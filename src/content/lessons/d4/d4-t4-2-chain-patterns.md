---
id: "d4-t4-2-chain-patterns"
title: "Chain Patterns — Per-File, Reduce, and Verification Chains"
domain: "d4"
taskRef: "T4.4"
order: 11
xp: 25
tag: "Core"
duration: "7 min"
analogy: "A relay race where each runner specializes. The mapper charts the terrain. The implementer follows the map. The inspector checks the result. Specialization at each stage produces better outcomes than one person doing all three."
examTrap: "Using the same Claude session for generation AND verification. The reviewer must be a separate API call with no generation context — otherwise it inherits the generator's reasoning bias and is far less likely to find errors."
keyPoints:
  - "Per-file chain: analyze each file independently in parallel, then synthesize cross-file patterns sequentially."
  - "Reduce chain: each step transforms large input into smaller, refined output for the next step."
  - "Verification chain: generation step → independent review with a SEPARATE API call, no shared context."
  - "Separate verification call explicitly told to assume the code might be wrong."
  - "Step failure isolation: retry failing step only — not the whole chain."
antiPatterns:
  - "Same API session for generation and verification — reviewer inherits generator's bias"
  - "All files in one review call — attention dilution"
  - "No step-level failure isolation — whole chain reruns on one step failure"
  - "Reviewer not told to assume code might be wrong — defaults to confirmation"
tbChallenge: "Design a generation-verification chain for code. Show the generation call, the verification call structure, how they're isolated from each other, and what happens when verification finds a Critical issue."
---

## Per-File Pattern

```python
async def analyze_codebase(files: list[str]) -> dict:
    # Phase 1: per-file, parallel, full attention each
    per_file = await asyncio.gather(*[
        call_claude(
            system="Review THIS FILE ONLY. Return JSON: {issues, interfaces, assumptions}",
            user=read_file(f)
        )
        for f in files
    ])

    # Phase 2: cross-file synthesis, sequential, receives summaries not raw files
    synthesis = await call_claude(
        system="""Find ONLY cross-file issues:
                  - interface contract mismatches
                  - contradictory assumptions
                  - circular dependencies""",
        user=json.dumps(per_file)  # Structured summaries — no raw files
    )

    return {"per_file": per_file, "integration": synthesis}
```

## Verification Chain

```python
async def generate_and_verify(task: str) -> dict:
    # Step 1: Generate
    code = await call_claude(
        messages=[{"role": "user", "content": f"Implement: {task}"}]
    )

    # Step 2: Verify — SEPARATE CALL, NO GENERATION CONTEXT
    review = await call_claude(
        messages=[{
            "role": "user",
            "content": f"""Review this code for bugs and security issues.

Task:
{task}

Code:
{code}

Do NOT assume this code is correct.
Assume there may be bugs, vulnerabilities, or logic errors.
Your job is to find them.

Return: {{findings: [{{severity, description, fix}}], verdict: approved|needs_changes}}"""
        }]
        # No generation messages — fresh context
    )

    findings = parse_findings(review)
    if any(f["severity"] == "CRITICAL" for f in findings):
        return {"status": "failed_review", "findings": findings, "code": code}

    return {"status": "approved", "code": code}
```

## Reduce Chain

```python
# Each step reduces large input to smaller, refined output
async def research_reduce_chain(raw_sources: list[str]) -> str:
    # Step 1: Summarize each source (parallel)
    summaries = await asyncio.gather(*[
        call_claude(system="Summarize key facts. Max 200 words.", user=s)
        for s in raw_sources
    ])

    # Step 2: Combine summaries (sequential, needs all)
    combined = await call_claude(
        system="Synthesize these summaries into one coherent brief.",
        user="\n\n".join(summaries)
    )

    # Step 3: Distill to final output (sequential, needs combined)
    final = await call_claude(
        system="Distill to 5 key actionable insights.",
        user=combined
    )

    return final
```

## Key Takeaways

1. **Per-file parallel, cross-file sequential** — canonical analysis pattern
2. **Verification = separate API call** with no generation context
3. **Tell reviewer to assume code might be wrong** — prevents confirmation bias
4. **Retry at step level** — not the whole chain
5. **Reduce chain** — each step outputs smaller, more refined content for the next
