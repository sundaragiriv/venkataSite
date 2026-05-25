---
id: "d1-t2-1-hub-spoke"
title: "Hub-and-Spoke Architecture — The Production Standard for Multi-Agent Systems"
domain: "d1"
taskRef: "T1.2"
order: 4
xp: 40
tag: "Core"
duration: "10 min"
analogy: "A hospital emergency department. The triage nurse (coordinator) receives every patient, assigns them to the right specialist (subagent), collects all results, and decides what happens next. The specialists don't talk to each other — the triage nurse is the single point of coordination. This is not inefficiency. It is how you maintain safety and observability in a complex system."
examTrap: "Letting subagents communicate directly with each other to 'save time.' This removes observability, makes error recovery impossible at the coordinator level, and creates dependency chains that break in unpredictable ways."
keyPoints:
  - "In hub-and-spoke, the coordinator is the only agent that communicates with all others — subagents communicate only with the coordinator, never with each other."
  - "Subagents run in isolated contexts — they have NO access to the coordinator's conversation history or to other subagents' results unless you explicitly pass that information."
  - "The coordinator is responsible for ALL error recovery decisions — a subagent that encounters an error should report it upward, not attempt to recover autonomously."
  - "All inter-agent communication routing through the coordinator enables complete observability — you can log, monitor, and debug every step."
  - "Parallel subagent execution is achieved by emitting multiple Task tool calls in a SINGLE coordinator response, not by making multiple sequential API calls."
antiPatterns:
  - "Giving subagents the ability to spawn their own subagents without coordinator involvement"
  - "Having subagents share state through a database or cache instead of routing through the coordinator"
  - "Letting subagents make autonomous recovery decisions when they encounter errors"
  - "Sequential subagent spawning when the tasks are independent (wasting latency)"
tbChallenge: "Explain hub-and-spoke to me as if I'm a junior developer who just asked: 'Why can't the search subagent just directly pass its results to the synthesis subagent? That would be faster.' What do you tell them?"
---

## Why Multi-Agent Systems Need Architecture

A single Claude agent can handle many tasks. But some tasks exceed what a single agent context can handle:

- A codebase too large to fit in one context window
- A research task requiring simultaneous investigation of multiple domains
- A workflow requiring different tools at different stages
- Tasks where quality improves when one agent's work is reviewed by another

Multi-agent systems exist to solve these problems. But adding agents without architecture creates new problems: race conditions, inconsistent state, invisible failures, and systems impossible to debug.

Hub-and-spoke is the architecture that solves this. It's the standard pattern because it makes complex multi-agent systems **understandable, debuggable, and reliable**.

## The Structure

```
                    ┌─────────────────┐
                    │   COORDINATOR   │
                    │  (Hub Agent)    │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
    ┌────────▼────┐  ┌───────▼────┐  ┌──────▼─────┐
    │  Subagent   │  │  Subagent  │  │  Subagent  │
    │  (Search)   │  │ (Analysis) │  │ (Synthesis)│
    └─────────────┘  └────────────┘  └────────────┘
```

**The rules:**
- Coordinator → Subagents: task assignment and context
- Subagents → Coordinator: results and errors
- Subagents ↔ Subagents: **never**

## Context Isolation — The Most Misunderstood Part

When a coordinator spawns a subagent, the subagent starts with a **blank context**. It does not inherit:

- The coordinator's conversation history
- Results from other subagents
- The user's original query (unless you explicitly pass it)
- Any system prompt the coordinator has

This is both the most important feature and the most common source of confusion.

**Wrong mental model:** "The subagent knows what the coordinator knows."

**Right mental model:** "The subagent is a new Claude instance. You brief it like you'd brief a new employee on their first day — tell them everything they need to know to do their specific task."

```python
# ❌ Wrong: assuming subagent has context
coordinator_prompt = """
You've been analyzing this codebase. Now spawn a subagent to write tests.
"""
# The subagent has never seen the codebase analysis

# ✅ Right: pass all necessary context explicitly
analysis_results = "..." # From earlier coordinator work
subagent_prompt = f"""
A codebase analysis has been completed. Here are the findings:

{analysis_results}

Based on these findings, write comprehensive tests for the functions identified
as highest risk. Focus on: [specific functions]. Use pytest format.
"""
```

## Spawning Subagents with the Task Tool

The Task tool is how coordinators spawn subagents. Here's what it looks like in practice:

```python
# Coordinator's tools include the Task tool
tools = [
    {
        "name": "Task",
        "description": "Spawn a subagent to handle a specific task",
        "input_schema": {
            "type": "object",
            "properties": {
                "description": {"type": "string", "description": "What the subagent should do"},
                "prompt": {"type": "string", "description": "Full context and instructions for the subagent"},
                "subagent_tools": {
                    "type": "array",
                    "description": "List of tool names this subagent is allowed to use"
                }
            },
            "required": ["description", "prompt"]
        }
    },
    # ... other coordinator-level tools
]
```

When Claude calls the Task tool, your orchestration layer:
1. Extracts the prompt and allowed_tools
2. Creates a new Claude API call with that prompt as the system or user message
3. Runs the full agentic loop for the subagent
4. Returns the subagent's final response as the tool result

## Parallel Execution — The Right Way

The key to parallel subagent execution is **emitting multiple Task tool calls in a single coordinator response**.

The coordinator does this in one response:
```json
{
  "stop_reason": "tool_use",
  "content": [
    {
      "type": "tool_use",
      "id": "task_001",
      "name": "Task",
      "input": {
        "description": "Search for market data on AI adoption",
        "prompt": "Search for recent statistics on enterprise AI adoption rates..."
      }
    },
    {
      "type": "tool_use",
      "id": "task_002",
      "name": "Task",
      "input": {
        "description": "Search for competitor analysis",
        "prompt": "Find recent information about Claude competitors..."
      }
    },
    {
      "type": "tool_use",
      "id": "task_003",
      "name": "Task",
      "input": {
        "description": "Research regulatory landscape",
        "prompt": "Find current AI regulation developments in the EU and US..."
      }
    }
  ]
}
```

Your orchestration layer sees three Task tool_use blocks and runs them in parallel:

```python
import asyncio

async def run_coordinator(user_query):
    coordinator_messages = [{"role": "user", "content": user_query}]

    while True:
        response = await call_claude_async(coordinator_messages, tools=coordinator_tools)

        if response.stop_reason == "end_turn":
            return extract_text(response)

        task_tool_calls = [
            b for b in response.content
            if b.type == "tool_use" and b.name == "Task"
        ]

        if task_tool_calls:
            # Run ALL subagents in parallel
            subagent_tasks = [
                run_subagent(task.input["prompt"], task.input.get("subagent_tools", []))
                for task in task_tool_calls
            ]
            results = await asyncio.gather(*subagent_tasks, return_exceptions=True)

            # Package results
            tool_results = []
            for task, result in zip(task_tool_calls, results):
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": task.id,
                    "content": str(result) if not isinstance(result, Exception)
                               else f"Subagent failed: {result}",
                    "is_error": isinstance(result, Exception)
                })

            coordinator_messages.append({
                "role": "assistant",
                "content": response.content
            })
            coordinator_messages.append({
                "role": "user",
                "content": tool_results
            })
```

## Error Recovery — Coordinator's Responsibility

When a subagent fails, the coordinator decides what to do. The subagent's job is to report the failure clearly — not to decide how to recover.

```python
# Subagent reports failure clearly
def run_subagent(prompt, allowed_tools):
    try:
        result = run_agent_loop(prompt, allowed_tools)
        return result
    except Exception as e:
        # Return structured error — coordinator will decide what to do
        return {
            "status": "error",
            "error_type": type(e).__name__,
            "message": str(e),
            "partial_results": get_partial_results_if_any()
        }

# Coordinator decides recovery strategy
# It might: retry, use alternative approach, or inform user
```

This is why routing everything through the coordinator is essential. If subagents recover autonomously, the coordinator has no visibility into what happened — it only sees the final (potentially incorrect) result.

## Observability — The Hidden Benefit

Every message in hub-and-spoke passes through the coordinator. This means you can log, trace, and debug the entire execution by instrumenting one place:

```python
def execute_with_logging(task_tool_call, task_id):
    log.info(f"[{task_id}] Spawning subagent: {task_tool_call.input['description']}")
    start = time.time()
    result = run_subagent(task_tool_call.input["prompt"])
    elapsed = time.time() - start
    log.info(f"[{task_id}] Subagent completed in {elapsed:.2f}s: {result[:100]}...")
    return result
```

In a peer-to-peer architecture (subagents communicating directly), you'd need to instrument every agent. In hub-and-spoke, instrument the coordinator and you see everything.

## Key Takeaways

1. **Coordinator is the only communication hub** — subagents never talk to each other directly
2. **Context isolation is total** — subagents start blank, pass everything they need explicitly
3. **Parallel execution = multiple Task calls in one coordinator response**, not multiple API calls
4. **Error recovery is the coordinator's decision**, not the subagent's
5. **All communication through coordinator = full observability**
6. **Subagent tool access should be scoped** to only what that specific role needs
