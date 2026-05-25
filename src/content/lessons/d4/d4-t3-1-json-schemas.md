---
id: "d4-t3-1-json-schemas"
title: "JSON Schema for Structured Output — Eliminating Syntax Errors"
domain: "d4"
taskRef: "T4.3"
order: 7
xp: 40
tag: "⚡ Exam Tested"
duration: "10 min"
analogy: "A standardized form vs a blank page. A blank page accepts anything — but requires you to parse whatever you receive. A standardized form constrains input to valid values and produces consistent, parseable output every time. JSON Schema is that form for Claude's responses."
examTrap: "Thinking JSON Schema eliminates all output errors. Schema enforces SYNTAX — field presence, types, formats. It does NOT prevent SEMANTIC errors: Claude might extract the wrong number, misidentify a party, or hallucinate data that isn't in the source. Schema + validation catches syntax. Human review catches semantics."
keyPoints:
  - "Using tool_use with a JSON schema forces Claude to produce schema-compliant output — eliminates syntax errors."
  - "Schema eliminates syntax errors but NOT semantic errors — wrong values that match the schema type still get through."
  - "Nullable fields: use when source documents may not contain the information — prevents fabrication to satisfy required fields."
  - "enum + 'other' pattern: for categories that are mostly known but may have unknowns — captures novelty without fabrication."
  - "tool_choice: forced with a specific schema tool guarantees Claude calls that tool — not optional."
antiPatterns:
  - "Marking all fields required when source documents may not contain all values — causes fabrication"
  - "Using 'string' type for fields with known valid values — use enum instead"
  - "No nullable fields — Claude invents values rather than returning null for missing data"
  - "Using auto tool_choice for extraction — Claude may return text instead of calling the tool"
tbChallenge: "You're extracting invoice data. Some invoices have PO numbers, some don't. Some have tax amounts, some don't. Design the schema section that handles these optional fields correctly and explain what happens if you mark them required instead."
---

## tool_use for Structured Output

The most reliable structured output mechanism: define an extraction tool with a JSON schema, force Claude to call it.

```python
client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    tools=[{
        "name": "extract_invoice",
        "description": "Extract structured data from an invoice document",
        "input_schema": {
            "type": "object",
            "properties": {
                "invoice_number": {
                    "type": "string",
                    "description": "Invoice number or identifier"
                },
                "vendor_name": {
                    "type": "string",
                    "description": "Name of the vendor/supplier"
                },
                "invoice_date": {
                    "type": "string",
                    "description": "Invoice date in ISO format YYYY-MM-DD",
                    "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
                },
                "total_amount": {
                    "type": "number",
                    "description": "Total invoice amount in dollars (decimal)"
                },
                "currency": {
                    "type": "string",
                    "enum": ["USD", "EUR", "GBP", "CAD", "AUD", "other"],
                    "description": "Currency code. Use 'other' if not in the list."
                },
                # Nullable field — may not be present in all invoices
                "po_number": {
                    "type": ["string", "null"],
                    "description": "Purchase order number if referenced. null if not present."
                },
                "tax_amount": {
                    "type": ["number", "null"],
                    "description": "Tax amount if separately stated. null if not present."
                },
                "line_items": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "description": {"type": "string"},
                            "quantity":    {"type": "number"},
                            "unit_price":  {"type": "number"},
                            "total":       {"type": "number"}
                        },
                        "required": ["description", "total"]
                    }
                }
            },
            "required": [
                "invoice_number", "vendor_name", "invoice_date",
                "total_amount", "currency", "line_items"
            ]
            # Note: po_number and tax_amount are NOT required — they're nullable
        }
    }],
    tool_choice={"type": "tool", "name": "extract_invoice"},  # FORCED
    messages=[{
        "role": "user",
        "content": [
            {"type": "document", "source": {"type": "base64", ...}},
            {"type": "text", "text": "Extract invoice data using the extract_invoice tool."}
        ]
    }]
)
```

## Nullable Fields — Critical Pattern

```python
# ❌ All required — Claude fabricates missing values
"required": ["invoice_number", "vendor_name", "po_number", "tax_amount"]
# If PO number isn't on the invoice: Claude might write "N/A", "Not provided",
# or even invent a plausible-looking PO number

# ✅ Optional fields are nullable — Claude returns null for missing data
"properties": {
    "po_number": {
        "type": ["string", "null"],  # Can be string OR null
        "description": "Purchase order number. null if not present on invoice."
    }
}
# "required": ["invoice_number", "vendor_name"]  # Only always-present fields
```

## The enum + 'other' Pattern

```python
# For categorization where the category might be novel:
"document_type": {
    "type": "string",
    "enum": ["invoice", "purchase_order", "credit_memo", "receipt", "statement", "other"],
    "description": "Document type. Use 'other' only if document clearly doesn't fit listed types."
}

# If 'other' — also capture what it actually is:
"document_type_detail": {
    "type": ["string", "null"],
    "description": "If document_type is 'other', describe what type it is. null otherwise."
}
```

## Schema vs Semantic Errors

```python
# Schema prevents these (syntax):
{"total_amount": "four hundred dollars"}  # ← string, not number — rejected by schema

# Schema does NOT prevent these (semantic):
{"total_amount": 400.00}  # ← syntactically valid, but wrong value extracted
{"vendor_name": "ABC Corp"}  # ← valid, but document says "ABC Corporation"
{"invoice_date": "2024-01-15"}  # ← valid format, but document says Feb 15

# Need: human review or rule-based validation for semantic errors
def validate_invoice_semantics(extracted: dict, document_text: str):
    # Cross-check key values
    assert str(extracted["total_amount"]) in document_text, "Amount not found in document"
    assert extracted["vendor_name"].lower() in document_text.lower(), "Vendor name mismatch"
```

## Key Takeaways

1. **tool_use with forced tool_choice** is the most reliable structured output
2. **Schema eliminates syntax errors** — not semantic errors
3. **Nullable fields** prevent fabrication of missing data
4. **enum + 'other'** handles mostly-known categories with novelty
5. **Required only what's always present** — everything else is nullable
