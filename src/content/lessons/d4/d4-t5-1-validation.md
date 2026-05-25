---
id: "d4-t5-1-validation"
title: "Output Validation — Two Layers, Specific Feedback, Retry Logic"
domain: "d4"
taskRef: "T4.5"
order: 13
xp: 30
tag: "Core"
duration: "8 min"
analogy: "A bank's multi-layer transaction validation. Layer 1: format check (is this a valid transaction structure?). Layer 2: business rule check (does the customer have sufficient funds?). Each layer catches different error types — neither alone is sufficient."
examTrap: "Thinking JSON schema validation is sufficient for production quality. Schema catches syntax errors. Business rule validation catches semantic errors — values that are syntactically valid but factually wrong. Both layers are required."
keyPoints:
  - "Layer 1: Schema/syntax validation — catches wrong types, missing required fields, invalid enum values."
  - "Layer 2: Semantic/business rule validation — catches wrong values that pass the schema."
  - "Retry-with-error-feedback: original document + failed output + SPECIFIC errors → retry prompt."
  - "Retry works for format errors. It does NOT work when source document lacks the information — that produces fabrication."
  - "Cap retries at 2-3 before routing to human review — unlimited retries waste cost."
antiPatterns:
  - "Schema validation only — misses semantic errors"
  - "Retrying when source document doesn't contain the information — leads to fabrication"
  - "Vague retry feedback: 'invalid output' — Claude can't fix this"
  - "Unlimited retries — cost explodes on consistently bad documents"
tbChallenge: "Your extractor returns {total_amount: '$4,999.00'} when schema requires a number. Write the complete retry prompt — all three required components — and explain why each component is necessary."
---

## Two Validation Layers

```python
class TwoLayerValidator:

    def validate_syntax(self, output: dict) -> dict:
        """Layer 1: Schema/syntax — wrong types, missing fields"""
        errors = []
        if not isinstance(output.get("total_amount"), (int, float)):
            errors.append({
                "field": "total_amount",
                "error": "Must be a decimal number in dollars",
                "got": repr(output.get("total_amount")),
                "expected_example": 4999.00
            })
        if not isinstance(output.get("line_items"), list):
            errors.append({
                "field": "line_items",
                "error": "Must be an array",
                "got": type(output.get("line_items")).__name__
            })
        return {"valid": not errors, "errors": errors}

    def validate_semantics(self, output: dict, source: str) -> dict:
        """Layer 2: Business rules — valid types but wrong values"""
        errors = []

        # Cross-check: vendor name must appear in source document
        vendor = output.get("vendor_name", "")
        if vendor and vendor.lower() not in source.lower():
            errors.append({
                "field": "vendor_name",
                "error": f"'{vendor}' not found in source document",
                "likely_cause": "May have extracted wrong entity"
            })

        # Cross-check: line item totals must match invoice total
        if output.get("line_items"):
            line_sum = sum(i.get("total", 0) for i in output["line_items"])
            total = output.get("total_amount", 0)
            if abs(line_sum - total) > 0.02:
                errors.append({
                    "field": "total_amount",
                    "error": f"Line items sum {line_sum:.2f} ≠ total {total:.2f}",
                    "hint": "Check for tax or discount not captured in line items"
                })

        return {"valid": not errors, "errors": errors}
```

## The Complete Retry Prompt

```python
def build_retry_prompt(document: str, failed_output: dict, errors: list) -> str:
    """Three required components: document + failed output + specific errors."""
    error_text = "\n".join(
        f"• {e['field']}: {e['error']}"
        + (f"\n  Got: {e.get('got')}" if "got" in e else "")
        + (f"\n  Expected: {e.get('expected_example')}" if "expected_example" in e else "")
        for e in errors
    )

    return f"""Previous extraction failed validation. Fix the specific errors below.

ORIGINAL DOCUMENT:
{document}

YOUR PREVIOUS (INCORRECT) EXTRACTION:
{json.dumps(failed_output, indent=2)}

ERRORS TO FIX:
{error_text}

Re-extract fixing only these errors. Do not change fields that were correct.
If a value is not in the document, return null — do not invent values."""
```

## When NOT to Retry

```python
def should_retry(error: dict) -> bool:
    """Format errors: retryable. Missing data: not retryable (would fabricate)."""
    not_retryable_phrases = [
        "not found in source",
        "not in the document",
        "document does not contain",
        "absent from"
    ]
    return not any(p in error.get("error", "").lower() for p in not_retryable_phrases)
```

## Key Takeaways

1. **Layer 1: syntax** (types, fields), **Layer 2: semantics** (values, cross-checks)
2. **Retry prompt needs all three**: document + failed output + specific errors
3. **Specific errors** — field name + what you got + what's expected
4. **Never retry missing-data errors** — would produce fabrication
5. **Cap at 2-3 retries** — escalate to human review after

---
id: "d4-t5-2-retry-patterns"
title: "Retry Patterns — Effective Error Recovery for Extraction Pipelines"
domain: "d4"
taskRef: "T4.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A proofreader marking up a draft. They don't say 'this is wrong' — they mark each specific error with the correction needed. The author addresses each marked issue precisely. Claude's retry loop works the same way: marked errors → targeted corrections."
examTrap: "Retrying with the original prompt unchanged. An unchanged prompt produces an identical wrong output. The retry must include: original document, failed output, AND specific error descriptions — all three."
keyPoints:
  - "Three required retry components: original document, failed output, specific errors."
  - "Without the failed output: Claude doesn't know what it got wrong."
  - "Without specific errors: Claude doesn't know what to fix."
  - "Without the original document: Claude can't re-extract correctly."
  - "Error specificity: field name + current value + expected format."
antiPatterns:
  - "Retrying with only the original prompt — same input → same wrong output"
  - "Only sending errors without the failed output — Claude doesn't know what changed"
  - "Vague errors: 'date format invalid' vs 'invoice_date must be YYYY-MM-DD, got January 15 2024'"
  - "Retrying non-retryable errors (missing data) — fabrication results"
tbChallenge: "Your extractor returned invoice_date as 'Jan 15, 2024' instead of '2024-01-15'. Write the retry prompt with all three required components. Make the error description specific enough that Claude knows exactly what to change."
---

## The Anatomy of a Good Retry

```python
# What must be in the retry prompt:

retry_prompt = f"""
[COMPONENT 1: WHY WE'RE RETRYING]
Your previous extraction had validation errors. Please fix the specific issues below.

[COMPONENT 2: ORIGINAL DOCUMENT — so Claude can re-extract]
ORIGINAL DOCUMENT:
{original_document}

[COMPONENT 3: WHAT CLAUDE GOT — so it knows what to change]
YOUR PREVIOUS EXTRACTION (INCORRECT):
{json.dumps(failed_output, indent=2)}

[COMPONENT 4: WHAT'S WRONG — specific, field-level, with examples]
ERRORS TO FIX:
• invoice_date: Must be ISO format YYYY-MM-DD
  Got: "Jan 15, 2024"
  Expected: "2024-01-15"

• total_amount: Must be a decimal number, not a string with currency symbol
  Got: "$4,999.00"
  Expected: 4999.00

[INSTRUCTION]
Fix only the listed errors. Do not modify fields that were correct.
If a value is not in the document, return null — do not invent values.
"""
```

## Specific vs Vague Error Messages

```python
# ❌ Vague — Claude doesn't know what to change
{"field": "invoice_date", "error": "Invalid format"}

# ✅ Specific — Claude knows exactly what to do
{
    "field":    "invoice_date",
    "error":    "Must be ISO format YYYY-MM-DD",
    "got":      "Jan 15, 2024",
    "expected": "2024-01-15",
    "hint":     "Convert the written-out month name to a two-digit number"
}
```

## Retry Decision Flow

```python
async def extract_with_retry(document: str, max_retries: int = 2) -> dict:
    last_output, last_errors = None, None

    for attempt in range(max_retries + 1):
        output = await extract(document, retry_context=(last_output, last_errors))
        syntax_ok = validate_syntax(output)

        if not syntax_ok["valid"]:
            retryable = [e for e in syntax_ok["errors"] if should_retry(e)]
            if retryable and attempt < max_retries:
                last_output, last_errors = output, retryable
                continue
            return {"status": "needs_review", "output": output}

        semantic_ok = validate_semantics(output, document)
        if not semantic_ok["valid"]:
            retryable = [e for e in semantic_ok["errors"] if should_retry(e)]
            if retryable and attempt < max_retries:
                last_output, last_errors = output, retryable
                continue
            return {"status": "needs_review", "output": output}

        return {"status": "success", "output": output, "attempts": attempt + 1}

    return {"status": "needs_review", "output": last_output, "reason": "max_retries"}
```

## Key Takeaways

1. **All three components** in retry: document + failed output + specific errors
2. **Specific errors** — field + got + expected + hint
3. **Retry only retryable errors** — not missing-data errors
4. **Cap retries** — 2-3 max, then human review
5. **"Do not change correct fields"** — targeted correction

---
id: "d4-t5-3-batch-processing"
title: "Batch Processing — Message Batches API for High-Volume Extraction"
domain: "d4"
taskRef: "T4.5"
order: 15
xp: 30
tag: "⚡ Exam Tested"
duration: "7 min"
analogy: "Overnight cloud photo processing vs in-store same-day printing. Cloud batch is 50% cheaper and you can submit thousands at once — but you get results the next morning. In-store costs more but you get results in an hour. The Batch API is the overnight option."
examTrap: "Using Batch API for anything with a latency requirement. Batch API has NO guaranteed SLA — up to 24 hours. Using it for pre-merge checks, real-time features, or blocking workflows is an architectural error the exam specifically tests."
keyPoints:
  - "Batch API: 50% cost reduction. Up to 24-hour processing. No latency SLA whatsoever."
  - "Use for: nightly batch jobs, backfills, cost optimization on non-urgent large volumes."
  - "Never use for: CI/CD pipeline checks, user-blocking features, real-time requirements."
  - "custom_id correlates your requests with responses — essential for partial failure recovery."
  - "Partial failure: resubmit only failed requests by custom_id — not the entire batch."
antiPatterns:
  - "Batch API for pre-merge CI/CD checks — pipeline waits up to 24 hours"
  - "No custom_id — can't identify which requests succeeded or failed"
  - "Resubmitting entire batch on partial failure — wastes 50% cost saving"
  - "No status polling — assuming synchronous completion"
tbChallenge: "You have 50,000 invoices to process overnight. Some will fail validation. Design the complete Batch API strategy: request structure, custom_id scheme, polling, and partial failure recovery."
---

## Batch API vs Real-Time: The Decision

```
Has a latency requirement?          → Real-time API
User is waiting for result?         → Real-time API
CI/CD pipeline check?               → Real-time API
Results needed within the hour?     → Real-time API

Non-urgent processing (overnight OK)?    → Batch API
Cost is a primary concern?               → Batch API
Volume > 1,000 requests per job?         → Consider Batch API
```

## Complete Batch Workflow

```python
import anthropic, time, json

client = anthropic.Anthropic()

# 1. Prepare requests with custom_ids
def build_batch_requests(invoices: dict) -> list:
    return [
        {
            "custom_id": f"inv-{inv_id}",   # YOUR correlation key
            "params": {
                "model":      "claude-sonnet-4-6",
                "max_tokens": 2048,
                "tools":       [invoice_extraction_tool],
                "tool_choice": {"type": "tool", "name": "extract_invoice"},
                "messages": [{
                    "role": "user",
                    "content": f"Extract invoice data:\n{inv_text}"
                }]
            }
        }
        for inv_id, inv_text in invoices.items()
    ]

# 2. Submit
requests = build_batch_requests(invoices)
batch = client.beta.messages.batches.create(requests=requests)
batch_id = batch.id
print(f"Submitted batch {batch_id} with {len(requests)} requests")

# 3. Poll for completion
while True:
    status = client.beta.messages.batches.retrieve(batch_id)
    if status.processing_status == "ended":
        break
    print(f"Processing... {status.request_counts}")
    time.sleep(60)  # Poll every minute

# 4. Process results and identify failures
successful, failed = [], []
for result in client.beta.messages.batches.results(batch_id):
    inv_id = result.custom_id.replace("inv-", "")
    if result.result.type == "succeeded":
        extraction = parse_tool_result(result.result.message)
        successful.append({"id": inv_id, "data": extraction})
    else:
        failed.append({"id": inv_id, "custom_id": result.custom_id,
                        "error": result.result.error.type})

# 5. Resubmit ONLY failed requests
if failed:
    failed_ids = {f["custom_id"] for f in failed}
    retry_requests = [r for r in requests if r["custom_id"] in failed_ids]
    retry_batch = client.beta.messages.batches.create(requests=retry_requests)
    print(f"Resubmitting {len(retry_requests)} failed requests as {retry_batch.id}")
```

## Key Takeaways

1. **50% cheaper, up to 24h** — non-urgent work only
2. **Never for latency-sensitive workflows** — CI/CD, user-blocking
3. **custom_id is essential** — enables partial failure recovery
4. **Resubmit only failures** — don't resubmit successful requests
5. **Poll for completion** — Batch API is asynchronous

---
id: "d4-t6-1-review-arch"
title: "Multi-Instance Review Architecture — Why Self-Review Fails"
domain: "d4"
taskRef: "T4.6"
order: 16
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "Proofreading your own writing. You wrote it — your brain autocorrects as you read. You see what you intended, not what's there. A fresh reader has no such bias. Claude reviewing its own code has the same blind spot: it retains the reasoning context from generation."
examTrap: "Thinking 'ask Claude to review carefully' is equivalent to independent review. It's not. The model retains its reasoning from generation regardless of how you phrase the review request. The fix is a completely separate API call with no generation context whatsoever."
keyPoints:
  - "Self-review limitation: Claude retains reasoning context from generation — biased toward validating its own decisions."
  - "Independent review: fresh Claude API call with NO knowledge of how the code was generated."
  - "Tell the reviewer explicitly: 'Do not assume this code is correct. Your job is to find errors.'"
  - "Multi-pass: per-file reviews (parallel, full attention) → cross-file integration (sequential)."
  - "Confidence self-reporting alongside findings enables routing decisions."
antiPatterns:
  - "Same session for generation and review — reviewer inherits generator's reasoning"
  - "Passing generation conversation context to reviewer — same effect as same session"
  - "One massive review of all files — attention dilution misses issues"
  - "Reviewer not told to assume code might be wrong — defaults to confirmation mode"
tbChallenge: "Explain to a skeptical colleague why the same Claude instance reviewing its own code is biased. What specifically is different about an independent instance, and how would you measure whether it catches more bugs?"
---

## Why Self-Review Fails

```python
# THE PROBLEM: Same session retains reasoning context

# Generation session
response = await call_claude(
    messages=[
        {"role": "user", "content": "Implement auth middleware"},
        # ... multi-turn generation conversation
        # Claude built a mental model of WHY each decision was made
    ]
)

# ❌ Self-review in SAME session
review = await call_claude(
    messages=[
        # ... all previous generation turns ...
        {"role": "assistant", "content": generated_code},
        {"role": "user", "content": "Review your code for bugs"}
        # Claude still has context explaining why each decision was "correct"
        # Much less likely to question those decisions
    ]
)
```

## The Independent Review Call

```python
# ✅ Independent review: SEPARATE API CALL, no generation history

async def independent_review(code: str, task_description: str) -> dict:
    response = await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Review this implementation for bugs, security issues, and correctness.

Task the code was meant to implement:
{task_description}

Code to review:
{code}

IMPORTANT: Do NOT assume this code is correct.
Assume there may be bugs, security vulnerabilities, or logic errors.
Your job is to find them — not to confirm the code works.

Return: {{findings: [{{severity, description, line, fix}}], overall_verdict: approved|needs_changes}}"""
        }]
        # NOTE: No generation messages included — completely fresh context
    )
    return parse_findings(response)
```

## Multi-Pass Architecture

```python
async def review_pr(changed_files: list[str]) -> dict:

    # Pass 1: Per-file (parallel — full attention per file)
    per_file = await asyncio.gather(*[
        independent_review(
            code=read_file(f),
            task_description=f"File: {f}"
        )
        for f in changed_files
    ])

    # Pass 2: Cross-file integration (sequential — needs all per-file results)
    integration = await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Review cross-file integration issues ONLY.
Per-file reviews have already checked individual correctness.
Focus on: interface mismatches, shared state bugs, circular dependencies.

Per-file findings:
{json.dumps(per_file)}"""
        }]
    )

    return {"per_file": per_file, "integration": integration}
```

## Confidence Self-Report for Routing

```python
review_schema = {
    "findings": [...],
    "confidence": {
        "overall": "high|medium|low",
        "uncertain_findings": [
            {"finding_index": 0, "reason": "Context missing — may be intentional"}
        ]
    }
}

# Route uncertain findings to human verification
def route_finding(finding: dict, uncertainty: list) -> str:
    uncertain_indices = {u["finding_index"] for u in uncertainty}
    if finding["severity"] == "CRITICAL" and finding["index"] not in uncertain_indices:
        return "block_merge"
    elif finding["index"] in uncertain_indices:
        return "human_verify"
    return "standard_review"
```

## Key Takeaways

1. **Self-review is biased** — generation context remains in session
2. **Independent review = separate API call, zero generation history**
3. **Explicitly tell reviewer** to assume code might be wrong
4. **Per-file parallel, cross-file sequential** — multi-pass prevents dilution
5. **Confidence reporting** enables intelligent finding routing

---
id: "d4-t6-2-multi-pass"
title: "Multi-Pass Review — Preventing Attention Dilution"
domain: "d4"
taskRef: "T4.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Medical specialist consultations vs one overworked generalist. The cardiologist reviews cardiac results with full attention. The neurologist reviews neurological results with full attention. A generalist reviewing all 20 test results simultaneously misses the interaction between result 7 and result 15."
examTrap: "Sending all changed files in one context to one Claude call. Attention dilution: reviewing 20 files simultaneously produces lower effective attention per file than reviewing each file individually."
keyPoints:
  - "Attention dilution: reviewing many files at once reduces effective attention per file — issues get missed."
  - "Multi-pass: per-file reviews run in parallel (full attention per file), cross-file synthesis runs sequentially."
  - "Cross-file pass receives structured summaries from per-file reviews — not raw file contents."
  - "Contradictory findings between files are surfaced in the cross-file pass for human resolution."
  - "Per-file context window usage: one file = full context window. Twenty files = 1/20th effective attention."
antiPatterns:
  - "All files in one context — attention dilution"
  - "No cross-file pass — misses integration issues"
  - "Cross-file pass receiving raw file contents — re-introduces dilution"
  - "Contradictions left unresolved — leaves developers confused about which is correct"
tbChallenge: "PR has 15 changed files. Per-file review of file_auth.ts says 'getUser() returns null on error'. Per-file review of file_orders.ts says 'getUser() throws UserNotFoundException'. How does the cross-file pass surface and handle this contradiction?"
---

## The Dilution Problem in Numbers

```
20 files, all-in-one context: ~200,000 tokens
Per file, attention allocation: ~10,000 tokens effective per file
Issues in file 14: compete with context from files 1-13

20 files, per-file reviews: 20 separate calls
Per file, attention allocation: FULL context window per file
Issues in file 14: receive full attention, not diluted by others
```

## Multi-Pass Implementation

```python
async def multi_pass_review(files: list[str]) -> dict:

    # PASS 1: Per-file (parallel — full attention each)
    per_file_reviews = await asyncio.gather(*[
        call_claude(
            messages=[{
                "role": "user",
                "content": f"""Review {filename} thoroughly.
Focus ONLY on this file — do not consider other files.

{read_file(filename)}

Return JSON:
{{
  "file": "{filename}",
  "issues": [...],
  "key_interfaces": ["function signatures, types exported"],
  "assumptions": ["what this file assumes about other code"]
}}"""
            }]
        )
        for filename in files
    ])

    # PASS 2: Cross-file synthesis (sequential — needs all pass 1 results)
    cross_file = await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Find cross-file integration issues ONLY.
Per-file reviewers have already checked individual correctness.

Focus on:
1. Interface contract mismatches (A declares X, B expects Y)
2. Shared state inconsistencies
3. Contradictory assumptions between files

Per-file summaries:
{json.dumps(per_file_reviews, indent=2)}

Return: {{contradictions: [...], integration_issues: [...]}}"""
        }]
    )

    # Surface contradictions for human resolution
    contradictions = parse_contradictions(cross_file)
    return {
        "per_file": per_file_reviews,
        "integration": cross_file,
        "needs_human_resolution": contradictions
    }
```

## Resolving Contradictions

```python
# The cross-file pass finds:
# file_auth.ts assumes getUser() returns null on error
# file_orders.ts assumes getUser() throws UserNotFoundException

contradiction = {
    "type": "interface_contract_mismatch",
    "function": "getUser()",
    "files": ["file_auth.ts", "file_orders.ts"],
    "conflict": {
        "file_auth.ts":   "Handles null return — assumes returns null on error",
        "file_orders.ts": "Catches UserNotFoundException — assumes throws on error"
    },
    "human_question": "Which behavior is correct? file_auth.ts or file_orders.ts must be updated."
}
```

## Key Takeaways

1. **Attention dilution is real** — per-file reviews catch more
2. **Parallel per-file, sequential cross-file** — the pattern
3. **Cross-file receives summaries**, not raw files
4. **Contradictions surface in cross-file pass** — route to human
5. **Two passes minimum** — per-file + integration

---
id: "d4-t6-3-confidence-scoring"
title: "Confidence Scoring — Routing Decisions Based on Model Certainty"
domain: "d4"
taskRef: "T4.6"
order: 18
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A doctor's referral system. Confident diagnosis → prescribe and discharge. Uncertain → refer to specialist. Alarmed → send to emergency. The routing decision is based on confidence, not just the finding. The patient doesn't wait while the doctor mulls over everything."
examTrap: "Treating confidence scoring as binary accept/reject. The exam tests that confidence enables ROUTING — high confidence auto-processes, medium spot-checks, low routes to human — not just pass/fail."
keyPoints:
  - "Confidence scoring: Claude self-reports certainty alongside each finding or extraction."
  - "Three routing tiers: high → auto-process, medium → spot-check sample, low → human review."
  - "Field-level confidence: individual fields in one extraction can have different confidence levels."
  - "Calibration: measure whether self-reported confidence correlates with actual accuracy via stratified sampling."
  - "Recalibrate routing thresholds when calibration shows miscalibration."
antiPatterns:
  - "Binary confidence (confident/not) — loses routing granularity"
  - "No routing logic — what does the system do with the confidence score?"
  - "Uncalibrated confidence — assuming self-reported confidence is accurate without measuring"
  - "Same human review process for all low-confidence fields — critical fields need faster escalation"
tbChallenge: "An extraction reports: vendor_name (high confidence), invoice_date (high confidence), total_amount (low confidence). What does the routing logic do — and how is this different from an all-low-confidence extraction?"
---

## Field-Level Confidence Schema

```python
extraction_schema_with_confidence = {
    "properties": {
        "vendor_name":   {"type": "string"},
        "invoice_date":  {"type": "string"},
        "total_amount":  {"type": "number"},

        "confidence": {
            "type": "object",
            "properties": {
                "overall": {
                    "type": "string",
                    "enum": ["high", "medium", "low"]
                },
                "low_confidence_fields": {
                    "type": "array",
                    "description": "Fields where Claude is uncertain. Empty array if all high confidence.",
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
    }
}

# Example output:
{
    "vendor_name":  "Acme Corp",
    "invoice_date": "2024-01-15",
    "total_amount": 4999.00,
    "confidence": {
        "overall": "medium",
        "low_confidence_fields": [
            {
                "field": "total_amount",
                "reason": "Document has multiple amount figures; unclear which is the final total"
            }
        ]
    }
}
```

## Routing Logic

```python
# Critical financial fields that always escalate on low confidence
CRITICAL_FIELDS = {"total_amount", "invoice_number", "due_date", "vendor_name"}

def route(extraction: dict) -> dict:
    conf = extraction.get("confidence", {})
    overall = conf.get("overall", "low")
    low_fields = conf.get("low_confidence_fields", [])
    low_critical = [f for f in low_fields if f["field"] in CRITICAL_FIELDS]

    if overall == "high" and not low_fields:
        return {"route": "auto_process"}

    if low_critical:
        return {
            "route": "human_review",
            "priority": "high",  # Critical field uncertain → prioritize
            "focus": [f["field"] for f in low_critical]
        }

    if overall == "low" or len(low_fields) > 2:
        return {"route": "human_review", "priority": "standard"}

    # medium overall, few non-critical low-confidence fields
    return {
        "route": "spot_check",
        "check_fields": [f["field"] for f in low_fields]
    }
```

## Calibration via Stratified Sampling

```python
def calibrate(sample_results: list[dict]) -> dict:
    """Measure whether confidence tiers match actual accuracy."""
    tiers = {"high": [], "medium": [], "low": []}
    for r in sample_results:
        tier = r["confidence"]["overall"]
        tiers[tier].append(r["human_verified_correct"])

    calibration = {}
    for tier, results in tiers.items():
        if results:
            accuracy = sum(results) / len(results)
            calibration[tier] = {
                "n": len(results),
                "accuracy": accuracy,
                "well_calibrated": accuracy > 0.9 if tier == "high"
                    else 0.7 < accuracy <= 0.9 if tier == "medium"
                    else accuracy <= 0.7
            }

    return calibration

# If high-confidence is only 72% accurate:
# → Claude's "high" is actually "medium"
# → Update routing: treat "high" as "medium" until recalibrated
```

## Key Takeaways

1. **Confidence enables routing** — three tiers, three different actions
2. **Field-level confidence** — individual fields can route differently
3. **Critical fields** — always escalate to human review when uncertain
4. **Calibrate** — verify self-reported confidence matches actual accuracy
5. **Recalibrate thresholds** when miscalibration is detected
