---
id: "d6-t2-2-reliability-design"
title: "D1 + D5: Designing Reliable Multi-Agent Systems"
domain: "d6"
taskRef: "T6.2"
order: 4
xp: 40
tag: "Core"
duration: "8 min"
analogy: "Designing a hospital's emergency response system. D1 is the organizational structure: who coordinates, who does what, how decisions escalate. D5 is the quality assurance layer: error detection, confidence in diagnoses, human oversight triggers. Neither alone makes the system reliable — together they do."
examTrap: "Thinking reliability comes from either D1 (better loop design) or D5 (better error handling) alone. The exam tests that production reliability requires both: correct orchestration AND robust error handling and confidence tracking."
keyPoints:
  - "Reliability design principle: assume failures, design for partial success, communicate confidence accurately."
  - "D1 provides: correct loop termination, multi-agent coordination, human-in-the-loop for scope changes."
  - "D5 provides: structured error propagation, confidence scoring, stratified sampling for quality validation."
  - "The combination: D1 orchestrates the work, D5 validates and communicates the quality of that work."
  - "Production checklist: loop terminates correctly (D1) + errors propagate structured (D5) + confidence is calibrated (D5) + human review is triggered appropriately (D1+D5)."
antiPatterns:
  - "Loop correctness without error structure — correct control flow with undiagnosed failures"
  - "Error structure without loop coordination — errors detected but not acted on"
  - "Confidence scoring without routing — confidence calculated but never used for decisions"
  - "Human review triggers without clear handoff — human reviewer lacks context"
tbChallenge: "Design the reliability checklist for a production multi-agent customer support system. What D1 components must be in place? What D5 components? What happens when they work together vs when either is missing?"
---

## The Reliability Design Checklist

### D1 Components (Orchestration)

```python
D1_RELIABILITY_CHECKLIST = {
    "loop_termination": {
        "requirement": "Loop terminates on stop_reason, not text parsing",
        "test": "Verify stop_reason == 'end_turn' triggers return",
        "failure_mode": "Infinite loop or premature termination"
    },
    "tool_use_handling": {
        "requirement": "All tool_use blocks processed, results batched in one turn",
        "test": "Verify multi-tool responses handled correctly",
        "failure_mode": "Missing tool calls, invalid conversation history"
    },
    "error_recovery": {
        "requirement": "Coordinator makes informed retry/fallback decisions",
        "test": "Simulate transient and permanent failures, verify different behaviors",
        "failure_mode": "Retrying permanent failures, not retrying transient failures"
    },
    "human_handoff": {
        "requirement": "Clear escalation for scope changes, irreversible actions, low confidence",
        "test": "Verify escalation triggers fire with complete context",
        "failure_mode": "Agent exceeds scope, or reviewer lacks decision context"
    },
    "state_persistence": {
        "requirement": "Checkpoint after each significant operation",
        "test": "Kill agent mid-run, verify it resumes correctly",
        "failure_mode": "Lost progress on failure, duplicate work on resume"
    }
}
```

### D5 Components (Reliability Assurance)

```python
D5_RELIABILITY_CHECKLIST = {
    "structured_errors": {
        "requirement": "All tool failures return {error_category, is_retryable, message}",
        "test": "Simulate each error type, verify structured response",
        "failure_mode": "Coordinator makes uninformed recovery decisions"
    },
    "confidence_scoring": {
        "requirement": "Extractions include field-level confidence",
        "test": "Verify confidence routes to appropriate tier",
        "failure_mode": "Low-confidence results auto-processed, errors reach customers"
    },
    "calibration": {
        "requirement": "Stratified sampling validates confidence accuracy",
        "test": "Verify sample results match expected confidence accuracy",
        "failure_mode": "Miscalibrated confidence — high-confidence results are wrong"
    },
    "partial_failure_handling": {
        "requirement": "Synthesis knows which sources failed and why",
        "test": "Simulate partial subagent failure, verify synthesis labels gaps",
        "failure_mode": "Synthesis presents partial results as complete"
    },
    "context_management": {
        "requirement": "Context window managed, tool results trimmed",
        "test": "Run long session, verify context doesn't overflow",
        "failure_mode": "Quality degrades as session length increases"
    }
}
```

### When Both Work Together

```python
# D1: Coordinator spawns 5 subagents, handles their results
# D5: Subagents return structured errors, synthesis labels gaps

# What you get:
{
    "status": "partial_success",
    "results": {
        "completed_tasks": 4,
        "failed_tasks":    1,
        "failure_detail":  "EU regulatory access denied (permission error, permanent)",
    },
    "synthesis": "Research complete for 4 of 5 areas...",
    "confidence": "medium",  # Reduced due to known gap
    "data_gaps":  ["EU regulatory landscape"],
    "recommended_action": "human_review",  # Due to medium confidence + known gap
}
```

### When D1 Works But D5 Doesn't

```python
# D1: Correct orchestration — loop runs correctly, coordinator coordinates well
# D5: No structured errors — silent failures, no confidence scoring

# What you get:
{
    "status": "success",  # Looks like success — actually partial failure silently
    "synthesis": "Research complete across all 5 areas...",  # EU data is fabricated
    "confidence": "high",  # Uncalibrated — confidence not measured
    # No indication of failure or gaps
}
# Result: incorrect data presented with false confidence
```

## Key Takeaways

1. **D1 orchestrates, D5 validates** — both required for production reliability
2. **Without D5 structured errors**: D1 coordinator makes uninformed decisions
3. **Without D1 loop correctness**: D5 error detection has nothing to act on
4. **The combination**: informed coordination + quality assurance + calibrated confidence
5. **Production checklist**: verify both D1 and D5 components before shipping
