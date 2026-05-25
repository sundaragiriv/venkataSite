---
id: "d4-t6-2-multi-pass"
title: "Multi-Pass Review — Preventing Attention Dilution"
domain: "d4"
taskRef: "T4.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Medical specialists vs one generalist reviewing 20 lab results. The cardiologist reviews cardiac results with full attention. The neurologist reviews neurological results with full attention. A generalist reviewing all 20 simultaneously misses the interaction between result 7 and result 15."
examTrap: "Sending all changed files to one Claude call. With 15 files in one context, each file gets roughly 1/15th of effective attention — issues that per-file review catches get missed in the noise."
keyPoints:
  - "Attention dilution: reviewing many files at once reduces effective attention per file."
  - "Multi-pass: per-file reviews (parallel, full attention per file) → cross-file synthesis (sequential)."
  - "Cross-file pass receives structured per-file summaries — NOT raw file contents."
  - "Contradictions between per-file findings surfaced and routed to human resolution."
  - "Two passes minimum — per-file correctness + cross-file integration."
antiPatterns:
  - "All files in one review call — attention dilution misses issues"
  - "No cross-file pass — integration issues go undetected"
  - "Cross-file pass receiving raw files — re-introduces dilution at synthesis stage"
  - "Contradictions left unresolved — developers get conflicting guidance"
tbChallenge: "Per-file review says auth.ts assumes getUser() returns null on error. Per-file review says orders.ts assumes getUser() throws UserNotFoundException. How does your cross-file pass detect and report this contradiction?"
---

## Attention Dilution in Numbers

```
15 files in one call:
  Context: ~150k tokens total
  Effective per file: ~10k tokens
  File 13 competes with context from files 1-12

15 files, per-file (parallel):
  Context per call: full window
  Effective per file: FULL attention
  File 13: complete focus, no dilution
```

## Multi-Pass Implementation

```python
async def multi_pass_review(files: list[str]) -> dict:

    # Pass 1: per-file, parallel
    per_file = await asyncio.gather(*[
        call_claude(messages=[{
            "role": "user",
            "content": f"""Review {f} thoroughly. Focus ONLY on this file.

{read_file(f)}

Return JSON: {{
  "file": "{f}",
  "issues": [{{severity, description, line, fix}}],
  "interfaces": ["exported functions with signatures"],
  "assumptions": ["what this file assumes about external code"]
}}"""
        }])
        for f in files
    ])

    # Pass 2: cross-file synthesis, sequential, summaries not raw files
    cross_file = await call_claude(messages=[{
        "role": "user",
        "content": f"""Find cross-file integration issues ONLY.
Per-file reviewers already checked individual correctness.
Focus on: interface mismatches, contradictory assumptions, shared state bugs.

Per-file summaries:
{json.dumps(per_file)}

Return: {{
  "contradictions": [
    {{"function": "...", "file_a": "...", "file_a_says": "...",
      "file_b": "...", "file_b_says": "...", "human_question": "..."}}
  ],
  "integration_issues": [...]
}}"""
    }])

    return {
        "per_file": per_file,
        "integration": cross_file,
        "needs_human_resolution": extract_contradictions(cross_file)
    }
```

## Key Takeaways

1. **Attention dilution is real** — per-file catches more issues
2. **Parallel per-file, sequential cross-file** — the canonical pattern
3. **Cross-file receives summaries**, not raw files — prevents re-dilution
4. **Contradictions surfaced** — route to human for resolution
5. **Two passes minimum** — individual + integration
