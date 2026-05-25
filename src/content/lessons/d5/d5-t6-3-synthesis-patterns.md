---
id: "d5-t6-3-synthesis-patterns"
title: "Synthesis Patterns — Combining Sources Without Losing Reliability"
domain: "d5"
taskRef: "T5.6"
order: 18
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Writing a Wikipedia article. You don't just copy one source — you synthesize information from multiple reliable sources, cite each one, note where they agree, surface where they conflict, and maintain neutrality. The article's reliability comes from the citations, not from the author's authority."
examTrap: "Synthesis = combining source content into a coherent narrative without maintaining attribution. Wrong. Synthesis must maintain claim-source mapping, surface conflicts, and clearly separate what's well-supported from what's uncertain."
keyPoints:
  - "Weighted synthesis: claims supported by multiple high-quality sources get high confidence; single-source claims get medium or low."
  - "Agreement mapping: identify which claims sources agree on (foundation of synthesis) and which they conflict on (require conflict presentation)."
  - "Data gaps: synthesis must explicitly note topics where no source had information."
  - "Confidence degradation: each synthesis step (source → summary → combination) should degrade confidence appropriately."
  - "Synthesis output structure: executive summary (high confidence claims only), supporting evidence, conflicts section, data gaps."
antiPatterns:
  - "Synthesis that invents connections between sources not present in any source"
  - "Executive summary that includes uncertain or conflicting claims without flagging them"
  - "No data gaps section — reader thinks the synthesis is comprehensive"
  - "Confidence inflation through synthesis — three low-quality sources don't become one high-quality source"
tbChallenge: "Design the output structure for a synthesis report that will be used for business decision-making. What sections does it have, what confidence level is required for each section, and how are conflicts and gaps handled?"
---

## Weighted Synthesis Pattern

```python
async def weighted_synthesis(
    sources: list[dict],
    topic: str
) -> SynthesisResult:
    """
    Synthesize from multiple sources with maintained attribution and confidence weighting.
    """
    
    synthesis_prompt = f"""
You are synthesizing research on: {topic}

SOURCES (numbered for citation):
{format_numbered_sources(sources)}

CREATE A STRUCTURED SYNTHESIS following these rules:

SECTION 1 — HIGH CONFIDENCE FINDINGS
Include ONLY claims supported by 2+ independent sources OR 1 peer-reviewed source.
Format: Claim [SOURCE_X, SOURCE_Y]. Include dates for all statistics.

SECTION 2 — SINGLE-SOURCE FINDINGS  
Claims from only one source — less certain, may not generalize.
Format: Claim [SOURCE_X]. Note: single-source finding.

SECTION 3 — CONFLICTING DATA
Topics where sources disagree on the same question.
Format: SOURCE_X reports [value]. SOURCE_Y reports [different value]. 
Possible explanation: [why they differ].

SECTION 4 — DATA GAPS
Topics relevant to {topic} where no source had information.
Explicitly note: "No source addressed [topic]."

SECTION 5 — SOURCE QUALITY SUMMARY
For each source: name, date, type, limitations.

Do NOT:
- Combine conflicting data by averaging without noting it
- Present single-source claims as established facts
- Omit any conflicts between sources
- Fill data gaps with speculation
"""
    
    return await call_claude(synthesis_prompt)
```

## Business Decision-Ready Output Structure

```python
SYNTHESIS_REPORT_STRUCTURE = {
    "executive_summary": {
        "content": "High-confidence findings only (multi-source or peer-reviewed)",
        "required_confidence": "high",
        "attribution": "inline [SOURCE_X]",
        "max_length": "5 bullet points"
    },
    "key_findings": {
        "content": "All findings, labeled by confidence",
        "required_confidence": "any — but labeled",
        "attribution": "inline with date",
        "format": "finding + confidence + sources + date"
    },
    "conflicts_and_uncertainties": {
        "content": "Where sources disagree or data quality is low",
        "format": "conflict description + both values + possible explanation",
        "action_note": "Decision-maker should investigate before relying on this data"
    },
    "data_gaps": {
        "content": "Topics relevant to the question not covered by any source",
        "importance": "Critical — prevents false confidence in report completeness"
    },
    "source_quality": {
        "content": "Each source rated by type, date, methodology",
        "format": "table: source name | type | date | quality rating | limitations"
    }
}
```

## Confidence Degradation Through Synthesis

```python
# Source quality → claim confidence → synthesis confidence

def synthesis_confidence(
    claim: str,
    supporting_sources: list[dict]
) -> str:
    source_qualities = [
        SOURCE_QUALITY_WEIGHTS.get(s["type"], 0.5)
        for s in supporting_sources
    ]
    
    # Multiple independent sources add confidence
    if len(supporting_sources) >= 3:
        base_confidence = max(source_qualities) + 0.1
    elif len(supporting_sources) == 2:
        base_confidence = max(source_qualities)
    else:
        base_confidence = max(source_qualities) - 0.1
    
    # Cap at appropriate levels
    if base_confidence >= 0.85:
        return "high"
    elif base_confidence >= 0.60:
        return "medium"
    return "low"

# Note: 3 low-quality sources ≠ 1 high-quality source
# base_confidence = 0.3 + 0.1 = 0.4 → still "low"
# Synthesis doesn't inflate source quality
```

## Key Takeaways

1. **Multi-source support = high confidence** — single source stays medium at best
2. **Executive summary = high confidence only** — conflicts and uncertainties go to their own section
3. **Data gaps are explicit** — don't let reader assume completeness
4. **Three low-quality sources ≠ high confidence** — synthesis doesn't inflate quality
5. **Source quality table** — decision-maker knows what they're relying on
