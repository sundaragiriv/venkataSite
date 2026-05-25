---
id: "d5-t4-2-isolation-patterns"
title: "Context Isolation Patterns — Keeping Agent Sessions Clean"
domain: "d5"
taskRef: "T5.4"
order: 11
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Clean rooms in semiconductor manufacturing. Contamination from one process doesn't affect the next. Each agent session is a clean room — what happened in the last session doesn't contaminate the current one unless you explicitly bring it in."
examTrap: "Assuming context isolation happens automatically. It doesn't — you must actively design for it. Without explicit design, tool results, conversation history, and stale facts bleed between sessions and phases."
keyPoints:
  - "Session isolation: each new session starts with only what you explicitly pass — no automatic carry-over."
  - "Phase isolation: within a long session, use subagents to isolate exploratory phases from implementation phases."
  - "Tool result isolation: trim and extract before adding to conversation — don't let full results accumulate."
  - "Stale context prevention: when environment changes, don't resume stale sessions — start fresh with a briefing."
  - "The Explore subagent is the primary isolation mechanism for verbose discovery within a session."
antiPatterns:
  - "Resuming a session when source files have changed — reasoning about stale state"
  - "No phase isolation — exploration output mixed with implementation context"
  - "Carrying full conversation history into new sessions — should carry summary not transcript"
  - "Assuming subagents inherit coordinator context — they don't"
tbChallenge: "Explain phase isolation to a developer who says 'I don't need Explore subagents — I can just read the files in my main session and then implement.' What problem are they going to hit at scale?"
---

## Session Isolation Design

```python
class IsolatedAgentSession:
    """
    Each session starts clean. State from previous sessions
    is injected explicitly, not inherited automatically.
    """
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.messages = []  # Starts empty every time
    
    def initialize_with_briefing(self, briefing: dict):
        """Explicitly inject what this session needs to know."""
        self.messages = [{
            "role": "user",
            "content": self._format_briefing(briefing)
        }]
    
    def _format_briefing(self, briefing: dict) -> str:
        """Convert prior session findings to current session context."""
        return f"""
SESSION BRIEFING (from prior work):

GOAL: {briefing["goal"]}

DECISIONS ALREADY MADE:
{chr(10).join(f"- {d}" for d in briefing.get("decisions", []))}

FINDINGS ALREADY CONFIRMED:
{chr(10).join(f"- {f}" for f in briefing.get("confirmed_findings", []))}

WHAT HAS CHANGED SINCE LAST SESSION:
{briefing.get("changes", "No changes")}

FOCUS FOR THIS SESSION:
{briefing["current_focus"]}

Do not repeat work already completed. Build on the briefing above.
"""
    
    # Briefing carries forward knowledge without carrying conversation history
```

## Phase Isolation Within a Session

```python
async def isolated_phases(task: str) -> dict:
    
    # Phase 1: Exploration (in isolation — verbose, fills context)
    # Use Explore subagent so exploration doesn't pollute main context
    exploration_summary = await spawn_explore_subagent(
        f"Explore the codebase relevant to: {task}. Return structured summary only."
    )
    # Main context: +200 lines (summary), not +50,000 (raw file contents)
    
    # Phase 2: Planning (uses exploration summary — clean context)
    plan = await call_claude(
        system="You are a software architect. Create an implementation plan.",
        user=f"Task: {task}\n\nCodebase analysis:\n{exploration_summary}"
    )
    # Main context: +200 (summary) + plan
    
    # Phase 3: Implementation (focused context — no exploration noise)
    implementation = await call_claude(
        system="Implement according to the plan. Focus on correctness.",
        user=f"Plan:\n{plan}\n\nCodebase context:\n{exploration_summary}"
    )
    
    return {"exploration": exploration_summary, "plan": plan, "implementation": implementation}
```

## Stale Context Detection

```python
class SessionFreshnessChecker:
    """Detect when a session's context is stale due to environment changes."""
    
    def __init__(self, session_metadata: dict):
        self.session_files = set(session_metadata.get("files_examined", []))
        self.session_time = session_metadata.get("created_at")
    
    def check_freshness(self, current_env: dict) -> dict:
        modified_files = set(current_env.get("recently_modified", []))
        overlap = self.session_files & modified_files
        
        if not overlap:
            return {"fresh": True, "action": "resume"}
        
        if len(overlap) > 5 or any(f in overlap for f in current_env.get("critical_files", [])):
            return {
                "fresh": False,
                "action": "start_fresh_with_briefing",
                "stale_files": list(overlap),
                "reason": f"{len(overlap)} examined files have been modified since session"
            }
        
        return {
            "fresh": "partial",
            "action": "resume_with_update",
            "stale_files": list(overlap),
            "message": f"These files changed since last session: {overlap}"
        }
```

## Key Takeaways

1. **Sessions start clean** — no automatic carry-over from previous sessions
2. **Briefings not transcripts** — inject structured summary, not raw history
3. **Explore subagents for phase isolation** — verbose exploration doesn't pollute main context
4. **Stale context detection** — don't resume when source files have changed
5. **What carries forward**: decisions, findings, current focus — not raw conversation
