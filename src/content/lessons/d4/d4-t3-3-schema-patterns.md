---
id: "d4-t3-3-schema-patterns"
title: "Advanced Schema Patterns — Handling Real-World Complexity"
domain: "d4"
taskRef: "T4.3"
order: 9
xp: 25
tag: "Core"
duration: "7 min"
analogy: "Form design for complex applications. Simple forms have flat fields. Complex applications need conditional sections, multi-value fields, and flexible categories. JSON Schema has the same patterns — discriminated unions, confidence fields, and nullable arrays."
examTrap: "Building separate extraction schemas for every minor document variant. Discriminated unions handle subtypes in one schema — the exam tests that you can design for document variety efficiently."
keyPoints:
  - "Discriminated unions: one schema covers multiple document subtypes via a type discriminator field."
  - "Nullable arrays for optional repeated data: line items that may be absent."
  - "Confidence fields alongside data: let Claude report certainty per field for routing decisions."
  - "Schema versioning: include schema_version in output so parsers survive schema evolution."
  - "allOf with if/then for conditional required fields — fields required only for specific document subtypes."
antiPatterns:
  - "Separate schema per document subtype when discriminated union handles it"
  - "No confidence fields — can't route low-confidence extractions to human review"
  - "No schema versioning — breaking change corrupts all stored extractions"
  - "Required fields for variant-specific data — causes fabrication for documents that don't have them"
tbChallenge: "Design a schema for financial documents that handles both invoices (have due_date) and credit memos (have credit_expires_date). Show the discriminated union pattern and explain how Claude knows which date field to populate."
---

## Discriminated Union Schema

```python
financial_document_schema = {
    "type": "object",
    "properties": {
        # Type discriminator — determines which subtype this is
        "document_type": {
            "type": "string",
            "enum": ["invoice", "credit_memo", "purchase_order"],
            "description": "Type of financial document — determines which variant fields are present"
        },

        # Common fields — all subtypes
        "document_number": {"type": "string"},
        "vendor_name":     {"type": "string"},
        "date":            {"type": "string", "description": "Document date, ISO format"},
        "amount":          {"type": "number", "description": "Total amount in dollars"},

        # Invoice-specific — null for credit memos
        "due_date": {
            "type": ["string", "null"],
            "description": "Payment due date. Populate for invoices, return null for credit memos."
        },

        # Credit memo-specific — null for invoices
        "credit_expires_date": {
            "type": ["string", "null"],
            "description": "Credit expiry date. Populate for credit memos, return null for invoices."
        },

        # Confidence fields for routing
        "extraction_confidence": {
            "type": "object",
            "properties": {
                "overall": {"type": "string", "enum": ["high", "medium", "low"]},
                "uncertain_fields": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "field":  {"type": "string"},
                            "reason": {"type": "string"}
                        }
                    },
                    "description": "Fields where extraction is uncertain. Empty array if all confident."
                }
            }
        },

        # Schema versioning
        "schema_version": {
            "type": "string",
            "enum": ["2.1"],
            "description": "Always return '2.1'"
        }
    },
    "required": [
        "document_type", "document_number", "vendor_name",
        "date", "amount", "extraction_confidence", "schema_version"
    ]
    # due_date and credit_expires_date are NOT required — nullable
}
```

## Routing with Confidence Fields

```python
def route_extraction(result: dict) -> str:
    conf = result.get("extraction_confidence", {})
    overall = conf.get("overall", "low")
    uncertain = conf.get("uncertain_fields", [])

    # Critical financial fields that always trigger review if uncertain
    critical = {"amount", "due_date", "vendor_name"}
    uncertain_critical = [f for f in uncertain if f["field"] in critical]

    if overall == "high" and not uncertain_critical:
        return "auto_process"
    elif uncertain_critical:
        return "human_review"
    else:
        return "spot_check"
```

## Schema Version for Safe Evolution

```python
# When schema changes, old stored extractions still parseable
parsers = {
    "1.0": parse_v1,   # Legacy
    "2.0": parse_v2,   # Current
    "2.1": parse_v2_1, # Latest
}

def parse_extraction(raw: dict) -> ParsedDocument:
    version = raw.get("schema_version", "1.0")
    parser = parsers.get(version, parse_v1)
    return parser(raw)
```

## Key Takeaways

1. **Discriminated union** handles document subtypes in one schema
2. **Nullable variant-specific fields** — don't mark them required
3. **Confidence fields** enable routing without a second API call
4. **schema_version in output** for safe schema evolution
5. **Uncertain fields array** pinpoints what needs human verification
