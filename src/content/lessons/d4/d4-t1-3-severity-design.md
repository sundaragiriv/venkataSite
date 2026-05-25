---
id: "d4-t1-3-severity-design"
title: "Severity Design — Four Levels, Clear Actions, Concrete Examples"
domain: "d4"
taskRef: "T4.1"
order: 3
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Hospital triage. Not everything is a Code Blue. Triage assigns severity so resources go to the right problems at the right time. A well-designed severity system means developers know instantly: fix now, fix before merge, track for later, or just note it."
examTrap: "Severity inflation — too many Critical and High findings. When everything is High priority, nothing is. Developers can't differentiate and treat all findings the same."
keyPoints:
  - "Four levels: Critical (ship blocker), High (fix before merge), Medium (track as debt), Low (informational)."
  - "Each level needs a clear action — not just a label."
  - "Include both examples of what IS and what is NOT at each severity level."
  - "Healthy distribution: ~5% Critical, ~20% High, ~50% Medium, ~25% Low. Skewed = recalibrate."
  - "Severity is based on IMPACT, not on confidence. Don't inflate severity because you're uncertain."
antiPatterns:
  - "Severity without actions — what does the developer actually DO with a High finding?"
  - "Severity inflation — Critical for anything that could theoretically be a problem"
  - "No negative examples — Claude doesn't know what does NOT qualify at each level"
  - "Confidence masquerading as severity — 'I'm not sure so I'll say Critical'"
tbChallenge: "Design the four-level severity system for an API security review. For each level: definition, action required, one thing that IS that level, one thing that is NOT."
---

## A Complete Severity System

```python
severity_system = """
SEVERITY LEVELS — apply exactly as defined

### CRITICAL — Reject PR immediately
What it is: Directly exploitable or causes data loss/corruption.
Action: PR rejected. Engineer must fix before review continues.
Response SLA: Fix within 4 hours.

✓ IS Critical:
  raw_sql = f"SELECT * FROM users WHERE id = {request.user_id}"  # SQL injection
  SECRET_KEY = "my-prod-secret-key-123"  # Hardcoded credential
  
✗ NOT Critical (that's High):
  Missing rate limiting on a public endpoint

### HIGH — Fix before merge (or written justification)
What it is: Bug causing incorrect behavior in production, or significant security weakness.
Action: Fix required OR engineer documents override decision.

✓ IS High:
  async def charge_card(amount):
      result = await payment_api.charge(amount)  # No error handling — silent failure
      
✗ NOT High (that's Medium):
  Function is 65 lines — over the 50-line guideline

### MEDIUM — Track as technical debt
What it is: Code quality issue causing future maintenance problems.
Action: Create a ticket. Not required before merge.

✓ IS Medium:
  Public function get_customer() missing type hints
  
✗ NOT Medium (that's Low):
  Variable name could be clearer

### LOW — Informational only
What it is: Minor improvement, no significant impact.
Action: PR comment only. No action required.

✓ IS Low:
  Comment explains what the code does instead of why
  
✗ NOT Low (not flagged at all):
  Personal style preference
  Formatting issues (use linter)
  Naming convention (use naming linter)
"""
```

## Severity Distribution Check

```python
def check_distribution(findings: list) -> list[str]:
    total = len(findings)
    if total == 0:
        return []

    dist = {
        s: sum(1 for f in findings if f["severity"] == s) / total
        for s in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    }

    warnings = []
    if dist["CRITICAL"] > 0.15:
        warnings.append(f"Critical at {dist['CRITICAL']:.0%} — criteria too broad")
    if dist["CRITICAL"] + dist["HIGH"] > 0.50:
        warnings.append("High+Critical >50% — severity inflation detected")
    if dist["LOW"] < 0.10:
        warnings.append("No Low findings — may be missing fine-grained issues")
    return warnings
```

## Key Takeaways

1. **Four levels, four actions** — definition AND required response
2. **Both examples**: what IS at that level AND what is NOT
3. **Healthy distribution** — skewed = recalibrate
4. **Severity = impact**, not confidence
5. **Low matters** — gives developers informational value without blocking them
