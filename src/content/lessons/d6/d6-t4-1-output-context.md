---
id: "d6-t4-1-output-context"
title: "D4 + D5: Structured Output as Context Window Management"
domain: "d6"
taskRef: "T6.4"
order: 7
xp: 40
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "A well-organized filing cabinet vs a pile of documents. The pile holds the same information, but retrieving anything from it requires reading everything. The cabinet's structure means you go directly to the right drawer. JSON schemas (D4) create the filing cabinet — structured output that D5 context management can efficiently process."
examTrap: "Thinking structured output (D4) and context management (D5) are independent concerns. They interact directly: structured JSON output is significantly more compact and parseable than equivalent prose, directly reducing context window consumption."
keyPoints:
  - "Structured JSON output (D4) consumes less context than equivalent prose — JSON is dense, prose is verbose."
  - "Downstream pipeline steps (D5) that receive structured JSON don't need to re-extract information — reducing additional context."
  - "Schema-defined output eliminates syntax error recovery in the context — no 'wait, let me reformat that' retries."
  - "Field-level confidence in structured output (D4+D5) enables routing without a second API call — saving context."
  - "The combined efficiency: D4 forces compact output → D5 pipeline gets compact input → overall context usage drops."
antiPatterns:
  - "Asking for prose summaries when structured JSON would serve the downstream need"
  - "Downstream pipeline parsing prose to extract structured data — should have been structured from the start"
  - "Large JSON schemas with many optional fields — forces empty null values into context"
  - "No schema validation — syntax errors trigger retry turns that fill context"
tbChallenge: "Your extraction pipeline produces prose summaries that a downstream scoring step then parses. How does switching to structured JSON output affect: context usage, pipeline reliability, and the number of API calls needed?"
---

## The Context Consumption Comparison

```python
# Same information: prose vs structured JSON

# Prose version (~150 tokens):
prose_extraction = """
The invoice was issued by Acme Corporation on January 15th, 2024,
with invoice number INV-2024-001847. The total amount is four thousand,
nine hundred and ninety-nine dollars, due by February 14th, 2024.
The invoice covers software licensing services. Overall I'm fairly confident
in this extraction though the due date was somewhat unclear in the document.
"""

# Structured JSON (~60 tokens) — same information, 60% fewer tokens:
json_extraction = {
    "vendor":       "Acme Corporation",
    "invoice_id":   "INV-2024-001847",
    "date":         "2024-01-15",
    "amount":       4999.00,
    "due_date":     "2024-02-14",
    "service_type": "software_licensing",
    "confidence":   {"overall": "medium", "uncertain_fields": [{"field": "due_date"}]}
}

# JSON is:
# - 60% fewer tokens
# - Directly parseable — no extraction step
# - Machine-verifiable via schema
# - Confidence embedded — no second API call for routing
```

## Pipeline Efficiency

```python
# ❌ Prose pipeline — multiple inefficient steps
async def prose_pipeline(document: bytes) -> dict:
    
    # Step 1: Extraction (~150 token result)
    prose = await call_claude(
        "Extract invoice data and summarize it in prose.",
        document
    )
    
    # Step 2: Re-extraction from prose (~adds 150 tokens to context)
    structured = await call_claude(
        f"Parse this summary into JSON: {prose}",
        # Now context has: original document + prose + parsing request
    )
    
    # Step 3: Confidence check (~adds more context)
    confidence = await call_claude(
        f"Rate confidence of this extraction: {structured}"
    )
    
    # Total: 3 API calls, large context
    return {"data": structured, "confidence": confidence}

# ✅ Structured pipeline — one efficient step
async def structured_pipeline(document: bytes) -> dict:
    
    # Step 1: Direct structured extraction (single call)
    result = await call_claude(
        system="Extract invoice data. Include confidence in output.",
        user=document,
        tools=[invoice_schema_with_confidence],
        tool_choice={"type": "tool", "name": "extract_invoice"}
    )
    
    # Total: 1 API call, compact structured output
    # Confidence is IN the output — no additional call needed
    # Downstream steps receive clean JSON — no parsing step needed
    return parse_tool_result(result)
```

## Schema Design for Context Efficiency

```python
# Efficient schema: no padding, no redundancy
efficient_schema = {
    "properties": {
        "vendor":       {"type": "string"},
        "invoice_id":   {"type": "string"},
        "date":         {"type": "string"},
        "amount":       {"type": "number"},
        "due_date":     {"type": ["string", "null"]},  # null saves tokens vs empty string
        "confidence":   {
            "type": "object",
            "properties": {
                "overall":           {"type": "string", "enum": ["high", "medium", "low"]},
                "uncertain_fields":  {
                    "type": "array",
                    "items": {
                        "properties": {
                            "field":  {"type": "string"},
                            "reason": {"type": "string"}
                        }
                    }
                }
            }
        }
    },
    "required": ["vendor", "invoice_id", "date", "amount", "confidence"]
    # due_date nullable — doesn't force empty string into context
}
```

## Key Takeaways

1. **JSON is 40-60% more compact than prose** for the same information
2. **Structured output eliminates parse step** — downstream gets usable data directly
3. **Confidence embedded in schema** — routing decision without extra API call
4. **Schema validation prevents retry** — no reformatting turns filling context
5. **D4 structure + D5 efficiency** = compound savings in API calls and context usage
