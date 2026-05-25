---
id: "d1-t5-2-observe-think-act"
title: "The Observe-Think-Act-Respond Cycle — The Cognitive Loop of an Agent"
domain: "d1"
taskRef: "T1.1"
order: 19
xp: 35
tag: "Core"
duration: "8 min"
analogy: "A chess player's thinking process. Observe the board position. Think through possible moves and consequences. Act by moving a piece. Observe the opponent's response. Repeat until checkmate or draw. An agent does exactly this — except the 'board' is a complex real-world task."
examTrap: "Assuming the 'think' phase is visible to your code. Claude's reasoning happens inside the model — you only see its output (text or tool calls). The think phase is opaque. You interact with observe (what you send) and act (what Claude returns)."
keyPoints:
  - "Observe: Claude receives the current conversation state — user message, prior tool results, and conversation history."
  - "Think: Claude reasons internally about what to do next — this is opaque to your code."
  - "Act: Claude outputs either text (task complete) or tool_use blocks (needs more information or action)."
  - "Respond: your code executes the action and appends the result, enabling the next observe phase."
  - "The entire agentic loop implements this cycle — stop_reason tells you which phase came out: end_turn (task complete) or tool_use (needs more)."
antiPatterns:
  - "Trying to inspect Claude's 'thinking' from the response — the think phase is internal to the model"
  - "Skipping the respond phase (not appending tool results) — breaks the cycle"
  - "Adding extra observe steps without acts — confuses the cycle with redundant context"
tbChallenge: "Map the observe-think-act-respond cycle onto the agentic loop code. For each line of a loop iteration, tell me which phase it corresponds to and why."
---

## The Cycle in Detail

### Observe Phase
Claude receives everything in the current messages array — including:
- The original user request
- All prior tool results
- All prior Claude responses
- Any system instructions

This is your opportunity to shape what Claude observes. Well-structured context = better decisions.

```python
# The messages array represents what Claude observes
messages = [
    {"role": "user", "content": "Process the customer's refund request for order #12345"},
    # Prior tool results are part of the observation
    {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "t001",
         "content": '{"customer": "Jane Smith", "verified": true, "tier": "premium"}'}
    ]},
    {"role": "assistant", "content": [
        {"type": "text", "text": "Customer verified. Checking order details."},
        {"type": "tool_use", "id": "t002", "name": "get_order",
         "input": {"order_id": "12345"}}
    ]},
    # This is the current observation point — Claude will read all of the above
]
```

### Think Phase (Internal)
Claude processes the observation and decides:
- Is there enough information to complete the task?
- If yes → generate the final response
- If no → which tool to call to get more information?

You cannot see this phase. You cannot inject into it mid-execution.

### Act Phase
Claude outputs its decision:

```python
response = call_claude(messages)

# Act: either complete...
if response.stop_reason == "end_turn":
    # Claude decided the task is complete
    final_text = extract_text(response)

# ...or continue
elif response.stop_reason == "tool_use":
    # Claude decided it needs more information/action
    tool_calls = [b for b in response.content if b.type == "tool_use"]
```

### Respond Phase
Your code executes the act and creates the next observation:

```python
# Respond: execute Claude's requested action
results = []
for tool_call in tool_calls:
    result = execute_tool(tool_call.name, tool_call.input)
    results.append({
        "type": "tool_result",
        "tool_use_id": tool_call.id,
        "content": str(result)
    })

# Append Claude's act to history
messages.append({"role": "assistant", "content": response.content})

# Append your response (which creates the next observation)
messages.append({"role": "user", "content": results})

# Loop: next iteration begins with this new observation
```

## How This Maps to the Agentic Loop

```python
# The complete cycle in code

while True:
    # ── OBSERVE ──────────────────────────────────────
    # Claude receives messages — this is the observation
    response = call_claude(messages)

    # ── THINK ────────────────────────────────────────
    # Happens inside Claude — you only see the output

    # ── ACT ──────────────────────────────────────────
    if response.stop_reason == "end_turn":
        return extract_text(response)  # Act: task complete

    # Act: requesting tool execution
    tool_calls = extract_tool_calls(response)

    # ── RESPOND ──────────────────────────────────────
    results = execute_all_tools(tool_calls)

    # Append act to history (enables next observation)
    messages.append({"role": "assistant", "content": response.content})

    # Append response (becomes part of next observation)
    messages.append({"role": "user", "content": results})

    # Cycle repeats: next call to Claude begins new Observe phase
```

## Key Takeaways

1. **Observe** = the messages array Claude receives
2. **Think** = internal to Claude, opaque to your code
3. **Act** = Claude's response (text or tool_use blocks)
4. **Respond** = your tool execution + appended results
5. **The cycle repeats** until stop_reason is end_turn
6. **Think is opaque** — you can't inspect it, only influence it through the Observe phase
