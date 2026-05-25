---
id: "d2-t1-2-schema-design"
title: "Tool Schema Design — Building Input Schemas Claude Can Use Reliably"
domain: "d2"
taskRef: "T2.1"
order: 2
xp: 30
tag: "Core"
duration: "8 min"
analogy: "A well-designed form vs a blank text field. A blank field gives you anything — but you'll get inconsistent input that breaks downstream processing. A well-designed form guides the user to provide exactly what you need, in the format you need it. Tool schemas do the same for Claude."
examTrap: "Making all fields required when some are genuinely optional. Required fields that Claude can't always populate cause tool call failures. Optional fields with clear descriptions are better than required fields that sometimes have no valid value."
keyPoints:
  - "JSON Schema is the format for tool input schemas — use type, description, enum, default, and required correctly."
  - "enum values constrain Claude's choices to valid options — essential for fields with a fixed set of valid values."
  - "required array should only contain fields Claude can always provide — optional fields should be genuinely optional."
  - "Nested objects in schemas are fine but deep nesting makes descriptions harder to write and Claude's inputs harder to validate."
  - "Schema design affects reliability: a schema that allows invalid inputs will eventually receive them."
antiPatterns:
  - "No description on any input parameters — Claude must guess format and content"
  - "All fields marked required when some are conditional on other field values"
  - "Using 'string' type for fields with a known set of valid values — use enum instead"
  - "Allowing any string when a specific format is required (dates, IDs, codes)"
tbChallenge: "Design the tool schema for a 'create_support_ticket' tool. It needs: customer ID, issue category (from a fixed list), priority, description, and an optional list of related order IDs. Show me the full schema with descriptions."
---

## JSON Schema Basics for Tool Inputs

```python
tool_schema = {
    "name": "create_support_ticket",
    "description": "Creates a support ticket for a customer issue.",
    "input_schema": {
        "type": "object",
        "properties": {
            # String with format constraint
            "customer_id": {
                "type": "string",
                "description": "Customer identifier in format 'C-XXXXXX'. "
                              "Obtain from get_customer result.",
                "pattern": "^C-[0-9]{6}$"  # Regex validation
            },

            # Enum — constrained to valid values
            "category": {
                "type": "string",
                "enum": ["billing", "shipping", "product_defect", "account_access", "other"],
                "description": "Issue category. Use 'other' only if none of the specific "
                              "categories apply."
            },

            # Enum with description of each value
            "priority": {
                "type": "string",
                "enum": ["low", "medium", "high", "urgent"],
                "description": "Ticket priority. "
                              "urgent: customer cannot use product at all. "
                              "high: significant functionality impaired. "
                              "medium: partial functionality affected. "
                              "low: cosmetic or minor issue.",
                "default": "medium"
            },

            # String with length constraints
            "description": {
                "type": "string",
                "description": "Detailed description of the issue in the customer's words. "
                              "Include: what they were trying to do, what happened instead, "
                              "any error messages. Minimum 50 characters.",
                "minLength": 50,
                "maxLength": 2000
            },

            # Optional array
            "related_order_ids": {
                "type": "array",
                "items": {
                    "type": "string",
                    "pattern": "^ORD-[0-9]{8}$"
                },
                "description": "Order IDs related to this issue (format: 'ORD-XXXXXXXX'). "
                              "Optional — include only if this issue is order-specific.",
                "maxItems": 5
            }
        },
        "required": ["customer_id", "category", "priority", "description"]
        # related_order_ids is NOT required — it's genuinely optional
    }
}
```

## When to Use Each Schema Type

| Situation | Use |
|---|---|
| Fixed set of valid values | `enum` |
| Free text with format rules | `string` with `pattern` |
| Numeric with range | `integer` or `number` with `minimum`/`maximum` |
| Yes/no decision | `boolean` |
| Collection of items | `array` with `items` schema |
| Grouped related fields | `object` with nested `properties` |

## The Required vs Optional Decision

Only mark fields as required if Claude can **always** provide them for any valid call.

```python
# ❌ Wrong: making conditional fields required
"required": ["customer_id", "order_id", "payment_id"]
# What if the issue isn't order or payment related?

# ✅ Right: only require what's always available
"required": ["customer_id", "category", "description"]
# order_id and payment_id are optional — included when relevant
```

## Key Takeaways

1. **enum** for fields with fixed valid values — prevents invalid inputs
2. **required** only for fields Claude can always provide
3. **Descriptions on every parameter** — not just the top-level schema
4. **Pattern constraints** for formatted strings (IDs, dates, codes)
5. **Default values** for optional fields with common defaults
