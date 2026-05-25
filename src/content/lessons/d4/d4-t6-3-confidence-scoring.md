---
id: "d4-t6-3-confidence-scoring"
title: "Confidence Scoring — Routing Based on Model Certainty"
domain: "d4"
taskRef: "T4.6"
order: 18
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A doctor's referral system. Confident diagnosis → prescribe and discharge. Uncertain → specialist referral. Alarmed → emergency. Routing based on confidence ensures the right resource handles the right case — not every case going to the most expensive resource."
examTrap: "Treating confidence as binary accept/reject. The exam tests that confidence scoring enables tiered ROUTING — different confidence levels trigger different workflows, not just pass/fail."
keyPoints:
  - "Three routing tiers: high confidence → auto-process, medium → spot-check, low → human review."
  - "Field-level confidence: individual fields in one extraction can route differently."
  - "Critical fields (total_amount, invoice_number) always escalate when low confidence — regardless of overall score."
  - "Calibration: measure whether self-reported confidence correlates with actual accuracy via stratified sampling."
  - "Recalibrate when miscalibrated — 'high' at 72% accuracy should be treated as 'medium'."
antiPatterns:
  - "Binary confidence — confident or not loses routing granularity"
  - "No routing logic — collecting confidence scores but never acting on them"
  - "Uncalibrated — assuming self-reports are accurate without measuring"
  - "Same review priority for all low-confidence — critical fields need faster escalation"
tbChallenge: "Extraction: vendor_name (high), invoice_date (high), total_amount (low). What does routing do? How is this different from all-fields-low? Why does field-level confidence matter here?"
---

## Field-Level Confidence Schema

```python
# Claude reports confidence per field alongside the extraction
{
    "vendor_name":  "Acme Corp",
    "invoice_date": "2024-01-15",
    "total_amount": 4999.00,
    "confidence": {
        "overall": "medium",
        "low_confidence_fields": [
            {
                "field":  "total_amount",
                "reason": "Multiple amount figures on page — unclear which is final total"
            }
        ]
    }
}
```

## Routing Logic

```python
CRITICAL_FIELDS = {"total_amount", "invoice_number", "vendor_name", "due_date"}

def route(extraction: dict) -> dict:
    conf        = extraction.get("confidence", {})
    overall     = conf.get("overall", "low")
    low_fields  = conf.get("low_confidence_fields", [])
    low_critical = [f for f in low_fields if f["field"] in CRITICAL_FIELDS]

    # All high, no uncertain fields
    if overall == "high" and not low_fields:
        return {"route": "auto_process"}

    # Critical field is uncertain → high-priority human review
    if low_critical:
        return {
            "route":        "human_review",
            "priority":     "high",
            "focus_fields": [f["field"] for f in low_critical],
            "reason":       "Critical field has low confidence"
        }

    # Overall low or too many uncertain fields
    if overall == "low" or len(low_fields) > 2:
        return {"route": "human_review", "priority": "standard"}

    # Medium overall, few non-critical uncertain fields
    return {
        "route":        "spot_check",
        "check_fields": [f["field"] for f in low_fields]
    }

# Teach-back answer:
# vendor_name (high) + invoice_date (high) + total_amount (low + critical)
# → human_review, priority=HIGH, focus=["total_amount"]
# All-fields-low → human_review, priority=standard (no critical flag)
# Field-level matters: total_amount low triggers high priority even if overall is medium
```

## Calibration

```python
def calibrate(sample: list[dict]) -> dict:
    """Measure whether self-reported confidence matches actual accuracy."""
    tiers = {"high": [], "medium": [], "low": []}
    for r in sample:
        tier = r["confidence"]["overall"]
        tiers[tier].append(r["human_verified_correct"])

    result = {}
    for tier, vals in tiers.items():
        if vals:
            acc = sum(vals) / len(vals)
            result[tier] = {
                "n":               len(vals),
                "accuracy":        f"{acc:.0%}",
                "well_calibrated": (acc > 0.90 if tier == "high"
                                    else 0.70 < acc <= 0.90 if tier == "medium"
                                    else acc <= 0.70)
            }

    return result

# If "high" confidence is only 72% accurate:
# → Claude's "high" is actually "medium"
# → Treat "high" responses as "medium" until prompt recalibration
```

## Key Takeaways

1. **Confidence enables tiered routing** — three tiers, three different actions
2. **Field-level confidence** — individual fields route independently
3. **Critical fields always escalate** when uncertain — regardless of overall
4. **Calibrate with stratified sampling** — measure actual accuracy per tier
5. **Recalibrate thresholds** when self-reports don't match reality
