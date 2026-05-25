---
id: "d5-t5-2-stratified-sampling"
title: "Stratified Sampling — Validating System Performance Without Reviewing Everything"
domain: "d5"
taskRef: "T5.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A food safety inspector who doesn't test every item in a 10,000-item shipment. They take a statistically valid sample from each category — fresh, frozen, canned — and test that. If any category fails, the whole category is flagged. Stratified sampling gives confidence without reviewing everything."
examTrap: "Random sampling instead of stratified sampling. Random sampling will under-represent rare categories (like low-confidence extractions or unusual document types) and give false confidence. Stratified sampling ensures every category is represented."
keyPoints:
  - "Stratified sampling: sample proportionally from each stratum (confidence tier, document type, error category)."
  - "Sample size per stratum: minimum 30-50 examples for statistical significance."
  - "Strata for extraction systems: confidence tier, document type, amount range, vendor category."
  - "Review frequency: high-error strata need more frequent sampling than low-error strata."
  - "Sampling drives calibration: stratified sample results feed back to confidence routing thresholds."
antiPatterns:
  - "Simple random sample — rare categories under-represented"
  - "Sampling only successes — misses the failure distribution"
  - "Too small a sample — results not statistically significant"
  - "No stratification — can't identify which specific category has quality issues"
tbChallenge: "Your extraction system processes 5,000 invoices per day. You can afford 50 human reviews per day. Design the stratified sampling strategy: which strata, how many from each, and how results are used."
---

## Designing the Strata

```python
class StratifiedSampler:
    """
    Samples proportionally from each stratum to validate system quality.
    Ensures every category has representation — not just the common cases.
    """
    
    def __init__(self, daily_review_budget: int = 50):
        self.budget = daily_review_budget
        
        # Define strata and their review budget allocation
        self.strata_config = {
            # Confidence-based strata
            "confidence_high":   {"budget_pct": 0.10, "review_reason": "calibration check"},
            "confidence_medium": {"budget_pct": 0.20, "review_reason": "spot verification"},
            "confidence_low":    {"budget_pct": 0.40, "review_reason": "accuracy audit"},
            
            # Document-type strata
            "international_docs": {"budget_pct": 0.15, "review_reason": "currency/format issues"},
            "handwritten":        {"budget_pct": 0.10, "review_reason": "OCR accuracy"},
            
            # Amount-range strata  
            "high_value_gt1000":  {"budget_pct": 0.05, "review_reason": "financial risk"},
        }
    
    def daily_sample(self, processed_items: list) -> dict:
        """Select stratified sample from today's processed items."""
        stratified = {}
        
        for stratum_name, config in self.strata_config.items():
            stratum_items = self._filter_stratum(processed_items, stratum_name)
            
            n_to_sample = max(
                5,  # Minimum per stratum
                int(self.budget * config["budget_pct"])
            )
            
            if stratum_items:
                sample = random.sample(
                    stratum_items,
                    min(n_to_sample, len(stratum_items))
                )
                stratified[stratum_name] = {
                    "items":         sample,
                    "stratum_size":  len(stratum_items),
                    "sample_size":   len(sample),
                    "review_reason": config["review_reason"]
                }
        
        return stratified
    
    def _filter_stratum(self, items: list, stratum: str) -> list:
        filters = {
            "confidence_high":   lambda i: i["confidence"]["overall"] == "high",
            "confidence_medium": lambda i: i["confidence"]["overall"] == "medium",
            "confidence_low":    lambda i: i["confidence"]["overall"] == "low",
            "international_docs":lambda i: i.get("currency") not in ("USD", None),
            "handwritten":       lambda i: i.get("document_type") == "handwritten",
            "high_value_gt1000": lambda i: i.get("total_amount", 0) > 1000,
        }
        return [i for i in items if filters.get(stratum, lambda _: False)(i)]
```

## Using Sample Results

```python
def process_sample_review_outcomes(sample_outcomes: list[dict]) -> dict:
    """Convert reviewer verdicts into calibration improvements."""
    
    by_stratum = {}
    for outcome in sample_outcomes:
        stratum = outcome["stratum"]
        correct = outcome["human_verified_correct"]
        
        if stratum not in by_stratum:
            by_stratum[stratum] = []
        by_stratum[stratum].append(correct)
    
    recommendations = {}
    for stratum, results in by_stratum.items():
        accuracy = sum(results) / len(results)
        
        if "confidence_high" in stratum and accuracy < 0.90:
            recommendations["confidence_routing"] = "treat_high_as_medium"
        
        if "confidence_low" in stratum and accuracy > 0.80:
            recommendations["confidence_routing"] = "some_low_can_be_spot_check"
        
        if "international_docs" in stratum and accuracy < 0.70:
            recommendations["international_handling"] = "add_currency_normalization"
    
    return recommendations
```

## Key Takeaways

1. **Stratified not random** — ensure every category is represented
2. **Minimum 30-50 per stratum** for statistical significance
3. **Allocate review budget by risk** — low-confidence gets more sampling
4. **Feed results to calibration** — sample outcomes improve routing thresholds
5. **Track over time** — trends in accuracy identify emerging issues
