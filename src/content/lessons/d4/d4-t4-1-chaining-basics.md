---
id: "d4-t4-1-chaining-basics"
title: "Prompt Chaining — Multi-Step Reasoning Workflows"
domain: "d4"
taskRef: "T4.4"
order: 10
xp: 30
tag: "Core"
duration: "8 min"
analogy: "An assembly line where each station adds value based on what the previous station produced. You can't do quality inspection before assembly, and you can't assemble before the parts arrive. Each step is a Claude call that genuinely depends on the previous step's output."
examTrap: "Chaining steps that are actually independent. Independent steps waste latency when chained — they should be parallelized. The exam tests that you can distinguish genuine sequential dependency from artificial serialization."
keyPoints:
  - "Chain when each step genuinely depends on the previous step's output — there is a real data dependency."
  - "Parallelize when steps are independent — running them in sequence wastes time."
  - "Structured handoffs: each step outputs structured data the next step can reliably parse."
  - "Breaking complex single prompts into chains improves reliability — each step is simpler and more focused."
  - "Chain output must be designed for the next step's input — not just for human readability."
antiPatterns:
  - "Chaining independent steps — doubles or triples latency unnecessarily"
  - "Passing full previous output to next step without extracting relevant parts"
  - "Unstructured prose handoffs — next step must parse what it receives"
  - "No error handling between steps — a step 2 failure fails the whole pipeline silently"
tbChallenge: "You're building a legal document analyzer: (1) extract key clauses, (2) identify risk clauses, (3) score overall risk, (4) draft recommendations. Which steps chain, which can parallelize? Draw the execution graph."
---

## Chain vs Parallelize Decision

```
Step 2a: Liability risk analysis  ─┐
                                    ├─ PARALLEL (both need step 1, not each other)
Step 2b: Termination risk analysis ─┘

Step 1: Extract all clauses   → feeds both 2a and 2b
Step 3: Overall risk score    → needs BOTH 2a and 2b → CHAIN after parallel
Step 4: Recommendations       → needs step 3 → CHAIN
```

## The Chain Pattern

```python
async def analyze_legal_document(doc: str) -> dict:

    # Step 1: Extract (sequential — everything depends on this)
    clauses = await call_claude(
        system="Extract all clauses. Return structured JSON with liability and termination arrays.",
        user=doc,
        tool=clause_extraction_schema,
        tool_choice="forced"
    )

    # Steps 2a + 2b: Both need step 1, not each other → PARALLELIZE
    liability_risk, termination_risk = await asyncio.gather(
        call_claude(
            system="Analyze liability clauses for risk. Return: {risk_level, findings}",
            user=json.dumps(clauses["liability_clauses"])
        ),
        call_claude(
            system="Analyze termination clauses for risk. Return: {risk_level, findings}",
            user=json.dumps(clauses["termination_clauses"])
        )
    )

    # Step 3: Overall risk → needs BOTH → CHAIN
    risk_score = await call_claude(
        system="Score overall contract risk 1-10 with justification.",
        user=f"Liability findings:\n{liability_risk}\n\nTermination findings:\n{termination_risk}"
    )

    # Step 4: Recommendations → needs step 3 → CHAIN
    recommendations = await call_claude(
        system="Draft negotiation recommendations based on risk analysis.",
        user=f"Risk score: {risk_score['score']}/10\n\nKey concerns:\n{risk_score['justification']}"
    )

    return {
        "clauses": clauses,
        "risk_score": risk_score,
        "recommendations": recommendations
    }
```

## Structured Handoffs

```python
# ❌ Prose handoff — step 2 must parse unstructured text
step1_output = "The contract has several concerning liability clauses, particularly..."

# ✅ Structured handoff — step 2 receives clean JSON
step1_output = {
    "liability_clauses": [
        {"type": "cap", "text": "...", "concerns": ["unusually low cap"]}
    ],
    "termination_clauses": [...]
}
```

## Key Takeaways

1. **Chain for genuine dependency** — step B truly needs step A's output
2. **Parallelize independent steps** — even inside a chain where possible
3. **Structured handoffs** — JSON not prose between steps
4. **Error handling per step** — know which step failed and why
5. **Each step simpler = more reliable** — focus on one thing per call

---
id: "d4-t4-2-chain-patterns"
title: "Chain Patterns — Per-File, Reduce, and Verification Chains"
domain: "d4"
taskRef: "T4.4"
order: 11
xp: 25
tag: "Core"
duration: "7 min"
analogy: "A relay race where each runner specializes. The first runner maps the terrain (exploration). The second carries the baton through the discovered route (implementation). The third inspects the result (verification). Specialization at each stage produces better outcomes than one runner doing all three."
examTrap: "Using the same Claude session for both generation and verification. The verification chain requires a SEPARATE API call with no shared context — otherwise the reviewer inherits the generator's reasoning bias."
keyPoints:
  - "Per-file chain: analyze each file independently (parallel), synthesize cross-file patterns (sequential)."
  - "Reduce chain: each step processes large input into smaller, more refined output for the next step."
  - "Verification chain: generation step → independent review with SEPARATE API call and no generation context."
  - "Step failure isolation: log which step failed, retry that step only, don't restart the whole chain."
  - "Max 5 sequential steps before quality validation checkpoint — error compounds across steps."
antiPatterns:
  - "Same session for generation and verification — reviewer retains generator's reasoning"
  - "No step failure isolation — chain fails opaquely"
  - "All-at-once instead of per-file — attention dilution"
  - "Chain deeper than 5 without quality checkpoint — accumulated error"
tbChallenge: "Design a verification chain for code generation. Show: the generation call, the verification call, how they're isolated, and what happens if the verification finds critical issues."
---

## Per-File Pattern (canonical for codebase analysis)

```python
async def review_codebase(files: list[str]) -> dict:
    # Phase 1: Per-file (parallel — files are independent)
    file_reviews = await asyncio.gather(*[
        call_claude(
            system="Review THIS FILE ONLY. Full attention on this file. Return JSON findings.",
            user=read_file(f)
        )
        for f in files
    ])

    # Phase 2: Cross-file synthesis (sequential — needs all phase 1 results)
    synthesis = await call_claude(
        system="""Find cross-file issues ONLY:
                  - Interface contract mismatches
                  - Shared state problems
                  - Circular dependencies""",
        user=json.dumps(file_reviews)  # Structured summaries, not raw files
    )

    return {"per_file": file_reviews, "integration": synthesis}
```

## Verification Chain (separate API call)

```python
async def generate_with_verification(task: str) -> dict:

    # STEP 1: Generate
    generated = await call_claude(
        messages=[{"role": "user", "content": f"Implement: {task}"}]
    )

    # STEP 2: Verify — COMPLETELY SEPARATE CALL
    # No messages from the generation session
    verification = await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Review this implementation for bugs and security issues.

Implementation:
{generated}

Task it was supposed to implement:
{task}

CRITICAL: Do not assume this code is correct.
Assume there may be bugs, security vulnerabilities, or logic errors.
Your job is to find them."""
        }]
        # NOTE: No generation history passed here — reviewer starts fresh
    )

    findings = parse_findings(verification)
    if any(f["severity"] == "CRITICAL" for f in findings):
        return {"status": "failed_review", "findings": findings}

    return {"status": "approved", "code": generated, "review": verification}
```

## Step Failure Isolation

```python
async def run_chain_with_isolation(steps: list, initial_input) -> dict:
    results = {}
    current = initial_input

    for step in steps:
        for attempt in range(3):  # Retry transient failures
            try:
                result = await step.fn(current)
                results[step.name] = {"status": "success", "output": result}
                current = result
                break
            except TransientError:
                if attempt == 2:
                    return {
                        "status": "failed",
                        "failed_at_step": step.name,
                        "completed": results
                    }
                await asyncio.sleep(2 ** attempt)
            except Exception as e:
                return {
                    "status": "failed",
                    "failed_at_step": step.name,
                    "error": str(e),
                    "completed": results
                }

    return {"status": "success", "results": results}
```

## Key Takeaways

1. **Per-file parallel, cross-file sequential** — canonical analysis pattern
2. **Verification = separate API call** with no generation context
3. **Tell reviewer to assume code might be wrong** — prevents implicit approval
4. **Retry at step level** — not the whole chain
5. **Log which step failed** — enables targeted debugging

---
id: "d4-t4-3-chain-reliability"
title: "Chain Reliability — Validation Gates Between Steps"
domain: "d4"
taskRef: "T4.4"
order: 12
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Quality control at each station on an assembly line. Finding a defect at station 3 is cheap. Finding the same defect after 7 more stations of work is expensive. Validate at each step — don't wait for the end."
examTrap: "Validating only at the end of a chain. Early validation is cheaper and prevents error propagation — a bad step 2 output that passes unvalidated makes step 3 produce a confidently wrong result."
keyPoints:
  - "Validate step output BEFORE passing to next step — catch errors early."
  - "Schema validation catches format errors. Quality validation catches semantic errors. Both are needed."
  - "A lightweight evaluator Claude call between heavy steps catches quality issues cheaply."
  - "Retry the failing step before propagating failure — transient issues resolve on retry."
  - "Low confidence outputs should route to human review rather than continuing the chain."
antiPatterns:
  - "No validation between steps — semantic errors compound silently"
  - "Validating format only — wrong values pass schema validation"
  - "No retry on step failure — full chain reruns when one step fails transiently"
  - "Propagating low-confidence output — amplifying uncertainty through subsequent steps"
tbChallenge: "Step 2 of your chain extracts key facts from a contract. Step 3 uses those facts to score legal risk. What do you validate between steps 2 and 3, and what happens if confidence is low?"
---

## Validation Between Steps

```python
async def validated_chain(document: str) -> dict:

    # Step 1: Extract
    extraction = await extract_clauses(document)

    # ── GATE 1: Format + completeness ──────────────────────
    format_ok = validate_schema(extraction, required_fields=["liability", "termination"])
    if not format_ok["valid"]:
        extraction = await extract_clauses(document, retry_context=format_ok["errors"])

    # ── GATE 2: Quality check (lightweight evaluator) ──────
    quality = await call_claude(
        model="claude-haiku-4-5-20251001",  # cheap model for quick check
        system="Rate extraction quality: high | medium | low. Return only the word.",
        user=json.dumps(extraction)
    )

    if quality.strip() == "low":
        return {"status": "needs_review", "step": "extraction", "output": extraction}

    # ── GATE 3: Confidence check ────────────────────────────
    if extraction.get("confidence", {}).get("overall") == "low":
        return {"status": "needs_review", "step": "extraction", "reason": "low confidence"}

    # Step 2: Risk scoring (only proceeds if extraction passed all gates)
    risk = await score_risk(extraction)

    return {"status": "success", "extraction": extraction, "risk": risk}
```

## Lightweight Evaluator Pattern

```python
# Use cheap model to evaluate expensive step output
# Cost: ~$0.001 per evaluation
# Saves: re-running expensive step with bad input

async def evaluate_extraction_quality(extraction: dict) -> str:
    response = await call_claude(
        model="claude-haiku-4-5-20251001",
        system="""Evaluate extraction quality. Return ONLY one word: high | medium | low

high: all key fields populated, specific and verifiable
medium: most fields populated, minor gaps
low: vague, missing critical fields, or contradictory""",
        user=json.dumps(extraction)
    )
    return response.strip().lower()
```

## Key Takeaways

1. **Validate at each step** — format gate + quality gate + confidence gate
2. **Lightweight evaluator** between heavy steps — cheap insurance
3. **Retry the failing step** before propagating failure
4. **Low confidence → human review**, not next step
5. **Early validation is always cheaper** than late detection
