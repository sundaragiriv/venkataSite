---
id: "d5-t2-1-error-propagation"
title: "Error Propagation in Multi-Agent Systems"
domain: "d5"
taskRef: "T5.2"
order: 4
xp: 35
tag: "⚡ Exam Tested"
duration: "9 min"
analogy: "A broken telephone game where errors amplify. Player 1 mishears a message. Player 2 gets a wrong message. By Player 5, the message is completely wrong — but Player 5 has no idea. Silent error propagation in multi-agent systems works exactly this way: a subagent failure that isn't surfaced turns into a confidently wrong final answer."
examTrap: "Subagents silently handling their own failures and returning partial/default results as if successful. The coordinator has no way to make good recovery decisions without accurate failure information."
keyPoints:
  - "Structured error context: when a subagent fails, it returns a structured error object — not an empty result or a default value."
  - "Silent suppression is the worst pattern — coordinator receives plausible-looking wrong results and can't distinguish them from correct ones."
  - "Partial success must be labeled — if 3 of 4 data sources succeeded, the coordinator needs to know which one failed."
  - "Error propagation chain: subagent error → structured result → coordinator decides recovery strategy."
  - "The coordinator decides recovery — not the subagent. Subagents report, coordinators decide."
antiPatterns:
  - "Catch-all exception handler that returns empty dict on any failure"
  - "Returning default values on failure without flagging that defaults were used"
  - "Subagent autonomously retrying and recovering without reporting to coordinator"
  - "Partial results labeled as complete — coordinator thinks it has everything"
tbChallenge: "Your coordinator spawned 4 research subagents in parallel. Subagent 2 hit a rate limit (transient). Subagent 4 got a 403 (permission error). What does each return, and what does the coordinator do with that information?"
---

## Structured Error Returns

Every subagent return value should have the same envelope — success or failure:

```python
from dataclasses import dataclass
from typing import Optional, Any
from enum import Enum

class ErrorCategory(Enum):
    TRANSIENT   = "transient"    # retry-safe
    VALIDATION  = "validation"   # fix input
    PERMISSION  = "permission"   # fix authorization
    BUSINESS    = "business"     # different action needed
    UNKNOWN     = "unknown"      # escalate

@dataclass
class SubagentResult:
    status:          str              # "success" | "partial" | "failed"
    task_id:         str
    task_description: str
    result:          Optional[Any]    # actual result if success
    error_category:  Optional[str]   # if failed
    error_message:   Optional[str]   # human-readable
    is_retryable:    bool
    partial_data:    Optional[Any]   # any usable partial result

async def run_research_subagent(task: dict) -> SubagentResult:
    try:
        result = await execute_research(task["prompt"], task["tools"])
        return SubagentResult(
            status="success",
            task_id=task["id"],
            task_description=task["description"],
            result=result,
            error_category=None,
            error_message=None,
            is_retryable=False,
            partial_data=None
        )
    except RateLimitError as e:
        return SubagentResult(
            status="failed",
            task_id=task["id"],
            task_description=task["description"],
            result=None,
            error_category=ErrorCategory.TRANSIENT.value,
            error_message=f"Rate limited: {str(e)}. Retry after {e.retry_after}s.",
            is_retryable=True,
            partial_data=None
        )
    except PermissionError as e:
        return SubagentResult(
            status="failed",
            task_id=task["id"],
            task_description=task["description"],
            result=None,
            error_category=ErrorCategory.PERMISSION.value,
            error_message=f"Access denied to {e.resource}. Check API permissions.",
            is_retryable=False,
            partial_data=None
        )
    except Exception as e:
        return SubagentResult(
            status="failed",
            task_id=task["id"],
            task_description=task["description"],
            result=None,
            error_category=ErrorCategory.UNKNOWN.value,
            error_message=str(e),
            is_retryable=False,
            partial_data=None
        )
```

## Coordinator Recovery Decisions

```python
async def coordinator_with_recovery(tasks: list) -> dict:
    # Run all subagents
    results = await asyncio.gather(*[
        run_research_subagent(task) for task in tasks
    ], return_exceptions=True)
    
    successful  = [r for r in results if r.status == "success"]
    retryable   = [r for r in results if r.status == "failed" and r.is_retryable]
    permanent   = [r for r in results if r.status == "failed" and not r.is_retryable]
    
    # Retry transient failures (once)
    if retryable:
        await asyncio.sleep(5)
        retry_results = await asyncio.gather(*[
            run_research_subagent({"id": r.task_id, "description": r.task_description})
            for r in retryable
        ])
        successful.extend([r for r in retry_results if r.status == "success"])
        permanent.extend([r for r in retry_results if r.status == "failed"])
    
    # Build coordinator context with accurate picture
    coordinator_prompt = f"""
Research phase completed with {len(successful)} of {len(tasks)} tasks successful.

SUCCESSFUL RESULTS ({len(successful)} tasks):
{format_results(successful)}

FAILED TASKS ({len(permanent)} tasks — data missing from final synthesis):
{format_failures(permanent)}

Synthesize a report from the successful results.
Explicitly note where data is missing due to failed tasks.
Do not fabricate data for the missing areas.
"""
    return await call_claude(coordinator_prompt)
```

## The Silent Suppression Anti-Pattern

```python
# ❌ Silent suppression — coordinator has no idea this failed
async def bad_subagent(task: dict) -> dict:
    try:
        return await expensive_operation(task)
    except Exception:
        return {}  # Returns empty dict — looks like "no results"

# ❌ Default values — coordinator thinks data was found
async def also_bad_subagent(task: dict) -> dict:
    try:
        return await fetch_data(task)
    except Exception:
        return {"revenue": 0, "customers": 0}  # Fabricated defaults!
```

Both patterns cause the coordinator to synthesize a report that includes wrong data — presented as real. The final output is confidently incorrect with no indication of failure.

## Key Takeaways

1. **Structured error returns** — same envelope for success and failure
2. **Never suppress silently** — empty dict or default values are deceptive
3. **Include error category + is_retryable** — coordinator needs this to decide
4. **Label partial success explicitly** — coordinator needs accurate picture
5. **Coordinator decides recovery** — subagents report, don't self-recover
