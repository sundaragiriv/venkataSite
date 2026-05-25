---
id: "d5-t4-1-token-basics"
title: "Token Management — Practical Techniques for Long-Running Agents"
domain: "d5"
taskRef: "T5.4"
order: 10
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Managing a long road trip on a tank of gas. You don't wait until you're empty — you watch the gauge and top up before you run out. You also drive efficiently: highway speed, not jack-rabbit starts. Token management is both watching the gauge AND driving efficiently."
examTrap: "Token management is about more than staying under the limit. The exam tests specific techniques: /compact, subagent delegation for context isolation, scratchpad files, and structured fact extraction — not just 'use fewer tokens'."
keyPoints:
  - "/compact in Claude Code: compresses conversation history while preserving key decisions and findings."
  - "Subagent delegation for isolation: offload verbose tasks to subagents — main context only receives the summary."
  - "Scratchpad files: intermediate computation results written to files instead of conversation."
  - "Structured fact extraction: extract key facts from tool results into a compact facts block rather than keeping raw results."
  - "Token cost vs quality tradeoff: aggressive compression can lose precision — preserve exact values, summarize narrative."
antiPatterns:
  - "Never using /compact in long Claude Code sessions — context fills gradually and quality degrades"
  - "Doing verbose file reads in main agent context — use Explore subagent instead"
  - "No scratchpad files for long computation — intermediate work fills conversation"
  - "Summarizing structured data (amounts, IDs, dates) — precision loss"
tbChallenge: "Your Claude Code session has been running for 2 hours analyzing a large codebase. Context is at 70%. You have another hour of work to do. What are your three options and what are the tradeoffs?"
---

## /compact — Claude Code Context Compression

```bash
# In Claude Code terminal during a long session
/compact

# What happens:
# 1. Claude reads the entire conversation history
# 2. Generates a condensed summary preserving:
#    - Key decisions made
#    - Important findings
#    - Current task state
#    - Files examined and their relevant content
# 3. Replaces the history with the summary
# 4. Session continues with compressed context

# When to use:
# - Context >50% full
# - Before starting a new major task phase
# - After completing a large exploration phase
```

## Subagent Delegation for Context Isolation

```python
# ❌ Main agent reads files — context fills with content
# Main agent: "Let me read all 50 authentication-related files..."
# Context: now contains 50,000 tokens of file contents

# ✅ Explore subagent reads files — main context receives only summary
explore_prompt = """
Explore all authentication-related files in src/auth/ and src/middleware/.
Examine: entry points, token validation, session management.

Return a structured summary (200 lines max):
{
  "entry_points": [...],
  "token_flow": "description",
  "session_mechanism": "description",
  "security_concerns": [...],
  "files_examined": N
}

Do NOT return file contents — return your analysis only.
"""

# Main agent spawns Explore subagent
summary = await spawn_explore_subagent(explore_prompt)
# Main context grows by 200 lines, not 50,000
```

## Scratchpad Files

```python
# For long computation with intermediate results
scratchpad_config = """
For extensive analysis, use scratchpad files:
- Write intermediate findings to /tmp/analysis_scratchpad.md
- Update the scratchpad as you progress
- Return only your final conclusions in the conversation

This prevents your working notes from filling the context window.
"""

# Claude writes to scratchpad during long analysis
# Main conversation only contains the final summary
```

## Structured Fact Extraction

```python
class FactExtractor:
    """Extract compact facts from verbose tool results."""
    
    FACT_PATTERNS = {
        "get_order": lambda r: {
            "order_id":  r["id"],
            "status":    r["status"],
            "amount":    r["total_cents"] / 100,
            "date":      r["created_at"][:10]
        },
        "get_customer": lambda r: {
            "customer_id": r["id"],
            "name":        r["name"],
            "tier":        r["tier"],
            "verified":    r.get("verified", False)
        }
    }
    
    def extract(self, tool_name: str, full_result: dict) -> dict:
        """Extract compact facts instead of storing full result."""
        extractor = self.FACT_PATTERNS.get(tool_name)
        if extractor:
            return extractor(full_result)
        return full_result  # no pattern — pass through
    
    def as_context_string(self, facts: dict) -> str:
        """Format facts as compact string for context."""
        return "\n".join(f"{k}: {v}" for k, v in facts.items())
```

## Key Takeaways

1. **/compact** when context exceeds 50% in Claude Code
2. **Subagent delegation** for verbose exploration — main context gets summary only
3. **Scratchpad files** for intermediate computation work
4. **Structured fact extraction** — compact facts not full tool results
5. **Preserve exact values** (amounts, IDs, dates) when summarizing — never approximate
