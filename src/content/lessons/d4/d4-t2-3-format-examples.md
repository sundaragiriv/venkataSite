---
id: "d4-t2-3-format-examples"
title: "Format Examples — Controlling Output Structure with Few-Shot"
domain: "d4"
taskRef: "T4.2"
order: 6
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A style guide with annotated examples. Telling writers 'write in AP style' produces variability. Showing them three exemplary articles with annotations produces consistent house style. Few-shot format examples do the same for Claude's output."
examTrap: "Using few-shot only for content guidance and ignoring its power for format control. For complex nested JSON, showing examples is often more reliable than describing the schema."
keyPoints:
  - "Format examples show exact output structure — more reliable than format descriptions for complex structures."
  - "All examples must use identical format — variation in examples creates variation in output."
  - "Include null/missing cases explicitly — prevents Claude from inventing values."
  - "Combine few-shot format examples with schema validation for production reliability."
  - "Input/output pair examples teach both content judgment AND format simultaneously."
antiPatterns:
  - "Inconsistent format between examples — Claude averages them"
  - "No null/missing value examples — Claude invents plausible-looking values"
  - "Describing format only without showing it — less reliable for complex nesting"
  - "Not combining with schema validation — examples alone don't catch all format violations"
tbChallenge: "Write a 2-example few-shot prompt for extracting contract party information. One contract has two parties, one has three. Include null handling for optional fields."
---

## Format Examples vs Format Instructions

```python
# ❌ Instructions only — produces variable nesting
instructions = """
Extract parties from contracts. Return JSON with:
- parties: array of party objects with name, role, and address
- Each party may have a 'represented_by' attorney field
"""
# Result: Claude nests 'represented_by' differently each time

# ✅ Examples show exact structure — produces consistent output
few_shot = """
Extract contract parties. Follow this EXACT structure:

EXAMPLE 1 (two parties, one with attorney):
Contract: "Between Acme Corp ('Buyer') and TechCo Inc ('Seller')
represented by counsel Smith & Jones LLP, effective January 2024."
Output:
{
  "parties": [
    {
      "name": "Acme Corp",
      "role": "buyer",
      "represented_by": null
    },
    {
      "name": "TechCo Inc",
      "role": "seller",
      "represented_by": "Smith & Jones LLP"
    }
  ],
  "party_count": 2
}

EXAMPLE 2 (three parties, none with attorneys):
Contract: "Agreement between GlobalCorp ('Licensor'), RegionCo ('Licensee'),
and PayCo ('Payment Agent')."
Output:
{
  "parties": [
    {"name": "GlobalCorp", "role": "licensor", "represented_by": null},
    {"name": "RegionCo", "role": "licensee", "represented_by": null},
    {"name": "PayCo", "role": "payment_agent", "represented_by": null}
  ],
  "party_count": 3
}

Now extract parties from: {contract_text}
"""
```

Example 1 explicitly teaches `null` for missing `represented_by` — preventing Claude from omitting the field entirely or inventing an attorney.

## Format Consistency Across Examples

```python
# ❌ Inconsistent — creates inconsistent output
examples = [
    # Example 1: date as string
    {"effective_date": "2024-01-15"},
    # Example 2: date as object
    {"effective_date": {"year": 2024, "month": 1, "day": 15}},
]
# Claude will sometimes use one format, sometimes the other

# ✅ Consistent — output is predictable
examples = [
    {"effective_date": "2024-01-15"},   # ISO string
    {"effective_date": "2024-03-22"},   # ISO string
    {"effective_date": None},           # null when missing
]
```

## Key Takeaways

1. **Show structure** rather than describe it for complex nesting
2. **null/missing cases** must be in examples — prevents fabrication
3. **Identical format** across all examples — no variation
4. **Two examples minimum** to show pattern generalization
5. **Combine with schema validation** for production safety
