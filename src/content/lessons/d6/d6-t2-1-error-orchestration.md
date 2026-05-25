---
id: "d6-t2-1-error-orchestration"
title: "D1 + D5: Error Propagation Through Multi-Agent Orchestration"
domain: "d6"
taskRef: "T6.2"
order: 3
xp: 45
tag: "⚡ Exam Tested"
duration: "9 min"
analogy: "A supply chain disruption. A factory failure (subagent error) must propagate up through the distributor (coordinator) to the retailer (final output) in a structured way. A factory that secretly ships empty boxes (silent failure) causes problems the retailer can't anticipate. A factory that sends a structured shortage notice allows the distributor to source elsewhere."
examTrap: "Treating D1 error recovery and D5 error propagation as the same topic. D1 focuses on loop control and coordinator recovery decisions. D5 focuses on how structured error context travels through the system. The exam tests that you understand both layers and their interaction."
keyPoints:
  - "D1's coordinator receives error: decides retry, fallback, or graceful degrade (D1 recovery decision)."
  - "D5's structured error context: the error must carry enough information for the coordinator to make that decision."
  - "Without D5 structured errors, D1 coordinator makes uninformed recovery decisions — or can't decide at all."
  - "Error context must survive multi-hop propagation: subagent → coordinator → final synthesis."
  - "The synthesis step must know which data is missing (D5 partial failure) to produce calibrated confidence (D5 confidence scoring)."
antiPatterns:
  - "Subagent returns empty dict on failure — coordinator makes uninformed recovery decision"
  - "Coordinator makes recovery decisions without knowing error category — treats all failures as retryable"
  - "Synthesis treats partial results as complete — overconfident final output"
  - "Error context lost between subagent and coordinator — coordinator starts from scratch"
tbChallenge: "A coordinator spawns 5 research subagents. Subagent 3 fails with a permission error (non-retryable). Walk through the complete D1+D5 interaction: what D5 structure does subagent 3 return, what D1 decision does the coordinator make, and how does D5 confidence appear in the final synthesis?"
---

## The D1+D5 Error Flow

```
Subagent 3 (D5 structured error)
    │
    │ Returns: SubagentResult(
    │   status="failed",
    │   error_category="permission",
    │   is_retryable=False,
    │   task_description="Research regulatory landscape for EU market"
    │ )
    │
    ▼
Coordinator (D1 recovery decision)
    │
    │ Receives structured error → categorizes as permanent failure
    │ Decision: do NOT retry (is_retryable=False)
    │ Decision: continue with 4/5 successful results
    │ Decision: flag missing area in synthesis prompt
    │
    ▼
Synthesis (D5 confidence + partial failure)
    │
    │ Synthesis prompt:
    │ "4 of 5 research tasks succeeded.
    │  MISSING: EU regulatory landscape (permission denied to EU data sources)
    │  Do NOT speculate about EU regulations.
    │  Note this gap in the report's Data Limitations section."
    │
    ▼
Final Report
    Contains: "EU regulatory information not available for this report
              due to data access limitations. [Data Limitations]"
    Confidence: "medium" (not "high" — known data gap)
```

## Implementation

```python
async def multi_agent_with_d1_d5(tasks: list) -> dict:
    
    # D1: Spawn all subagents
    results = await asyncio.gather(*[
        run_subagent_with_d5_errors(task) for task in tasks
    ])
    
    # D1 + D5: Classify results using D5 error structure
    successful  = [r for r in results if r.status == "success"]
    retryable   = [r for r in results if r.status == "failed" and r.is_retryable]
    permanent   = [r for r in results if r.status == "failed" and not r.is_retryable]
    
    # D1: Retry transient failures (using D5 is_retryable flag)
    if retryable:
        retry_results = await asyncio.gather(*[
            run_subagent_with_d5_errors({"id": r.task_id, "prompt": r.task_description})
            for r in retryable
        ])
        successful.extend([r for r in retry_results if r.status == "success"])
        permanent.extend([r for r in retry_results if r.status == "failed"])
    
    # D5: Build synthesis prompt with accurate partial failure information
    synthesis_context = f"""
RESEARCH SYNTHESIS

AVAILABLE DATA ({len(successful)}/{len(tasks)} sources):
{format_successful_results(successful)}

MISSING DATA ({len(permanent)} tasks permanently failed):
{chr(10).join(f"- {r.task_description}: {r.error_message}" for r in permanent)}

INSTRUCTIONS:
- Synthesize from available data
- Explicitly note missing areas
- Set confidence to 'medium' (not 'high') due to data gaps
- Do NOT speculate about missing areas
"""
    
    synthesis = await call_claude(synthesis_context)
    
    # D5: Calculate overall confidence based on data completeness
    data_completeness = len(successful) / len(tasks)
    overall_confidence = (
        "high"   if data_completeness >= 0.90 else
        "medium" if data_completeness >= 0.70 else
        "low"
    )
    
    return {
        "synthesis":    synthesis,
        "confidence":   overall_confidence,
        "data_coverage": f"{len(successful)}/{len(tasks)} tasks",
        "permanent_failures": [r.task_description for r in permanent]
    }
```

## Key Takeaways

1. **D5 structured errors enable D1 recovery decisions** — without structure, coordinator guesses
2. **is_retryable from D5** drives D1 retry logic — permanent failures don't get retried
3. **D5 partial failure labeling** ensures synthesis knows what's missing
4. **Data completeness drives D5 confidence** — partial data = medium confidence, not high
5. **Error context survives propagation** — subagent error information reaches synthesis step
