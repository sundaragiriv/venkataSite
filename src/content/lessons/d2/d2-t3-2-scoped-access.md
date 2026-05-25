---
id: "d2-t3-2-scoped-access"
title: "Scoped Tool Access — Minimum Necessary Permissions per Agent"
domain: "d2"
taskRef: "T2.3"
order: 8
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Building access cards. The receptionist gets lobby access. The developer gets the office and server room. The CEO gets everything. You don't give every employee CEO-level access just because it's simpler. Same principle applies to agents."
examTrap: "Giving all agents access to all tools because it avoids the complexity of managing different tool sets. This is explicitly called out as an anti-pattern on the exam — it increases blast radius, degrades tool selection reliability, and violates minimal footprint."
keyPoints:
  - "Each agent role should have access only to the tools it needs for its specific function — not all available tools."
  - "Scoped access reduces blast radius: if an agent behaves unexpectedly, it can only affect what its tools allow."
  - "Scoped access improves selection reliability: an agent with 4 tools selects correctly more often than one with 20 tools."
  - "Tool scoping is implemented in your orchestration layer — you pass different tool lists to different agent roles."
  - "MCP server scoping: different clients can be authenticated to access different subsets of the server's tools."
antiPatterns:
  - "Passing all available tools to all agents — violates minimal footprint and degrades reliability"
  - "Giving a read-only analysis agent write access tools — creates unnecessary risk"
  - "Not scoping tools in multi-agent systems — coordinator and subagents should have different access"
tbChallenge: "Design the tool access scope for a customer support system with these roles: intake agent (first contact), billing specialist, technical specialist, and escalation coordinator. What tools does each get and why?"
---

## Tool Scoping by Role

```python
# Define all available tools
ALL_TOOLS = {
    # Customer data
    "get_customer":           customer_tools.get_customer,
    "get_order":              customer_tools.get_order,
    "get_payment_history":    customer_tools.get_payment_history,
    "get_support_history":    customer_tools.get_support_history,

    # Resolution actions
    "process_refund":         resolution_tools.process_refund,
    "send_replacement":       resolution_tools.send_replacement,
    "update_subscription":    resolution_tools.update_subscription,

    # Technical tools
    "check_service_status":   technical_tools.check_service_status,
    "reset_user_auth":        technical_tools.reset_user_auth,
    "clear_cache":            technical_tools.clear_cache,

    # Escalation
    "create_ticket":          escalation_tools.create_ticket,
    "escalate_to_human":      escalation_tools.escalate_to_human,
    "get_agent_queue":        escalation_tools.get_agent_queue,

    # Communication
    "send_email":             comms_tools.send_email,
    "send_sms":               comms_tools.send_sms,
}

# Define scoped tool sets per role
TOOL_SCOPES = {
    # Intake agent: identify issue, gather context, route
    "intake_agent": [
        "get_customer", "get_order", "get_support_history",
        "create_ticket"
    ],

    # Billing specialist: full customer data, billing actions only
    "billing_specialist": [
        "get_customer", "get_order", "get_payment_history",
        "process_refund", "update_subscription",
        "send_email"
    ],

    # Technical specialist: diagnostic and fix tools, no billing
    "technical_specialist": [
        "get_customer", "get_order",
        "check_service_status", "reset_user_auth", "clear_cache",
        "send_email"
    ],

    # Escalation coordinator: oversight tools, full escalation access
    "escalation_coordinator": [
        "get_customer", "get_order", "get_support_history",
        "create_ticket", "escalate_to_human", "get_agent_queue",
        "send_email", "send_sms"
    ],
}

def get_tools_for_role(role: str) -> list:
    """Return the tool definitions for a specific agent role."""
    tool_names = TOOL_SCOPES.get(role, [])
    return [ALL_TOOLS[name] for name in tool_names if name in ALL_TOOLS]

# Usage
intake_tools = get_tools_for_role("intake_agent")       # 4 tools
billing_tools = get_tools_for_role("billing_specialist") # 6 tools
tech_tools = get_tools_for_role("technical_specialist")  # 6 tools
```

## MCP Server-Level Scoping

For MCP servers, scope can be enforced at the authentication layer:

```python
# MCP server with role-based tool access
TOOL_PERMISSIONS = {
    "read_only_key": ["get_customer", "get_order", "search_knowledge_base"],
    "billing_key":   ["get_customer", "get_order", "get_payment_history", "process_refund"],
    "admin_key":     ["get_customer", "get_order", "get_payment_history",
                      "process_refund", "delete_account", "export_data"],
}

@server.tool("process_refund")
async def process_refund(amount: float, order_id: str, api_key: str = Depends(auth)):
    # Check that this API key has permission for this specific tool
    allowed_tools = TOOL_PERMISSIONS.get(api_key, [])
    if "process_refund" not in allowed_tools:
        raise PermissionError("This API key does not have refund processing access")
    return await refund_service.process(amount, order_id)
```

## Key Takeaways

1. **Scope tools to roles** — minimum necessary access for each agent function
2. **Benefits**: reduced blast radius, better selection reliability, minimal footprint
3. **Implementation**: pass different tool lists to different agent calls
4. **MCP scoping**: authenticate clients to different tool subsets at the server level
5. **Never give all tools to all agents** — explicit exam anti-pattern
