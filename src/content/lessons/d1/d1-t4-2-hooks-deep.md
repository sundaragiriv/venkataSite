---
id: "d1-t4-2-hooks-deep"
title: "Agent SDK Hooks — Deep Dive Into Pre and Post Tool Use"
domain: "d1"
taskRef: "T1.5"
order: 11
xp: 40
tag: "Core"
duration: "9 min"
analogy: "Middleware in a web framework. Before a request hits your route handler, middleware can authenticate, rate-limit, log, and transform the request. After the handler responds, middleware can compress, cache, and add headers. Hooks are middleware for tool calls."
examTrap: "Thinking PostToolUse hooks run after Claude processes the result. They run BEFORE Claude processes the result — they intercept the raw tool output and transform it before Claude ever sees it."
keyPoints:
  - "PreToolUse hooks fire synchronously before the tool executes — they can allow, block, or modify the tool's input parameters."
  - "PostToolUse hooks fire after the tool executes but BEFORE Claude receives the result — they transform raw tool output into a format better suited for Claude's reasoning."
  - "Hook chains execute in registration order — multiple hooks can be registered and all execute in sequence."
  - "A blocked PreToolUse hook returns an error as the tool_result — Claude sees the error message and can decide how to proceed."
  - "PostToolUse hooks are the correct mechanism for data normalization across heterogeneous tool sources."
antiPatterns:
  - "Confusing when hooks fire — PreToolUse is before execution, PostToolUse is before Claude sees the result (not after)"
  - "Using hooks for logic that belongs in the tool itself"
  - "Not returning a tool_result when a hook blocks — Claude needs to see why the call was blocked"
  - "Assuming Claude won't retry after a hook block — it might, so make your error messages actionable"
tbChallenge: "Walk me through the exact execution sequence for a refund request: the hook registration, what fires when, what Claude sees at each step, and how the conversation continues after a blocked call."
---

## The Hook Execution Sequence

Understanding exactly when each hook fires is critical for the exam. Here's the complete sequence for a tool call:

```
1. Claude decides to call a tool
2. Claude emits tool_use block in response
   stop_reason = "tool_use"

3. YOUR CODE receives the response
4. YOUR CODE extracts the tool_use block
5. PRE_TOOL_USE HOOKS FIRE ← here
   - Can allow (return nothing or {blocked: false})
   - Can block (return {blocked: true, error: {...}})
   - Can modify input (return {modified_input: {...}})

6a. If blocked:
    → tool_result is the error message from the hook
    → Claude sees the error and decides next action
    → Loop continues

6b. If allowed:
    → Tool executes with original or modified input
    → Tool returns result

7. POST_TOOL_USE HOOKS FIRE ← here (BEFORE Claude sees the result)
   - Transform raw result into normalized format
   - Filter sensitive data
   - Add metadata

8. Claude receives the (potentially transformed) tool_result
9. Claude reasons about what to do next
10. Loop continues
```

## PreToolUse Hook Implementation

```python
from typing import Optional

class HookResult:
    def __init__(self, blocked: bool = False,
                 error: Optional[dict] = None,
                 modified_input: Optional[dict] = None):
        self.blocked = blocked
        self.error = error
        self.modified_input = modified_input

def refund_compliance_hook(
    tool_name: str,
    tool_input: dict,
    session_state: dict
) -> HookResult:
    """
    Enforces refund compliance rules.
    Must run BEFORE process_refund tool executes.
    """
    if tool_name != "process_refund":
        return HookResult()  # Allow all other tools

    # Rule 1: Customer must be verified
    if not session_state.get("customer_verified"):
        return HookResult(
            blocked=True,
            error={
                "type": "prerequisite_not_met",
                "message": "Customer identity must be verified before processing any refund. "
                           "Call get_customer first and confirm the customer identity.",
                "code": "VERIFICATION_REQUIRED"
            }
        )

    # Rule 2: Refund amount must be within limits
    amount = float(tool_input.get("amount", 0))
    if amount > 500:
        return HookResult(
            blocked=True,
            error={
                "type": "policy_violation",
                "message": f"Refund amount ${amount:.2f} exceeds the automated refund limit of $500.00. "
                           "Escalate to a human agent for amounts over $500.",
                "code": "AMOUNT_EXCEEDS_LIMIT",
                "limit": 500.00,
                "requested": amount
            }
        )

    # Rule 3: Must have a valid reason code
    valid_reasons = {"defective", "not_received", "wrong_item", "changed_mind", "duplicate_charge"}
    reason = tool_input.get("reason_code", "")
    if reason not in valid_reasons:
        return HookResult(
            blocked=True,
            error={
                "type": "validation_error",
                "message": f"Invalid reason code '{reason}'. Valid codes: {', '.join(valid_reasons)}",
                "code": "INVALID_REASON_CODE"
            }
        )

    # All checks passed
    return HookResult()

def audit_log_hook(
    tool_name: str,
    tool_input: dict,
    session_state: dict
) -> HookResult:
    """
    Logs all tool calls for audit purposes.
    Never blocks — just records.
    """
    audit_logger.info({
        "event": "tool_call",
        "tool": tool_name,
        "input": sanitize_for_logging(tool_input),
        "session_id": session_state.get("session_id"),
        "customer_id": session_state.get("customer_id"),
        "timestamp": datetime.utcnow().isoformat()
    })
    return HookResult()  # Always allow
```

## PostToolUse Hook Implementation

```python
UNIX_TIMESTAMP_FIELDS = {"created_at", "updated_at", "processed_at", "timestamp"}
STATUS_CODE_MAP = {
    "1": "pending", "2": "processing", "3": "complete",
    "4": "failed", "5": "refunded", "6": "cancelled"
}

def normalize_order_result_hook(
    tool_name: str,
    tool_result: dict,
    session_state: dict
) -> dict:
    """
    Normalizes order data from three different backend systems.
    Fires AFTER tool execution, BEFORE Claude receives the result.
    """
    if tool_name not in ("get_order", "get_order_legacy", "get_order_v3"):
        return tool_result  # Pass through unchanged

    normalized = {}

    # Normalize ID field (different systems use different names)
    normalized["order_id"] = (
        tool_result.get("order_id") or
        tool_result.get("id") or
        tool_result.get("orderId") or
        "unknown"
    )

    # Normalize status (legacy uses numeric codes, v3 uses strings)
    raw_status = str(tool_result.get("status") or tool_result.get("status_code", ""))
    normalized["status"] = STATUS_CODE_MAP.get(raw_status, raw_status)

    # Normalize timestamps (mix of Unix timestamps and ISO strings)
    for field in UNIX_TIMESTAMP_FIELDS:
        raw = tool_result.get(field)
        if raw:
            normalized[field] = (
                datetime.utcfromtimestamp(raw).isoformat()
                if isinstance(raw, (int, float))
                else raw
            )

    # Normalize amount (some systems return cents as integers)
    raw_amount = tool_result.get("total") or tool_result.get("amount", 0)
    normalized["amount"] = raw_amount / 100 if raw_amount > 10000 else float(raw_amount)

    return normalized
```

Claude always receives consistent, normalized order data regardless of which backend system fulfilled the query.

## Registering Multiple Hooks

```python
# Hook chain — executes in registration order
agent_config = {
    "pre_tool_use_hooks": [
        audit_log_hook,           # Always runs first (logging)
        refund_compliance_hook,   # Checks compliance rules
        rate_limit_hook,          # Prevents tool abuse
    ],
    "post_tool_use_hooks": [
        normalize_order_result_hook,  # Data normalization
        redact_sensitive_data_hook,   # Remove PII from results
        cache_result_hook,            # Cache expensive lookups
    ]
}
```

If `refund_compliance_hook` blocks the call, `rate_limit_hook` does not execute (the call is already blocked). But `audit_log_hook` runs first — the blocked attempt is still logged.

## What Claude Sees After a Block

When a hook blocks a tool call, Claude receives the error message as the tool_result:

```json
{
  "role": "user",
  "content": [{
    "type": "tool_result",
    "tool_use_id": "toolu_01ABC",
    "content": "Error: Customer identity must be verified before processing any refund. Call get_customer first and confirm the customer identity.",
    "is_error": true
  }]
}
```

Claude reads this error and decides how to proceed. In most cases, it will call the required prerequisite tool (get_customer) and then retry the refund. This is the correct behavior — the hook guided Claude to the right sequence.

## Key Takeaways

1. **PreToolUse fires before tool execution** — can block, allow, or modify input
2. **PostToolUse fires before Claude sees the result** — transforms raw tool output
3. **Hook chains execute in registration order** — all hooks in chain run (unless blocked)
4. **Blocked calls return error as tool_result** — Claude reads it and adapts
5. **PostToolUse is for normalization** — data consistency across heterogeneous sources
6. **Hooks are deterministic** — unlike prompts, they execute 100% reliably
