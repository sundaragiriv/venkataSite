---
id: "d5-t2-3-partial-failure"
title: "Partial Failure Handling — When Some Succeeds and Some Fails"
domain: "d5"
taskRef: "T5.2"
order: 6
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A cargo ship delivering to multiple ports. If the ship can't dock at Port 3 due to weather, it doesn't abandon the whole voyage. It notes Port 3 as failed, delivers to Ports 1, 2, 4, and 5, and returns with a manifest showing exactly what was and wasn't delivered."
examTrap: "Treating partial failure as complete failure — returning nothing when some subagents succeeded. A coordinator that received 4 of 5 results can still produce a useful (though incomplete) synthesis."
keyPoints:
  - "Partial success is a valid state — return what succeeded with clear labeling of what failed."
  - "The synthesis step must know which sources are missing to avoid overstating confidence."
  - "Partial results should include: succeeded count, failed count, which tasks failed, and why."
  - "The coordinator prompt for partial synthesis explicitly tells Claude what's missing."
  - "Future retry: store failed task IDs so they can be resubmitted in a follow-up batch."
antiPatterns:
  - "Returning nothing when partial results exist — wastes successful subagent work"
  - "Synthesizing from partial results without telling Claude what's missing — overconfident conclusions"
  - "No record of which tasks failed — can't retry them later"
  - "Treating partial failure as requiring immediate human intervention — often synthesis from available data is sufficient"
tbChallenge: "5 parallel research subagents ran. 4 succeeded. 1 failed with a permission error. Design the coordinator's synthesis prompt. What must it explicitly include about the missing data?"
---

## Partial Results Aggregation

```python
@dataclass
class PartialResults:
    succeeded:     list[SubagentResult]
    failed:        list[SubagentResult]
    total_tasks:   int
    
    @property
    def success_rate(self) -> float:
        return len(self.succeeded) / self.total_tasks
    
    @property
    def is_viable_for_synthesis(self) -> bool:
        """Can we produce a useful synthesis from what we have?"""
        return self.success_rate >= 0.5  # At least half succeeded
    
    def failed_descriptions(self) -> list[str]:
        return [f"{r.task_description} ({r.error_category})" for r in self.failed]
    
    def synthesis_prompt(self, original_task: str) -> str:
        return f"""
Synthesize a research report from partial results.

ORIGINAL TASK: {original_task}

AVAILABLE DATA ({len(self.succeeded)} of {self.total_tasks} sources):
{chr(10).join(f"SOURCE {i+1}: {r.result}" for i, r in enumerate(self.succeeded))}

MISSING DATA ({len(self.failed)} sources failed):
{chr(10).join(f"- {desc}" for desc in self.failed_descriptions())}

INSTRUCTIONS:
1. Synthesize from the available sources
2. For each conclusion, note which sources support it
3. Explicitly acknowledge the missing data areas
4. Do NOT speculate or fill in the missing areas
5. Include a "Data Limitations" section noting what's missing and why it matters

The report should be useful despite the gaps, not pretend they don't exist.
"""
```

## Storing Failed Tasks for Later Retry

```python
class FailureTracker:
    """Tracks failed tasks for potential retry in follow-up batch."""
    
    def __init__(self, storage):
        self.storage = storage
    
    def record_failures(self, run_id: str, failures: list[SubagentResult]):
        self.storage.save(f"failures:{run_id}", {
            "run_id":      run_id,
            "timestamp":   utcnow(),
            "failed_tasks": [
                {
                    "task_id":          f.task_id,
                    "task_description": f.task_description,
                    "error_category":   f.error_category,
                    "is_retryable":     f.is_retryable
                }
                for f in failures
            ]
        })
    
    def get_retryable_failures(self, run_id: str) -> list[dict]:
        data = self.storage.load(f"failures:{run_id}")
        if not data:
            return []
        return [t for t in data["failed_tasks"] if t["is_retryable"]]
```

## Key Takeaways

1. **Partial success is valid** — synthesize from what you have
2. **Tell Claude what's missing** in the synthesis prompt — prevents false confidence
3. **is_viable_for_synthesis** — check if enough data exists before attempting synthesis
4. **Store failed task IDs** — enables targeted retry in follow-up runs
5. **Data Limitations section** in output — honest about gaps
