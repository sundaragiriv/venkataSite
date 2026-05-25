---
id: "d5-t6-2-conflict-detection"
title: "Conflict Detection — Finding and Handling Source Disagreements"
domain: "d5"
taskRef: "T5.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A fact-checker at a publishing house. Before a book goes to print, they verify every statistic against the original source — and flag any cases where two cited sources disagree. They don't choose between the disagreeing sources — they escalate to the author to reconcile."
examTrap: "Conflict resolution = choosing one source over another. Wrong. Conflict detection = surfacing that sources disagree. Resolution is either presenting both with context, or escalating to a human who can investigate the discrepancy."
keyPoints:
  - "Detect conflicts by comparing claims across sources on the same topic."
  - "Conflicts to surface: numerical disagreements, temporal contradictions, factual opposites."
  - "Present conflicts don't resolve them autonomously — offer explanation for why they might differ."
  - "Temporal conflicts are common: a 2020 statistic and a 2024 statistic may both be correct for their time."
  - "Severity of conflict: minor wording differences are noise; significant numerical differences are conflicts."
antiPatterns:
  - "Silently choosing the source that confirms a hypothesis"
  - "Averaging conflicting numbers without noting that they were averaged"
  - "Treating temporal differences as data conflicts — old data and new data are both valid for their period"
  - "Not surfacing conflicts in the final output — synthesizing a false consensus"
tbChallenge: "Source A says AI adoption is 34%. Source B says 67%. Source C says 51%. These are all from 2024. Is this a conflict? What does your synthesis do with it?"
---

## Conflict Detection Algorithm

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class DataConflict:
    topic:          str
    sources:        list[dict]
    conflict_type:  str  # "numerical" | "factual" | "temporal" | "definitional"
    severity:       str  # "minor" | "moderate" | "significant"
    possible_explanation: str

class ConflictDetector:
    
    NUMERICAL_THRESHOLD = 0.20  # >20% difference = significant conflict
    
    def detect_numerical_conflict(
        self, topic: str, claims: list[dict]
    ) -> Optional[DataConflict]:
        """Detect when sources report significantly different numbers for same topic."""
        values = [c["value"] for c in claims if isinstance(c.get("value"), (int, float))]
        
        if len(values) < 2:
            return None
        
        min_val, max_val = min(values), max(values)
        relative_diff = (max_val - min_val) / min_val if min_val > 0 else 1.0
        
        if relative_diff < 0.05:
            return None  # < 5% difference = not a conflict, just measurement variation
        
        severity = (
            "significant" if relative_diff > 0.30 else
            "moderate"    if relative_diff > 0.15 else
            "minor"
        )
        
        # Generate possible explanations
        dates = [c.get("date") for c in claims if c.get("date")]
        explanation = self._explain_numerical_conflict(claims, relative_diff, dates)
        
        return DataConflict(
            topic=topic,
            sources=claims,
            conflict_type="numerical",
            severity=severity,
            possible_explanation=explanation
        )
    
    def _explain_numerical_conflict(
        self, claims: list, relative_diff: float, dates: list
    ) -> str:
        if dates and max(dates) != min(dates):
            return f"Sources span different time periods ({min(dates)} to {max(dates)}) — data may reflect genuine change over time"
        
        methodologies = set(c.get("methodology") for c in claims if c.get("methodology"))
        if len(methodologies) > 1:
            return f"Sources use different methodologies: {' vs '.join(methodologies)}"
        
        populations = set(c.get("population") for c in claims if c.get("population"))
        if len(populations) > 1:
            return f"Sources sample different populations: {' and '.join(populations)}"
        
        return "Discrepancy likely due to different definitions, sampling methods, or time periods"
```

## Teach-Back Answer

```python
# Source A: 34%, Source B: 67%, Source C: 51% — all 2024
# 
# Is this a conflict? YES — significant.
# (max - min) / min = (67 - 34) / 34 = 97% difference → significant
#
# What to do:
# 1. Present ALL THREE values with citations — don't choose
# 2. Calculate the range and note it's wide
# 3. Explain the most likely reason: different definitions of "AI adoption"
#    (production deployment vs pilot vs any AI use)
# 4. Recommend the reader check each source's methodology

synthesis_for_conflicting_adoption = """
Enterprise AI adoption rates vary significantly across 2024 surveys:

- 34% of enterprises have deployed AI in production
  [Source A — defines "deployed" as production workloads handling real data]
  
- 51% have AI initiatives underway
  [Source C — includes pilots, POCs, and production deployments]
  
- 67% report using AI in some capacity
  [Source B — includes any AI tool use, including productivity tools]

The wide range (34%–67%) reflects definitional differences rather than 
measurement error. The appropriate figure depends on your definition of "AI adoption."
"""
```

## Key Takeaways

1. **Conflict = sources disagree meaningfully** (>20% numerical difference)
2. **Present all conflicting values** — never silently choose one
3. **Explain the likely cause** — methodology, definition, time period
4. **Temporal differences often aren't conflicts** — 2019 data and 2024 data are both valid
5. **Leave resolution to the reader** — provide context, not decisions
