---
id: "d6-t1-1-loop-tool-design"
title: "D1 + D2: Agent Loops Through Tools — The Combined Failure Modes"
domain: "d6"
taskRef: "T6.1"
order: 1
xp: 45
tag: "⚡ Exam Tested"
duration: "10 min"
analogy: "A machine operator and their equipment. The operator (agent loop) is skilled, but if the equipment (tools) has poor descriptions, ambiguous controls, or no error feedback, even a skilled operator makes mistakes. D1 teaches you to design skilled operators. D2 teaches you to build equipment they can use reliably. Together, you build a system that works."
examTrap: "Treating D1 (agent loop design) and D2 (tool design) as independent concerns. The exam specifically tests their interaction: a well-designed loop with poor tools fails just as completely as a poorly-designed loop with good tools."
keyPoints:
  - "Inadequate tool descriptions cause wrong tool selection — the loop calls the right function but the wrong tool."
  - "Missing error categories in tools mean the loop can't make intelligent retry decisions."
  - "Tool schema issues (wrong types, no nullable fields) cause tool call failures that the loop must handle."
  - "Too many tools per agent (>4-5) degrades tool selection reliability — the loop calls wrong tools with increasing frequency."
  - "PostToolUse normalization ensures loop receives consistent data — without it, loop reasoning degrades on variable data."
antiPatterns:
  - "Good loop logic with tools that have no descriptions — loop guesses which tool to use"
  - "Tool errors that don't include isRetryable — loop retries permanent failures"
  - "All tools given to all agents — loop reliability degrades with tool count"
  - "Raw tool results passed to loop without normalization — inconsistent data corrupts reasoning"
tbChallenge: "Your agent loop is calling the wrong tool 30% of the time. Your loop control flow is correct. Where is the bug, and what does the fix look like in both D1 (loop) and D2 (tool) terms?"
---

## How D1 and D2 Failures Interact

### Scenario 1: Tool Description Failure → Loop Failure

```python
# D2 problem: poor tool descriptions
tools = [
    {
        "name": "get_customer",
        "description": "Gets customer data",  # ← Too vague
    },
    {
        "name": "get_order",
        "description": "Gets order data",     # ← Too vague — same pattern
    }
]

# D1 consequence: loop calls wrong tool
# Claude sees "get_customer" and "get_order" — both described as "gets data"
# For "look up order #12345", Claude may call get_customer with order ID
# Result: 400 error, loop retries, fails again — 3 retries then gives up

# The fix is D2 (better descriptions), not D1 (loop control):
tools_fixed = [
    {
        "name": "get_customer",
        "description": """Retrieves customer profile by customer ID (format C-XXXXXX).
        Use when you need: name, email, account tier, contact history.
        Do NOT use for order information → use get_order instead."""
    },
    {
        "name": "get_order",
        "description": """Retrieves order details by order ID (format ORD-XXXXXXXX).
        Use when you need: order status, items, amounts, shipping info.
        Do NOT use for customer profile → use get_customer instead."""
    }
]
```

### Scenario 2: Missing Error Category → Loop Can't Recover

```python
# D2 problem: tool error doesn't include error category
def get_customer_bad(customer_id: str) -> dict:
    try:
        return db.query(customer_id)
    except Exception as e:
        return {"error": str(e)}  # ← No category, no isRetryable

# D1 consequence: loop can't decide whether to retry
async def handle_tool_result(tool_result: dict) -> str:
    if "error" in tool_result:
        # D1 loop doesn't know if this is retryable or not
        # So it either always retries (wastes retries on permanent failures)
        # or never retries (gives up on transient failures)
        return "error"  # No intelligent decision possible

# The fix is D2 (structured error) that enables D1 (intelligent retry):
def get_customer_good(customer_id: str) -> dict:
    try:
        return db.query(customer_id)
    except TimeoutError:
        return {
            "error":        "Database timeout",
            "error_category": "transient",
            "isRetryable":  True,
            "retry_after_seconds": 2
        }
    except PermissionError:
        return {
            "error":          "Insufficient permissions",
            "error_category": "permission",
            "isRetryable":    False
        }
```

### Scenario 3: Tool Count → Loop Selection Degrades

```python
# D2 problem: 20 tools given to one agent
COORDINATOR_TOOLS = all_20_tools  # D2 violation: too many tools

# D1 consequence: loop selection degrades
# At 20 tools, Claude picks the wrong tool ~25% of the time
# Loop has to retry and escalate more often
# Overall reliability drops significantly

# The fix combines D2 (scoped tools) with D1 (specialized subagents):
# D2: each agent type gets 3-5 tools for its role
INTAKE_TOOLS    = [get_customer, get_order, create_ticket]  # 3 tools
BILLING_TOOLS   = [get_customer, get_payment_history, process_refund]  # 3 tools
TECHNICAL_TOOLS = [get_customer, check_service_status, reset_auth]  # 3 tools

# D1: coordinator routes to appropriate specialized subagent
# Each subagent loop is highly reliable because it has few, well-chosen tools
```

## The Combined Reliability Equation

```
System reliability = 
  Loop control correctness (D1)
  × Tool description quality (D2)
  × Tool error structure quality (D2)
  × Tool count per agent (D2)
  × Tool result normalization (D2)

If any factor is near zero, system reliability is near zero.
D1 and D2 must BOTH be done well.
```

## Key Takeaways

1. **Loop + tool failures compound** — neither domain is sufficient alone
2. **Wrong tool selection** is a D2 description problem, not a D1 loop problem
3. **Unintelligent retry** is a D2 error structure problem
4. **Reliability degrades with tool count** — D2 scoping enables D1 reliability
5. **Exam scenarios** showing loop failures often trace to D2 tool design issues
