---
id: "d1-t1-2-loop-control"
title: "Agentic Loop Control Flow — Handling Multiple Tools"
domain: "d1"
taskRef: "T1.1"
order: 2
xp: 35
tag: "Core"
duration: "9 min"
analogy: "An air traffic controller managing multiple planes simultaneously. Each plane (tool call) needs clearance, executes its flight path, reports back, and the controller coordinates the next move — never letting planes figure out their own sequence."
examTrap: "Only handling the first tool_use block in a response. Claude can request multiple tools in a single response — you must handle ALL of them before looping."
keyPoints:
  - "A single Claude response can contain multiple tool_use blocks — you must execute ALL of them before appending results and continuing."
  - "Each tool_use block has a unique tool_use_id — your tool_result must reference the correct id or the conversation history becomes invalid."
  - "Tool results are appended as a single user turn containing multiple tool_result content blocks — not as separate API calls."
  - "The order of tool_result blocks does not need to match the order of tool_use blocks, but every tool_use_id must have a corresponding tool_result."
  - "If a tool fails, you still must return a tool_result for that tool_use_id — mark it as an error, don't skip it."
antiPatterns:
  - "Only processing response.content[0] — missing subsequent tool_use blocks in the same response"
  - "Making a new API call for each tool result instead of batching all results in one user turn"
  - "Skipping a failed tool's result — leaving a tool_use_id without a matching tool_result"
  - "Using the wrong tool_use_id in your tool_result — invalidates the conversation"
tbChallenge: "Walk me through what happens when Claude requests two tools in the same response. What exactly do you send back, and why does it have to be structured that way?"
---

## When Claude Requests Multiple Tools at Once

In the previous lesson we covered the basic loop: Claude requests a tool, you execute it, you append the result, you loop. Simple.

But Claude can — and often does — request **multiple tools in a single response**. When building a research agent, Claude might simultaneously want to search the web AND query a database. When building a support agent, it might want to look up both the customer record AND their order history in one go.

This is one of the most common sources of broken agentic loops. Engineers handle the first tool call correctly, miss the second, and then spend hours debugging why their agent produces incomplete results.

## What Multiple Tool Calls Look Like

A response with multiple tool calls has a content array containing multiple tool_use blocks:

```python
# Claude's response content might look like this:
response.content = [
    {
        "type": "text",
        "text": "I'll look up both the customer and their orders simultaneously."
    },
    {
        "type": "tool_use",
        "id": "toolu_01ABC",
        "name": "get_customer",
        "input": {"customer_id": "C-12345"}
    },
    {
        "type": "tool_use",
        "id": "toolu_01DEF",
        "name": "get_orders",
        "input": {"customer_id": "C-12345", "limit": 5}
    }
]
```

Two tool_use blocks. Two tools to execute. **Both must complete before you continue the loop.**

## How to Handle Multiple Tool Calls Correctly

```python
def run_agent(messages, tools):
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        if response.stop_reason == "end_turn":
            return extract_text(response)

        if response.stop_reason == "tool_use":
            # Step 1: Collect ALL tool_use blocks from the response
            tool_use_blocks = [
                block for block in response.content
                if block.type == "tool_use"
            ]

            # Step 2: Execute ALL tools (can be parallel or sequential)
            tool_results = []
            for tool_block in tool_use_blocks:
                try:
                    result = execute_tool(tool_block.name, tool_block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_block.id,  # Must match exactly
                        "content": str(result)
                    })
                except Exception as e:
                    # Tool failed — STILL append a result, mark as error
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": tool_block.id,
                        "content": f"Error: {str(e)}",
                        "is_error": True
                    })

            # Step 3: Append Claude's response turn
            messages.append({
                "role": "assistant",
                "content": response.content
            })

            # Step 4: Append ALL tool results in ONE user turn
            messages.append({
                "role": "user",
                "content": tool_results  # All results together
            })
            # Loop continues
```

## The Critical Rules

### Rule 1: Collect all tool_use blocks before executing any

Don't execute the first tool and immediately append results. Collect all tool_use blocks from the response first, then execute them all.

### Rule 2: Batch all tool results in one user turn

Wrong:
```python
# ❌ Two separate API messages for two tools
messages.append({"role": "user", "content": [tool_result_1]})
messages.append({"role": "user", "content": [tool_result_2]})
```

Right:
```python
# ✅ All results in one user message
messages.append({
    "role": "user",
    "content": [tool_result_1, tool_result_2]
})
```

The conversation must alternate: user → assistant → user → assistant. Two consecutive user messages is invalid.

### Rule 3: Always return a result for every tool_use_id

If a tool raises an exception, you cannot skip its result. Claude is waiting for every tool_use_id it requested. A missing result means Claude is reasoning about incomplete information — or the API rejects the conversation as malformed.

```python
# ❌ Skip failed tool
try:
    result = execute_tool(name, input)
    results.append({"type": "tool_result", "tool_use_id": id, "content": result})
except:
    pass  # NEVER do this

# ✅ Always return a result, even for failures
try:
    result = execute_tool(name, input)
    results.append({
        "type": "tool_result",
        "tool_use_id": id,
        "content": str(result)
    })
except Exception as e:
    results.append({
        "type": "tool_result",
        "tool_use_id": id,
        "content": f"Tool execution failed: {str(e)}",
        "is_error": True
    })
```

### Rule 4: Parallel execution is fine and often better

If two tools don't depend on each other's results, you can execute them concurrently:

```python
import asyncio

async def execute_tools_parallel(tool_blocks):
    tasks = [
        execute_tool_async(block.name, block.input)
        for block in tool_blocks
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [
        {
            "type": "tool_result",
            "tool_use_id": block.id,
            "content": str(r) if not isinstance(r, Exception) else f"Error: {r}",
            "is_error": isinstance(r, Exception)
        }
        for block, r in zip(tool_blocks, results)
    ]
```

This is particularly valuable in multi-agent scenarios where tool calls spawn subagents — you want them running in parallel, not sequentially.

## The tool_use_id Matters Enormously

The `id` field on each tool_use block is Claude's reference for which result corresponds to which request. Get it wrong and the conversation history is corrupted.

```python
# ❌ Wrong: made up or copied ID
{"type": "tool_result", "tool_use_id": "my_custom_id", "content": "..."}

# ✅ Right: exact ID from the tool_use block
{"type": "tool_result", "tool_use_id": tool_block.id, "content": "..."}
```

## The Production Implication

This pattern becomes critical in the hub-and-spoke multi-agent architecture (T1.2). When a coordinator agent spawns multiple subagents via the Task tool, it does so by emitting multiple Task tool calls in a single response. Your orchestration layer must:

1. Collect all Task tool_use blocks
2. Spawn all subagents (in parallel if possible)
3. Wait for all to complete
4. Batch all results into one user turn

This is exactly how you achieve parallel subagent execution — not by making multiple API calls, but by handling multiple tool_use blocks in a single coordinator response correctly.

## Key Takeaways

1. **Check all content blocks** — not just content[0]
2. **Execute all tools** before returning any results
3. **Batch all results** in one user turn — never split across messages
4. **Always return a result** for every tool_use_id, even on failure
5. **tool_use_id must match exactly** — copy it, never generate your own
