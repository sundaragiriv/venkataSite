---
id: "d4-t1-1-explicit-criteria"
title: "Explicit Criteria Design — Specific Instructions Over Vague Guidance"
domain: "d4"
taskRef: "T4.1"
order: 1
xp: 35
tag: "Core"
duration: "9 min"
analogy: "A contract vs a handshake. A handshake deal on 'good quality work' leaves both parties with different expectations. A contract specifies deliverables, dimensions, materials, timelines, and what constitutes acceptable vs unacceptable. Explicit criteria are the contract."
examTrap: "Writing criteria that tell Claude what to do without telling it what makes an output GOOD or BAD. 'Review this code for issues' is a task. 'Flag any function exceeding 30 lines as High severity, and any function with a cyclomatic complexity above 10 as Critical' is criteria."
keyPoints:
  - "Specific, verifiable criteria produce consistent output — vague criteria produce variable, subjective output."
  - "Criteria should be checkable: 'functions over 30 lines' can be verified. 'readable code' cannot be verified."
  - "False positives erode developer trust — over-flagging is worse than under-flagging for adoption."
  - "Include severity calibration with concrete examples — what makes something Critical vs High vs Medium?"
  - "Negative criteria matter as much as positive: what should NOT be flagged, and why?"
antiPatterns:
  - "'Review for best practices' — not specific enough to produce consistent results"
  - "Criteria without concrete thresholds — 'long functions' vs 'functions over 30 lines'"
  - "No severity guidance — everything flagged as the same severity"
  - "No examples of what NOT to flag — leads to over-flagging and trust erosion"
tbChallenge: "Your code review Claude integration is flagging 40 issues per PR, mostly style preferences. Developer adoption is dropping because people ignore it. What specifically is wrong with your criteria design and how do you fix it?"
---

## Specific vs Vague Criteria

```python
# ❌ Vague — produces variable, subjective output
system_prompt = """
You are a code reviewer. Review this code and flag any issues you find.
Focus on code quality, readability, and best practices.
"""

# ✅ Specific — produces consistent, actionable output
system_prompt = """
You are a code reviewer. Review ONLY for these specific issues:

## Critical (must fix before merge)
- Security vulnerabilities: SQL injection, XSS, hardcoded credentials
- Data loss risk: operations that could destroy data without recovery path
- Auth bypass: any path that could allow unauthenticated access to protected resources

## High (should fix before merge)
- Functions exceeding 50 lines — exception: main() orchestration functions
- Cyclomatic complexity > 10 (more than 10 decision points)
- Missing error handling in async functions that make network calls

## Medium (track as tech debt)
- Missing type hints on public functions (Python) or `any` types (TypeScript)
- Duplicate logic blocks > 5 lines — flag the second occurrence
- No docstring on public classes

## Do NOT flag (these are not issues for this reviewer)
- Naming style (camelCase vs snake_case) — we have linters for this
- Comment formatting or quantity
- Single-letter variable names in list comprehensions or lambda functions
- File organization preferences
"""
```

The vague version flags 40 issues per PR. The specific version flags 3-7 high-signal issues.

## The Trust Erosion Problem

False positives destroy adoption faster than false negatives.

If Claude flags 40 issues per PR and developers judge 35 of them as wrong or irrelevant, they learn to ignore the tool entirely. The 5 real issues get ignored along with the noise.

```python
# Calibration: what makes a finding worth flagging?
calibration_criteria = """
Before flagging an issue, apply this test:

1. Is this OBJECTIVELY wrong? (not a style preference)
2. Would this cause a bug, security issue, or maintenance problem?
3. Would a senior developer agree this needs to change?
4. Is this specific enough that the developer knows exactly what to do?

If the answer to any of these is no: do NOT flag it.
"""
```

## Severity Calibration with Examples

```python
severity_guide = """
## SEVERITY CALIBRATION

Critical — Ship blockers. Merge must be rejected:
  Example: 
    raw_query = f"SELECT * FROM users WHERE email = '{email}'"  ← SQL injection
    api_key = "sk-prod-abc123"  ← Hardcoded credential

High — Should fix before merge. Usually no acceptable workaround:
  Example:
    async def process_payment(amount):
        result = await payment_api.charge(amount)
        # No try/catch — payment failure silently returns None
    
    def calculate_total(items):  # 87 lines
        ...  ← Exceeds 50-line limit

Medium — Tech debt. Track but don't block:
  Example:
    def get_customer(id):  ← Missing type hint on public function
        ...

Low — Note only. Don't interrupt workflow:
  Example:
    # Slightly unclear variable name — but context makes it readable

Do NOT flag style preferences, linting issues (we have automated linters),
or anything you're uncertain about.
"""
```

## Including Scope Boundaries

```python
# Tell Claude what this reviewer does NOT cover
scope_exclusions = """
This reviewer focuses on LOGIC and SECURITY only.

Do not flag:
- Import ordering — handled by isort in CI
- Formatting — handled by black/prettier in CI  
- Naming conventions — handled by naming linter
- Test coverage — handled by coverage tool
- Documentation completeness — handled separately

If you find a formatting issue that also represents a logic bug, flag the logic bug only.
"""
```

## Key Takeaways

1. **Specific + verifiable** beats vague + subjective — always
2. **False positives destroy trust** — calibrate to reduce noise
3. **Severity calibration with examples** — what makes Critical vs Medium?
4. **Scope boundaries** — explicitly say what NOT to flag
5. **Concrete thresholds** — "over 30 lines" not "long functions"

---
id: "d4-t1-2-false-positives"
title: "False Positives — Why Over-Flagging Kills Adoption"
domain: "d4"
taskRef: "T4.1"
order: 2
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A smoke detector that goes off every time you cook toast. You know it's sensitive. So when it goes off at 3am, you assume it's toast again — you don't evacuate. A detector that only alarms for real fires keeps everyone alert. Claude reviews that only flag real issues keep developers engaged."
examTrap: "Thinking that catching more issues is always better. The exam tests that false positives actively reduce the value of AI-assisted review by training developers to ignore outputs."
keyPoints:
  - "Signal-to-noise ratio determines adoption — not total issues found."
  - "One false positive per ten real issues is acceptable. Five false positives per real issue kills adoption."
  - "False positives are created by: vague criteria, missing scope exclusions, insufficient context about the codebase."
  - "Measuring false positive rate: track developer overrides — when developers dismiss findings, that's a false positive signal."
  - "Calibration requires iteration — review false positives, improve criteria, measure again."
antiPatterns:
  - "Optimizing for recall (catch everything) at the expense of precision (only flag real issues)"
  - "No mechanism to track which findings developers dismiss"
  - "Treating all false positives as acceptable — they compound and destroy trust"
  - "Not updating criteria when patterns of false positives emerge"
tbChallenge: "Your Claude code review has been running for 3 weeks. Developers are dismissing 70% of findings. What data would you collect, and how would you update your criteria to improve the signal-to-noise ratio?"
---

## The Adoption Curve

```
False positive rate → Developer behavior

0-10%   → Developers read all findings carefully
10-30%  → Developers skim, focus on Critical/High
30-60%  → Developers scan for their own judgment, mostly dismiss
60%+    → Developers ignore the tool entirely
```

## Measuring False Positives

```python
# Track dismissals as false positive signals
def record_finding_outcome(finding_id: str, outcome: str, reason: str):
    """
    outcome: 'fixed' | 'dismissed' | 'deferred'
    reason: why if dismissed
    """
    db.insert("finding_outcomes", {
        "finding_id": finding_id,
        "outcome": outcome,
        "reason": reason,
        "reviewer": get_current_user(),
        "timestamp": now()
    })

# Weekly analysis
def analyze_false_positives():
    findings = db.query("""
        SELECT rule_category, outcome, COUNT(*) as count
        FROM finding_outcomes
        WHERE timestamp > NOW() - INTERVAL '7 days'
        GROUP BY rule_category, outcome
    """)
    
    for category in findings:
        total = category.fixed + category.dismissed
        fp_rate = category.dismissed / total if total > 0 else 0
        if fp_rate > 0.3:
            flag_for_criteria_review(category.rule_category, fp_rate)
```

## Reducing False Positives by Category

```python
# Pattern: false positives on "missing error handling"
# Root cause: Claude flags error handling that exists in a parent try/catch
# Fix: add context about error handling patterns used in this codebase

additional_context = """
Note on error handling patterns:
- Our FastAPI middleware catches all unhandled exceptions and returns 500
- You do NOT need to flag missing try/catch in route handlers that delegate to services
- Only flag missing error handling where: (1) the function makes a network call directly,
  (2) there is no parent error boundary visible in this file
"""
```

## Key Takeaways

1. **Signal-to-noise ratio** is what matters — not total findings
2. **Track dismissals** as your false positive measurement
3. **>30% dismissal rate** for any category = criteria needs updating
4. **Iterate systematically** — identify the pattern, update criteria, measure again
5. **Context reduces false positives** — give Claude enough information to distinguish real issues from valid patterns

---
id: "d4-t1-3-severity-design"
title: "Severity Design — Calibrating Impact Levels for Actionable Output"
domain: "d4"
taskRef: "T4.1"
order: 3
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Hospital triage — not everything is a Code Blue. Triage assigns severity so the right resources go to the right problems. A well-designed severity system means developers know instantly what needs attention now vs what can wait."
examTrap: "Designing a severity system where everything ends up at High severity. If all findings are High, none of them are — developers can't prioritize and treat all findings the same."
keyPoints:
  - "Four levels is optimal: Critical (ship blocker), High (fix before merge), Medium (track as debt), Low (informational only)."
  - "Critical must have a clear decision rule: anything that meets criterion X is automatically Critical."
  - "Each severity needs examples of what IS and what is NOT at that level."
  - "Severity distribution target: 5% Critical, 20% High, 50% Medium, 25% Low — if skewed, recalibrate."
  - "The action for each severity must be clear: Critical = block merge, High = fix or get explicit override, Medium = create ticket, Low = optional."
antiPatterns:
  - "No clear criteria for what makes something Critical vs High — developers disagree and escalate everything"
  - "Severity inflation — too many Critical/High findings that aren't actually that serious"
  - "No action defined per severity — what does finding a High issue actually mean for the PR?"
  - "Severity based on confidence ('I'm 80% sure this is an issue') rather than impact"
tbChallenge: "Design a four-level severity system for a financial services API review. Include: definition of each level, one concrete example at each level, and the action required for each."
---

## A Well-Designed Severity System

```python
severity_system = """
## SEVERITY DEFINITIONS AND ACTIONS

### CRITICAL — Block merge immediately
Definition: Exploitable vulnerability or data corruption risk.
Action: PR is rejected. Must be fixed before review continues.
SLA: Must be addressed within 4 hours.

Examples:
  ✓ SQL injection: f"SELECT * FROM users WHERE id = {user_input}"
  ✓ Hardcoded credential: api_key = "sk-prod-live-key123"
  ✓ Missing authentication on payment endpoint
  ✗ Performance issue (that's High at most)
  ✗ Code style problem (that's not even Low)

### HIGH — Fix before merge (or explicit override)
Definition: Bug that will cause incorrect behavior in production, or security
            weakness that increases attack surface.
Action: Must be fixed OR engineer provides written justification for override.

Examples:
  ✓ Missing null check before dereferencing in a path that receives user input
  ✓ Race condition in concurrent payment processing
  ✓ Incorrect HTTP status code on authentication failure (401 vs 403)
  ✗ 60-line function that's well-structured (that's Medium)

### MEDIUM — Track as technical debt
Definition: Code quality issue that will cause maintenance problems over time.
Action: Create a ticket. Not required to fix before merge.

Examples:
  ✓ Function exceeding 50 lines without clear logical sections
  ✓ Missing type hints on public API functions
  ✓ Duplicate logic block > 10 lines
  ✗ Variable could be named more clearly (that's Low)

### LOW — Informational
Definition: Minor improvement opportunity. No significant impact.
Action: Note in PR comments. No action required.

Examples:
  ✓ Variable name could be slightly more descriptive
  ✓ Comment explains what code does rather than why
  ✗ Personal style preferences (not flagged at all)
"""
```

## Severity Distribution Check

```python
def check_severity_distribution(findings: list) -> dict:
    """
    Healthy distribution: ~5% Critical, ~20% High, ~50% Medium, ~25% Low
    If skewed: recalibrate criteria.
    """
    total = len(findings)
    if total == 0:
        return {}
    
    dist = {
        "critical": sum(1 for f in findings if f["severity"] == "CRITICAL") / total,
        "high":     sum(1 for f in findings if f["severity"] == "HIGH") / total,
        "medium":   sum(1 for f in findings if f["severity"] == "MEDIUM") / total,
        "low":      sum(1 for f in findings if f["severity"] == "LOW") / total,
    }
    
    warnings = []
    if dist["critical"] > 0.15:
        warnings.append("Too many Critical — criteria may be too broad")
    if dist["high"] + dist["critical"] > 0.5:
        warnings.append("High/Critical ratio too high — severity inflation detected")
    if dist["low"] < 0.1:
        warnings.append("No Low findings — criteria may not be fine-grained enough")
    
    return {"distribution": dist, "warnings": warnings}
```

## Key Takeaways

1. **Four levels** — Critical, High, Medium, Low with clear definitions
2. **Each severity has a clear action** — what does the developer do with this?
3. **Concrete examples** at each level AND what does NOT qualify
4. **Monitor distribution** — skewed severity means recalibration needed
5. **Severity = impact**, not confidence — don't let uncertainty inflate severity
