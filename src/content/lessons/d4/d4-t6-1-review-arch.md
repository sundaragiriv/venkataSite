---
id: "d4-t6-1-review-arch"
title: "Multi-Instance Review — Why Self-Review Fails"
domain: "d4"
taskRef: "T4.6"
order: 16
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "Proofreading your own writing. Your brain autocorrects as you read — you see what you intended, not what's there. A fresh reader has no such bias. Claude reviewing its own code has identical psychology: it retains the reasoning from generation and is far less likely to question its own decisions."
examTrap: "Thinking 'ask Claude to review carefully' equals independent review. It doesn't. The model retains its reasoning context from generation regardless of how you phrase the review request. The fix is a completely separate API call with no shared context whatsoever."
keyPoints:
  - "Self-review fails: Claude retains reasoning context from generation — biased toward validating its own decisions."
  - "Independent review: fresh API call with NO knowledge of how the code was generated."
  - "Tell the reviewer explicitly: 'Do not assume this code is correct. Find errors.'"
  - "Multi-pass: per-file reviews (parallel, full attention) → cross-file integration (sequential)."
  - "Confidence self-reporting alongside findings enables routing to human review."
antiPatterns:
  - "Same session for generation and review — reviewer inherits generator's bias"
  - "Passing generation conversation history to reviewer — same effect as same session"
  - "One massive review of all files simultaneously — attention dilution"
  - "Reviewer not told to assume code might be wrong — defaults to confirmation mode"
tbChallenge: "Colleague says: 'I ask Claude to double-check its code before submitting — works fine.' What's actually happening, and why does an independent instance catch more bugs?"
---

## The Self-Review Bias

```python
# Generation session: Claude builds reasoning for every decision made
# "I used a for loop because of performance concerns"
# "I skipped this error check because the input is always validated upstream"
# "This pattern is standard for this framework"

# ❌ Review in SAME session — reviewer inherits all that reasoning
same_session_review = generation_messages + [
    {"role": "user", "content": "Review your code for bugs"}
    # Claude's internal state: "I remember why I made every decision — they were correct"
    # Much less likely to question decisions it already justified
]
```

## The Independent Review Call

```python
# ✅ Separate API call — completely fresh context

async def independent_review(code: str, task: str) -> dict:
    return await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Review this code for bugs, security issues, and correctness.

Task it was meant to implement:
{task}

Code to review:
{code}

CRITICAL: Do NOT assume this code is correct.
Your job is to find bugs, vulnerabilities, and logic errors.
Do not confirm — question.

Return: {{findings: [{{severity, description, line, suggested_fix}}], verdict: approved|needs_changes}}"""
        }]
        # No generation conversation — completely fresh
    )
```

## Multi-Pass Architecture

```python
async def full_review(files: list[str]) -> dict:
    # Pass 1: per-file, parallel, full context window each
    per_file = await asyncio.gather(*[
        independent_review(read_file(f), f"File: {f}")
        for f in files
    ])

    # Pass 2: cross-file integration, sequential
    integration = await call_claude(messages=[{
        "role": "user",
        "content": f"""Find cross-file issues ONLY.
Per-file reviewers checked individual correctness.
Focus: interface mismatches, shared state bugs, contradictory assumptions.

Per-file findings: {json.dumps(per_file)}"""
    }])

    return {"per_file": per_file, "integration": integration}
```

## Key Takeaways

1. **Self-review is biased** — generation reasoning persists in session
2. **Independent = separate API call, zero generation history**
3. **Tell reviewer to assume code might be wrong** — prevents confirmation bias
4. **Per-file parallel, cross-file sequential** — avoids attention dilution
5. **Confidence self-report** alongside findings for routing
