---
id: "d1-t2-3-parallel-sequential"
title: "Parallel vs Sequential Subagent Execution — Choosing the Right Pattern"
domain: "d1"
taskRef: "T1.2"
order: 6
xp: 35
tag: "Core"
duration: "8 min"
analogy: "Building a house. You don't need to lay all the foundation before ordering materials — some things can happen at the same time. But you can't install the roof before the walls are up — some things must be sequential. Knowing which is which determines how fast and reliably your system runs."
examTrap: "Treating all multi-agent workflows as sequential by default. The exam specifically tests your ability to identify when tasks can run in parallel and how to implement it correctly — emitting multiple Task calls in one coordinator response."
keyPoints:
  - "Parallel execution happens by emitting multiple Task tool calls in a single coordinator response — your orchestration layer runs them concurrently."
  - "Sequential execution is required when task B needs the output of task A to proceed — there's a data dependency."
  - "Mixed patterns are common: Phase 1 tasks run in parallel, Phase 2 synthesis task runs sequentially after Phase 1 completes."
  - "Parallelising independent tasks is not optional for production systems — it's a reliability and performance requirement."
  - "The coordinator determines the execution graph — which tasks can start immediately, which must wait, which must be retried."
antiPatterns:
  - "Running independent tasks sequentially because it's simpler to implement"
  - "Trying to parallelize tasks that have data dependencies between them"
  - "Making the coordinator spawn one subagent per coordinator loop iteration (forces sequential)"
  - "Not planning the execution graph before writing coordinator logic"
tbChallenge: "I have a research system with these tasks: (1) web search, (2) database query, (3) competitor analysis, (4) synthesis of 1+2+3 results, (5) executive summary of 4. Draw the execution graph for me and explain which run in parallel and which must be sequential."
---

## The Execution Graph

Before writing any code, draw the execution graph. An execution graph shows which tasks can start immediately, which must wait for others, and what the dependencies are.

For a research system example:

```
Phase 1 (parallel — no dependencies):
  Task A: Web Search
  Task B: Database Query
  Task C: Competitor Analysis

Phase 2 (sequential — depends on Phase 1):
  Task D: Synthesis [requires A, B, C results]

Phase 3 (sequential — depends on Phase 2):
  Task E: Executive Summary [requires D result]
```

This execution graph tells you:
- **One coordinator response** spawns A, B, and C simultaneously
- After A, B, C complete, **another coordinator response** spawns D
- After D completes, **another coordinator response** spawns E

## Implementing Parallel Execution

Parallel tasks are spawned in a **single coordinator response** with multiple Task tool calls:

```python
# The coordinator's response contains multiple Task tool calls at once
# Your orchestration layer sees this and runs them concurrently

async def run_orchestrator(user_query):
    messages = [{"role": "user", "content": user_query}]

    while True:
        response = await claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=coordinator_tools,  # includes Task tool
            messages=messages
        )

        if response.stop_reason == "end_turn":
            return extract_text(response)

        if response.stop_reason == "tool_use":
            task_calls = [b for b in response.content if b.type == "tool_use"]

            # Run ALL task calls concurrently
            results = await asyncio.gather(*[
                run_subagent(call.input["prompt"], call.input.get("tools", []))
                for call in task_calls
            ], return_exceptions=True)

            # Package all results
            tool_results = []
            for call, result in zip(task_calls, results):
                if isinstance(result, Exception):
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": call.id,
                        "content": f"Subagent failed: {str(result)}",
                        "is_error": True
                    })
                else:
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": call.id,
                        "content": result
                    })

            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
```

The key insight: **the coordinator doesn't know or care about parallel vs sequential**. It just emits Task tool calls. Your orchestration layer decides how to execute them. If it sees multiple Task calls, it runs them concurrently.

## Implementing Sequential Execution

Sequential tasks happen across **multiple coordinator loop iterations**. The coordinator waits for Phase 1 results before deciding to spawn Phase 2:

```
Iteration 1:
  Coordinator sees user query
  Coordinator emits: Task(web_search), Task(db_query), Task(competitor_analysis)
  → Your layer runs all three concurrently

Iteration 2:
  Coordinator receives results from all three Phase 1 tasks
  Coordinator now has enough context to define the synthesis task
  Coordinator emits: Task(synthesis, prompt includes Phase 1 results)
  → Your layer runs synthesis

Iteration 3:
  Coordinator receives synthesis result
  Coordinator emits: Task(executive_summary, prompt includes synthesis)
  → Your layer runs executive summary

Iteration 4:
  Coordinator receives executive summary
  Coordinator has all information needed
  Coordinator returns final response to user
  stop_reason: "end_turn"
```

The coordinator's intelligence is in knowing when it has enough information to proceed to the next phase. This is exactly what you're designing when you write the coordinator's system prompt.

## Mixed Patterns in Practice

Real workflows are almost always mixed. Here's a code review system:

```
Phase 1 — Parallel (all start simultaneously):
  - Subagent A: Security vulnerability scan (all files)
  - Subagent B: Performance analysis (all files)
  - Subagent C: Per-file logic review (files 1-7)
  - Subagent D: Per-file logic review (files 8-14)

Phase 2 — Sequential (depends on Phase 1):
  - Subagent E: Cross-file integration review
    [needs results from C and D to identify conflicts]

Phase 3 — Sequential (depends on Phase 2):
  - Subagent F: Final report compilation
    [needs all results from A, B, C, D, E]
```

Notice that splitting file review into two parallel subagents (C and D) is itself a parallelization decision — they can review different files simultaneously.

## Deciding: Can These Run in Parallel?

Ask three questions:

**1. Does Task B need Task A's output?**
If yes → sequential. If no → potentially parallel.

**2. Do tasks share a resource that can't handle concurrent access?**
If writing to the same file, database record, or external API with rate limits → sequential.

**3. Does task order matter for quality?**
Sometimes order doesn't create a hard dependency but does affect quality. Review synthesis should come after the facts are gathered, not before — even if technically possible to run simultaneously.

## The Coordinator Prompt for Execution Control

Your coordinator prompt should describe the execution strategy:

```
You are a research coordinator managing multiple specialized subagents.

EXECUTION STRATEGY:
- Phase 1: Spawn web search, database lookup, and competitor analysis SIMULTANEOUSLY
  (they are independent and can run in parallel)
- Phase 2: Once Phase 1 results are received, spawn the synthesis subagent
  (it requires all Phase 1 results to produce coherent output)
- Phase 3: Once synthesis is complete, spawn executive summary
  (it requires the synthesis to be complete)

Never spawn Phase 2 until all Phase 1 results are received.
Never spawn Phase 3 until Phase 2 result is received.
```

This gives the coordinator the execution graph explicitly. The coordinator then emits the right Task tool calls at the right times.

## Performance Impact

Consider a research workflow with 3 parallel Phase 1 tasks (each taking 8 seconds) and 1 sequential Phase 2 task (taking 5 seconds):

| Approach | Total Time |
|---|---|
| Sequential: A→B→C→D | 8+8+8+5 = 29 seconds |
| Parallel: (A,B,C)→D | max(8,8,8)+5 = 13 seconds |

Parallel execution is 2.2x faster. For complex workflows, this difference compounds dramatically. A 6-phase workflow where each phase has 5 parallel tasks is 5x faster with parallel execution.

## Key Takeaways

1. **Draw the execution graph first** — identify dependencies before writing code
2. **Parallel = multiple Task calls in one coordinator response**
3. **Sequential = separate coordinator loop iterations**
4. **Mixed patterns are normal** — phases can be parallel internally, sequential across phases
5. **Coordinator prompt should describe the execution strategy explicitly**
6. **Parallelizing independent tasks is a production requirement**, not an optimization
