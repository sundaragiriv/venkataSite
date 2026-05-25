---
id: "d2-t5-1-result-formatting"
title: "Tool Result Formatting — Structuring Output for Claude's Reasoning"
domain: "d2"
taskRef: "T2.5"
order: 13
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A well-organized filing cabinet vs a box of loose papers. Both have the same information. But the filing cabinet lets you find exactly what you need in seconds. Tool results formatted for Claude's reasoning are the filing cabinet — Claude can extract what it needs without parsing noise."
examTrap: "Returning raw API responses directly as tool results. Raw API responses contain headers, metadata, pagination info, and nested structures that Claude must wade through. Pre-process results to return only what Claude needs in the clearest possible format."
keyPoints:
  - "Return only relevant information — strip metadata, headers, pagination artifacts, and unused fields before sending to Claude."
  - "Consistent field names across similar tools reduce Claude's cognitive load — 'customer_id' should mean the same thing in every tool result."
  - "Structured formats (JSON with clear field names) beat prose descriptions — Claude can reference specific fields."
  - "Include computed summaries for large result sets — don't make Claude count or calculate when you can do it for free."
  - "Error results need the same formatting care as success results — a well-formatted error helps Claude recover correctly."
antiPatterns:
  - "Returning raw API JSON with all fields including irrelevant ones"
  - "Returning string representations of large objects ('Customer<id=123, name=...>')"
  - "Inconsistent field naming across similar tools (customer_id vs customerId vs cust_id)"
  - "Not including summaries for large result sets — making Claude count/aggregate"
tbChallenge: "Show me the difference between a raw API response for a customer lookup and a well-formatted tool result. What specifically gets removed or restructured, and why does each change matter?"
---

## Raw vs Formatted: A Real Example

```python
# Raw API response — what you GET from Salesforce
raw_customer_response = {
    "Id": "0031000000000001",
    "Name": "Jane Smith",
    "Email": "jane@example.com",
    "Phone": "555-1234",
    "MobilePhone": None,
    "AccountId": "0011000000000001",
    "Account": {
        "Id": "0011000000000001",
        "Name": "Acme Corp",
        "Industry": "Technology",
        "AnnualRevenue": 5000000,
        "NumberOfEmployees": 250,
        "BillingAddress": {...},
        "ShippingAddress": {...}
    },
    "RecordTypeId": "0121000000000001",
    "CreatedDate": "2023-01-15T08:30:00.000+0000",
    "LastModifiedDate": "2024-11-20T14:22:00.000+0000",
    "SystemModstamp": "2024-11-20T14:22:00.000+0000",
    "LastActivityDate": "2024-11-19",
    "IsDeleted": False,
    "attributes": {"type": "Contact", "url": "/services/data/v58.0/sobjects/Contact/..."},
    "CustomField1__c": None,
    "CustomField2__c": None,
    # 40+ more fields...
}

# ✅ Formatted result — what you return to Claude
def format_customer_result(raw: dict) -> dict:
    return {
        "customer_id": raw["Id"],
        "name": raw["Name"],
        "email": raw["Email"],
        "phone": raw.get("Phone") or raw.get("MobilePhone", "not provided"),
        "company": raw.get("Account", {}).get("Name", "individual"),
        "account_created": raw["CreatedDate"][:10],  # Just the date
        "last_active": raw.get("LastActivityDate", "unknown"),
    }
```

The formatted result is 7 fields instead of 50+. Claude gets exactly what it needs for customer support decisions.

## Consistency Across Tools

```python
# Define consistent field names across all customer-related tools
CUSTOMER_FIELD_MAP = {
    "get_customer":           {"id": "customer_id", "created": "account_created"},
    "get_order":              {"customerId": "customer_id", "orderDate": "order_date"},
    "get_payment_history":    {"custId": "customer_id", "txDate": "payment_date"},
}

def normalize_customer_id_field(result: dict, tool_name: str) -> dict:
    """Ensure 'customer_id' is always the field name, regardless of source."""
    mapping = CUSTOMER_FIELD_MAP.get(tool_name, {})
    for source_key, target_key in mapping.items():
        if source_key in result:
            result[target_key] = result.pop(source_key)
    return result
```

## Summaries for Large Results

```python
def format_order_history(orders: list) -> dict:
    """Don't make Claude count and aggregate — do it for them."""
    return {
        "total_orders": len(orders),
        "date_range": {
            "earliest": min(o["date"] for o in orders),
            "latest": max(o["date"] for o in orders)
        },
        "total_spent": sum(o["amount"] for o in orders),
        "status_summary": {
            "delivered": sum(1 for o in orders if o["status"] == "delivered"),
            "pending": sum(1 for o in orders if o["status"] == "pending"),
            "cancelled": sum(1 for o in orders if o["status"] == "cancelled"),
        },
        "recent_orders": orders[-5:],  # Last 5 in full detail
        "note": f"Showing last 5 of {len(orders)} orders. Full history available on request."
    }
```

## Key Takeaways

1. **Strip irrelevant fields** before returning to Claude
2. **Consistent field names** across all tools for the same concept
3. **Include computed summaries** for large datasets
4. **Return structured JSON**, not string representations
5. **Format errors with the same care** as success results

---
id: "d2-t5-2-normalization"
title: "PostToolUse Normalization — Consistent Data Across Heterogeneous Sources"
domain: "d2"
taskRef: "T2.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "An international airport's baggage system. Bags arrive in different shapes, sizes, and with different tags from dozens of airlines. The system normalizes everything to a standard barcode before routing — so every downstream process works the same way regardless of which airline sent the bag."
examTrap: "Expecting Claude to handle data format inconsistencies gracefully. Claude can adapt to some variation, but inconsistent data formats degrade accuracy and require Claude to make assumptions. PostToolUse normalization eliminates this problem at the source."
keyPoints:
  - "PostToolUse hooks are the correct mechanism for normalizing data across heterogeneous tool sources — they run after tool execution, before Claude sees the result."
  - "Common normalization targets: timestamps (Unix → ISO 8601), status codes (numeric → string), currency (cents → dollars), IDs (different naming conventions)."
  - "Normalization should be transparent to Claude — it receives clean, consistent data without knowing it was transformed."
  - "Create a normalization schema that defines what each field should look like, then enforce it in PostToolUse hooks."
antiPatterns:
  - "Letting Claude handle format variations — adds prompt complexity and reduces reliability"
  - "Normalizing in the system prompt ('timestamps may be Unix or ISO, treat them the same') — ask Claude to do extra work for every response"
  - "Inconsistent normalization — some tools normalized, others not — forces Claude to know which is which"
tbChallenge: "You have three order management systems: Legacy (uses numeric status codes and Unix timestamps), V2 (uses string statuses and ISO dates), V3 (uses different string values and UTC offset dates). Design the PostToolUse normalization for all three."
---

## The Normalization Problem

```python
# Three systems, three different formats for the same data
legacy_order = {
    "order_id": 12345,          # integer
    "status": 3,                 # numeric: 1=pending, 2=processing, 3=shipped, 4=delivered
    "created_ts": 1703203200,    # Unix timestamp
    "total_cents": 4999          # amount in cents
}

v2_order = {
    "orderId": "ORD-12345",      # string with prefix
    "status": "shipped",         # string status
    "createdAt": "2023-12-22T00:00:00Z",  # ISO 8601
    "totalAmount": 49.99         # decimal dollars
}

v3_order = {
    "id": "12345",               # string, no prefix
    "order_status": "in_transit",# different string values
    "creation_date": "2023-12-22 00:00:00+00:00",  # different format
    "amount": "49.99"            # string
}
```

## PostToolUse Normalization Hook

```python
STATUS_MAPS = {
    # Legacy numeric codes
    1: "pending", 2: "processing", 3: "shipped", 4: "delivered", 5: "cancelled",
    # V3 different string values
    "in_transit": "shipped", "fulfilled": "delivered", "voided": "cancelled",
}

def normalize_order(raw: dict, tool_name: str) -> dict:
    """Normalize order data from any source to canonical format."""

    # Normalize order ID
    order_id = str(
        raw.get("order_id") or
        raw.get("orderId") or
        raw.get("id") or "unknown"
    ).replace("ORD-", "")

    # Normalize status
    raw_status = raw.get("status") or raw.get("order_status")
    status = STATUS_MAPS.get(raw_status, str(raw_status).lower())

    # Normalize timestamp to ISO 8601
    raw_ts = raw.get("created_ts") or raw.get("createdAt") or raw.get("creation_date")
    if isinstance(raw_ts, (int, float)):
        created_at = datetime.utcfromtimestamp(raw_ts).isoformat() + "Z"
    else:
        created_at = parse_datetime(str(raw_ts)).isoformat() + "Z"

    # Normalize amount to decimal dollars
    raw_amount = raw.get("total_cents") or raw.get("totalAmount") or raw.get("amount")
    amount = float(raw_amount) / 100 if isinstance(raw_amount, int) and raw_amount > 1000 \
             else float(raw_amount)

    return {
        "order_id": f"ORD-{order_id}",
        "status": status,
        "created_at": created_at,
        "amount": round(amount, 2),
        "_source_system": tool_name  # For debugging only
    }

# Register as PostToolUse hook
def order_normalization_hook(tool_name: str, result: dict, session: dict) -> dict:
    if tool_name in ("get_order_legacy", "get_order_v2", "get_order_v3"):
        return normalize_order(result, tool_name)
    return result
```

## Key Takeaways

1. **PostToolUse hooks** are the right place for normalization — transparent to Claude
2. **Define a canonical format** first, then normalize to it from all sources
3. **Cover all variation**: timestamps, status codes, amounts, IDs, field names
4. **Test edge cases** — what happens when fields are null, missing, or in unexpected format?

---
id: "d2-t5-3-context-efficiency"
title: "Tool Result Trimming — Context Window Efficiency"
domain: "d2"
taskRef: "T2.5"
order: 15
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A researcher who summarizes sources rather than photocopying entire documents. The full document exists and can be retrieved if needed — but the summary is what gets passed around during the analysis phase. Tool result trimming is this summarization at the architecture level."
examTrap: "Thinking that passing more context to Claude always produces better results. At some threshold, additional context dilutes attention on what matters. Tool results should be trimmed to the relevant portion — complete information elsewhere, essential information in the conversation."
keyPoints:
  - "Large tool results consume context window space that could be used for reasoning — trim aggressively."
  - "Return summaries to conversation, store full results externally for reference if needed."
  - "For long lists, return counts and summaries with the top N most relevant items."
  - "For large text blobs, extract only the relevant sections based on the current query."
  - "Context efficiency and result quality are inversely related at extremes — too little loses information, too much loses focus."
antiPatterns:
  - "Returning entire database query results when only a few fields are relevant"
  - "Passing full document text when only 2 paragraphs are relevant to the current question"
  - "Not trimming repetitive or low-value data before adding to conversation history"
  - "Assuming more context always improves Claude's responses"
tbChallenge: "Your tool returns a customer's full order history — 200 orders with all fields over 3 years. The current task is determining whether the customer is eligible for a loyalty upgrade. What do you return to Claude?"
---

## Targeted Trimming for the Current Task

```python
def trim_order_history_for_loyalty_check(orders: list, query_context: str) -> dict:
    """
    Trim 200 orders down to what's relevant for loyalty upgrade eligibility.
    Loyalty = based on: total spend, order frequency, recent activity.
    """
    # Calculate what matters for loyalty
    total_spend = sum(o["amount"] for o in orders)
    orders_last_12_months = [
        o for o in orders
        if datetime.fromisoformat(o["created_at"]) > datetime.now() - timedelta(days=365)
    ]
    orders_last_30_days = [
        o for o in orders
        if datetime.fromisoformat(o["created_at"]) > datetime.now() - timedelta(days=30)
    ]

    # Return only what's needed for the decision — not all 200 orders
    return {
        "summary_for_loyalty_assessment": {
            "total_lifetime_orders": len(orders),
            "total_lifetime_spend": total_spend,
            "orders_last_12_months": len(orders_last_12_months),
            "spend_last_12_months": sum(o["amount"] for o in orders_last_12_months),
            "orders_last_30_days": len(orders_last_30_days),
            "most_recent_order_date": max(o["created_at"] for o in orders) if orders else None,
        },
        "note": "Full order history available via get_order_history with date filters if needed"
    }
```

## The Trim-and-Reference Pattern

```python
# Store full data, return reference + summary
async def get_large_dataset(customer_id: str) -> dict:
    full_data = await fetch_all_customer_data(customer_id)

    # Store full data for potential follow-up
    reference_key = f"data:{customer_id}:{uuid.uuid4()}"
    await temporary_store.save(reference_key, full_data, ttl_seconds=3600)

    # Return summary to conversation
    return {
        "summary": generate_summary(full_data),
        "key_metrics": extract_key_metrics(full_data),
        "full_data_reference": reference_key,
        "note": "Full dataset stored. Call get_stored_data with the reference key if you need complete details."
    }
```

## Key Takeaways

1. **Trim tool results** to what's relevant for the current task
2. **Summaries + key metrics** beat full datasets for most decisions
3. **Store full data externally**, reference it in results if Claude might need it
4. **Include item counts** so Claude knows what's available vs what's shown
5. **Context efficiency = faster, cheaper, often more accurate responses**
