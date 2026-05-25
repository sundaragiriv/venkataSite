---
id: "d4-t2-2-example-targeting"
title: "Example Targeting — Choosing Examples for Maximum Impact"
domain: "d4"
taskRef: "T4.2"
order: 5
xp: 25
tag: "Core"
duration: "7 min"
analogy: "A driving instructor choosing practice scenarios. They don't spend hours on straight empty roads — that's easy. They practice merging in heavy traffic, reversing into tight spots, driving in fog. Hard cases where skill and judgment make the difference."
examTrap: "Choosing representative (typical) examples rather than challenging (hard) ones. Typical examples add zero value — Claude handles them correctly without guidance. Hard examples are where few-shot actually improves performance."
keyPoints:
  - "The right example: a case Claude would get WRONG without it, where the example teaches the correct judgment."
  - "Common failure modes to target: boundary conditions, ambiguous categories, look-alike distinctions."
  - "Each example teaches ONE judgment call — multi-lesson examples confuse."
  - "Verify example impact: remove it and measure accuracy drop. If no drop, don't include it."
  - "Refresh examples as new failure patterns emerge — stale examples lose relevance."
antiPatterns:
  - "Examples that are obvious — Claude gets these right without any examples"
  - "Multi-lesson examples — teaching two things blurs what lesson Claude draws"
  - "Not verifying example impact — assumed benefit, not measured"
  - "Never updating examples — failure patterns change as prompts and models evolve"
tbChallenge: "Your clause extractor confuses indemnification with liability limitation clauses 40% of the time. Write the single most targeted example that fixes this specific confusion. Show the example and explain exactly what judgment call it teaches."
---

## The Failure-First Approach

```python
# WRONG: start with examples you think are useful
# RIGHT: start with where the model fails

# Step 1: Run zero-shot on 100 documents
# Step 2: Manually review outputs, categorize failures

failure_analysis = {
    "indemnification_vs_liability": 23,   # 23 cases — highest priority
    "governing_law_flagged":         18,   # incorrectly flagging as important
    "multi_clause_paragraph":        14,   # extracts only first clause
    "one_party_indemnification":     11,   # misses asymmetric clauses
}

# Step 3: Design ONE example per failure type, prioritized by frequency
```

## Targeting the Indemnification vs Liability Confusion

```python
targeted_example = """
EXAMPLE (critical distinction — indemnification, NOT liability limitation):

Contract text:
"Client shall defend, indemnify, and hold harmless Provider from any third-party
claims, damages, or losses arising out of Client's use of the services, Client's
breach of this agreement, or Client's violation of applicable law."

Output:
{
  "clause_type": "indemnification",
  "direction": "client_indemnifies_provider",
  "scope": "third_party_claims, breach, law_violations",
  "risk_level": "high"
}

Why this is indemnification, NOT liability_limitation:
- Indemnification: Party A must defend/compensate Party B against third-party claims
- Liability limitation: Caps or excludes what either party owes the OTHER party
- Key phrase: "defend, indemnify, and hold harmless" = indemnification
- Key phrase: "shall not be liable for" = liability limitation
"""
```

## The One-Lesson Rule

```python
# ❌ Multi-lesson example — unclear what to learn
bad_example = """
Contract: "Client indemnifies Provider AND total liability is capped at contract value."
Output: [indemnification, liability_limitation]  # two different things at once
# What does Claude learn? The indemnification? The cap? How to handle combined clauses?
"""

# ✅ Single-lesson example — one clear takeaway
good_example_1 = """
Contract: "Client shall indemnify Provider from third-party claims."
Output: {type: "indemnification"}
Lesson: "indemnify" = indemnification, even without "hold harmless"
"""

good_example_2 = """
Contract: "Total liability is capped at the fees paid in the preceding 12 months."
Output: {type: "liability_limitation"}
Lesson: "capped at" = liability limitation
"""
```

## Measuring Example Impact

```python
def measure_impact(task: str, example_to_test: str, test_cases: list) -> dict:
    # Baseline: without the example
    baseline_correct = sum(
        run_zero_shot(task, tc) == tc["expected"] for tc in test_cases
    )

    # With example
    with_example_correct = sum(
        run_few_shot(task, [example_to_test], tc) == tc["expected"]
        for tc in test_cases
    )

    improvement = (with_example_correct - baseline_correct) / len(test_cases)
    return {
        "include": improvement >= 0.05,  # At least 5% improvement
        "improvement": f"{improvement:.0%}",
        "baseline": f"{baseline_correct/len(test_cases):.0%}",
        "with_example": f"{with_example_correct/len(test_cases):.0%}"
    }
```

## Key Takeaways

1. **Start with failures** — analyze where zero-shot goes wrong first
2. **Target hard cases** — examples for easy cases add no value
3. **One lesson per example** — clarity over density
4. **Measure impact** — only include examples that demonstrably improve accuracy
5. **Refresh regularly** — failure patterns change over time
