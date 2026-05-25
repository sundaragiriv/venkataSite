---
id: "d2-t5-3-context-efficiency"
title: "Tool Result Trimming — Keeping the Context Window Efficient"
domain: "d2"
taskRef: "T2.5"
order: 15
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A research assistant who summarizes sources rather than handing you entire documents. The full document exists in the library if you need it — but the summary is what gets passed around during analysis. Tool result trimming is this summarization at the architecture level."
examTrap: "Thinking that more context always produces better Claude responses. At some threshold, additional context dilutes attention on what matters. Trim tool results to the relevant portion for the current task."
keyPoints:
  - "Large tool results consume context window space needed for reasoning — trim to the relevant portion."
  - "For large datasets, return a summary plus the N most relevant items, not all items."
  - "Store full data externally and provide a reference key — Claude can request full details if needed."
  - "Trimming is task-specific — what's relevant depends on why the tool was called, not just what data exists."
  - "Include item counts so Claude knows total vs shown: 'Showing 5 of 200 orders.'"
antiPatterns:
  - "Returning all 200 orders when only recent history is relevant"
  - "Passing full document text when only 2 paragraphs answer the current question"
  - "Not telling Claude how much data was trimmed — it thinks it has the complete picture"
  - "Using the same trimming logic for all queries — relevance is context-dependent"
tbChallenge: "Design a trimming strategy for a tool that returns a customer's full 3-year order history (200 orders, all fields). The current task is checking loyalty upgrade eligibility. What do you return and what do you omit?"
---

## Task-Specific Trimming

The correct trim depends on why Claude called the tool:

```python
def get_order_history(customer_id: str, purpose: str = "general") -> dict:
    """
    Returns order history trimmed for the stated purpose.
    """
    all_orders = db.query("SELECT * FROM orders WHERE customer_id = ?", customer_id)

    if purpose == "loyalty_check":
        return trim_for_loyalty(all_orders)
    elif purpose == "recent_activity":
        return trim_for_recent(all_orders)
    elif purpose == "dispute_investigation":
        return trim_for_dispute(all_orders)
    else:
        return trim_default(all_orders)

def trim_for_loyalty(orders: list) -> dict:
    """What matters for loyalty: spend, frequency, recency."""
    now = datetime.now()
    last_12m = [o for o in orders if (now - datetime.fromisoformat(o["date"])).days <= 365]

    return {
        "total_orders": len(orders),
        "total_spend_lifetime": sum(o["amount"] for o in orders),
        "orders_last_12_months": len(last_12m),
        "spend_last_12_months": sum(o["amount"] for o in last_12m),
        "most_recent_order": max(orders, key=lambda o: o["date"])["date"] if orders else None,
        "note": f"Loyalty metrics calculated from {len(orders)} total orders."
    }
```

## The Store-and-Reference Pattern

```python
async def get_large_result(query_id: str) -> dict:
    full_data = await fetch_large_dataset(query_id)

    # Store full data temporarily
    ref_key = f"tmp:{query_id}:{int(time.time())}"
    await temp_store.save(ref_key, full_data, ttl=3600)

    # Return summary to conversation
    return {
        "item_count": len(full_data),
        "summary": summarize(full_data),
        "top_items": full_data[:10],
        "full_data_available": ref_key,
        "note": f"Showing 10 of {len(full_data)} items. Use ref key to access all."
    }
```

## Key Takeaways

1. **Trim to the task** — relevance is context-specific
2. **Always include total count** when showing a subset
3. **Store full data with reference key** for potential follow-up
4. **Summary + top N beats full dataset** for most Claude reasoning tasks
5. **Trimming is not loss** — it's signal optimization for Claude's attention
