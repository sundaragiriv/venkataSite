---
id: "d1-t3-3-spawning-patterns"
title: "Subagent Spawning Patterns — Choosing the Right Approach"
domain: "d1"
taskRef: "T1.3"
order: 9
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Staffing a project. Sometimes you hire specialists with specific skill sets (scoped subagents). Sometimes you bring in a generalist who figures out their own approach (dynamic subagents). Sometimes you fork an existing team member's work (fork_session). The right choice depends on what you need from them."
examTrap: "Assuming all subagents should be maximally capable (many tools, broad scope). Scoped subagents with minimal tool access are more reliable and easier to reason about."
keyPoints:
  - "Static spawning: coordinator knows exactly which subagents to spawn at design time — use for predictable, well-understood workflows."
  - "Dynamic spawning: coordinator decides at runtime which subagents to spawn based on what it discovers — use for open-ended investigation tasks."
  - "Explore subagent: specialized pattern for verbose discovery that would fill the coordinator context window — returns only summary, not raw discovery output."
  - "The Explore subagent pattern prevents context exhaustion during large codebase analysis or multi-source research."
  - "Spawning failure: subagent errors should be returned as structured tool_results, not exceptions that crash the coordinator."
antiPatterns:
  - "Using dynamic spawning for well-understood workflows — adds unpredictability unnecessarily"
  - "Putting verbose exploration output directly into coordinator context — use Explore subagent pattern instead"
  - "Not handling subagent spawn failures — coordinator needs to decide whether to retry, use alternative, or abort"
  - "Spawning subagents with overlapping responsibilities — leads to contradictory results"
tbChallenge: "What is the Explore subagent pattern and when do you use it? Why does it specifically solve the context exhaustion problem?"
---

## Three Spawning Approaches

### 1. Static Spawning
The coordinator always spawns the same set of subagents in a known pattern. Used for repeatable, well-defined workflows.

```python
# Customer support resolution — always follows this pattern
coordinator_prompt = """
When handling a customer issue, always:
1. Spawn a customer lookup subagent (gets customer profile and history)
2. Spawn an order lookup subagent (gets relevant order details)
3. Spawn a policy check subagent (determines what resolution is available)
4. Based on results, spawn one of: refund_agent, replacement_agent, or escalation_agent
"""
```

The coordinator knows at design time which subagents exist and when to spawn each.

### 2. Dynamic Spawning
The coordinator discovers what needs to be done and spawns subagents accordingly. Used for open-ended investigation where the right approach depends on what's found.

```python
coordinator_prompt = """
Investigate this codebase to identify all test coverage gaps.
You may spawn specialized subagents as needed to:
- Analyze specific modules that look complex
- Deep-dive into areas with suspected coverage gaps
- Verify findings that seem contradictory

Spawn whatever specialized subagents will give you the most complete picture.
"""
```

The coordinator might spawn 3 subagents for a simple codebase, or 15 for a complex one.

### 3. The Explore Subagent Pattern
A specialized pattern for verbose discovery tasks. Instead of running discovery in the coordinator context (which fills it quickly), delegate discovery to an Explore subagent that returns only a structured summary.

```
Without Explore subagent:
  Coordinator explores files → context fills with file contents → context overflow

With Explore subagent:
  Coordinator spawns Explore(task="map all authentication entry points")
  Explore subagent reads all relevant files (in its own isolated context)
  Explore subagent returns structured summary: {entry_points: [...], concerns: [...]}
  Coordinator context only grows by the size of the summary
```

```python
# Coordinator spawns an Explore subagent
explore_task = {
    "description": "Map the authentication system",
    "prompt": """
    Explore the codebase and map the authentication system.
    
    Investigate:
    - All authentication entry points (HTTP endpoints, API routes)
    - Session management approach
    - Token validation logic
    - Any security concerns observed
    
    Return a structured JSON summary:
    {
      "entry_points": [{"path": "...", "method": "...", "auth_mechanism": "..."}],
      "session_approach": "...",
      "token_validation": "...",
      "security_concerns": ["...", "..."],
      "files_examined": 47
    }
    
    Do NOT return file contents — return only your structured analysis.
    """,
    "allowed_tools": ["file_read", "glob", "grep"]
}
```

The coordinator's context grows only by the size of the summary, not by the contents of 47 files.

## Handling Spawning Failures

Subagents fail. Networks time out, tools break, LLMs return unexpected outputs. Your spawning pattern needs explicit failure handling:

```python
async def spawn_with_retry(task_input, max_retries=2):
    for attempt in range(max_retries + 1):
        try:
            result = await run_subagent(
                task_input["prompt"],
                task_input.get("allowed_tools", [])
            )
            return {"status": "success", "result": result}
        except TimeoutError:
            if attempt < max_retries:
                await asyncio.sleep(2 ** attempt)  # exponential backoff
                continue
            return {
                "status": "error",
                "error_type": "timeout",
                "message": "Subagent timed out after retries",
                "partial_result": None
            }
        except Exception as e:
            return {
                "status": "error",
                "error_type": type(e).__name__,
                "message": str(e),
                "partial_result": None
            }
```

Return structured error results to the coordinator — let it decide whether to retry, use an alternative approach, or inform the user.

## Key Takeaways

1. **Static spawning** for predictable workflows, **dynamic** for open-ended investigation
2. **Explore subagent pattern** prevents context exhaustion during verbose discovery
3. **Explore returns summaries**, not raw content — keeps coordinator context manageable
4. **Handle spawning failures explicitly** — return structured errors, let coordinator decide
5. **Scope subagent tools** to minimum necessary for their specific role
