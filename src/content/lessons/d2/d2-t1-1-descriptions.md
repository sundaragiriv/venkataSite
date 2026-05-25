---
id: "d2-t1-1-descriptions"
title: "Effective Tool Descriptions — The Most Underestimated Part of Agent Design"
domain: "d2"
taskRef: "T2.1"
order: 1
xp: 35
tag: "Core"
duration: "9 min"
analogy: "A job posting vs a job description. A bad job posting says 'Developer needed.' A good job description says exactly what the developer does, what they don't do, when to use them vs another specialist, and what a good output looks like. Claude reads tool descriptions like a hiring manager reads a job description — the quality of the description determines whether the right tool gets called."
examTrap: "Writing descriptions that explain WHAT the tool does technically rather than WHEN Claude should call it and WHY it's the right choice in specific situations. Claude already knows what an API call is — it needs to know when this specific tool is the right one to use."
keyPoints:
  - "Tool descriptions are the primary mechanism Claude uses to decide which tool to call — they are more important than the tool name."
  - "Good descriptions specify: what the tool does, when to use it, when NOT to use it, and what distinguishes it from similar tools."
  - "Input schema parameter descriptions are as important as the top-level description — they guide how Claude populates the inputs."
  - "Ambiguous tool boundaries cause Claude to call the wrong tool — make boundaries explicit in every description where confusion is possible."
  - "The 4-tool reliability principle: 4-5 tools per agent is optimal for reliable selection. 18+ tools degrades reliability significantly."
antiPatterns:
  - "Writing 'retrieves customer data' when you need 'retrieves customer profile including tier, preferences, and contact history — use when you need information about WHO the customer is'"
  - "No description on input parameters — Claude has to guess what format or content is expected"
  - "Two tools with overlapping descriptions — Claude will call whichever seems more familiar, not necessarily the right one"
  - "Using a generic tool name like 'query' without a description that differentiates it from other query tools"
tbChallenge: "I have two tools: get_customer and get_order. My agent keeps calling get_customer when it needs order information. The tool names are clear — why is it still calling the wrong one, and how do I fix it without renaming the tools?"
---

## Why Tool Descriptions Drive Agent Behavior

When Claude decides which tool to call, it reads the tool descriptions and matches them to the current task context. The tool name is a hint. The description is the actual decision driver.

Consider these two descriptions for the same tool:

**Bad:**
```python
{
    "name": "get_customer",
    "description": "Gets customer information from the database.",
}
```

**Good:**
```python
{
    "name": "get_customer",
    "description": """Retrieves a customer's profile, account status, and service history.
    
    Use this tool when you need to:
    - Verify a customer's identity before processing sensitive requests
    - Understand a customer's tier, preferences, or contact information
    - Check account standing, subscription status, or loyalty points
    
    Do NOT use this tool when you need:
    - Order details or shipping status → use get_order instead
    - Payment history → use get_payment_history instead
    - Recent support tickets → use get_support_history instead
    
    Returns: customer_id, name, email, tier (standard/premium/enterprise), 
    account_status, created_at, contact_preferences."""
}
```

The good description tells Claude exactly when to use this tool and explicitly prevents confusion with similar tools.

## The Four Components of a Good Tool Description

### 1. What It Does (One Sentence)
```
"Retrieves a customer's profile, account status, and service history."
```

### 2. When to Use It (Specific Conditions)
```
"Use this tool when you need to verify identity, understand account tier, 
or access contact information."
```

### 3. When NOT to Use It (Boundary Conditions)
```
"Do NOT use for order details (use get_order), payment history 
(use get_payment_history), or recent tickets (use get_support_history)."
```

### 4. What It Returns (So Claude Knows What to Expect)
```
"Returns: customer_id, name, email, tier, account_status, created_at."
```

## Parameter Descriptions Are Equally Important

The top-level description guides tool selection. Parameter descriptions guide correct usage.

**Bad parameter descriptions:**
```python
"input_schema": {
    "properties": {
        "customer_id": {"type": "string"},
        "include_history": {"type": "boolean"},
        "limit": {"type": "integer"}
    }
}
```

Claude doesn't know: what format is customer_id? What does include_history include? What does limit apply to?

**Good parameter descriptions:**
```python
"input_schema": {
    "properties": {
        "customer_id": {
            "type": "string",
            "description": "Customer identifier in format 'C-XXXXXX' (e.g., 'C-123456'). "
                          "Find this in get_order results as 'customer_id' field."
        },
        "include_history": {
            "type": "boolean",
            "description": "Whether to include service interaction history (last 90 days). "
                          "Set to true when investigating complaint history. "
                          "Set to false (default) for basic profile lookups to reduce response size."
        },
        "limit": {
            "type": "integer",
            "description": "Maximum number of history records to return (1-100, default 20). "
                          "Only applies when include_history is true."
        }
    },
    "required": ["customer_id"]
}
```

Now Claude knows exactly how to construct a valid, appropriate call.

## Disambiguating Similar Tools

When you have multiple tools with overlapping capability, explicit disambiguation in each description prevents wrong-tool calls:

```python
tools = [
    {
        "name": "search_knowledge_base",
        "description": """Searches internal product documentation and support articles.
        
        Use for: questions about product features, policies, procedures, 
        warranty terms, and standard troubleshooting steps.
        
        Use this INSTEAD of web_search when: the question is about our 
        specific product or company policy.
        
        Do NOT use for: real-time information, external pricing, 
        competitor products, or anything not in our documentation."""
    },
    {
        "name": "web_search",
        "description": """Searches the public internet for current information.
        
        Use for: general knowledge, external product information, 
        current events, technical standards, third-party compatibility.
        
        Use this INSTEAD of search_knowledge_base when: the information 
        needed is not specific to our company or products.
        
        Do NOT use for: internal policies, our product features, 
        or information that should be in our knowledge base."""
    }
]
```

Each description explicitly references the other, creating clear mutual boundaries.

## The 4-Tool Reliability Principle

Research and exam guidance consistently points to a specific number:

| Tool Count | Reliability |
|---|---|
| 1-4 tools | Highest — Claude reliably selects correctly |
| 5-7 tools | Good — occasional selection errors |
| 8-12 tools | Moderate — noticeable selection degradation |
| 13-18 tools | Poor — frequent wrong-tool calls |
| 18+ tools | Unreliable — selection becomes nearly random in edge cases |

**The fix for complex systems:** scope tool access per agent role.

```python
# Instead of giving every agent all 20 tools:
ALL_TOOLS = [tool_1, tool_2, ..., tool_20]  # ❌ Too many

# Give each agent only what its role needs:
CUSTOMER_LOOKUP_TOOLS = [get_customer, get_order, get_payment_history]  # ✅ 3 tools
REFUND_PROCESSING_TOOLS = [validate_refund, process_refund, send_confirmation]  # ✅ 3 tools
ESCALATION_TOOLS = [get_agent_queue, create_ticket, escalate_to_human]  # ✅ 3 tools
```

Each agent has 3 tools and makes reliable selections. Total capability across all agents is 9 tools — all accessible through the right agent.

## Iterating on Tool Descriptions

If Claude consistently calls the wrong tool, the fix is almost always the description:

```python
# Observe: Claude keeps calling search_knowledge_base for external pricing questions

# Fix: Add explicit exclusion in search_knowledge_base description
"Do NOT use for pricing of competitor products or external market rates. "
"For competitor pricing, use web_search."

# And add explicit inclusion in web_search description  
"Use for competitor pricing comparisons and external market information."
```

Test → observe wrong calls → improve description → repeat until selection is reliable.

## Key Takeaways

1. **Descriptions drive tool selection** — names are hints, descriptions are decisions
2. **Four components**: what it does, when to use, when NOT to use, what it returns
3. **Parameter descriptions matter** — guide correct input construction
4. **Disambiguate explicitly** — reference other tools when boundaries overlap
5. **4-5 tools per agent** — more than that degrades selection reliability
6. **Iterate on descriptions** when wrong-tool calls occur
