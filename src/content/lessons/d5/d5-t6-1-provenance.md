---
id: "d5-t6-1-provenance"
title: "Source Attribution — Tracking Claims to Their Sources"
domain: "d5"
taskRef: "T5.6"
order: 16
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Academic citations in a research paper. Not just 'studies show X' — but 'Smith et al. (2023) in the Journal of Y found X with a sample size of N.' The citation lets any reader verify the claim independently. Source attribution in AI systems does the same."
examTrap: "Treating source attribution as a nice-to-have for user experience. It's a reliability requirement: when Claude synthesizes from multiple sources, claims must be traceable back to specific source documents — especially when sources conflict."
keyPoints:
  - "Every factual claim in synthesized output must be traceable to a specific source document."
  - "Claim-source mapping survives synthesis: attribution must be maintained through summarization and combination steps."
  - "Conflicting sources: when two sources disagree, both must be cited and the conflict noted — not one arbitrarily chosen."
  - "Temporal data requires publication date: 'adoption rate is 45%' is meaningless without 'per Gartner 2023 survey'."
  - "Source quality affects claim confidence: peer-reviewed > industry report > blog post."
antiPatterns:
  - "Synthesizing without maintaining source mapping — claims become untraceable"
  - "Choosing one conflicting source over another without noting the conflict"
  - "Citing 'research shows' without specific source attribution"
  - "Treating all sources as equal quality regardless of type"
tbChallenge: "You synthesize a report from 5 sources. Source 2 says AI adoption is 34%. Source 4 says AI adoption is 67%. How does your synthesis handle this conflict, and what does the attribution look like in the final report?"
---

## Claim-Source Mapping in Synthesis

```python
@dataclass
class SourcedClaim:
    """A factual claim with its attribution maintained through synthesis."""
    claim:          str
    source_id:      str
    source_name:    str
    source_type:    str    # "peer_reviewed" | "industry_report" | "news" | "blog"
    publication_date: str
    confidence:     str    # based on source quality + claim type
    conflicting_sources: list['SourcedClaim'] = None  # if conflict exists

@dataclass
class SynthesisResult:
    summary:     str
    claims:      list[SourcedClaim]
    conflicts:   list[dict]
    
    def format_with_citations(self) -> str:
        """Format the synthesis with inline citations."""
        result = self.summary + "\n\n"
        
        if self.conflicts:
            result += "## Conflicting Data Points\n"
            for conflict in self.conflicts:
                result += (
                    f"- **{conflict['topic']}**: "
                    f"{conflict['source_a']['name']} reports {conflict['source_a']['value']}, "
                    f"while {conflict['source_b']['name']} reports {conflict['source_b']['value']}. "
                    f"Discrepancy may reflect {conflict['possible_explanation']}.\n"
                )
        
        result += "\n## Sources\n"
        for i, source in enumerate(self.get_unique_sources()):
            result += f"[{i+1}] {source['name']} ({source['date']}). {source['type']}.\n"
        
        return result
```

## Handling Conflicting Sources

```python
async def synthesize_with_attribution(sources: list[dict]) -> SynthesisResult:
    """
    Synthesis prompt that maintains source attribution and surfaces conflicts.
    """
    
    synthesis_prompt = f"""
Synthesize a research report from these {len(sources)} sources.

SOURCES:
{format_sources_with_ids(sources)}

INSTRUCTIONS FOR ATTRIBUTION:
1. For every factual claim, include the source ID in brackets: [SOURCE_1]
2. If sources AGREE on a fact: cite all agreeing sources
3. If sources DISAGREE on a fact: present BOTH values and BOTH sources, note the conflict
4. NEVER choose between conflicting sources — present the conflict
5. Include publication date for all data points that could change over time
6. Rate source quality: peer_reviewed > industry_report > news_article > blog

OUTPUT FORMAT:
- Main synthesis with inline citations [SOURCE_X]
- Conflicts section: explicitly list each data point where sources disagree
- Data gaps: topics where no source had information
- Source quality notes: flag if claiming peer-reviewed status

EXAMPLE FORMAT:
Enterprise AI adoption rates vary significantly by survey methodology:
34% of enterprises have deployed AI in production [SOURCE_2, Gartner Q3 2023],
though other estimates reach 67% when including pilots and POCs [SOURCE_4, IDC 2024].
The discrepancy likely reflects different definitions of "deployed."
"""
    
    response = await call_claude(synthesis_prompt)
    return parse_synthesis_response(response, sources)
```

## Source Quality Weighting

```python
SOURCE_QUALITY_WEIGHTS = {
    "peer_reviewed":    1.0,   # Highest — peer review, methodology section
    "industry_report":  0.8,   # Good — named methodology, large sample
    "government_data":  0.9,   # Very good — official statistics
    "news_article":     0.5,   # Moderate — journalist interpretation
    "company_blog":     0.3,   # Lower — marketing bias possible
    "social_media":     0.1,   # Lowest — no editorial review
}

def calculate_claim_confidence(
    claim: SourcedClaim,
    source_type: str
) -> str:
    weight = SOURCE_QUALITY_WEIGHTS.get(source_type, 0.5)
    if weight >= 0.8:
        return "high"
    elif weight >= 0.5:
        return "medium"
    return "low"
```

## Key Takeaways

1. **Every claim needs attribution** — not "research shows" but "Smith et al. 2023 shows"
2. **Conflicts must be surfaced** — present both values and both sources
3. **Temporal data needs dates** — a 2019 statistic presented as current is misinformation
4. **Source quality affects confidence** — peer-reviewed ≠ blog post
5. **Attribution survives synthesis** — doesn't disappear when you combine sources
