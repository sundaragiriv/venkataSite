---
id: "d1-t1-1-loop-basics"
title: "The Agentic Loop — How It Actually Works"
domain: "d1"
taskRef: "T1.1"
order: 1
xp: 35
tag: "Core"
duration: "8 min"
analogy: "A chef who checks if the dish is done, acts if not, checks again — looping until complete. Never stops based on a timer. Always stops based on the actual state of the dish."
examTrap: "Parsing natural language from Claude's response to detect completion — e.g. checking if the word 'done' appears in the text. This has a non-zero failure rate and breaks silently."
keyPoints:
  - "The agentic loop has exactly two exit conditions: stop_reason is 'end_turn' OR stop_reason is 'max_tokens'. Never anything else."
  - "When stop_reason is 'tool_use': execute the tool, append the tool_result to messages, call the API again. The loop continues."
  - "When stop_reason is 'end_turn': extract the text content from the response. The task is complete. Return it."
  - "Tool results MUST be appended to the conversation history so Claude can reason about what happened and decide the next action."
  - "Never set arbitrary iteration caps as the PRIMARY stopping mechanism — they mask errors instead of surfacing them."
antiPatterns:
  - "Parsing Claude's response text to detect completion ('if done in response.text...')"
  - "Checking for the presence of assistant text content as a completion indicator"
  - "Setting a counter like 'max_iterations=10' and stopping silently when reached"
  - "Not appending tool results back to conversation history"
tbChallenge: "Explain the agentic loop to me as if I'm 13 and have never seen any code. What is it, why does it exist, and what happens if you get the stopping condition wrong?"
---

## What Is the Agentic Loop?

When you call the Claude API once and get back a response, Claude is being used as a **text generator**. When you call it repeatedly in a cycle — where each response determines what happens next — Claude is being used as an **agent**.

The agentic loop is this cycle. It's the core pattern underlying every autonomous AI system built with Claude. Before you can understand multi-agent orchestration, hooks, state management, or any other Domain 1 concept, you must understand this loop completely.

## The Mechanism

Here is what actually happens inside the loop:

```
1. You send a request to Claude
2. Claude responds with a stop_reason
3. You inspect that stop_reason
4. If stop_reason === 'tool_use':
     → Claude wants to call a tool
     → Extract the tool name and input from the response
     → Execute the tool yourself (Claude cannot execute tools — it only requests them)
     → Append the tool_result to the conversation messages array
     → Go back to step 1
5. If stop_reason === 'end_turn':
     → Claude believes the task is complete
     → Extract the text content from the response
     → Return it to the user
     → STOP — the loop is done
```

That's it. The entire agentic loop in 8 lines.

## Why Tool Results Must Go Back Into Messages

This is the most commonly misunderstood detail.

When Claude calls a tool, it has **no idea what happened**. It only knows it requested the call. Your code executes the tool and gets a result. If you don't send that result back to Claude, it has no information to reason about next. The loop breaks down entirely.

The correct structure is:

```python
messages = [
    {"role": "user", "content": "Check the order status for #12345"},
]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        tools=tools,
        messages=messages
    )

    if response.stop_reason == "end_turn":
        # Task complete
        return extract_text(response)

    elif response.stop_reason == "tool_use":
        # Claude wants to call a tool
        tool_use_block = next(
            block for block in response.content
            if block.type == "tool_use"
        )

        # Execute the tool yourself
        result = execute_tool(tool_use_block.name, tool_use_block.input)

        # CRITICAL: append both Claude's response AND your tool result
        messages.append({"role": "assistant", "content": response.content})
        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": tool_use_block.id,
                "content": str(result)
            }]
        })
        # Loop continues
```

Notice that you append **two things**: Claude's response (with its tool_use block) and your tool_result. Both are required for the conversation history to be valid.

## The Two Valid Stop Reasons

| stop_reason | Meaning | What to do |
|---|---|---|
| `end_turn` | Claude finished the task | Return the response text |
| `tool_use` | Claude wants to call a tool | Execute it, append result, loop |
| `max_tokens` | Response hit token limit | This is an error condition — handle it |
| `stop_sequence` | A stop sequence was triggered | Return the response |

## The Three Anti-Patterns

### Anti-pattern 1: Parsing text to detect completion
```python
# ❌ WRONG
response_text = get_text(response)
if "done" in response_text or "complete" in response_text:
    break  # This fails silently when Claude doesn't say "done"
```

Claude might say "finished", "completed", "that's all", or nothing at all. Parsing natural language for completion detection has a non-zero failure rate. **Always use stop_reason.**

### Anti-pattern 2: Arbitrary iteration caps as primary stop
```python
# ❌ WRONG
for i in range(10):  # Loop stops after 10 iterations regardless
    response = call_claude(messages)
    if is_done(response): break
# What happens at iteration 11? Silent failure.
```

An iteration cap is fine as a **safety valve** (to prevent infinite loops caused by bugs). It is not acceptable as the **primary** stopping mechanism. If you hit your cap, that's an error — raise it, don't return partial results.

### Anti-pattern 3: Checking for assistant text content
```python
# ❌ WRONG
if response.content[0].type == "text":
    return response.content[0].text  # Breaks when Claude leads with a tool_use block
```

Claude can return tool_use blocks alongside text, or text alone, or tool_use alone. Check stop_reason, not content type.

## The Production Implication

Why does this matter so much for the exam?

Because this pattern is the foundation of everything else in Domain 1. Multi-agent orchestration is just a loop where one of the "tools" spawns another agent. Hooks intercept the tool execution step. State management is about what you pass into the messages array. Session management is about persisting the messages array across requests.

Get the loop right, and the rest follows.

## Key Takeaways

1. **stop_reason drives everything** — it's the only reliable completion signal
2. **Tool results must go back to Claude** — both the assistant turn and the tool_result
3. **Never parse text for completion** — it fails silently at the worst possible times
4. **Iteration caps are safety valves, not primary stops** — hitting them is an error condition
5. **Claude requests tools; you execute them** — Claude cannot take actions directly
