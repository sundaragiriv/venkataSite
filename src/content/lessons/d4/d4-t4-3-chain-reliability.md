---
id: "d4-t4-3-chain-reliability"
title: "Chain Reliability — Validation Gates Between Steps"
domain: "d4"
taskRef: "T4.4"
order: 12
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Quality gates on an assembly line. Finding a defect at station 3 costs 10 minutes. Finding the same defect at station 8 costs 10 minutes plus all the downstream work since station 3. Validate at each step — catching errors early is always cheaper."
examTrap: "Validating only at the end of the chain. A bad step 2 output that passes undetected causes step 3 to produce a confidently wrong result — compounding the error."
keyPoints:
  - "Validate step output BEFORE passing to next step — format check AND quality check."
  - "Lightweight evaluator Claude call between heavy steps: cheap quality assessment before expensive next step."
  - "Retry the failing step before propagating failure — transient issues resolve on retry."
  - "Low confidence outputs route to human review rather than continuing the chain."
  - "Quality gates catch semantic errors that schema validation misses."
antiPatterns:
  - "No validation between steps — errors compound silently"
  - "Format validation only — wrong-but-valid values continue unchecked"
  - "No retry on step failure — full chain reruns on transient failures"
  - "Propagating low-confidence output — amplifies uncertainty downstream"
tbChallenge: "Step 2 extracts key facts from a contract. Step 3 uses those facts to calculate risk scores. What validation do you put between steps 2 and 3? What happens if confidence is 'low' on a critical field?"
---

## Validation Gate Pattern

```python
async def validated_chain(document: str) -> dict:

    # Step 1: Extract
    extraction = await extract_clauses(document)

    # ── GATE 1: Schema validation ─────────────────────────
    schema_ok = validate_schema(extraction, required=["liability", "termination", "parties"])
    if not schema_ok["valid"]:
        # Retry with specific errors
        extraction = await extract_clauses(document, retry_errors=schema_ok["errors"])
        if not validate_schema(extraction, required=["liability", "termination", "parties"])["valid"]:
            return {"status": "needs_review", "failed_at": "extraction_schema"}

    # ── GATE 2: Lightweight quality evaluator ────────────
    quality = await call_claude(
        model="claude-haiku-4-5-20251001",  # cheap model
        system="Rate extraction quality: high | medium | low. Return only the word.",
        user=json.dumps(extraction)
    )
    if quality.strip() == "low":
        return {"status": "needs_review", "failed_at": "extraction_quality", "output": extraction}

    # ── GATE 3: Confidence check ─────────────────────────
    conf = extraction.get("confidence", {})
    if conf.get("overall") == "low":
        return {"status": "needs_review", "failed_at": "extraction_confidence", "output": extraction}

    # All gates passed — proceed to step 2
    risk = await score_risk(extraction)
    return {"status": "success", "extraction": extraction, "risk": risk}
```

## The Lightweight Evaluator

```python
# Cost: ~$0.001 per evaluation on Haiku
# Value: prevents running expensive next step on bad input

async def assess_quality(step_output: dict, context: str) -> str:
    """Quick quality assessment before expensive next step."""
    return (await call_claude(
        model="claude-haiku-4-5-20251001",
        system=f"""You are evaluating output quality for: {context}
Return ONLY one word: high | medium | low

high: complete, specific, all required fields present
medium: mostly complete, minor gaps
low: vague, incomplete, contradictory, or missing critical fields""",
        user=json.dumps(step_output)
    )).strip().lower()
```

## Key Takeaways

1. **Three gates per step**: schema → quality → confidence
2. **Lightweight evaluator** (Haiku) before heavy next step (Sonnet)
3. **Retry at step level** — transient failures before propagating
4. **Low confidence on critical fields → human review**, not next step
5. **Early validation is always cheaper** than late detection

---
id: "d4-t5-2-retry-patterns"
title: "Retry Patterns — Effective Error Recovery"
domain: "d4"
taskRef: "T4.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A proofreader marking up a draft with specific corrections. Not 'this is wrong' — but red marks on each specific error with notes on what's correct. The author addresses each mark precisely. Claude's retry needs the same specificity."
examTrap: "Retrying with the original prompt unchanged — produces the same wrong output. The retry prompt must include all three: original document, previous failed output, and specific errors."
keyPoints:
  - "Retry prompt three required parts: original document + failed output + specific errors."
  - "Without failed output: Claude doesn't know what to change."
  - "Without specific errors: Claude doesn't know what's wrong."
  - "Error format: field name + current value + expected value/format."
  - "Never retry when source document lacks the information — produces fabrication."
antiPatterns:
  - "Retry with only original prompt — identical wrong output"
  - "Vague error messages: 'date invalid' vs 'invoice_date must be YYYY-MM-DD, got Jan 15 2024'"
  - "Retrying source-document-missing errors — fabrication results"
  - "Unlimited retries — cap at 2-3 before human review"
tbChallenge: "Write the complete retry prompt for this failure: extractor returned invoice_date='January 15, 2024' and total_amount='$4,999.00'. Show all three components."
---

## The Three-Component Retry Prompt

```python
def build_retry_prompt(document: str, failed_output: dict, errors: list) -> str:
    error_text = "\n".join([
        f"• {e['field']}: {e['error']}"
        + (f"\n  Got: {e['got']}" if 'got' in e else "")
        + (f"\n  Expected: {e['expected']}" if 'expected' in e else "")
        for e in errors
    ])

    return f"""Your previous extraction had validation errors. Fix the specific issues below.

ORIGINAL DOCUMENT:
{document}

YOUR PREVIOUS (INCORRECT) EXTRACTION:
{json.dumps(failed_output, indent=2)}

ERRORS TO FIX:
{error_text}

Fix only these errors. Do not change correct fields.
If a value is not in the document, return null — do not invent values."""

# Example errors for the teach-back scenario:
errors = [
    {
        "field":    "invoice_date",
        "error":    "Must be ISO format YYYY-MM-DD",
        "got":      "January 15, 2024",
        "expected": "2024-01-15"
    },
    {
        "field":    "total_amount",
        "error":    "Must be a decimal number in dollars, not a string with currency symbol",
        "got":      "$4,999.00",
        "expected": 4999.00
    }
]
```

## Retry Decision

```python
NOT_RETRYABLE = ["not found in source", "not in the document", "absent from", "document does not contain"]

def should_retry(error: dict) -> bool:
    return not any(p in error.get("error", "").lower() for p in NOT_RETRYABLE)

async def extract_with_retry(document: str, max_retries: int = 2) -> dict:
    last_output, last_errors = None, None
    for attempt in range(max_retries + 1):
        output = await extract(document, last_output, last_errors)
        validation = validate(output, document)
        if validation["valid"]:
            return {"status": "success", "output": output}
        retryable = [e for e in validation["errors"] if should_retry(e)]
        if retryable and attempt < max_retries:
            last_output, last_errors = output, retryable
        else:
            return {"status": "needs_review", "output": output}
    return {"status": "needs_review", "output": last_output}
```

## Key Takeaways

1. **Three components**: document + failed output + specific errors — all required
2. **Field + got + expected** in every error
3. **Never retry missing-data errors** — fabrication
4. **Cap retries at 2-3** — escalate after
5. **"Do not change correct fields"** — targeted correction

---
id: "d4-t5-3-batch-processing"
title: "Batch Processing — Message Batches API"
domain: "d4"
taskRef: "T4.5"
order: 15
xp: 30
tag: "⚡ Exam Tested"
duration: "7 min"
analogy: "Overnight cloud processing vs same-day in-store printing. Overnight is 50% cheaper and handles thousands at once — but you get results the next morning. The Batch API is the overnight option: cheaper, scalable, not for anything urgent."
examTrap: "Using Batch API for anything with a latency requirement. No guaranteed SLA — up to 24 hours. Using it for CI/CD checks, user-blocking workflows, or real-time features is an architectural error. The exam specifically tests this distinction."
keyPoints:
  - "Batch API: 50% cost reduction. Up to 24-hour processing. NO latency SLA."
  - "Use for: nightly batch jobs, non-urgent large volumes, cost-sensitive backfills."
  - "Never use for: CI/CD pipeline checks, user-blocking features, real-time needs."
  - "custom_id field correlates your requests with responses — required for partial failure recovery."
  - "Partial failure: resubmit ONLY failed requests by custom_id — not the whole batch."
antiPatterns:
  - "Batch API for pre-merge CI/CD — pipeline may wait 24 hours"
  - "No custom_id — can't identify which requests failed"
  - "Resubmitting entire batch on partial failure — wastes the 50% saving"
  - "Assuming synchronous completion — must poll for status"
tbChallenge: "You have 10,000 invoices to process. Some will fail schema validation after extraction. Design the complete Batch API strategy: structure, polling, partial failure handling."
---

## Batch vs Real-Time Decision

```python
def choose_api(request: dict) -> str:
    if request.get("user_is_waiting"):         return "real_time"
    if request.get("is_ci_cd_check"):          return "real_time"
    if request.get("latency_sla_minutes"):     return "real_time"
    if request.get("non_urgent_batch_job"):    return "batch_api"
    if request.get("volume", 0) > 5000:        return "consider_batch"
    return "real_time"  # default to real-time when uncertain
```

## Complete Batch Workflow

```python
import anthropic, time

client = anthropic.Anthropic()

# 1. Build requests with custom_ids
requests = [
    {
        "custom_id": f"inv-{inv_id}",  # YOUR correlation key
        "params": {
            "model":      "claude-sonnet-4-6",
            "max_tokens": 2048,
            "tools":       [invoice_extraction_tool],
            "tool_choice": {"type": "tool", "name": "extract_invoice"},
            "messages": [{"role": "user", "content": f"Extract: {text}"}]
        }
    }
    for inv_id, text in invoices.items()
]

# 2. Submit
batch = client.beta.messages.batches.create(requests=requests)
batch_id = batch.id

# 3. Poll
while True:
    status = client.beta.messages.batches.retrieve(batch_id)
    if status.processing_status == "ended":
        break
    time.sleep(60)

# 4. Process results
succeeded, failed = [], []
for result in client.beta.messages.batches.results(batch_id):
    inv_id = result.custom_id.replace("inv-", "")
    if result.result.type == "succeeded":
        succeeded.append({"id": inv_id, "data": parse_tool_result(result.result.message)})
    else:
        failed.append({"id": inv_id, "custom_id": result.custom_id})

# 5. Resubmit ONLY failed (not the whole batch)
if failed:
    failed_ids = {f["custom_id"] for f in failed}
    retry = [r for r in requests if r["custom_id"] in failed_ids]
    client.beta.messages.batches.create(requests=retry)
```

## Key Takeaways

1. **50% cheaper, up to 24h** — non-urgent work only
2. **Never for latency-sensitive work** — CI/CD, user-blocking
3. **custom_id is non-negotiable** — partial failure recovery
4. **Resubmit only failed requests** — don't resubmit successes
5. **Poll for completion** — asynchronous, not synchronous

---
id: "d4-t6-1-review-arch"
title: "Multi-Instance Review — Why Self-Review Fails"
domain: "d4"
taskRef: "T4.6"
order: 16
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "Proofreading your own writing. Your brain autocorrects as you read — you see what you intended, not what's there. A fresh reader has no such bias. Claude reviewing its own code has the same problem: it retains the reasoning context from generation."
examTrap: "Thinking 'ask Claude to review carefully' equals independent review. It does not. The model retains its generation reasoning regardless of how you phrase the review request. The fix is a completely separate API call with no shared context."
keyPoints:
  - "Self-review fails: Claude retains reasoning context from generation — biased toward validating its own decisions."
  - "Independent review: fresh API call with NO knowledge of how the code was generated."
  - "Tell the reviewer explicitly: 'Do not assume this code is correct. Find errors.'"
  - "Multi-pass: per-file reviews (parallel) → cross-file integration (sequential)."
  - "Confidence self-reporting alongside findings enables routing to human review."
antiPatterns:
  - "Same session for generation and review — reviewer inherits generator's reasoning"
  - "Passing generation conversation history to reviewer — same effect"
  - "One massive review of all files — attention dilution"
  - "Not telling reviewer to assume code might be wrong"
tbChallenge: "A colleague says: 'I just ask Claude to double-check its code before submitting. Works fine.' What's actually happening in that session, and why does it produce worse results than an independent instance?"
---

## Why Self-Review Fails

```python
# Generation session builds reasoning context:
# "I used a for loop here because X"
# "I skipped error handling because Y"
# "This pattern is correct because Z"

# ❌ Self-review in same session
generation_messages = [
    {"role": "user", "content": "Implement auth middleware"},
    {"role": "assistant", "content": "Here's the first draft..."},
    # ... multiple turns, Claude builds justification for each decision ...
    {"role": "assistant", "content": final_code},
]

review_in_same_session = generation_messages + [
    {"role": "user", "content": "Review your code for bugs"}
    # Claude's reasoning: "I know WHY I made each decision, they were correct"
    # Result: confirms its own decisions rather than questioning them
]
```

## The Independent Review Call

```python
# ✅ Separate API call — zero generation context

async def independent_review(code: str, task: str) -> dict:
    return await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Review this code for bugs and security issues.

Task it implements:
{task}

Code:
{code}

CRITICAL: Do NOT assume this code is correct.
Your job is to find bugs, vulnerabilities, and logic errors — not confirm correctness.

Return JSON: {{findings: [{{severity, description, line, fix}}], verdict: approved|needs_changes}}"""
        }]
        # No generation messages — fresh context, no inherited reasoning
    )
```

## Multi-Pass Architecture

```python
async def full_pr_review(files: list[str]) -> dict:
    # Pass 1: per-file, parallel, full attention per file
    per_file = await asyncio.gather(*[
        independent_review(read_file(f), f"File: {f}")
        for f in files
    ])

    # Pass 2: cross-file integration, sequential
    integration = await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Find cross-file integration issues ONLY.
Per-file reviewers already checked individual correctness.
Focus on: interface mismatches, shared state bugs, contradictions between files.

Per-file findings:
{json.dumps(per_file)}"""
        }]
    )

    return {"per_file": per_file, "integration": integration}
```

## Key Takeaways

1. **Self-review is biased** — generation context persists in session
2. **Independent review = separate API call, no generation history**
3. **Tell reviewer to assume code might be wrong** — prevents confirmation
4. **Per-file parallel, cross-file sequential** — multi-pass
5. **Confidence alongside findings** enables human review routing

---
id: "d4-t6-2-multi-pass"
title: "Multi-Pass Review — Preventing Attention Dilution"
domain: "d4"
taskRef: "T4.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Medical specialists vs one generalist reviewing 20 lab results. The cardiologist reviews cardiac results with full attention. The neurologist reviews neurological results with full attention. A generalist reviewing all 20 simultaneously misses interaction effects."
examTrap: "Sending all changed files to one Claude call. Attention dilution: with 20 files in one context, each file gets 1/20th of effective attention — issues that per-file review catches get missed."
keyPoints:
  - "Attention dilution: more files in one context = less effective attention per file."
  - "Multi-pass: per-file reviews run in parallel (full attention), cross-file synthesis runs sequentially."
  - "Cross-file pass receives structured per-file summaries — not raw file contents."
  - "Contradictions between per-file findings surfaced in cross-file pass for human resolution."
  - "Per-file context: one file = full context window. Fifteen files = ~1/15th effective attention."
antiPatterns:
  - "All files in one context — attention dilution"
  - "No cross-file pass — misses integration issues"
  - "Cross-file pass receiving raw files — re-introduces dilution at synthesis stage"
  - "Contradictions left unresolved — developers get conflicting guidance"
tbChallenge: "Per-file review of auth.ts says getUser() returns null on error. Per-file review of orders.ts says getUser() throws UserNotFoundException. How does your cross-file pass detect this and what does it output?"
---

## The Numbers

```
15 files, all-in-one review call:
  Total context: ~150k tokens
  Effective attention per file: ~10k tokens
  File 13 competes with context from files 1-12

15 files, per-file reviews (parallel):
  Context per call: full context window
  Effective attention per file: full
  File 13 reviewed with complete focus
```

## Multi-Pass Implementation

```python
async def multi_pass_review(files: list[str]) -> dict:

    # Pass 1: per-file, parallel, full context window each
    per_file = await asyncio.gather(*[
        call_claude(messages=[{
            "role": "user",
            "content": f"""Review {f} thoroughly. Focus ONLY on this file.

{read_file(f)}

Return JSON: {{
  "file": "{f}",
  "issues": [...],
  "interfaces": ["exported functions/types with their signatures"],
  "assumptions": ["what this file assumes about other code"]
}}"""
        }])
        for f in files
    ])

    # Pass 2: cross-file, sequential, receives summaries
    cross_file = await call_claude(messages=[{
        "role": "user",
        "content": f"""Find cross-file integration issues ONLY.
Per-file reviewers checked individual correctness.
Focus on: interface mismatches, contradictory assumptions, shared state bugs.

Per-file summaries:
{json.dumps(per_file)}

Return: {{
  "contradictions": [
    {{"function": "...", "file_a": "...", "says": "...", "file_b": "...", "says": "..."}}
  ],
  "integration_issues": [...]
}}"""
    }])

    contradictions = parse_contradictions(cross_file)
    return {
        "per_file": per_file,
        "integration": cross_file,
        "needs_human_resolution": contradictions
    }
```

## Contradiction Example Output

```json
{
  "contradictions": [
    {
      "function": "getUser()",
      "file_a": "auth.ts",
      "file_a_says": "returns null on error",
      "file_b": "orders.ts",
      "file_b_says": "throws UserNotFoundException on error",
      "human_question": "Which behavior is correct? The other file's call site must be updated."
    }
  ]
}
```

## Key Takeaways

1. **Attention dilution is real** — per-file reviews catch more issues
2. **Parallel per-file, sequential cross-file** — the pattern
3. **Cross-file receives summaries**, not raw files
4. **Contradictions surfaced** — route to human for resolution
5. **Two passes minimum** — individual correctness + integration

---
id: "d4-t6-3-confidence-scoring"
title: "Confidence Scoring — Routing Based on Model Certainty"
domain: "d4"
taskRef: "T4.6"
order: 18
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A doctor's referral system. Confident diagnosis → prescribe and discharge. Uncertain → specialist referral. Alarmed → emergency. Routing based on confidence level means the right resource handles the right cases — not every case going to the most expensive resource."
examTrap: "Treating confidence as binary accept/reject. The exam tests that confidence scoring enables tiered ROUTING — different confidence levels trigger different workflows, not just yes/no."
keyPoints:
  - "Three routing tiers: high confidence → auto-process, medium → spot-check, low → human review."
  - "Field-level confidence: individual fields in one extraction can route differently."
  - "Critical fields always escalate to human review when low confidence — regardless of overall score."
  - "Calibration: measure whether self-reported confidence correlates with actual accuracy."
  - "Recalibrate when miscalibration detected — 'high' that's only 72% accurate is actually 'medium'."
antiPatterns:
  - "Binary confidence — confident or not confident loses routing granularity"
  - "No routing logic — confidence score collected but never used"
  - "Uncalibrated confidence — assuming self-reports are accurate without measuring"
  - "Same human review priority for all low-confidence — critical fields need faster escalation"
tbChallenge: "Extraction reports: vendor_name (high), invoice_date (high), total_amount (low). What does routing do? How is this different from all-fields-low? Why does field-level confidence matter more than just overall?"
---

## Field-Level Confidence Schema

```python
{
    "vendor_name":  "Acme Corp",
    "invoice_date": "2024-01-15",
    "total_amount": 4999.00,
    "confidence": {
        "overall": "medium",
        "low_confidence_fields": [
            {
                "field":  "total_amount",
                "reason": "Multiple amount figures on invoice; unclear which is final total"
            }
        ]
    }
}
```

## Routing Logic

```python
CRITICAL_FIELDS = {"total_amount", "invoice_number", "vendor_name", "due_date"}

def route(extraction: dict) -> dict:
    conf = extraction.get("confidence", {})
    overall = conf.get("overall", "low")
    low_fields = conf.get("low_confidence_fields", [])
    low_critical = [f for f in low_fields if f["field"] in CRITICAL_FIELDS]

    # High confidence, no uncertain fields
    if overall == "high" and not low_fields:
        return {"route": "auto_process"}

    # Critical field uncertain — highest priority human review
    if low_critical:
        return {
            "route": "human_review",
            "priority": "high",
            "focus_fields": [f["field"] for f in low_critical],
            "reason": "Critical financial field has low confidence"
        }

    # Overall low or too many uncertain fields
    if overall == "low" or len(low_fields) > 2:
        return {"route": "human_review", "priority": "standard"}

    # Medium overall, few non-critical uncertain fields
    return {
        "route": "spot_check",
        "check_fields": [f["field"] for f in low_fields]
    }

# For the teach-back scenario:
# vendor_name (high), invoice_date (high), total_amount (low + critical)
# → human_review, priority=high, focus=["total_amount"]
# NOT the same as all-low: that routes to standard human review
# Critical field uncertainty always escalates to high-priority
```

## Calibration

```python
def calibrate(sample: list[dict]) -> dict:
    tiers = {"high": [], "medium": [], "low": []}
    for r in sample:
        tiers[r["confidence"]["overall"]].append(r["human_verified_correct"])

    result = {}
    for tier, vals in tiers.items():
        if vals:
            acc = sum(vals) / len(vals)
            result[tier] = {
                "accuracy": f"{acc:.0%}",
                "well_calibrated": (acc > 0.90 if tier == "high"
                    else 0.70 < acc <= 0.90 if tier == "medium"
                    else acc <= 0.70)
            }
    return result

# If "high" confidence is only 72% accurate:
# → Claude's "high" is actually "medium"
# → Adjust routing: treat "high" as "medium" until recalibrated
```

## Key Takeaways

1. **Confidence enables routing** — three tiers, three actions
2. **Field-level confidence** — individual fields can route differently
3. **Critical fields always escalate** when uncertain
4. **Calibrate** — measure self-reported confidence against actual accuracy
5. **Recalibrate thresholds** when miscalibration detected
