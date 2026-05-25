---
id: "d6-t1-2-combined-failures"
title: "D1 + D2: Diagnosing Combined Failures — The Root Cause Framework"
domain: "d6"
taskRef: "T6.1"
order: 2
xp: 40
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "An aircraft incident investigation. Rarely is the cause purely pilot error or purely equipment failure — usually it's a chain: equipment gave ambiguous feedback, pilot misinterpreted it, recovery procedure was inadequate. Multi-domain failures require multi-domain root cause analysis."
examTrap: "Stopping root cause analysis at the first layer. 'The agent called the wrong tool' is a symptom, not a root cause. The exam presents cascading failures and tests whether you trace them to their actual origin."
keyPoints:
  - "Symptom → immediate cause → root cause: the symptom is what went wrong, the root cause is why it was possible."
  - "Wrong tool call: immediate cause is loop logic; root cause is usually D2 tool description."
  - "Unrecoverable loop: immediate cause is the loop hitting max retries; root cause is D2 not providing isRetryable."
  - "Performance degradation over time: immediate cause is slow response; root cause is D2 tool result accumulation in D1 context."
  - "The fix layer must match the root cause layer — fixing symptoms without fixing root cause produces recurrence."
antiPatterns:
  - "Fixing the loop when the problem is the tool description"
  - "Adding more error handling in D1 when D2 errors lack structure"
  - "Reducing tool count in D1 when D2 descriptions just need improvement"
  - "Stopping at the first causal layer — missing the actual root cause"
tbChallenge: "An agent is failing on customer support queries. Symptoms: calls get_customer instead of get_order on order queries, retries 3 times then fails, each retry takes longer. Trace the root cause chain for each symptom."
---

## The Root Cause Framework

```python
FAILURE_ROOT_CAUSE_CHAIN = {
    "wrong_tool_called": {
        "symptom":        "Loop calls get_customer when get_order is needed",
        "immediate_cause": "Loop's tool selection logic chose incorrectly",
        "root_cause":     "D2: Tool descriptions are too similar or too vague",
        "fix_domain":     "D2 — improve tool descriptions with clear differentiators",
        "not_the_fix":    "D1 — adding explicit 'use get_order for orders' in system prompt",
        "why_not":        "System prompt fix is prompt guidance — probabilistic. Description fix is structural."
    },
    
    "max_retries_exhausted": {
        "symptom":        "Loop retries 3 times then gives up",
        "immediate_cause": "All retries failed",
        "root_cause":     "D2: Tool error doesn't include error_category or isRetryable",
        "deeper_root":    "Loop is retrying a permission error (non-retryable) because it doesn't know it's permanent",
        "fix_domain":     "D2 — add structured error returns with isRetryable flag",
        "not_the_fix":    "D1 — reducing retry count to 2"
    },
    
    "progressive_slowdown": {
        "symptom":        "Responses get slower over the course of a session",
        "immediate_cause": "API calls take longer as session continues",
        "root_cause":     "D2: Tool results aren't trimmed — full API responses appended to conversation",
        "mechanism":      "D1 context window fills with unprocessed tool results → more tokens → slower inference",
        "fix_domain":     "D2 — PostToolUse trimming; D5 — context management",
        "not_the_fix":    "D1 — reducing max_tokens"
    }
}
```

## Teach-Back Answer

```python
# Three symptoms traced:

# 1. calls get_customer instead of get_order
#    Root cause: D2 — both tools described as "gets [entity] data"
#    Fix: D2 — rewrite descriptions with explicit "use for X, not Y"

# 2. retries 3 times then fails
#    Root cause: D2 — error response doesn't include isRetryable
#    The error is a permission error (non-retryable), but loop doesn't know
#    so it wastes 3 retries before giving up
#    Fix: D2 — add {error_category: "permission", isRetryable: false} to error response

# 3. each retry takes longer
#    Root cause: combined D1 + D2
#    D2: full tool results (including the errors) appended without trimming
#    D1: context window growing with each retry
#    Each API call processes more tokens → slower
#    Fix: D2 — trim error results too, not just success results
```

## Exam Pattern Recognition

When the exam shows an agent that's:
- **Calling wrong tools**: look at D2 tool descriptions first
- **Retrying when it shouldn't** (or not retrying when it should): look at D2 error structure
- **Degrading over time**: look at D1 context management + D2 result trimming
- **Losing critical instructions**: look at D5 lost-in-the-middle + D1 state management

The symptom domain and the root cause domain are often different.

## Key Takeaways

1. **Trace root cause through layers** — symptom → immediate cause → root cause
2. **Wrong tool call** is almost always a D2 description problem
3. **Retry failures** trace to D2 error structure (missing isRetryable)
4. **Progressive degradation** combines D1 context + D2 result trimming
5. **Fix at the root cause domain** — fixing symptoms causes recurrence
