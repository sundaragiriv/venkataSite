---
id: "d4-t3-2-tool-choice-output"
title: "tool_choice for Structured Output — auto vs any vs forced"
domain: "d4"
taskRef: "T4.3"
order: 8
xp: 30
tag: "⚡ Exam Tested"
duration: "7 min"
analogy: "Ordering at a restaurant. 'Whatever you recommend' (auto) might get you a meal or just a drink. 'I must order food' (any) guarantees you get a dish but the waiter picks. 'I want the salmon specifically' (forced) guarantees exactly that dish. For structured output pipelines, you almost always want forced."
examTrap: "Using tool_choice: 'auto' in a document processing pipeline. Auto means Claude MAY respond with text instead of calling the extraction tool. For guaranteed structured output, use 'any' (unknown document type) or forced (known document type)."
keyPoints:
  - "auto: Claude decides whether to call a tool or return text — NOT suitable for extraction pipelines."
  - "any: Claude MUST call a tool, chooses which — use when document type determines the right schema."
  - "forced: Claude MUST call THIS specific tool — use when you know the document type."
  - "The exam scenario for 'any': multiple extraction schemas exist, document type is unknown, Claude reads and picks the right schema."
  - "Forced extraction: pre-classify document type, then force the matching schema tool."
antiPatterns:
  - "auto in an extraction pipeline — may return unstructured text instead of schema"
  - "Forced wrong schema — forcing 'extract_invoice' on a purchase order produces wrong output"
  - "any when you already know the document type — wasteful, use forced"
  - "Not considering that 'any' requires all schema tools to be in the tools array"
tbChallenge: "You receive documents from 3 sources: invoices from Source A, contracts from Source B, and mixed unknown types from Source C. Design the tool_choice strategy for each source and explain why."
---

## The tool_choice Decision for Extraction

```python
# Source A: Always invoices → FORCED
response = client.messages.create(
    tools=[invoice_schema_tool],
    tool_choice={"type": "tool", "name": "extract_invoice"},
    messages=[invoice_document]
)

# Source B: Always contracts → FORCED
response = client.messages.create(
    tools=[contract_schema_tool],
    tool_choice={"type": "tool", "name": "extract_contract"},
    messages=[contract_document]
)

# Source C: Mixed unknown types → ANY
response = client.messages.create(
    tools=[invoice_schema_tool, contract_schema_tool, receipt_schema_tool],
    tool_choice={"type": "any"},  # Claude reads, classifies, picks schema
    messages=[unknown_document]
)
```

## The 'any' Pattern for Unknown Document Types

```python
# With 'any': Claude reads the document, determines its type,
# and calls the appropriate extraction schema

tools = [
    {
        "name": "extract_invoice",
        "description": "Use for invoices: documents requesting payment for goods/services delivered",
        "input_schema": invoice_schema
    },
    {
        "name": "extract_contract",
        "description": "Use for contracts: legally binding agreements between parties",
        "input_schema": contract_schema
    },
    {
        "name": "extract_purchase_order",
        "description": "Use for POs: documents authorizing purchase of specified goods",
        "input_schema": po_schema
    }
]

# The tool DESCRIPTIONS drive which schema Claude selects
# This is why tool descriptions matter so much (D2 T2.1 connection)
```

## Pre-Classification Pipeline

```python
# For high-volume systems: classify first, then use forced extraction
async def process_document(document: bytes) -> dict:
    # Step 1: Classify (lightweight, cheap)
    doc_type = await classify_document(document)
    # Returns: "invoice" | "contract" | "purchase_order" | "unknown"
    
    # Step 2: Extract with forced schema matching the type
    schema_map = {
        "invoice": (invoice_schema_tool, "extract_invoice"),
        "contract": (contract_schema_tool, "extract_contract"),
        "purchase_order": (po_schema_tool, "extract_purchase_order"),
    }
    
    if doc_type == "unknown":
        # Fall back to 'any' for unknown types
        return await extract_with_any(document)
    
    tool, tool_name = schema_map[doc_type]
    return await extract_forced(document, tool, tool_name)
```

## Key Takeaways

1. **Never use auto for extraction pipelines** — may return text
2. **forced for known document types** — most reliable
3. **any for unknown document types** — Claude classifies and picks schema
4. **Tool descriptions** drive schema selection with 'any' — write them carefully
5. **Pre-classify for high volume** — cheap classification then forced extraction

---
id: "d4-t3-3-schema-patterns"
title: "Advanced Schema Patterns — Handling Real-World Document Complexity"
domain: "d4"
taskRef: "T4.3"
order: 9
xp: 25
tag: "Core"
duration: "7 min"
analogy: "Form design for a complex application. Simple forms have straightforward fields. Complex applications need conditional sections, multi-value fields, and flexible categories. JSON Schema has the same patterns — you just need to know them."
examTrap: "Using separate extraction calls when discriminated union schemas can handle document variation in one call. The exam tests schema design efficiency as well as correctness."
keyPoints:
  - "Discriminated unions: one schema handles multiple document subtypes based on a type discriminator field."
  - "Nested arrays: line items, parties, clauses — always use array of objects with clear item schemas."
  - "Conditional required fields: use allOf with if/then for fields required only when another field has a specific value."
  - "Confidence fields alongside data fields: let Claude report its confidence in each extraction."
  - "Schema version in output: include schema version so you can evolve the schema without breaking parsers."
antiPatterns:
  - "One massive schema for all document types — too complex for Claude to navigate reliably"
  - "No confidence fields — can't identify which extractions to send for human review"
  - "No schema versioning — breaking change in schema breaks all stored extractions"
  - "Missing item schemas for arrays — Claude improvises the array item structure"
tbChallenge: "Design a schema that handles both invoices and credit memos in a single extraction call. Invoices have a 'due_date', credit memos have a 'credit_expires' date. Show the discriminated union pattern."
---

## Discriminated Union Schema

```python
unified_financial_schema = {
    "type": "object",
    "properties": {
        # Type discriminator — determines document variant
        "document_type": {
            "type": "string",
            "enum": ["invoice", "credit_memo"],
            "description": "Type of financial document"
        },
        "document_number": {"type": "string"},
        "vendor_name":     {"type": "string"},
        "amount":          {"type": "number"},
        "date":            {"type": "string"},
        
        # Invoice-specific
        "due_date": {
            "type": ["string", "null"],
            "description": "Payment due date. Present for invoices, null for credit memos."
        },
        
        # Credit memo-specific
        "credit_expires": {
            "type": ["string", "null"],
            "description": "Credit expiry date. Present for credit memos, null for invoices."
        },
        
        # Confidence reporting
        "extraction_confidence": {
            "type": "object",
            "properties": {
                "overall": {
                    "type": "string",
                    "enum": ["high", "medium", "low"]
                },
                "low_confidence_fields": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "field":  {"type": "string"},
                            "reason": {"type": "string"}
                        }
                    }
                }
            }
        }
    },
    "required": ["document_type", "document_number", "vendor_name", "amount", "date"]
}
```

## Confidence Fields for Review Routing

```python
# Route to human review based on confidence
def route_extraction(result: dict) -> str:
    confidence = result.get("extraction_confidence", {})
    overall = confidence.get("overall", "low")
    low_fields = confidence.get("low_confidence_fields", [])
    
    if overall == "low" or len(low_fields) > 2:
        return "human_review"
    elif overall == "medium" or len(low_fields) > 0:
        return "spot_check"
    else:
        return "auto_process"
```

## Key Takeaways

1. **Discriminated union** for multiple document types in one schema
2. **Nullable optional fields** for variant-specific data
3. **Confidence fields** for routing to human review
4. **Array item schemas** — always define them explicitly
5. **Schema version** in output for safe evolution

---
id: "d4-t4-1-chaining-basics"
title: "Prompt Chaining — Multi-Step Reasoning Workflows"
domain: "d4"
taskRef: "T4.4"
order: 10
xp: 30
tag: "Core"
duration: "8 min"
analogy: "An assembly line for reasoning. Each station adds value based on what the previous station produced. You can't do the final quality check before the assembly, and you can't do the assembly before the parts arrive. Each step is a Claude call that builds on the previous."
examTrap: "Chaining steps that are actually independent. Independent steps should be parallelized, not chained. The exam tests that you can distinguish sequential dependency from artificial serialization."
keyPoints:
  - "Prompt chaining: each Claude call receives the output of the previous call as input."
  - "Chain when: each step genuinely depends on the previous step's output."
  - "Don't chain when: steps are independent — parallelize instead."
  - "Breaking complex single prompts into chains improves reliability — each step is simpler."
  - "Chain output format matters: each step's output must be structured for the next step's input."
antiPatterns:
  - "Chaining independent steps (should parallelize)"
  - "Passing full previous output to next step without extracting the relevant part"
  - "No structure to chain handoffs — next step receives unstructured prose"
  - "No error handling between steps — failure in step 2 with no recovery"
tbChallenge: "You're building a legal document analyzer. Steps: (1) extract key clauses, (2) identify risk clauses, (3) score overall risk, (4) draft recommendations. Which steps can parallelize and which must chain? Show the execution graph."
---

## The Chain Pattern

```python
async def analyze_legal_document(document_text: str) -> dict:

    # Step 1: Extract all clauses (foundation for everything else)
    extracted_clauses = await call_claude(
        system="Extract all clauses from this contract. Return structured JSON.",
        user=document_text,
        tool=clause_extraction_schema,
        tool_choice="forced"
    )

    # Step 2a and 2b: Both depend on step 1, but NOT on each other → PARALLELIZE
    liability_analysis, termination_analysis = await asyncio.gather(
        call_claude(
            system="Analyze liability clauses for risk.",
            user=json.dumps(extracted_clauses["liability_clauses"]),
        ),
        call_claude(
            system="Analyze termination clauses for risk.",
            user=json.dumps(extracted_clauses["termination_clauses"]),
        )
    )

    # Step 3: Overall risk score → depends on steps 2a and 2b → CHAIN
    risk_score = await call_claude(
        system="Score overall contract risk from 1-10.",
        user=f"Liability analysis:\n{liability_analysis}\n\nTermination analysis:\n{termination_analysis}"
    )

    # Step 4: Recommendations → depends on step 3 → CHAIN
    recommendations = await call_claude(
        system="Draft negotiation recommendations based on risk analysis.",
        user=f"Risk score: {risk_score}\n\nAnalysis details:\n..."
    )

    return {"clauses": extracted_clauses, "risk": risk_score, "recommendations": recommendations}
```

## Structured Handoffs

```python
# ❌ Unstructured handoff — next step parses prose
step1_output = "The contract has several concerning clauses including..."
# Step 2 receives unstructured text — harder to process reliably

# ✅ Structured handoff — next step receives clean input
step1_output = {
    "high_risk_clauses": [
        {"type": "liability_cap", "text": "...", "risk_score": 8}
    ],
    "medium_risk_clauses": [...],
    "low_risk_clauses": [...]
}
# Step 2 receives JSON it can reliably extract from
```

## Key Takeaways

1. **Chain for true sequential dependency** — step B needs step A's output
2. **Parallelize independent steps** — even within a chain, parallelism is possible
3. **Structured handoffs** — each step outputs structure the next step can parse
4. **Error handling between steps** — failure in step 2 needs recovery logic
5. **Each step simpler = more reliable** — break complex single prompts into chains

---
id: "d4-t4-2-chain-patterns"
title: "Chain Patterns — Building Reliable Multi-Step Pipelines"
domain: "d4"
taskRef: "T4.4"
order: 11
xp: 25
tag: "Core"
duration: "7 min"
analogy: "A relay race. Each runner has exactly one leg to run, receives the baton from the previous runner, and passes it to the next. If a runner drops the baton (step fails), the race has a clear failure point — not an ambiguous system failure."
examTrap: "Treating chain failures as pipeline failures. A well-designed chain has step-level failure handling — knowing which step failed tells you exactly what to fix, retry, or escalate."
keyPoints:
  - "Per-file then cross-file: analyze files individually in parallel, then synthesize across files — a canonical two-phase chain."
  - "Reduce chain: each step reduces a large input to a smaller, more processed output for the next step."
  - "Verification chain: generation step followed by independent review step using separate context."
  - "Step failure isolation: know which step failed and handle it at that level, not at the pipeline level."
  - "Max chain depth guideline: more than 5 sequential steps degrades quality — error compounds across steps."
antiPatterns:
  - "No step-level error handling — pipeline fails opaquely"
  - "Passing entire previous context to next step — dilutes focus, increases token cost"
  - "Chain depth > 5 without quality validation between steps"
  - "Same Claude instance for generation and verification — defeats verification purpose"
tbChallenge: "Design a document review pipeline as a chain: raw document → extract claims → verify each claim → identify contradictions → produce summary. What does each step receive, what does it output, and what's the failure handling at each step?"
---

## The Per-File Then Cross-File Pattern

Classic two-phase chain for codebase analysis:

```python
async def analyze_codebase(files: list[str]) -> dict:

    # Phase 1: Per-file analysis (parallel — files are independent)
    file_analyses = await asyncio.gather(*[
        call_claude(
            system="Analyze this file for: complexity, test coverage, tech debt. Return JSON.",
            user=read_file(f)
        )
        for f in files
    ])

    # Phase 2: Cross-file synthesis (sequential — depends on all file analyses)
    synthesis = await call_claude(
        system="Identify cross-file patterns, shared dependencies, and systemic issues.",
        user=json.dumps(file_analyses)
    )

    return {"file_analyses": file_analyses, "synthesis": synthesis}
```

## The Verification Chain

```python
async def generate_with_verification(task: str) -> dict:

    # Step 1: Generate
    generated = await call_claude(
        system="Generate a solution for this task.",
        user=task
    )

    # Step 2: Verify — SEPARATE CONTEXT, SEPARATE INVOCATION
    # (not the same Claude instance that generated)
    verification = await call_claude(
        system="""You are a code reviewer. Review this solution critically.
                  Identify bugs, security issues, and correctness problems.
                  Do NOT assume the code is correct.""",
        user=f"Code to review:\n{generated}\n\nOriginal task:\n{task}"
    )

    return {"generated": generated, "verification": verification}
```

## Step Failure Isolation

```python
class ChainStep:
    def __init__(self, name: str, fn, required: bool = True):
        self.name = name
        self.fn = fn
        self.required = required

async def run_chain(steps: list[ChainStep], initial_input: any) -> dict:
    results = {}
    current_input = initial_input

    for step in steps:
        try:
            result = await step.fn(current_input)
            results[step.name] = {"status": "success", "output": result}
            current_input = result  # Pass to next step
        except Exception as e:
            results[step.name] = {"status": "failed", "error": str(e)}
            if step.required:
                # Required step failed — stop here with clear diagnosis
                return {
                    "status": "failed",
                    "failed_at": step.name,
                    "completed_steps": results,
                    "error": str(e)
                }
            # Optional step failed — continue with previous output
            current_input = current_input  # Keep previous step's output

    return {"status": "success", "results": results}
```

## Key Takeaways

1. **Per-file parallel, cross-file sequential** — canonical analysis pattern
2. **Verification chain** = separate Claude instance, separate context
3. **Step failure isolation** — know exactly which step failed
4. **Required vs optional steps** — failure handling differs
5. **Max 5 sequential steps** before quality validation checkpoint

---
id: "d4-t4-3-chain-reliability"
title: "Chain Reliability — Validation and Quality Gates"
domain: "d4"
taskRef: "T4.4"
order: 12
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Quality control checkpoints in manufacturing. You don't only inspect the final product — you inspect at each stage. Finding a defect at stage 3 is cheaper than finding it at stage 7 after all subsequent work was wasted."
examTrap: "Waiting until the end of a chain to validate quality. Validating at each step prevents error propagation — a bad step 2 output caught early avoids wasted computation in steps 3-5."
keyPoints:
  - "Validate step output format before passing to next step — catch schema violations early."
  - "Validate step output quality at critical checkpoints — not just format."
  - "Quality validation can itself be a Claude call — a lightweight evaluator between heavy steps."
  - "Retry a failing step before propagating failure — transient issues often resolve on retry."
  - "Confidence thresholds: route low-confidence step outputs to human review before continuing."
antiPatterns:
  - "No validation between steps — errors propagate and compound"
  - "Validating only format, not quality — a syntactically valid but semantically wrong output continues"
  - "No retry on step failure — transient issues cause full chain reruns"
  - "Propagating low-confidence outputs — amplifying uncertainty through the chain"
tbChallenge: "Your chain has 4 steps. Step 2 extracts key facts from a document. Step 3 uses those facts to draw conclusions. What validation do you put between steps 2 and 3, and what do you do if confidence is low?"
---

## Step Output Validation

```python
def validate_extraction_output(output: dict, required_fields: list) -> dict:
    """Validate before passing to next step."""
    missing = [f for f in required_fields if f not in output or output[f] is None]
    
    if missing:
        return {
            "valid": False,
            "error": f"Required fields missing or null: {missing}",
            "output": output
        }
    
    # Validate confidence
    confidence = output.get("extraction_confidence", {}).get("overall", "low")
    if confidence == "low":
        return {
            "valid": True,
            "confidence": "low",
            "recommendation": "route_to_human_review",
            "output": output
        }
    
    return {"valid": True, "confidence": confidence, "output": output}

# Between steps
validation = validate_extraction_output(step2_output, ["key_facts", "parties", "date"])
if not validation["valid"]:
    return {"status": "failed", "step": "extraction", "error": validation["error"]}
if validation.get("recommendation") == "route_to_human_review":
    return {"status": "needs_review", "output": step2_output}
# Proceed to step 3
step3_input = validation["output"]
```

## Lightweight Evaluator Between Heavy Steps

```python
# After expensive step 2 (document analysis), before expensive step 3 (synthesis)
# Use a cheap evaluator to check quality

async def evaluate_analysis_quality(analysis: dict) -> str:
    """Lightweight quality check — much cheaper than re-running step 2."""
    result = await call_claude(
        model="claude-haiku-4-5-20251001",  # Cheap model for evaluation
        system="""Rate the quality of this analysis: high | medium | low.
                  high: all key points addressed, specific and actionable
                  medium: most points addressed, some gaps
                  low: vague, incomplete, or contradictory
                  Return only: high | medium | low""",
        user=json.dumps(analysis)
    )
    return result.strip()

quality = await evaluate_analysis_quality(step2_output)
if quality == "low":
    # Retry step 2 before proceeding
    step2_output = await retry_step2(document)
```

## Key Takeaways

1. **Validate after each step** — format AND quality where critical
2. **Lightweight evaluator** between heavy steps — cheap check saves expensive rework
3. **Retry before propagating failure** — transient issues resolve
4. **Confidence routing** — low-confidence outputs go to human review, not step 3
5. **Early detection** is cheaper than late detection — always

---
id: "d4-t5-1-validation"
title: "Output Validation — Catching Errors Before They Reach Production"
domain: "d4"
taskRef: "T4.5"
order: 13
xp: 30
tag: "Core"
duration: "8 min"
analogy: "A bank's transaction validation system. Multiple layers: format check (is it a valid transaction structure?), range check (is the amount reasonable?), business rule check (does the customer have sufficient funds?), fraud check (is this pattern suspicious?). Layers catch different error types."
examTrap: "Thinking JSON schema validation is sufficient for production output quality. Schema catches syntax. Business rule validation catches semantic errors. You need both — and the exam tests that you know which catches which."
keyPoints:
  - "Two validation layers: syntax validation (schema) catches format errors; semantic validation catches wrong-but-valid values."
  - "Retry-with-error-feedback: failed extraction → retry with original doc + failed output + specific error message."
  - "Retry works for: format errors, missing fields, wrong field types."
  - "Retry does NOT work for: information absent from source — if the data isn't there, retrying fabricates it."
  - "Validation feedback must be specific — 'extraction failed' doesn't help Claude fix it; 'total_amount format should be a number in dollars, got a string with currency symbol' does."
antiPatterns:
  - "Schema validation only — misses semantic errors"
  - "Retrying when the source document doesn't contain the information — leads to fabrication"
  - "Vague error feedback — Claude can't fix 'invalid output'"
  - "Unlimited retries — cap at 2-3 retries before escalating to human review"
tbChallenge: "Your invoice extractor returns {total_amount: '$4,999.00'} when the schema requires a number. Write the retry prompt that fixes this specific error, and explain why the specific error message matters."
---

## Two Validation Layers

```python
class InvoiceValidator:

    def validate_syntax(self, output: dict) -> dict:
        """Layer 1: Schema/syntax validation"""
        errors = []

        # Type checks
        if not isinstance(output.get("total_amount"), (int, float)):
            errors.append({
                "field": "total_amount",
                "error": "Must be a number (decimal dollars). Got: " + str(output.get("total_amount")),
                "correct_format": 4999.00
            })

        if not isinstance(output.get("line_items"), list):
            errors.append({
                "field": "line_items",
                "error": "Must be an array of line item objects",
                "correct_format": [{"description": "...", "total": 0.00}]
            })

        return {"valid": len(errors) == 0, "errors": errors}

    def validate_semantics(self, output: dict, source_text: str) -> dict:
        """Layer 2: Business rule / semantic validation"""
        errors = []

        # Cross-validation: line items sum should match total
        if output.get("line_items"):
            line_total = sum(item.get("total", 0) for item in output["line_items"])
            total = output.get("total_amount", 0)
            if abs(line_total - total) > 0.01:
                errors.append({
                    "field": "total_amount",
                    "error": f"Line items sum ({line_total}) doesn't match total ({total})",
                    "possible_cause": "Tax or discount not captured in line items"
                })

        # Source verification: vendor name should appear in document
        vendor = output.get("vendor_name", "")
        if vendor and vendor.lower() not in source_text.lower():
            errors.append({
                "field": "vendor_name",
                "error": f"Vendor '{vendor}' not found in source document",
                "possible_cause": "May have extracted wrong entity as vendor"
            })

        return {"valid": len(errors) == 0, "errors": errors}
```

## Retry-With-Error-Feedback

```python
async def extract_with_retry(document_text: str, max_retries: int = 2) -> dict:
    last_output = None
    last_errors = None

    for attempt in range(max_retries + 1):
        if attempt == 0:
            # First attempt: standard extraction
            prompt = f"Extract invoice data from:\n{document_text}"
        else:
            # Retry: include previous failed output + specific errors
            prompt = f"""Previous extraction attempt failed validation.

Original document:
{document_text}

Previous (incorrect) extraction:
{json.dumps(last_output, indent=2)}

Validation errors to fix:
{json.dumps(last_errors, indent=2)}

Please re-extract, fixing the specific errors listed above.
If a field is not present in the document, return null — do not invent values."""

        result = await call_claude(
            tools=[invoice_schema_tool],
            tool_choice={"type": "tool", "name": "extract_invoice"},
            messages=[{"role": "user", "content": prompt}]
        )
        output = parse_tool_result(result)

        # Validate
        syntax_check = validator.validate_syntax(output)
        if not syntax_check["valid"]:
            last_output = output
            last_errors = syntax_check["errors"]
            continue  # Retry

        semantic_check = validator.validate_semantics(output, document_text)
        if not semantic_check["valid"]:
            # Semantic errors: retry if fixable, escalate if not
            fixable = [e for e in semantic_check["errors"]
                      if "not found in source" not in e["error"]]
            not_fixable = [e for e in semantic_check["errors"]
                          if "not found in source" in e["error"]]

            if not_fixable:
                # Information not in document — retry would fabricate
                return {"status": "needs_review", "output": output,
                        "reason": "Source document missing required information"}

            if fixable and attempt < max_retries:
                last_output = output
                last_errors = fixable
                continue

        return {"status": "success", "output": output}

    # Exhausted retries
    return {"status": "needs_review", "output": last_output,
            "reason": f"Failed validation after {max_retries} retries"}
```

## When NOT to Retry

```python
NOT_RETRYABLE_ERRORS = [
    "not found in source document",
    "absent from the document",
    "document does not contain",
]

def is_retryable(error: dict) -> bool:
    """Format errors: retryable. Missing data: not retryable (would fabricate)."""
    error_text = error.get("error", "").lower()
    return not any(phrase in error_text for phrase in NOT_RETRYABLE_ERRORS)
```

## Key Takeaways

1. **Two layers**: syntax validation (schema) + semantic validation (business rules)
2. **Retry with specific feedback** — vague errors don't help Claude fix anything
3. **Retry for format errors**, NOT for missing source data
4. **Cap retries at 2-3** — escalate to human review after
5. **"Not in source" = don't retry** — would produce fabrication

---
id: "d4-t5-2-retry-patterns"
title: "Retry Patterns — Systematic Error Recovery for Extraction Pipelines"
domain: "d4"
taskRef: "T4.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Proofreading with marked corrections. A proofreader doesn't just say 'this is wrong' — they mark each specific error with instructions. The author then addresses each marked issue. Claude's retry loop works the same way: specific marked errors → targeted corrections."
examTrap: "Retrying with the original prompt unchanged. An unchanged prompt produces an identical (wrong) output. The retry prompt must include: original document, failed output, AND specific error descriptions."
keyPoints:
  - "Retry prompt must include: original document, failed output, and specific errors — all three are required."
  - "Without the failed output, Claude doesn't know what it got wrong."
  - "Without specific errors, Claude doesn't know what to fix."
  - "Without the original document, Claude can't re-extract correctly."
  - "Error message specificity: field name + what it got + what it should be."
antiPatterns:
  - "Retrying with only the original prompt — produces identical wrong output"
  - "Sending only the error message without the failed output — Claude doesn't know what to change"
  - "Sending only the failed output without the error message — Claude doesn't know what's wrong"
  - "Error messages that are too vague: 'invalid output' vs 'total_amount must be a number, got string'"
tbChallenge: "Your extractor returned {invoice_date: 'January 15, 2024'} but your schema requires ISO format (YYYY-MM-DD). Write the exact retry prompt — all three required components."
---

## The Complete Retry Prompt

```python
def build_retry_prompt(
    original_document: str,
    failed_output: dict,
    validation_errors: list
) -> str:
    """All three components required for effective retry."""

    error_descriptions = "\n".join([
        f"• Field '{e['field']}': {e['error']}"
        + (f"\n  Got: {e.get('got')}" if 'got' in e else "")
        + (f"\n  Expected: {e.get('expected')}" if 'expected' in e else "")
        for e in validation_errors
    ])

    return f"""Your previous extraction had validation errors that need to be corrected.

ORIGINAL DOCUMENT:
{original_document}

YOUR PREVIOUS (INCORRECT) EXTRACTION:
{json.dumps(failed_output, indent=2)}

SPECIFIC ERRORS TO FIX:
{error_descriptions}

Re-extract the data, fixing only the errors listed above.
For each error: apply the correction described.
Do not change fields that were correct.
If information is not in the document, return null — do not invent values."""
```

## Specific vs Vague Error Messages

```python
# ❌ Vague — Claude doesn't know what to change
errors_vague = [
    {"field": "invoice_date", "error": "Invalid format"}
]

# ✅ Specific — Claude knows exactly what to fix
errors_specific = [
    {
        "field": "invoice_date",
        "error": "Must be ISO format YYYY-MM-DD",
        "got": "January 15, 2024",
        "expected": "2024-01-15",
        "hint": "Convert the written-out date to ISO format"
    },
    {
        "field": "total_amount",
        "error": "Must be a decimal number (dollars), not a string with currency symbol",
        "got": "$4,999.00",
        "expected": 4999.00,
        "hint": "Remove the $ sign and commas, return as a number"
    }
]
```

## Key Takeaways

1. **Three required components**: original document, failed output, specific errors
2. **Specific errors**: field + what you got + what's expected
3. **Never retry with original prompt unchanged** — produces same output
4. **Don't change correct fields** — targeted corrections only
5. **Missing data → don't retry** — would fabricate

---
id: "d4-t5-3-batch-processing"
title: "Batch Processing — Message Batches API for High-Volume Extraction"
domain: "d4"
taskRef: "T4.5"
order: 15
xp: 30
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "Processing photos in bulk on a cloud service overnight vs printing them one at a time in-store. Overnight cloud batch is cheaper and you don't need to wait — but you can't print something you need right now. The Message Batches API is the overnight cloud option."
examTrap: "Using Batch API for time-sensitive operations. Batch API has NO guaranteed latency SLA — processing can take up to 24 hours. It's for jobs where you don't need the result immediately. NEVER use it for anything blocking user workflows or pre-merge checks."
keyPoints:
  - "Batch API: 50% cost savings on large volumes. Up to 24-hour processing time. No guaranteed latency SLA."
  - "Use for: overnight processing, non-urgent batch jobs, cost optimization at scale."
  - "Never use for: pre-merge checks, blocking user workflows, real-time data needs, anything with a latency requirement."
  - "custom_id field: correlates batch requests with responses — essential for partial failure recovery."
  - "Partial failure handling: resubmit only failed requests by custom_id, not the entire batch."
antiPatterns:
  - "Using Batch API for pre-merge CI/CD checks — can take 24 hours"
  - "No custom_id — can't identify which requests failed on partial failure"
  - "Resubmitting entire batch on partial failure — wastes cost and time"
  - "Not checking batch status before assuming completion"
tbChallenge: "You have 10,000 invoices to extract data from. Some will fail validation. Design the batch processing strategy including: batch size, custom_id scheme, status polling, and partial failure recovery."
---

## Batch API vs Real-Time API

```python
# Use real-time for:
# - Pre-merge code review checks (needs result in seconds)
# - User-facing features (user waits for response)
# - Retry logic that needs immediate feedback

# Use Batch API for:
# - Nightly invoice processing
# - Monthly report generation
# - Backfill operations
# - Any job where "done by morning" is acceptable

# Rule of thumb: if the user (human or system) is waiting → real-time
#                if you can check results tomorrow → Batch API
```

## Batch API Request Structure

```python
import anthropic

client = anthropic.Anthropic()

# Prepare batch requests
requests = []
for invoice_id, invoice_text in invoices.items():
    requests.append({
        "custom_id": f"invoice-{invoice_id}",  # YOUR identifier for correlation
        "params": {
            "model": "claude-sonnet-4-6",
            "max_tokens": 2048,
            "tools": [invoice_schema_tool],
            "tool_choice": {"type": "tool", "name": "extract_invoice"},
            "messages": [{
                "role": "user",
                "content": f"Extract invoice data:\n{invoice_text}"
            }]
        }
    })

# Submit batch
batch = client.beta.messages.batches.create(requests=requests)
batch_id = batch.id

# Poll for completion (don't use real-time processing time on this)
import time
while True:
    status = client.beta.messages.batches.retrieve(batch_id)
    if status.processing_status == "ended":
        break
    time.sleep(60)  # Check every minute
```

## Partial Failure Recovery

```python
# Process batch results
results = client.beta.messages.batches.results(batch_id)

successful = []
failed = []

for result in results:
    invoice_id = result.custom_id.replace("invoice-", "")

    if result.result.type == "succeeded":
        extraction = parse_tool_result(result.result.message)
        successful.append({"id": invoice_id, "data": extraction})
    else:
        failed.append({
            "id": invoice_id,
            "custom_id": result.custom_id,
            "error": result.result.error.type
        })

print(f"Succeeded: {len(successful)}, Failed: {len(failed)}")

# Resubmit ONLY failed requests — not the whole batch
if failed:
    retry_requests = [
        req for req in requests
        if req["custom_id"] in {f["custom_id"] for f in failed}
    ]
    retry_batch = client.beta.messages.batches.create(requests=retry_requests)
```

## Key Takeaways

1. **50% cost savings** but NO guaranteed latency — use only for non-urgent work
2. **Never for CI/CD or user-blocking operations** — use real-time API
3. **custom_id is critical** — enables partial failure recovery
4. **Resubmit only failed** — don't resubmit successful requests
5. **Poll for completion** — check status, don't assume

---
id: "d4-t6-1-review-arch"
title: "Multi-Instance Review Architecture — Why Self-Review Fails"
domain: "d4"
taskRef: "T4.6"
order: 16
xp: 35
tag: "⚡ Exam Tested"
duration: "9 min"
analogy: "Proofreading your own writing vs having someone else proofread it. You wrote it — so your brain autocorrects errors as you read. A fresh reader has no such bias. The same applies to Claude: the model that generated code retains context that makes it less likely to question its own decisions."
examTrap: "Thinking that asking Claude to 'review your work carefully' is equivalent to an independent review instance. It's not. The model retains its reasoning context from generation — even if you don't pass the generation conversation. The FIX is a completely separate API call with no shared context."
keyPoints:
  - "Self-review limitation: Claude retains reasoning context from generation, making it less likely to catch its own errors."
  - "Independent review: a fresh Claude API call with NO knowledge of how the code was generated — only the code itself."
  - "The independent reviewer should be explicitly told: 'Evaluate this independently. Do not assume it is correct.'"
  - "Multi-pass review: per-file analysis passes + cross-file integration pass — avoids attention dilution."
  - "Session isolation: the reviewer must NOT receive the generator's conversation history."
antiPatterns:
  - "Asking same session Claude to 'review your own work' — retains reasoning bias"
  - "Passing generation conversation context to the reviewer — defeats independence"
  - "One massive review of all files — attention dilution causes missed issues"
  - "Not telling the reviewer to assume the code might be wrong"
tbChallenge: "Explain to a skeptical engineer why 'just ask Claude to check its work' doesn't produce meaningful review. What specifically is different about the independent instance, and how do you prove it works better?"
---

## Why Self-Review Fails

```python
# Generation session
generation_response = await call_claude(
    messages=[
        {"role": "user", "content": "Implement the authentication middleware"},
        # ... multi-turn generation conversation
    ]
)
generated_code = extract_code(generation_response)

# ❌ Self-review in SAME session — retains reasoning context
self_review = await call_claude(
    messages=[
        {"role": "user", "content": "Implement the authentication middleware"},
        # ... all previous turns ...
        {"role": "assistant", "content": generated_code},
        {"role": "user", "content": "Now review your code for bugs"}
        # Claude remembers WHY it made each decision — less likely to question them
    ]
)

# ✅ Independent review — SEPARATE API CALL, NO generation context
independent_review = await call_claude(
    messages=[
        {
            "role": "user",
            "content": f"""Review this authentication middleware for bugs and security issues.

{generated_code}

Important: Evaluate this independently. Do not assume it is correct.
Assume there may be bugs, security vulnerabilities, or logic errors.
Your job is to find them, not to confirm the code works."""
        }
    ]
    # Note: completely separate call — no generation history
)
```

## Multi-Pass Review for Large Codebases

```python
async def review_codebase(files: list[str]) -> dict:

    # Pass 1: Per-file reviews (parallel — each file gets full attention)
    per_file_reviews = await asyncio.gather(*[
        call_claude(
            system="""Review this file for: bugs, security issues, logic errors.
                      Focus on THIS FILE ONLY — do not consider cross-file issues.""",
            user=read_file(f)
        )
        for f in files
    ])

    # Pass 2: Cross-file integration review
    # Receives: all per-file reviews + relevant interfaces
    cross_file_review = await call_claude(
        system="""You are reviewing cross-file integration.
                  Per-file reviewers have already checked individual file correctness.
                  Focus ONLY on: interface contracts, shared state, dependency issues,
                  and patterns that span multiple files.""",
        user=f"Per-file findings:\n{json.dumps(per_file_reviews)}\n\nKey interfaces:\n..."
    )

    return {"per_file": per_file_reviews, "integration": cross_file_review}
```

## The Confidence Self-Report

```python
# Have reviewers report confidence alongside findings
review_prompt = """
Review this code. For each finding, also report:
- confidence: high | medium | low
- reasoning: why you're flagging this

Return JSON:
{
  "findings": [
    {
      "severity": "HIGH",
      "description": "...",
      "confidence": "high",
      "reasoning": "This is a textbook SQL injection — user input directly in query string"
    },
    {
      "severity": "MEDIUM",
      "description": "...",
      "confidence": "low",
      "reasoning": "This pattern looks unusual but I may not have full context"
    }
  ]
}
"""

# Route based on confidence
def route_finding(finding: dict) -> str:
    if finding["severity"] == "CRITICAL" and finding["confidence"] == "high":
        return "block_merge"
    elif finding["confidence"] == "low":
        return "human_verify"
    else:
        return "standard_review"
```

## Key Takeaways

1. **Self-review is biased** — Claude retains its reasoning context
2. **Independent review = separate API call, no generation context**
3. **Tell the reviewer** to assume the code might be wrong
4. **Multi-pass**: per-file (parallel) then cross-file (sequential)
5. **Confidence self-report** enables intelligent routing of findings

---
id: "d4-t6-2-multi-pass"
title: "Multi-Pass Review — Avoiding Attention Dilution"
domain: "d4"
taskRef: "T4.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Medical specialist consultations vs one generalist. A generalist reviewing 20 test results might miss the interaction between result 7 and result 15. The cardiologist reviews the cardiac results with full attention. The neurologist reviews the neurological results with full attention. Then a synthesizer finds interactions."
examTrap: "Sending all files to one Claude call for review. The attention dilution effect: when reviewing 20 files simultaneously, Claude's effective attention per file is much lower than when reviewing each file individually."
keyPoints:
  - "Attention dilution: reviewing many files simultaneously reduces effective attention per file — missing issues that per-file review catches."
  - "Multi-pass: per-file reviews (parallel, full attention) → cross-file synthesis (sequential, focused on interactions)."
  - "Per-file pass uses full context window for one file — thorough coverage."
  - "Cross-file pass receives structured summaries from per-file reviews — not raw file contents."
  - "Contradictory findings: one file's analysis may contradict another's — cross-file pass identifies these."
antiPatterns:
  - "Sending all files in one context — attention dilution"
  - "No cross-file pass — misses integration issues"
  - "Cross-file pass receiving raw files instead of per-file analysis summaries"
  - "Contradictory findings not resolved — leave users confused about which is correct"
tbChallenge: "You're reviewing a PR with 12 changed files. Design the multi-pass review strategy: what does each pass receive, what does it output, and how are contradictions between per-file findings resolved?"
---

## The Dilution Problem

```python
# ❌ All-in-one: each file gets 1/12 of Claude's attention
review_all_at_once = await call_claude(
    system="Review all these files for bugs and security issues:",
    user="\n\n".join([f"=== {f} ===\n{read_file(f)}" for f in twelve_files])
)
# Issues in file 7 might be missed because context is saturated with files 1-6

# ✅ Multi-pass: each file gets full attention
per_file_reviews = await asyncio.gather(*[
    call_claude(
        system=f"Review {filename} thoroughly for bugs and security issues. Full attention on this file only.",
        user=read_file(filename)
    )
    for filename in twelve_files
])
# Each file reviewed with full context window — no dilution
```

## Cross-File Pass Input

```python
# Cross-file pass receives: structured summaries, not raw files
cross_file_input = {
    "per_file_findings": [
        {
            "file": filename,
            "issues": extract_issues(review),
            "key_interfaces": extract_interfaces(review),
            "assumptions": extract_assumptions(review)
        }
        for filename, review in zip(twelve_files, per_file_reviews)
    ]
}

cross_file_review = await call_claude(
    system="""You are identifying cross-file integration issues.
              Per-file reviewers have already checked individual correctness.
              Focus on: (1) interface contracts that don't match between files,
              (2) assumptions in one file that contradict another file,
              (3) shared state management issues,
              (4) circular dependencies or unexpected coupling.""",
    user=json.dumps(cross_file_input)
)
```

## Resolving Contradictory Findings

```python
# When per-file reviews contradict each other
# File A reviewer: "getUser() always returns null on error"
# File B reviewer: "getUser() throws UserNotFoundException on error"

contradictions = [
    finding for finding in cross_file_findings
    if finding.get("type") == "contradiction"
]

if contradictions:
    # Route to human for resolution
    for c in contradictions:
        create_clarification_request({
            "files_involved": c["files"],
            "contradiction": c["description"],
            "question": "Which behavior is correct? The callers need to be updated."
        })
```

## Key Takeaways

1. **Attention dilution** is real — per-file reviews catch more than all-at-once
2. **Per-file parallel, cross-file sequential** — the canonical multi-pass pattern
3. **Cross-file receives summaries** — not raw files (to avoid dilution in the synthesis step)
4. **Contradictions surface in cross-file pass** — flag them for human resolution
5. **Two-pass is minimum** — per-file + integration; add more passes for critical systems

---
id: "d4-t6-3-confidence-scoring"
title: "Confidence Scoring — Routing Decisions Based on Model Certainty"
domain: "d4"
taskRef: "T4.6"
order: 18
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A doctor's referral system. When a GP is confident, they prescribe and send you home. When they're uncertain, they refer to a specialist. When they're alarmed, they send you to emergency. The routing decision is based on their confidence, not just the diagnosis."
examTrap: "Treating confidence scoring as a binary pass/fail. The exam tests that confidence scoring enables ROUTING — different confidence levels route to different workflows, not just accept/reject."
keyPoints:
  - "Confidence scoring: Claude reports its certainty alongside each finding or extraction."
  - "Three routing tiers: high confidence → auto-process; medium → spot-check; low → human review."
  - "Field-level confidence: different fields in the same extraction can have different confidence levels."
  - "Calibration matters: 80% confidence that turns out to be wrong 60% of the time is miscalibrated."
  - "Stratified sampling validates calibration: sample from each confidence tier and measure actual accuracy."
antiPatterns:
  - "Binary confidence: 'confident' or 'not confident' — loses routing granularity"
  - "Confidence without routing — what does the system do with the confidence score?"
  - "No calibration — assuming self-reported confidence correlates with actual accuracy"
  - "Same human review for all low-confidence extractions — prioritize by field importance"
tbChallenge: "Your extraction system reports field-level confidence. An extraction has: vendor_name (high confidence), invoice_date (high confidence), total_amount (low confidence). What does the routing logic do, and why does it route differently than an all-low-confidence extraction?"
---

## Field-Level Confidence Extraction

```python
extraction_schema = {
    "properties": {
        "vendor_name": {"type": "string"},
        "invoice_date": {"type": "string"},
        "total_amount": {"type": "number"},
        
        # Confidence field alongside each major extraction
        "confidence": {
            "type": "object",
            "properties": {
                "overall": {
                    "type": "string",
                    "enum": ["high", "medium", "low"]
                },
                "fields": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "field":      {"type": "string"},
                            "confidence": {"type": "string",
                                          "enum": ["high", "medium", "low"]},
                            "reason":     {"type": "string"}
                        }
                    },
                    "description": "Only include fields where confidence is NOT high"
                }
            }
        }
    }
}

# Example output:
{
    "vendor_name": "Acme Corp",
    "invoice_date": "2024-01-15",
    "total_amount": 4999.00,
    "confidence": {
        "overall": "medium",
        "fields": [
            {
                "field": "total_amount",
                "confidence": "low",
                "reason": "Document has multiple amounts (subtotal, tax, total) and formatting is unclear"
            }
        ]
    }
}
```

## Routing Logic

```python
def route_extraction(extraction: dict) -> dict:
    """Route based on confidence — not binary accept/reject."""
    confidence = extraction.get("confidence", {})
    overall = confidence.get("overall", "low")
    low_fields = [f for f in confidence.get("fields", [])
                  if f.get("confidence") == "low"]

    # High-value fields that always need human review if low
    critical_fields = {"total_amount", "invoice_number", "payment_due_date"}
    low_critical = [f for f in low_fields if f["field"] in critical_fields]

    if overall == "high" and not low_fields:
        return {"route": "auto_process", "action": "process immediately"}

    if overall == "low" or len(low_critical) > 0:
        return {
            "route": "human_review",
            "priority": "high" if low_critical else "standard",
            "focus_fields": [f["field"] for f in low_critical] or "all",
            "action": "full human verification required"
        }

    return {
        "route": "spot_check",
        "action": "verify specific fields",
        "check_fields": [f["field"] for f in low_fields]
    }
```

## Calibration via Stratified Sampling

```python
def calibrate_confidence(sample_results: list[dict]) -> dict:
    """
    Check if self-reported confidence correlates with actual accuracy.
    Sample each confidence tier and measure actual accuracy.
    """
    tiers = {"high": [], "medium": [], "low": []}

    for result in sample_results:
        tier = result["confidence"]["overall"]
        actually_correct = result["human_verified_correct"]
        tiers[tier].append(actually_correct)

    calibration = {}
    for tier, results in tiers.items():
        if results:
            actual_accuracy = sum(results) / len(results)
            calibration[tier] = {
                "count": len(results),
                "actual_accuracy": actual_accuracy,
                "well_calibrated": (
                    actual_accuracy > 0.9 if tier == "high" else
                    0.7 < actual_accuracy <= 0.9 if tier == "medium" else
                    actual_accuracy <= 0.7
                )
            }

    return calibration

# If high-confidence extractions are only 70% accurate:
# → Recalibrate threshold: what Claude calls "high" is actually "medium"
# → Update routing: treat "high" like "medium" until recalibrated
```

## Key Takeaways

1. **Confidence enables routing** — three tiers with different actions
2. **Field-level confidence** — individual fields can route differently
3. **Critical fields** always get human review if low confidence
4. **Calibrate with stratified sampling** — verify self-reported confidence is accurate
5. **Recalibrate when miscalibrated** — don't trust unchecked self-reports
