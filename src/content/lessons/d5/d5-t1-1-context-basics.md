---
id: "d5-t1-1-context-basics"
title: "Context Window Basics — What It Is and Why It Fills Up"
domain: "d5"
taskRef: "T5.1"
order: 1
xp: 30
tag: "Core"
duration: "8 min"
analogy: "A whiteboard in a meeting room. Everyone can see everything on it. As the meeting progresses you keep adding — but the whiteboard has a finite size. When it's full, old content gets erased to make room. The context window is that whiteboard. What stays and what gets erased determines the quality of the conversation."
examTrap: "Thinking context window management is only about preventing overflow. The real issue is WHAT fills the window — verbose tool outputs, repeated context, and irrelevant history crowd out the reasoning space Claude needs."
keyPoints:
  - "The context window holds everything Claude sees: system prompt, conversation history, tool results, and the current message."
  - "Claude's attention is not uniform across the window — content in the middle receives less attention than content at the start or end (lost-in-the-middle effect)."
  - "Tool results are the fastest context filler — a single database dump can consume 40% of the window."
  - "The fix is not just 'stay under the limit' — it's actively managing WHAT occupies the window to keep signal high."
  - "Context exhaustion in long-running agents causes hallucination as Claude starts reasoning about content it can no longer 'see' clearly."
antiPatterns:
  - "Passing full tool results without trimming — a 5000-line database export in the context"
  - "Accumulating conversation history without summarization in long sessions"
  - "Putting critical instructions in the middle of a long context — they get deprioritized"
  - "No monitoring of context usage — discovering overflow in production"
tbChallenge: "Explain the lost-in-the-middle effect to a developer who says 'I just need to stay under 200k tokens and I'm fine.' What are they missing and why does it matter for production systems?"
---

## What Lives in the Context Window

Every token Claude processes in a single API call:

```
┌─────────────────────────────────────────────────────┐
│ CONTEXT WINDOW (200k tokens for claude-sonnet-4-6)  │
│                                                     │
│  System prompt          ~2,000 tokens               │
│  CLAUDE.md content      ~1,000 tokens               │
│  Conversation history   ~50,000 tokens (long run)   │
│  Tool results           ~30,000 tokens (unmanaged)  │
│  Current message        ~500 tokens                 │
│  Claude's response      ~4,000 tokens               │
│                         ──────────────              │
│  Total used             ~87,500 tokens (44%)        │
└─────────────────────────────────────────────────────┘
```

At 44% this looks fine. But after 2 more hours of tool calls and conversation, you're at 180k — and the critical system instructions from the beginning are now buried in the middle.

## The Lost-in-the-Middle Effect

Research consistently shows Claude's attention is non-uniform across long contexts:

```
Attention level across context position:

High  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓
      │                                               │
     START                  MIDDLE                  END
   (System               (Tool results,            (Recent
   prompt,               history)                  message)
   key rules)

Low   ░░░░░░░░░░░░░░░░░░▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░
```

Important instructions buried in the middle of 100k tokens of tool results get deprioritized. This is why:
- Critical rules belong in the system prompt (start)
- Key context belongs near the current message (end)
- Verbose intermediate results belong summarized or external

## What Fills Context Fastest

```python
# Rank by context consumption per operation:

1. Database query results (full rows):      5,000–50,000 tokens
2. File contents (large files):             2,000–20,000 tokens
3. API responses (verbose JSON):            1,000–10,000 tokens
4. Web search results (full pages):         2,000–8,000 tokens
5. Prior conversation turns:               100–500 tokens each
6. Tool descriptions:                       50–200 tokens each
```

## Monitoring Context Usage

```python
def estimate_context_usage(messages: list, tools: list) -> dict:
    """Rough token estimate before API call."""
    import anthropic
    
    # Use the tokenizer to count
    client = anthropic.Anthropic()
    
    # Count message tokens
    total = sum(
        len(msg["content"]) // 4  # ~4 chars per token approximation
        for msg in messages
        if isinstance(msg.get("content"), str)
    )
    
    # Count tool definition tokens
    tool_tokens = sum(len(str(t)) // 4 for t in tools)
    
    usage_pct = (total + tool_tokens) / 200000 * 100
    
    return {
        "estimated_tokens": total + tool_tokens,
        "usage_pct": round(usage_pct, 1),
        "warning": usage_pct > 60,
        "critical": usage_pct > 80
    }
```

## Key Takeaways

1. **Context window = everything Claude sees** — system prompt, history, tool results, message
2. **Lost-in-the-middle** — instructions buried in large contexts get deprioritized
3. **Tool results fill fastest** — trim aggressively before appending
4. **Stay under 60% as working limit** — not 100%
5. **Monitor usage proactively** — not reactively after production issues
