---
id: "d4-t1-2-false-positives"
title: "False Positives — Why Over-Flagging Kills Adoption"
domain: "d4"
taskRef: "T4.1"
order: 2
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A smoke detector that triggers every time you cook toast. You learn to ignore it. When it goes off at 3am you assume toast — and don't evacuate. A Claude reviewer that flags 40 issues per PR, 35 of them wrong, trains developers to ignore all 40."
examTrap: "Thinking more findings = more value. The exam tests that false positives actively degrade tool value by training developers to ignore outputs — including the real issues buried in the noise."
keyPoints:
  - "Signal-to-noise ratio determines adoption — not total issues found."
  - "Even a 20% false positive rate is acceptable. A 70% false positive rate kills adoption within weeks."
  - "False positives are caused by: vague criteria, missing scope exclusions, insufficient codebase context."
  - "Track dismissals — when developers dismiss findings, that's your false positive signal."
  - "Iterate on criteria when a category has >30% dismissal rate."
antiPatterns:
  - "Optimizing recall (catch everything) at the expense of precision (only flag real issues)"
  - "No mechanism to track which findings developers dismiss"
  - "Not updating criteria when dismissal patterns emerge — assuming false positives are acceptable"
  - "Treating all finding categories the same — some will have higher false positive rates than others"
tbChallenge: "Your Claude code review has been running 3 weeks. Developers are dismissing 70% of findings. Walk me through exactly how you diagnose which criteria are causing false positives and how you fix them."
---

## The Adoption Curve

```
False positive rate → Developer response

0–15%:  Developers read every finding carefully
15–30%: Developers focus on Critical/High, skim Medium
30–60%: Developers scan briefly, mostly dismiss
60%+:   Developers stop opening review comments entirely
```

At 70% dismissal, the 30% of real findings are invisible in the noise.

## Measuring False Positives

```python
# Track every developer action on findings
def record_finding_action(finding_id: str, action: str, reason: str = None):
    """
    action: 'fixed' | 'dismissed' | 'deferred'
    reason: free text if dismissed ('false positive', 'known issue', 'intentional', etc.)
    """
    db.insert("finding_actions", {
        "finding_id":  finding_id,
        "action":      action,
        "reason":      reason,
        "reviewer_id": current_user(),
        "timestamp":   utcnow()
    })

# Weekly report
def fp_report():
    return db.query("""
        SELECT  fa.rule_category,
                COUNT(*) FILTER (WHERE action='fixed')     as fixed,
                COUNT(*) FILTER (WHERE action='dismissed') as dismissed,
                COUNT(*) FILTER (WHERE action='deferred')  as deferred,
                ROUND(
                    COUNT(*) FILTER (WHERE action='dismissed') * 100.0 / COUNT(*), 1
                ) as fp_rate_pct
        FROM    finding_actions fa
        JOIN    findings f ON f.id = fa.finding_id
        WHERE   fa.timestamp > NOW() - INTERVAL '7 days'
        GROUP BY fa.rule_category
        ORDER BY fp_rate_pct DESC
    """)
```

## Diagnosing and Fixing by Category

```python
# Example: "missing_error_handling" has 68% dismissal rate
# Root cause analysis:
#   - FastAPI middleware catches all uncaught exceptions
#   - Claude doesn't know this — flags every route without explicit try/catch

# Fix: add codebase context to criteria
additional_context = """
Important context about this codebase:
- FastAPI middleware at src/middleware/error_handler.py catches ALL uncaught exceptions
- You do NOT need to flag missing try/catch in route handlers that delegate to services
- Only flag missing error handling where: (1) the function makes a network call directly
  AND (2) no error boundary is visible in the same file or its imports
"""
```

## Key Takeaways

1. **Signal-to-noise ratio** matters more than total findings
2. **Track dismissals** as your false positive measurement signal
3. **>30% dismissal** in any category → that category's criteria needs work
4. **Root cause**: vague criteria, missing context, or wrong scope
5. **Iterate systematically** — find the pattern, fix the criteria, measure again
