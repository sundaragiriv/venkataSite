---
id: "d2-t4-1-error-categories"
title: "MCP Error Categories — The Four Types and What They Mean"
domain: "d2"
taskRef: "T2.4"
order: 10
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "A hospital triage system. Some patients need immediate re-treatment (transient — try again). Some came in with the wrong paperwork (validation — fix the input). Some are outside what this hospital handles (business — different path). Some don't have authorization to receive certain treatments (permission — fix access)."
examTrap: "Retrying validation errors or business rule violations. Retrying these wastes resources and always fails — the error will recur until the input or authorization is fixed. Only transient errors are retryable."
keyPoints:
  - "Transient errors: temporary failures (network timeout, service unavailable) — safe to retry with backoff."
  - "Validation errors: bad input format or missing required data — retrying with same input always fails, must fix the input."
  - "Business rule errors: valid input but violates a business constraint (refund exceeds limit) — not a bug, requires different action or escalation."
  - "Permission errors: unauthorized access — requires authorization change, not retry."
  - "The isRetryable flag in structured error responses signals whether retry is appropriate."
antiPatterns:
  - "Retrying validation errors — the input is wrong, retry won't fix it"
  - "Retrying permission errors — the authorization hasn't changed between retries"
  - "Not categorizing errors and retrying everything — wastes resources on unretryable errors"
  - "Catching all errors the same way — different error types require different handling"
tbChallenge: "Your agent calls a payment processing tool and gets an error. It retries 3 times and keeps failing. What are the four possible error categories, and which one(s) should trigger retries vs different handling?"
---

## The Four Error Categories

### Category 1: Transient Errors

Temporary failures that resolve without fixing the request.

```python
TRANSIENT_ERROR_CODES = {
    "TIMEOUT",
    "SERVICE_UNAVAILABLE",
    "RATE_LIMIT_EXCEEDED",
    "NETWORK_ERROR",
    "TEMPORARY_FAILURE"
}

# These errors: safe to retry with exponential backoff
```

**Examples:**
- HTTP 503 Service Unavailable
- Network timeout
- Rate limit exceeded (wait, then retry)
- Database connection pool exhausted

**Correct response: retry with exponential backoff**

```python
async def retry_transient(tool_call, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await execute_tool(tool_call)
        except ToolError as e:
            if e.category != "transient":
                raise  # Don't retry non-transient errors
            if attempt == max_retries - 1:
                raise  # Last attempt, give up
            await asyncio.sleep(2 ** attempt)  # 1s, 2s, 4s
```

### Category 2: Validation Errors

The request is malformed — wrong format, missing required fields, invalid values.

```python
VALIDATION_ERROR_CODES = {
    "INVALID_FORMAT",
    "MISSING_REQUIRED_FIELD",
    "INVALID_VALUE",
    "SCHEMA_VIOLATION",
    "TYPE_MISMATCH"
}

# These errors: NEVER retry with same input
# Must fix the input first
```

**Examples:**
- customer_id in wrong format (expected "C-123456", got "123456")
- Missing required field (amount not provided for refund)
- Invalid enum value (status="UNKNOWN" when only "active"/"inactive" valid)

**Correct response: fix the input, inform Claude of the validation error**

```python
# Return validation error to Claude so it can fix its input
return {
    "type": "tool_result",
    "tool_use_id": tool_use_id,
    "content": json.dumps({
        "error": "validation_error",
        "message": "customer_id format is invalid",
        "expected_format": "C-XXXXXX (e.g., C-123456)",
        "received": "123456",
        "isRetryable": False
    }),
    "is_error": True
}
```

### Category 3: Business Rule Errors

Valid input, valid authorization, but the operation violates a business constraint.

```python
BUSINESS_ERROR_CODES = {
    "REFUND_LIMIT_EXCEEDED",
    "ACCOUNT_SUSPENDED",
    "POLICY_VIOLATION",
    "DUPLICATE_REQUEST",
    "INSUFFICIENT_FUNDS"
}

# These errors: NOT retryable, require different action
```

**Examples:**
- Refund amount exceeds $500 automated limit
- Customer account is suspended
- Duplicate refund request already processed
- Subscription cannot be cancelled during billing period

**Correct response: escalate or take alternative action**

```python
return {
    "error": "business_rule_violation",
    "code": "REFUND_LIMIT_EXCEEDED",
    "message": "Refund amount $750 exceeds the $500 automated processing limit",
    "limit": 500,
    "requested": 750,
    "escalation_required": True,
    "alternative_action": "Escalate to human agent for manual approval",
    "isRetryable": False
}
```

### Category 4: Permission Errors

The caller lacks authorization for this operation.

```python
PERMISSION_ERROR_CODES = {
    "UNAUTHORIZED",
    "FORBIDDEN",
    "INSUFFICIENT_PRIVILEGES",
    "TOKEN_EXPIRED",
    "RESOURCE_NOT_ACCESSIBLE"
}

# These errors: NOT retryable (unless token expired — then refresh and retry once)
```

**Examples:**
- Agent doesn't have access to billing operations
- Customer data in a restricted region
- Expired API token

**Correct response: fix authorization, not retry with same credentials**

## Structured Error Responses

Return errors in a consistent structure so both Claude and your code can handle them appropriately:

```python
def format_tool_error(
    category: str,          # "transient" | "validation" | "business" | "permission"
    code: str,              # Specific error code
    message: str,           # Human-readable message
    is_retryable: bool,
    details: dict = None    # Category-specific additional context
) -> dict:
    return {
        "error": True,
        "category": category,
        "code": code,
        "message": message,
        "isRetryable": is_retryable,
        "details": details or {},
        "timestamp": datetime.utcnow().isoformat()
    }

# Usage
return format_tool_error(
    category="validation",
    code="INVALID_CUSTOMER_ID",
    message=f"Customer ID '{customer_id}' does not match required format C-XXXXXX",
    is_retryable=False,
    details={"received": customer_id, "expected_pattern": "^C-[0-9]{6}$"}
)
```

## Key Takeaways

1. **Transient** → retry with backoff (network issues, temporary unavailability)
2. **Validation** → fix input, never retry with same data
3. **Business rule** → different action or escalation, not retry
4. **Permission** → fix authorization, not retry with same credentials
5. **isRetryable flag** in error response guides agent decision-making
6. **Consistent error structure** enables both Claude and code to handle correctly
