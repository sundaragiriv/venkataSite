---
id: "d1-t1-3-loop-antipatterns"
title: "Agentic Loop Anti-Patterns — The Mistakes That Break Production"
domain: "d1"
taskRef: "T1.1"
order: 3
xp: 40
tag: "⚡ Exam Critical"
duration: "10 min"
analogy: "A fire alarm that sometimes doesn't go off, sometimes goes off randomly, and sometimes you can't tell if it's real or a drill. An agentic loop with bad termination logic is exactly this — unreliable in ways that are hard to detect and catastrophic when they fail."
examTrap: "Thinking that an iteration cap prevents infinite loops safely. It does prevent infinite loops, but it masks the real error. A loop that hits its cap returned partial results silently — which is often worse than failing loudly."
keyPoints:
  - "Natural language completion detection is always wrong — 'done', 'finished', 'complete' can appear in any context, not just as signals that the task is done."
  - "Iteration caps are safety valves, not primary termination logic — hitting the cap should raise an exception, not return partial results."
  - "Checking content type instead of stop_reason breaks when Claude returns mixed content (text + tool_use in the same response)."
  - "Not persisting messages correctly between iterations corrupts the conversation history and causes Claude to repeat work or contradict itself."
  - "Missing max_tokens handling is a silent failure mode — the response was cut short but stop_reason is 'max_tokens' not 'end_turn'."
antiPatterns:
  - "if 'done' in response_text or 'finished' in response_text: break"
  - "for i in range(10): ... # silently returns partial results at i=10"
  - "if response.content[0].type == 'text': return — fails when Claude leads with tool_use"
  - "messages = [] at the start of each iteration — wipes conversation history"
  - "Not handling stop_reason == 'max_tokens' — treats truncated responses as complete"
tbChallenge: "I'm building a customer support agent and my loop runs for exactly 10 iterations every time, even on simple queries. What's wrong and how do I fix it without using a different loop structure?"
---

## Why Anti-Patterns Are More Dangerous Than Bugs

A regular bug crashes your program. You see the error, you fix it.

An agentic loop anti-pattern is different. It often works — most of the time. Your agent handles the easy cases correctly. It fails on edge cases, under load, or in specific configurations that you never tested. By the time it fails in production, it's been running for months and you have no idea which results were correct.

This is why the exam tests these patterns directly. They're not theoretical — they're the actual mistakes that engineers make when building real systems.

## Anti-Pattern 1: Natural Language Completion Detection

```python
# ❌ The most common mistake
while True:
    response = call_claude(messages)
    text = get_text_content(response)

    # These checks will fail in unexpected ways
    if "done" in text.lower():
        return text
    if "task complete" in text.lower():
        return text
    if "finished" in text.lower():
        return text

    # Handle tool calls...
```

**Why this breaks:**

Claude might say "I'm not done yet, let me check one more thing" — contains "done", triggers early exit.

Claude might describe a completed tool result: "The order has been finished processing" — contains "finished", triggers early exit.

Claude might ask a clarifying question that happens to contain any of these words.

**The correct approach:**

```python
# ✅ Only use stop_reason
while True:
    response = call_claude(messages)

    if response.stop_reason == "end_turn":
        return extract_text(response)
    elif response.stop_reason == "tool_use":
        # Handle tools
        pass
    elif response.stop_reason == "max_tokens":
        raise ValueError("Response truncated — increase max_tokens or reduce prompt size")
    else:
        raise ValueError(f"Unexpected stop_reason: {response.stop_reason}")
```

## Anti-Pattern 2: Iteration Caps as Primary Termination

```python
# ❌ Looks safe, actually masks errors
MAX_ITERATIONS = 10

for i in range(MAX_ITERATIONS):
    response = call_claude(messages)

    if response.stop_reason == "end_turn":
        return extract_text(response)

    handle_tool_calls(response, messages)

# Silently falls through here — what do we return?
return "Task may not be complete"  # ← This is the problem
```

**Why this breaks:**

If a legitimate task requires 11 tool calls, this returns partial results at iteration 10 without any indication that the task is incomplete. The caller gets back a result that looks real but is wrong.

**The correct approach:**

Use iteration caps as a safety valve that raises loudly, not silently:

```python
# ✅ Iteration cap as safety valve only
MAX_ITERATIONS = 50  # Generously high
iteration = 0

while True:
    iteration += 1
    if iteration > MAX_ITERATIONS:
        # This is an error condition — raise it, don't return partial results
        raise RuntimeError(
            f"Agent loop exceeded {MAX_ITERATIONS} iterations. "
            f"This indicates a bug in tool execution or an infinite loop condition. "
            f"Last stop_reason: {response.stop_reason}"
        )

    response = call_claude(messages)

    if response.stop_reason == "end_turn":
        return extract_text(response)

    handle_tool_calls(response, messages)
```

The distinction matters: an iteration cap should tell you something went wrong, not silently deliver bad data.

## Anti-Pattern 3: Content Type Check Instead of stop_reason

```python
# ❌ Breaks on mixed content responses
response = call_claude(messages)

# This fails when Claude returns text AND a tool_use in the same response
if response.content[0].type == "text":
    return response.content[0].text  # Wrong — might have tool_use blocks too
elif response.content[0].type == "tool_use":
    handle_tool(response.content[0])
```

**Why this breaks:**

Claude often returns a text explanation alongside tool_use blocks:

```
response.content = [
    {"type": "text", "text": "I'll look that up for you."},
    {"type": "tool_use", "id": "...", "name": "lookup_order", "input": {...}}
]
```

The first content block is `text`, so your code returns early — missing the tool call entirely. The agent appears to respond but never actually executes the tool.

**The correct approach:**

Always check `stop_reason` at the response level, never `content[0].type`:

```python
# ✅ stop_reason is the authoritative signal
if response.stop_reason == "end_turn":
    # Extract ALL text blocks (there might be multiple)
    text_blocks = [b.text for b in response.content if b.type == "text"]
    return " ".join(text_blocks)

elif response.stop_reason == "tool_use":
    # Extract ALL tool_use blocks (there might be multiple)
    tool_blocks = [b for b in response.content if b.type == "tool_use"]
    # Execute all of them
```

## Anti-Pattern 4: Wiping Message History Between Iterations

```python
# ❌ Destroys conversation context
while True:
    messages = [{"role": "user", "content": user_query}]  # WRONG: inside loop
    response = call_claude(messages)
    # Claude has no memory of what happened before
```

**Why this breaks:**

Claude has no memory of previous tool calls or results. It will repeat the same tool calls, contradict its earlier reasoning, or lose track of what it was doing entirely.

**The correct approach:**

Initialize messages once outside the loop and append to them:

```python
# ✅ Accumulate history throughout the loop
messages = [{"role": "user", "content": user_query}]  # Outside loop

while True:
    response = call_claude(messages)

    if response.stop_reason == "end_turn":
        return extract_text(response)

    # Append Claude's response
    messages.append({"role": "assistant", "content": response.content})

    # Execute tools and append results
    tool_results = execute_all_tools(response)
    messages.append({"role": "user", "content": tool_results})
    # Loop continues with full history intact
```

## Anti-Pattern 5: Ignoring max_tokens Stop Reason

```python
# ❌ Treats truncated response as complete
response = call_claude(messages)

if response.stop_reason in ("end_turn", "max_tokens"):  # ← Wrong
    return extract_text(response)
```

**Why this breaks:**

`max_tokens` means the response was cut off mid-generation. Claude didn't finish its thought — your code just got a fragment. Treating this as a valid completion returns incomplete, potentially corrupted output.

**The correct approach:**

Handle `max_tokens` as a configuration error:

```python
# ✅ max_tokens is an error condition
if response.stop_reason == "end_turn":
    return extract_text(response)
elif response.stop_reason == "max_tokens":
    raise ConfigurationError(
        "Response was truncated. Increase max_tokens in your API call. "
        "Current limit may be too low for this task complexity."
    )
elif response.stop_reason == "tool_use":
    handle_tool_calls(response, messages)
```

## Anti-Pattern 6: Sequential Tool Execution When Parallel Is Possible

```python
# ❌ Unnecessarily slow for independent tools
for tool_block in all_tool_blocks:
    result = execute_tool(tool_block.name, tool_block.input)
    time.sleep(0)  # Conceptually sequential even without explicit sleep
    results.append(result)
```

For tools that don't depend on each other's results — web searches, database lookups, external API calls — sequential execution multiplies your latency unnecessarily.

**The correct approach for independent tools:**

```python
# ✅ Parallel execution for independent tools
import concurrent.futures

with concurrent.futures.ThreadPoolExecutor() as executor:
    futures = {
        executor.submit(execute_tool, block.name, block.input): block
        for block in tool_blocks
    }
    results = []
    for future, block in futures.items():
        try:
            result = future.result(timeout=30)
            results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": str(result)
            })
        except Exception as e:
            results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": f"Error: {e}",
                "is_error": True
            })
```

## The Production Mental Model

Think of your agentic loop as a contract between your code and Claude:

- **Your obligation**: Return a valid tool_result for every tool_use_id Claude requests, every time, without exception
- **Claude's obligation**: Signal completion via stop_reason, not via the content of its responses
- **The loop's job**: Maintain conversation integrity by correctly accumulating history

Break any part of this contract and you get unpredictable behavior that's extremely hard to debug in production.

## Key Takeaways

1. **stop_reason is the only valid completion signal** — never parse text content
2. **Iteration caps should raise errors**, not return partial results silently
3. **Check stop_reason, not content[0].type** — responses can be mixed
4. **Messages array lives outside the loop** — never reinitialize it per iteration
5. **max_tokens is a configuration error**, not a valid completion
6. **Independent tools can run in parallel** — don't serialize unnecessarily
