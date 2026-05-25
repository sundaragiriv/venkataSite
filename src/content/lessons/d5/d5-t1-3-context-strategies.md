---
id: "d5-t1-3-context-strategies"
title: "Context Optimization Strategies — Keeping the Window Efficient"
domain: "d5"
taskRef: "T5.1"
order: 3
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A surgeon's tray during an operation. Not every tool from the hospital is on the tray — only what's needed for this procedure. The scrub nurse actively manages the tray, removing used instruments and keeping current ones accessible. Context optimization is that active tray management."
examTrap: "Treating context management as a one-time setup rather than an ongoing process. For long-running agents, context must be actively managed throughout the session — not just at the start."
keyPoints:
  - "Tool result trimming: return summaries and key metrics to conversation, store full data externally."
  - "Conversation compaction: /compact in Claude Code, or summary injection via API for agent sessions."
  - "Subagent delegation: offload verbose exploration to Explore subagents — return only structured summary."
  - "Scratchpad files: for long computations, write intermediate results to files rather than conversation."
  - "Context budget allocation: reserve space for reasoning — don't let tool results consume >40% of window."
antiPatterns:
  - "Returning full API responses as tool results — no trimming"
  - "Never compacting a long agent session — context fills with old irrelevant history"
  - "Doing verbose exploration in the main agent context — fills with file contents"
  - "No context budget — discovering overflow only when the API returns an error"
tbChallenge: "Your agent has been running for 3 hours. Context is at 75%. You still have significant work to do. Walk me through your options and the tradeoffs of each."
---

## The Four Context Strategies

### Strategy 1: Tool Result Trimming

Return only what Claude needs for its next decision:

```python
def trim_for_context(tool_name: str, full_result: dict, current_task: str) -> dict:
    """Trim tool results before adding to conversation."""
    
    if tool_name == "get_order_history":
        orders = full_result.get("orders", [])
        return {
            "total_orders": len(orders),
            "total_spend": sum(o["amount"] for o in orders),
            "recent_orders": orders[-5:],  # last 5 only
            "note": f"Showing 5 of {len(orders)} orders"
        }
    
    if tool_name == "get_document_content":
        content = full_result.get("content", "")
        # Return first 500 chars + summary
        return {
            "preview": content[:500],
            "total_chars": len(content),
            "summary": summarize_if_long(content)
        }
    
    return full_result  # pass through if no specific trimming rule
```

### Strategy 2: Conversation Compaction

When context grows too large, summarize old history:

```python
async def compact_if_needed(messages: list, threshold: float = 0.6) -> list:
    """Compact conversation if context exceeds threshold."""
    token_estimate = sum(len(str(m)) // 4 for m in messages)
    
    if token_estimate / 200000 < threshold:
        return messages  # under threshold, no action needed
    
    # Keep system prompt + last 10 turns
    system = [m for m in messages if m["role"] == "system"]
    recent = messages[-20:]  # last 10 turns (user + assistant pairs)
    old = messages[len(system):-20]
    
    # Summarize old history
    summary_response = await call_claude(
        system="Summarize this conversation preserving: decisions made, facts discovered, current task state.",
        user=format_messages(old)
    )
    
    summary_message = {
        "role": "user",
        "content": f"[Previous session summary]\n{summary_response}\n[End summary]"
    }
    
    return system + [summary_message] + recent
```

### Strategy 3: Scratchpad Files

For long computations, write to files instead of conversation:

```python
# Instead of: appending 10,000 tokens of analysis to conversation
# Do: write to a scratchpad file, reference it by path

async def analyze_with_scratchpad(data: dict) -> str:
    # Write intermediate work to file
    scratchpad_path = "/tmp/analysis_scratchpad.json"
    
    # Tell Claude to use the scratchpad
    response = await call_claude(
        system="For extensive analysis, write intermediate findings to the scratchpad file.",
        user=f"""Analyze this dataset. 
Write your working notes to {scratchpad_path} as you go.
Return only your final conclusions in the conversation."""
    )
    
    return response  # Conversation only has the conclusion, not the working
```

### Strategy 4: Context Budget Allocation

```python
CONTEXT_BUDGET = {
    "system_prompt":    0.05,   # 5% — permanent rules
    "task_context":     0.10,   # 10% — current task info
    "tool_results":     0.40,   # 40% — max for tool data
    "conversation":     0.30,   # 30% — history
    "reasoning_buffer": 0.15,   # 15% — reserved for Claude's response
}

def check_budget(messages: list) -> dict:
    total = sum(len(str(m)) // 4 for m in messages)
    pct = total / 200000
    
    if pct > 0.85:
        return {"status": "critical", "action": "compact_immediately"}
    elif pct > 0.65:
        return {"status": "warning", "action": "trim_next_results"}
    return {"status": "ok", "action": "continue"}
```

## Key Takeaways

1. **Trim tool results** — return key metrics and summaries, store full data externally
2. **Compact on threshold** — summarize old history when approaching limit
3. **Scratchpad files** for working notes — keep conversation for conclusions only
4. **Budget allocation** — reserve 15% for Claude's reasoning response
5. **Monitor proactively** — check before each API call, not after overflow
