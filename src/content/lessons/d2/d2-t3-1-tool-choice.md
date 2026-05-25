---
id: "d2-t3-1-tool-choice"
title: "tool_choice — auto, any, and Forced Selection"
domain: "d2"
taskRef: "T2.3"
order: 7
xp: 40
tag: "⚡ Exam Tested"
duration: "9 min"
analogy: "Giving instructions to a contractor. 'Use whatever you think is best' (auto). 'You must use a tool — pick which one' (any). 'Use specifically the drill for this step' (forced). Each is appropriate in different situations — choosing wrong wastes time or produces wrong results."
examTrap: "Using tool_choice: 'auto' when you need guaranteed tool usage. 'auto' means Claude MAY return text instead of calling a tool. For structured output pipelines, document processing, or any workflow where a tool MUST be called, 'any' or forced is required."
keyPoints:
  - "tool_choice: 'auto' — Claude decides whether to call a tool or respond with text. Default. Use when task might or might not require a tool."
  - "tool_choice: 'any' — Claude MUST call a tool, but chooses which one. Use when you need guaranteed tool invocation but document type/content determines the right tool."
  - "tool_choice: {type: 'tool', name: 'specific_tool'} — Claude MUST call this exact tool. Use for sequential workflows where a specific step must execute."
  - "The exam specifically tests: when document type is unknown and multiple extraction schemas exist → use 'any' not 'auto'."
  - "Forced tool_choice is commonly used for structured output extraction — guarantees Claude produces the schema you need."
antiPatterns:
  - "Using 'auto' in a structured output pipeline — Claude might return text instead of the extraction schema"
  - "Using forced tool_choice with a general extraction tool when document type is unknown — different document types need different schemas"
  - "Using 'any' when you need Claude to potentially respond without a tool call (clarifying questions, simple acknowledgments)"
tbChallenge: "You're building a document processing pipeline that receives different document types: invoices, contracts, and support emails. Each has a different extraction schema. What tool_choice strategy do you use and why?"
---

## The Three tool_choice Values

### auto — Claude Decides

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    tools=tools,
    tool_choice={"type": "auto"},  # Default — can omit
    messages=messages
)
# Result: Claude may call a tool OR return text
# Useful: conversational agents, assistants where some questions don't need tools
```

**When auto is right:**
- Conversational AI where some questions can be answered directly
- Agents where the task might already be complete
- Situations where Claude may need to ask a clarifying question before using a tool

**When auto is wrong:**
- Any structured output pipeline (Claude may return unstructured text)
- Document processing systems
- Sequential workflows where a step must execute

### any — Must Call A Tool, Claude Chooses Which

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    tools=[
        extract_invoice_schema,
        extract_contract_schema,
        extract_support_email_schema
    ],
    tool_choice={"type": "any"},  # Must call a tool — Claude picks which
    messages=[{
        "role": "user",
        "content": [
            {"type": "document", "source": {"type": "base64", ...}},
            {"type": "text", "text": "Extract the key information from this document."}
        ]
    }]
)
# Result: Claude reads the document, determines its type,
# and calls the appropriate extraction schema tool
```

**When any is right:**
- Document type is unknown — multiple schemas exist for different types
- Routing decisions — Claude must make a tool call but the right tool depends on content
- Any situation where "guaranteed tool call, Claude chooses which" is needed

**The exam scenario for 'any':**
You have 3 extraction schemas: invoice, contract, support_email. Documents arrive and you don't know which type they are. Using `auto` risks Claude returning text. Using forced `extract_invoice` on a contract produces wrong output. Using `any` lets Claude read the document and pick the right schema.

### Forced — Must Call This Specific Tool

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    tools=[verify_identity_tool, get_customer_tool, process_refund_tool],
    tool_choice={"type": "tool", "name": "verify_identity"},  # Must call THIS tool
    messages=messages
)
# Result: Claude MUST call verify_identity regardless of anything else
# Useful: first step in a required sequential workflow
```

**When forced is right:**
- Sequential workflows where step N must happen before step N+1
- Compliance requirements where a specific check must occur
- Structured output extraction where you know exactly which schema to use

```python
# Common pattern: forced extraction for known document types
# (when type is pre-classified by your pipeline)
response = client.messages.create(
    tools=[extract_invoice_schema],
    tool_choice={"type": "tool", "name": "extract_invoice_schema"},
    messages=[{
        "role": "user",
        "content": [invoice_document, {"type": "text", "text": "Extract invoice data"}]
    }]
)
```

## Decision Matrix

| Scenario | tool_choice |
|---|---|
| Conversational agent | `auto` |
| Document type unknown, multiple schemas | `any` |
| Document type known | forced (specific schema) |
| Step 1 of sequential workflow | forced (step 1 tool) |
| General assistant | `auto` |
| Guaranteed structured output | `any` or forced |

## Key Takeaways

1. **auto**: Claude may return text OR call a tool — not for structured output pipelines
2. **any**: Claude MUST call a tool, picks which — for unknown document types with multiple schemas
3. **forced**: Claude MUST call specific tool — for sequential workflows and known document types
4. **The exam tests 'any' specifically**: unknown document type + multiple schemas = `any`
5. **Default is auto** — only override when you need guaranteed tool invocation
