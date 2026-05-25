---
id: "d4-t2-1-fewshot-basics"
title: "Few-Shot Example Design — Teaching Claude By Showing"
domain: "d4"
taskRef: "T4.2"
order: 4
xp: 35
tag: "⚡ Exam Tested"
duration: "9 min"
analogy: "Teaching a new employee by showing examples rather than writing a manual. 'Here's a customer email we handled well. Here's one we handled poorly and why. Now handle this one.' Examples communicate faster and more precisely than instructions for tasks involving judgment."
examTrap: "Using easy, obvious examples in few-shot prompts. The exam tests that few-shot examples should target HARD and AMBIGUOUS cases — the edge cases where judgment is needed — not the obvious cases that Claude would handle correctly without examples."
keyPoints:
  - "Few-shot examples should target hard/ambiguous cases — the places where judgment calls are needed."
  - "2-4 examples is the sweet spot — fewer lacks coverage, more risks overfitting to example patterns."
  - "Include examples of correct REJECTION — showing what should NOT match is as important as what should."
  - "Examples must cover different formats/structures — if all examples are similar, Claude won't generalize."
  - "Few-shot beats zero-shot for: extraction tasks, classification with edge cases, format-specific output."
antiPatterns:
  - "Using only obvious examples — Claude already handles those correctly without examples"
  - "Too many examples (10+) — Claude starts pattern-matching examples rather than reasoning"
  - "No rejection examples — Claude only sees positive cases and over-classifies"
  - "All examples from the same document type — fails to generalize to other structures"
tbChallenge: "You're building a contract clause extractor. Write 3 few-shot examples that would actually improve performance. Explain why you chose each example and what judgment call each one teaches."
---

## Why Examples Beat Instructions for Judgment Tasks

For tasks involving judgment — classifying sentiment, extracting from variable formats, determining severity — showing Claude what you want is faster and more precise than describing it.

```python
# ❌ Zero-shot — relies on Claude's general sense of "important"
prompt = """
Extract the important clauses from this contract.
Classify each as: liability_limitation, indemnification, termination, payment_terms, other
"""
# Result: variable, depends on Claude's judgment about "important"

# ✅ Few-shot — shows Claude your specific definition of important
prompt = """
Extract clauses and classify them. Here are examples:

EXAMPLE 1:
Contract text: "Neither party shall be liable for indirect, incidental, or consequential 
damages regardless of the theory of liability."
Output: {"clause_type": "liability_limitation", "text": "Neither party shall be liable...",
         "enforceability_flag": false, "reason": "Standard limitation — generally enforceable"}

EXAMPLE 2 (tricky — looks like liability but is indemnification):
Contract text: "Client shall defend and hold harmless Provider from any third-party claims 
arising from Client's use of the service."
Output: {"clause_type": "indemnification", "text": "Client shall defend...",
         "enforceability_flag": true, "reason": "Asymmetric — only client indemnifies provider"}

EXAMPLE 3 (rejection — not a significant clause):
Contract text: "This agreement shall be governed by the laws of California."
Output: {"clause_type": "other", "text": "Governing law — California",
         "enforceability_flag": false, "reason": "Standard governing law — not a risk clause"}

Now extract clauses from: {contract_text}
"""
```

Example 2 is the crucial one — it prevents Claude from misclassifying indemnification as liability limitation, which is a common judgment error.

## The Hard Case Principle

Choose examples that represent the cases where Claude would most likely be wrong without guidance:

```python
# For sentiment classification
good_examples = [
    # Easy case — don't bother
    # ("I love this product!", "positive")  ← Claude gets this right without examples
    
    # Hard case 1: Mixed sentiment
    ("The shipping was excellent but the product broke after a week", "mixed"),
    
    # Hard case 2: Sarcasm
    ("Oh great, another thing that doesn't work. Really exceeded expectations.", "negative"),
    
    # Hard case 3: Neutral that sounds positive
    ("The product arrived as described.", "neutral"),
    
    # Rejection case: Technical feedback, not sentiment
    ("The API returns a 401 error when the token expires.", "technical_feedback"),
]

# These four examples target the four judgment failures Claude would make
# without guidance — not the easy cases it handles correctly regardless
```

## Example Count Guidelines

```
1 example: helps with format but not judgment
2-4 examples: sweet spot — covers main variation, allows generalization
5-7 examples: useful for complex tasks with many edge cases
8+ examples: risks overfitting — Claude matches example patterns not reasoning
10+ examples: only justified for highly variable tasks with many failure modes
```

## Including Rejection Examples

```python
# Rejection examples are critical for classification tasks
rejection_examples = """
EXAMPLE — DO NOT EXTRACT (not a contract clause):
Text: "Section 7.1 Payment Terms"
Why not: This is a section header, not a clause. Skip section headers.
Output: null

EXAMPLE — DO NOT EXTRACT (boilerplate, not substantive):
Text: "The parties agree that this agreement constitutes the entire agreement."
Why not: This is standard merger clause boilerplate present in all contracts.
         Only extract clauses with substantive risk or obligation.
Output: null
"""
```

## Key Takeaways

1. **Target hard cases** — easy cases don't need examples
2. **2-4 examples** is the sweet spot for most tasks
3. **Include rejection examples** — show what should NOT match
4. **Cover different formats** — prevent overfitting to one structure
5. **Few-shot beats zero-shot** for judgment tasks, extraction, classification

---
id: "d4-t2-2-example-targeting"
title: "Example Targeting — Choosing the Right Examples for Maximum Impact"
domain: "d4"
taskRef: "T4.2"
order: 5
xp: 25
tag: "Core"
duration: "7 min"
analogy: "A driving instructor choosing which driving scenarios to practice. They don't spend time on straight roads in perfect weather — that's easy. They practice: merging in heavy traffic, driving in rain, parallel parking in tight spaces. The difficult situations where skill and judgment make the difference."
examTrap: "Choosing examples that are representative (typical cases) rather than challenging (hard cases). Representative examples add no value because Claude handles typical cases correctly without guidance."
keyPoints:
  - "The right example: a case Claude would get wrong without it, where the example corrects the mistake."
  - "Common failure modes to target: boundary conditions, ambiguous categories, look-alike distinctions, edge cases."
  - "Example diversity matters: different document structures, different phrasing, different contexts."
  - "Each example should teach exactly ONE judgment call — multi-lesson examples are confusing."
  - "Test before committing: verify that removing each example actually degrades performance for that case."
antiPatterns:
  - "Examples that are too similar to each other — Claude sees one pattern, not the full space"
  - "Multi-lesson examples that teach several things at once — confusing and hard to reason about"
  - "Not testing whether examples actually improve accuracy — assumed benefit, not measured"
  - "Stale examples that don't reflect current failure patterns — outdated guidance"
tbChallenge: "Your contract clause extractor is confusing 'limitation of liability' clauses with 'indemnification' clauses 40% of the time. Design a targeted example that specifically fixes this confusion. Show the example and explain exactly what judgment call it teaches."
---

## Finding Your Examples: The Failure-First Approach

```python
# Step 1: Run zero-shot on a sample set
# Step 2: Manually review outputs — find the failure patterns
# Step 3: Design examples that specifically address each failure pattern

# Failure pattern analysis
failure_patterns = {
    "liability_misclassified_as_indemnification": 12,  # 24% of errors
    "neutral_classified_as_positive": 8,              # 16% of errors
    "technical_notes_not_filtered": 15,               # 30% of errors
    "multi_party_clauses_missed": 10,                 # 20% of errors
}

# Now choose examples that address your top failure patterns
# Priority: technical_notes_not_filtered (30%), then multi_party_clauses_missed (20%)
```

## The One-Lesson-Per-Example Rule

```python
# ❌ Multi-lesson example — teaches two things, unclear which matters
example_bad = """
Input: "The contractor warrants the work for 90 days AND client may 
        terminate with 30 days notice."  # Two clauses in one
Output: two separate extractions with different types
# What does Claude learn? The termination clause? The warranty clause?
# The multi-clause handling? All three? Unclear.
"""

# ✅ One lesson per example — teaches exactly one thing
example_good = """
Example (multi-clause paragraph — extract each separately):
Input: "Service Provider warrants materials for 90 days from delivery. 
        Client may terminate with 30 days written notice."
Output: [
  {"type": "warranty", "text": "Service Provider warrants materials for 90 days"},
  {"type": "termination", "text": "Client may terminate with 30 days written notice"}
]
Lesson: A single paragraph can contain multiple distinct clauses — extract each.
"""
```

## Testing Example Impact

```python
def measure_example_impact(baseline_accuracy: float, with_example_accuracy: float,
                           example_description: str) -> dict:
    """
    Only include examples that demonstrably improve accuracy.
    """
    improvement = with_example_accuracy - baseline_accuracy
    
    if improvement < 0.05:
        return {
            "include": False,
            "reason": f"Only {improvement:.0%} improvement — not worth context space"
        }
    
    return {
        "include": True,
        "improvement": improvement,
        "description": example_description
    }
```

## Key Takeaways

1. **Start with failures** — analyze where zero-shot goes wrong
2. **Target the failure patterns** — example for each failure mode
3. **One lesson per example** — clarity beats density
4. **Test impact** — verify removing the example degrades performance
5. **Refresh examples** as new failure patterns emerge

---
id: "d4-t2-3-format-examples"
title: "Format Examples — Controlling Output Structure with Few-Shot"
domain: "d4"
taskRef: "T4.2"
order: 6
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A style guide for a publication. Telling writers 'write clearly' produces variability. Showing them three exemplary articles produces consistent house style. Few-shot format examples do the same for Claude's output structure."
examTrap: "Using few-shot only for content guidance and ignoring its power for format control. Few-shot examples for format are often more reliable than detailed format instructions in the system prompt."
keyPoints:
  - "Format examples show Claude the exact output structure you need — more reliable than describing it."
  - "Input/output pair examples teach both content AND format simultaneously."
  - "Examples should use the same format consistently — variation in examples creates variation in output."
  - "For JSON output, examples are often more reliable than schema descriptions for complex nested structures."
  - "Combining few-shot examples with explicit schema validation catches format violations examples miss."
antiPatterns:
  - "Describing the format only in the system prompt without showing examples"
  - "Examples with slightly different formats — Claude averages between them"
  - "No examples for complex nested structures — Claude improvises nesting"
  - "Not combining few-shot with schema validation for production systems"
tbChallenge: "You want Claude to extract contract metadata into a specific JSON format with nested objects. Write a complete few-shot prompt (3 examples) that would reliably produce the exact structure you need."
---

## Format Examples Beat Format Instructions

```python
# ❌ Instructions only — produces variable output
system_prompt = """
Extract metadata from contracts. Return JSON with these fields:
- parties: array of party objects with name and role
- effective_date: ISO date string
- jurisdiction: string
- term: object with start_date and end_date
"""
# Claude will interpret "object" differently each time

# ✅ Examples show exact structure — produces consistent output
few_shot = """
Extract contract metadata. Follow this EXACT format:

EXAMPLE 1:
Contract: "This Agreement is entered into by Acme Corp ('Client') and Tech Solutions Inc 
('Provider') as of January 15, 2024, governed by California law, for one year."
Output:
{
  "parties": [
    {"name": "Acme Corp", "role": "client"},
    {"name": "Tech Solutions Inc", "role": "provider"}
  ],
  "effective_date": "2024-01-15",
  "jurisdiction": "California",
  "term": {"start_date": "2024-01-15", "end_date": "2025-01-15"}
}

EXAMPLE 2 (missing end date — use null):
Contract: "Between GlobalCorp ('Buyer') and SupplyChain Ltd ('Seller'), 
effective March 1, 2024, under New York law."
Output:
{
  "parties": [
    {"name": "GlobalCorp", "role": "buyer"},
    {"name": "SupplyChain Ltd", "role": "seller"}
  ],
  "effective_date": "2024-03-01",
  "jurisdiction": "New York",
  "term": {"start_date": "2024-03-01", "end_date": null}
}

Now extract metadata from: {contract_text}
"""
```

Example 2 explicitly teaches the null handling — preventing Claude from inventing an end date.

## Consistent Example Format

```python
# ❌ Inconsistent formatting in examples — Claude averages between formats
examples_bad = [
    # Example 1: date as string
    {"date": "2024-01-15"},
    # Example 2: date as nested object
    {"date": {"year": 2024, "month": 1, "day": 15}},
]
# Result: unpredictable — Claude sometimes does one, sometimes the other

# ✅ Consistent formatting — Claude learns the exact structure
examples_good = [
    {"date": "2024-01-15"},  # ISO string
    {"date": "2024-03-22"},  # ISO string
    {"date": null},          # Null when not found
]
```

## Key Takeaways

1. **Examples show structure** better than descriptions
2. **Show null/missing cases** explicitly — prevents fabrication
3. **Consistent format** across all examples — variation creates variation
4. **Combine with schema validation** for production systems
5. **Input/output pairs** teach both content and format simultaneously
