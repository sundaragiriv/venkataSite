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
examTrap: "Expecting Claude to handle data format inconsistencies gracefully in its reasoning. Claude can adapt, but inconsistent formats degrade accuracy and require Claude to make assumptions. PostToolUse normalization eliminates this problem at the source."
keyPoints:
  - "PostToolUse hooks run after tool execution, before Claude sees the result — the correct place for normalization."
  - "Common normalization targets: timestamps (Unix → ISO 8601), status codes (numeric → string), currency (cents → dollars), inconsistent field names."
  - "Normalization is transparent to Claude — it receives clean, consistent data without knowing it was transformed."
  - "Define a canonical schema first, then write normalizers to convert from each source format to canonical."
  - "Test normalization with null values, missing fields, and unexpected formats — edge cases will occur in production."
antiPatterns:
  - "Asking Claude to handle format variations via system prompt — adds complexity to every response"
  - "Normalizing some tools but not others — forces Claude to know which are normalized"
  - "Normalizing in the tool itself — better separation of concerns to normalize in PostToolUse"
tbChallenge: "You have three order management systems with different timestamp formats: Unix integer, ISO 8601 string, and UTC offset string. Write the normalization logic and show how you register it as a PostToolUse hook."
---

## The Multi-System Normalization Problem

```python
# Three systems, different formats for the same concept
legacy_order = {"status": 3, "created_ts": 1703203200, "total_cents": 4999}
v2_order = {"status": "shipped", "createdAt": "2023-12-22T00:00:00Z", "totalAmount": 49.99}
v3_order = {"order_status": "in_transit", "creation_date": "2023-12-22 00:00:00+00:00", "amount": "49.99"}
```

## Canonical Format + Normalization

```python
# Step 1: Define canonical format
CANONICAL_ORDER = {
    "order_id": str,        # "ORD-12345"
    "status": str,          # "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    "created_at": str,      # ISO 8601: "2023-12-22T00:00:00Z"
    "amount": float,        # 49.99 (dollars, 2 decimal places)
}

# Step 2: Status mapping across all systems
STATUS_MAP = {
    # Legacy numeric
    1: "pending", 2: "processing", 3: "shipped", 4: "delivered", 5: "cancelled",
    # V3 different strings
    "in_transit": "shipped", "fulfilled": "delivered", "voided": "cancelled",
}

# Step 3: Normalization function
def normalize_order(raw: dict, source: str) -> dict:
    raw_status = raw.get("status") or raw.get("order_status")
    status = STATUS_MAP.get(raw_status, str(raw_status))

    raw_ts = raw.get("created_ts") or raw.get("createdAt") or raw.get("creation_date")
    if isinstance(raw_ts, (int, float)):
        created_at = datetime.utcfromtimestamp(raw_ts).isoformat() + "Z"
    else:
        created_at = datetime.fromisoformat(str(raw_ts).replace(" ", "T")).isoformat() + "Z"

    raw_amount = raw.get("total_cents") or raw.get("totalAmount") or raw.get("amount", 0)
    if isinstance(raw_amount, int) and raw_amount > 10000:
        amount = raw_amount / 100  # cents to dollars
    else:
        amount = float(raw_amount)

    order_id = str(raw.get("order_id") or raw.get("id", "unknown")).replace("ORD-", "")

    return {
        "order_id": f"ORD-{order_id}",
        "status": status,
        "created_at": created_at,
        "amount": round(amount, 2),
    }

# Step 4: Register as PostToolUse hook
ORDER_TOOL_NAMES = {"get_order_legacy", "get_order_v2", "get_order_v3"}

def order_normalization_hook(tool_name: str, result: dict, session: dict) -> dict:
    if tool_name in ORDER_TOOL_NAMES:
        return normalize_order(result, tool_name)
    return result  # Pass through unchanged for other tools
```

## Key Takeaways

1. **PostToolUse** is the right place — transparent to Claude, consistent output
2. **Define canonical format first** — then build normalizers toward it
3. **Handle null and missing fields explicitly** — they will occur
4. **Test with all source system formats** before deploying
5. **One normalization hook per data entity** (orders, customers, payments)
