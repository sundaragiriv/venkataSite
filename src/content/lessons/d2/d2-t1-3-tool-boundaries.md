---
id: "d2-t1-3-tool-boundaries"
title: "Tool Boundary Design — When to Split, When to Consolidate"
domain: "d2"
taskRef: "T2.1"
order: 3
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A Swiss army knife vs a specialized toolkit. A Swiss army knife is convenient but you'd never do serious work with a saw the size of your thumb. Specialized tools do their job precisely. The question is: when does combining tools help Claude, and when does it hurt?"
examTrap: "Consolidating tools to reduce tool count when the operations are genuinely distinct. Combining 'get_customer_profile' and 'update_customer_email' into one tool is wrong — they have different preconditions, different side effects, and different appropriate contexts."
keyPoints:
  - "Split tools when: operations have different preconditions, different side effects, or Claude would legitimately call one without the other."
  - "Consolidate tools when: operations are always called together, have the same inputs, and represent a single logical operation."
  - "Read and write operations should almost always be separate tools — different authorization requirements and different risk profiles."
  - "A tool that does too much creates ambiguity about what Claude actually called it for and makes hooks harder to write."
  - "Tool granularity should match decision granularity — Claude makes one decision per tool call."
antiPatterns:
  - "Combined read-write tools (get_and_update_customer) — can't enforce read-only access"
  - "Tools that accept completely different inputs depending on a 'mode' parameter — split them"
  - "One tool that handles 5 different operations via a 'action' parameter — impossible to write useful descriptions or hooks"
  - "Too-granular tools that always get called as a group — consolidate if they're always called together"
tbChallenge: "Someone proposes a tool called 'customer_operations' with an 'action' parameter that accepts: get, update, delete, verify_identity, process_refund. What's wrong with this design and how do you fix it?"
---

## The Split vs Consolidate Decision

### Split when operations are distinct

```python
# ❌ Don't consolidate these — they're fundamentally different operations
{
    "name": "customer_operations",
    "description": "Performs various customer operations",
    "input_schema": {
        "properties": {
            "action": {"type": "string", "enum": ["get", "update", "delete", "verify"]},
            "customer_id": {"type": "string"},
            "field_to_update": {"type": "string"},  # Only for update
            "new_value": {"type": "string"},         # Only for update
        }
    }
}
# Problems:
# - Can't write a hook that specifically intercepts "delete" operations
# - Description is meaningless — what does this tool actually do?
# - Many parameters are irrelevant for most action types
# - Authorization for "get" and "delete" should be completely different

# ✅ Split into separate tools
{
    "name": "get_customer",
    "description": "Retrieves customer profile — read only, no side effects...",
},
{
    "name": "update_customer_field", 
    "description": "Updates a single customer field — write operation, requires verification first...",
},
{
    "name": "delete_customer_account",
    "description": "Permanently deletes customer account — irreversible, requires manager approval...",
}
```

### Consolidate when operations are always paired

```python
# These are always called together — consolidate
# ❌ Unnecessarily split
get_order_header(order_id)   # Always followed by:
get_order_line_items(order_id)  # Called separately but always together

# ✅ Consolidate — they're one logical operation
get_order(order_id)  # Returns header + line items together
```

## Read vs Write Separation

Read and write operations should always be separate tools:

| Reason | Detail |
|---|---|
| Authorization | Read-only access can be granted without write access |
| Hooks | PreToolUse hooks can block write operations specifically |
| Risk | Reads are safe to retry; writes may not be |
| Logging | Write operations need stronger audit trails |

```python
# Clear separation
read_tools = ["get_customer", "get_order", "get_payment_history", "search_knowledge_base"]
write_tools = ["update_customer", "process_refund", "create_ticket", "send_email"]

# Agent that only needs to look up information gets only read_tools
# Agent that processes resolutions gets both
```

## Key Takeaways

1. **Split** when operations have different preconditions, side effects, or authorization
2. **Consolidate** when operations are always called together with the same inputs
3. **Read and write always separate** — different risk, authorization, and hook requirements
4. **One decision per tool** — Claude makes a specific choice to call a specific tool
5. **Action-parameter tools are an antipattern** — split by action type instead
