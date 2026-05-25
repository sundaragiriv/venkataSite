---
id: "d2-t4-2-error-propagation"
title: "Error Propagation in Multi-Agent Systems"
domain: "d2"
taskRef: "T2.4"
order: 11
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A supply chain failure. When a supplier fails to deliver, the factory doesn't hide that failure — it reports up to the operations team who decides: use an alternative supplier, halt production, or inform the customer. Hiding the failure downstream creates larger problems."
examTrap: "Silently swallowing errors in subagents and returning partial results as if they were complete. The coordinator has no way to make good decisions without accurate information about what failed."
keyPoints:
  - "Error propagation means returning structured error information up the call chain — from tool to subagent to coordinator."
  - "Silent failure (swallowing errors) is the most dangerous pattern — coordinator receives plausible-looking partial results."
  - "Partial success must be clearly labeled — if 3 of 4 subagents succeeded, the coordinator needs to know which one failed."
  - "The coordinator decides recovery strategy — not the subagent. Subagents report failures, coordinators decide what to do."
  - "Structured error context gives the coordinator enough information to make intelligent recovery decisions."
antiPatterns:
  - "Catching all exceptions and returning empty/default results without indicating failure"
  - "Subagent retrying transient failures autonomously without reporting to coordinator"
  - "Returning partial results without clearly marking them as partial"
  - "Logging errors locally but returning success to the coordinator"
tbChallenge: "Your coordinator spawns 5 parallel subagents for a research task. Subagent 3 fails with a transient error. Subagent 4 fails with a permission error. What does each subagent return, and what does the coordinator do with that information?"
---

## Structured Error Propagation

```python
# Subagent always returns structured result — success OR failure
async def run_research_subagent(task: dict) -> dict:
    try:
        result = await execute_research(task)
        return {
            "status": "success",
            "task_id": task["id"],
            "task_description": task["description"],
            "result": result,
            "completion_time": datetime.utcnow().isoformat()
        }
    except TransientError as e:
        return {
            "status": "failed",
            "task_id": task["id"],
            "task_description": task["description"],
            "error_category": "transient",
            "error_message": str(e),
            "isRetryable": True,
            "retry_after_seconds": 5
        }
    except PermissionError as e:
        return {
            "status": "failed",
            "task_id": task["id"],
            "task_description": task["description"],
            "error_category": "permission",
            "error_message": str(e),
            "isRetryable": False,
            "required_access": e.required_permissions
        }
    except Exception as e:
        return {
            "status": "failed",
            "task_id": task["id"],
            "task_description": task["description"],
            "error_category": "unknown",
            "error_message": str(e),
            "isRetryable": False
        }
```

## Coordinator Recovery Decisions

```python
# Coordinator receives all results including failures
async def handle_research_results(results: list[dict]) -> dict:
    successful = [r for r in results if r["status"] == "success"]
    failed = [r for r in results if r["status"] == "failed"]

    if not failed:
        # All succeeded — proceed to synthesis
        return await synthesize_results([r["result"] for r in successful])

    # Classify failures
    retryable = [r for r in failed if r.get("isRetryable")]
    permanent = [r for r in failed if not r.get("isRetryable")]

    recovery_context = f"""
Research phase completed with partial failures.

SUCCESSFUL ({len(successful)} tasks):
{format_results(successful)}

RETRYABLE FAILURES ({len(retryable)} tasks):
{format_failures(retryable)}

PERMANENT FAILURES ({len(permanent)} tasks):
{format_failures(permanent)}

Options:
1. Retry the retryable failures and synthesize when they complete
2. Synthesize from successful results only (note: {len(failed)} tasks failed)
3. Report failure to user and stop

Which approach best serves the user's original request?
"""
    return {"status": "partial", "context": recovery_context, "successful": successful}
```

## Key Takeaways

1. **Always return structured results** — success or failure, never silent
2. **Include error category and isRetryable** in failure responses
3. **Coordinator decides recovery**, subagents just report
4. **Partial success must be labeled** — coordinator needs to know what's missing
5. **Never swallow exceptions silently** — makes debugging impossible
