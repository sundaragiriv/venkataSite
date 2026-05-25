---
id: "d5-t3-2-calibration"
title: "Confidence Calibration — Measuring and Correcting Self-Reported Certainty"
domain: "d5"
taskRef: "T5.3"
order: 8
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A weather forecast service that says '80% chance of rain' every time it's uncertain. If it only rains 50% of those times, the forecast is miscalibrated — 80% confidence should mean 80% accuracy. Calibrating Claude's confidence means measuring whether 'high confidence' actually corresponds to high accuracy."
examTrap: "Trusting self-reported confidence without calibration. Claude may consistently over-estimate or under-estimate its certainty on specific task types. Calibration reveals and corrects these systematic biases."
keyPoints:
  - "Calibration: measure actual accuracy per confidence tier using human-verified ground truth."
  - "Overconfidence: Claude reports 'high' but accuracy is only 75% — adjust routing to treat 'high' as 'medium'."
  - "Underconfidence: Claude reports 'low' but accuracy is 90% — adjust routing to treat 'low' as 'medium'."
  - "Task-specific calibration: calibration varies by document type, language, and domain — calibrate per task type."
  - "Stratified sampling: sample proportionally from each confidence tier to measure calibration."
antiPatterns:
  - "One-time calibration — recalibrate periodically as model updates and task distributions shift"
  - "Calibrating on too small a sample — need 50+ examples per tier for reliable measurement"
  - "Calibrating on easy documents only — test against the full distribution"
  - "Never adjusting routing thresholds based on calibration results"
tbChallenge: "Your calibration study shows: high confidence = 72% accurate, medium = 65% accurate, low = 45% accurate. What does this tell you, and how do you adjust your routing thresholds?"
---

## Calibration Study Design

```python
class ConfidenceCalibrationStudy:
    """
    Measures whether Claude's confidence tiers match actual accuracy.
    
    Protocol:
    1. Run extraction on 300 documents
    2. Sample 50 from each confidence tier
    3. Human verifies accuracy of each sample
    4. Calculate actual accuracy per tier
    5. Adjust routing thresholds based on findings
    """
    
    def __init__(self, min_sample_per_tier: int = 50):
        self.min_sample = min_sample_per_tier
        self.results = {"high": [], "medium": [], "low": []}
    
    def add_result(self, confidence_tier: str, human_verified_correct: bool):
        self.results[confidence_tier].append(human_verified_correct)
    
    def analyze(self) -> dict:
        analysis = {}
        
        for tier, verdicts in self.results.items():
            if len(verdicts) < self.min_sample:
                analysis[tier] = {"status": "insufficient_sample", "n": len(verdicts)}
                continue
            
            accuracy = sum(verdicts) / len(verdicts)
            
            # Expected accuracy ranges per tier
            expected = {
                "high":   (0.90, 1.00),
                "medium": (0.70, 0.90),
                "low":    (0.00, 0.70),
            }
            expected_min, expected_max = expected[tier]
            
            analysis[tier] = {
                "n":             len(verdicts),
                "accuracy":      accuracy,
                "expected_range": f"{expected_min:.0%}–{expected_max:.0%}",
                "calibrated":    expected_min <= accuracy <= expected_max,
                "bias":          (
                    "overconfident" if accuracy < expected_min else
                    "underconfident" if accuracy > expected_max else
                    "well_calibrated"
                ),
                "recommended_routing": self._recommend_routing(tier, accuracy)
            }
        
        return analysis
    
    def _recommend_routing(self, tier: str, accuracy: float) -> str:
        if tier == "high" and accuracy < 0.80:
            return "treat_as_medium"
        if tier == "high" and accuracy < 0.70:
            return "treat_as_low"
        if tier == "low" and accuracy > 0.85:
            return "treat_as_medium"
        return "keep_as_is"
```

## Interpreting the Teach-Back Results

```python
# Study results: high=72%, medium=65%, low=45%

# Analysis:
# high (72%): OVERCONFIDENT — expected >90%, got 72%
#   → Treat "high" as "medium" in routing
#   → All "high confidence" outputs need spot-check
#
# medium (65%): OVERCONFIDENT — expected 70-90%, got 65%
#   → Treat "medium" as "low" in routing
#   → All "medium confidence" outputs need human review
#
# low (45%): WELL CALIBRATED — expected <70%, got 45%
#   → Routing correct — human review is appropriate

# Adjusted routing thresholds:
ADJUSTED_ROUTING = {
    "high":   "spot_check",    # was "auto_process"
    "medium": "human_review",  # was "spot_check"
    "low":    "human_review",  # unchanged
}

# Root cause investigation:
# If ALL tiers are overconfident, Claude may not be given enough context
# to accurately assess its uncertainty — improve confidence prompt
```

## Key Takeaways

1. **Calibrate with human-verified ground truth** — 50+ samples per tier
2. **Overconfident**: accuracy below expected range → treat tier as lower
3. **Underconfident**: accuracy above expected range → treat tier as higher
4. **Recalibrate quarterly** — model updates and task distributions shift
5. **Task-specific calibration** — different document types have different profiles
