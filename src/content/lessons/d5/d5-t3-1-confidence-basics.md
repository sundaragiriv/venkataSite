---
id: "d5-t3-1-confidence-basics"
title: "Confidence Scoring — Routing Decisions Based on Model Certainty"
domain: "d5"
taskRef: "T5.3"
order: 7
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A radiologist's reporting system. 'Definitive finding — act immediately.' 'Probable finding — recommend follow-up.' 'Possible finding — note for awareness.' Each tier triggers a different workflow. Claude's confidence scoring does the same — routing outputs to the right downstream process based on certainty."
examTrap: "Treating confidence scoring as a binary pass/fail gate. The exam tests that confidence enables TIERED ROUTING — different confidence levels trigger different workflows, not just accept/reject."
keyPoints:
  - "Three tiers: high confidence → auto-process, medium → spot-check sample, low → human review."
  - "Field-level confidence: individual fields in one extraction can have different confidence levels."
  - "Claude self-reports confidence in structured output — route based on reported certainty."
  - "Calibration: self-reported confidence must be measured against actual accuracy to be trusted."
  - "Stratified sampling for calibration: sample from each tier and measure actual accuracy."
antiPatterns:
  - "Binary confidence — confident or not confident loses routing granularity"
  - "No routing logic — collecting confidence but never using it"
  - "Assuming self-reported confidence is accurate without calibration"
  - "Same review priority for all low-confidence — critical field uncertainty needs faster escalation"
tbChallenge: "Your extraction system reports field-level confidence. An invoice shows: vendor_name (high), invoice_date (high), total_amount (low). Walk through the routing logic step by step. How is this different from all-fields-low?"
---

## Confidence Schema in Structured Output

```python
extraction_with_confidence = {
    "type": "object",
    "properties": {
        "vendor_name":  {"type": "string"},
        "invoice_date": {"type": "string"},
        "total_amount": {"type": "number"},
        
        "confidence": {
            "type": "object",
            "properties": {
                "overall": {
                    "type": "string",
                    "enum": ["high", "medium", "low"]
                },
                "uncertain_fields": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "field":  {"type": "string"},
                            "reason": {"type": "string"}
                        }
                    },
                    "description": "Fields where Claude is uncertain. Empty if all high confidence."
                }
            }
        }
    }
}

# Example output with field-level confidence:
{
    "vendor_name":  "Acme Corp",
    "invoice_date": "2024-01-15",
    "total_amount": 4999.00,
    "confidence": {
        "overall": "medium",
        "uncertain_fields": [
            {
                "field":  "total_amount",
                "reason": "Three different totals on page — subtotal $4,250, tax $749, total unclear"
            }
        ]
    }
}
```

## Three-Tier Routing

```python
CRITICAL_FIELDS = {"total_amount", "invoice_number", "vendor_name", "due_date"}

def route_by_confidence(extraction: dict) -> dict:
    conf         = extraction.get("confidence", {})
    overall      = conf.get("overall", "low")
    uncertain    = conf.get("uncertain_fields", [])
    crit_uncert  = [f for f in uncertain if f["field"] in CRITICAL_FIELDS]
    
    if overall == "high" and not uncertain:
        return {
            "route":  "auto_process",
            "action": "Process immediately, no review needed"
        }
    
    if crit_uncert:
        return {
            "route":    "human_review",
            "priority": "high",
            "focus":    [f["field"] for f in crit_uncert],
            "reason":   "Critical financial field has low confidence"
        }
    
    if overall == "low" or len(uncertain) > 2:
        return {
            "route":  "human_review",
            "priority": "standard",
            "action": "Full human verification"
        }
    
    return {
        "route":        "spot_check",
        "check_fields": [f["field"] for f in uncertain],
        "action":       "Verify specific uncertain fields only"
    }
```

## Calibration Via Stratified Sampling

```python
def calibrate_confidence(sample_results: list[dict]) -> dict:
    """Measure whether self-reported confidence matches actual accuracy."""
    tiers = {"high": [], "medium": [], "low": []}
    
    for result in sample_results:
        tier = result["extraction"]["confidence"]["overall"]
        tiers[tier].append(result["human_verified_correct"])
    
    calibration = {}
    for tier, values in tiers.items():
        if values:
            accuracy = sum(values) / len(values)
            calibration[tier] = {
                "sample_size": len(values),
                "actual_accuracy": f"{accuracy:.0%}",
                "well_calibrated": (
                    accuracy > 0.90 if tier == "high" else
                    0.70 < accuracy <= 0.90 if tier == "medium" else
                    accuracy <= 0.70
                ),
                "adjustment": "treat as medium" if tier == "high" and accuracy < 0.80 else None
            }
    
    return calibration
```

## Key Takeaways

1. **Three tiers**: auto-process, spot-check, human review — not binary
2. **Field-level confidence** — individual fields route independently
3. **Critical fields escalate** when uncertain, regardless of overall score
4. **Calibrate regularly** — self-reported confidence must be measured
5. **Adjust routing thresholds** when miscalibration is detected
