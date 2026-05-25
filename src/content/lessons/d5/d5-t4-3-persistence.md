---
id: "d5-t4-3-persistence"
title: "State Persistence — Saving and Restoring Agent State Across Sessions"
domain: "d5"
taskRef: "T5.4"
order: 12
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A surgeon's pre-op notes. Before every procedure, they review the chart: patient history, current medications, known allergies, prior surgeries. They don't rely on memory between visits. Agent state persistence is building and maintaining that chart — structured, retrievable, always current."
examTrap: "Persisting the raw conversation history and treating it as equivalent to structured state. Raw conversation history is verbose and slow to inject. Structured state (key decisions, confirmed facts, task progress) is compact and precise."
keyPoints:
  - "Persist structured state, not raw conversation: decisions made, facts confirmed, tasks completed, current progress."
  - "Checkpoint after every significant operation — not just at the end."
  - "State must be rehydratable: loading saved state must produce the same agent behavior as if the session never stopped."
  - "Separate fast state (current session, in memory) from slow state (cross-session, in storage)."
  - "State expiration: long-abandoned state may be stale — check timestamps before rehydrating."
antiPatterns:
  - "Persisting only at the end of a run — crash loses all progress"
  - "Persisting raw conversation history — too verbose, too expensive to inject"
  - "No state expiration — rehydrating 6-month-old state as if it's current"
  - "Not checking if persisted state is still valid before resuming"
tbChallenge: "Design the state schema for a multi-agent research system that runs overnight and must be resumable if it crashes. What fields are in the state, when is it saved, and how is it rehydrated on restart?"
---

## State Schema for Resumable Agents

```python
from dataclasses import dataclass, asdict
from typing import Optional
import json

@dataclass
class AgentState:
    """Structured state that survives session boundaries."""
    
    # Identity
    run_id:       str
    created_at:   str
    updated_at:   str
    
    # Task tracking
    original_goal:        str
    current_phase:        str  # "exploration" | "planning" | "implementation" | "verification"
    completed_tasks:      list[str]
    failed_tasks:         list[dict]  # {task_id, error, retryable}
    remaining_tasks:      list[str]
    
    # Confirmed findings (structured, not prose)
    confirmed_facts:      dict  # {fact_key: fact_value}
    decisions_made:       list[str]
    files_examined:       list[str]
    
    # Quality tracking
    iteration_count:      int
    error_count:          int
    last_successful_op:   str
    
    def save(self, storage) -> None:
        storage.save(
            key=f"agent_state:{self.run_id}",
            value=asdict(self),
            ttl_hours=72  # State expires after 3 days
        )
    
    @classmethod
    def load(cls, storage, run_id: str) -> Optional['AgentState']:
        data = storage.load(f"agent_state:{run_id}")
        if not data:
            return None
        # Check expiration
        age_hours = calculate_age_hours(data["updated_at"])
        if age_hours > 72:
            return None  # Stale state
        return cls(**data)
    
    def to_briefing_prompt(self) -> str:
        """Convert state to a prompt for session rehydration."""
        return f"""
RESUMING RUN {self.run_id}

ORIGINAL GOAL: {self.original_goal}

CURRENT PHASE: {self.current_phase}

PROGRESS:
- Completed: {len(self.completed_tasks)} tasks
- Failed: {len(self.failed_tasks)} tasks  
- Remaining: {len(self.remaining_tasks)} tasks

CONFIRMED FACTS:
{json.dumps(self.confirmed_facts, indent=2)}

DECISIONS MADE:
{chr(10).join(f"- {d}" for d in self.decisions_made)}

NEXT TASKS TO COMPLETE:
{chr(10).join(f"- {t}" for t in self.remaining_tasks[:5])}

Continue from this exact point. Do not redo completed work.
"""
```

## Checkpoint Strategy

```python
class CheckpointManager:
    """Save state at key decision points, not just at the end."""
    
    CHECKPOINT_EVENTS = {
        "task_completed",
        "phase_changed",
        "significant_finding",
        "error_occurred",
    }
    
    async def run_with_checkpoints(self, agent, initial_state: AgentState) -> dict:
        state = initial_state
        
        while state.remaining_tasks:
            task = state.remaining_tasks[0]
            
            try:
                result = await agent.execute_task(task, state)
                
                # Update state
                state.completed_tasks.append(task)
                state.remaining_tasks.remove(task)
                state.last_successful_op = task
                state.iteration_count += 1
                
                # Checkpoint after every task completion
                state.updated_at = utcnow()
                state.save(self.storage)
                
            except Exception as e:
                state.failed_tasks.append({"task": task, "error": str(e)})
                state.remaining_tasks.remove(task)
                state.error_count += 1
                state.save(self.storage)  # Checkpoint failures too
        
        return state.to_final_report()
```

## Key Takeaways

1. **Structured state not raw history** — decisions, facts, progress — not transcript
2. **Checkpoint after every task** — not just at the end
3. **State expiration** — don't rehydrate stale state without checking timestamps
4. **to_briefing_prompt()** — convert state to a usable session initialization prompt
5. **Separate fast and slow state** — in-memory for current session, storage for cross-session
