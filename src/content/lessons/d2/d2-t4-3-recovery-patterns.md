---
id: "d2-t4-3-recovery-patterns"
title: "Tool Error Recovery Patterns"
domain: "d2"
taskRef: "T2.4"
order: 12
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A GPS that reroutes when a road is closed. It doesn't repeat the same blocked route — it finds an alternative. But it also doesn't pretend the road is open. It acknowledges the closure and adjusts."
examTrap: "Treating all errors the same way. The recovery pattern depends entirely on the error category — transient errors get retried, validation errors require input fixes, business errors need alternative workflows, permission errors need authorization changes."
keyPoints:
  - "Circuit breaker pattern: after N consecutive failures, stop trying and fail fast — prevents cascading failures."
  - "Fallback pattern: when primary tool fails, try a secondary tool that provides similar (possibly lower quality) results."
  - "Graceful degradation: return partial results with clear indication that some data is missing."
  - "Alternative workflow pattern: when the requested action fails due to business rules, offer a different path to the user's goal."
  - "Never present partial results as complete — always label what's missing and why."
antiPatterns:
  - "Retrying transient errors infinitely without circuit breaking"
  - "Using fallback for permanent errors (validation, permission) — fallback doesn't fix these"
  - "Presenting partial results as complete without labeling missing components"
  - "No retry for transient errors — treating all failures as permanent"
tbChallenge: "Your knowledge base search tool is timing out (transient). Your fallback is web search. Design the recovery logic: when do you try the fallback, when do you tell the user what happened, and what does the response look like?"
---

## Recovery Pattern 1: Retry with Backoff

```python
async def with_retry(tool_fn, max_retries=3, base_delay=1):
    """For transient errors only."""
    last_error = None
    for attempt in range(max_retries):
        try:
            return await tool_fn()
        except ToolError as e:
            if e.category != "transient":
                raise  # Don't retry non-transient errors
            last_error = e
            if attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)  # 1s, 2s, 4s
                await asyncio.sleep(delay)
    raise last_error
```

## Recovery Pattern 2: Circuit Breaker

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failures = 0
        self.threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.last_failure_time = None
        self.state = "closed"  # closed=normal, open=blocking

    async def call(self, tool_fn):
        if self.state == "open":
            if time.time() - self.last_failure_time > self.reset_timeout:
                self.state = "half-open"  # Try once
            else:
                raise CircuitOpenError("Tool circuit breaker is open — service unavailable")

        try:
            result = await tool_fn()
            if self.state == "half-open":
                self.state = "closed"
                self.failures = 0
            return result
        except ToolError as e:
            if e.category == "transient":
                self.failures += 1
                self.last_failure_time = time.time()
                if self.failures >= self.threshold:
                    self.state = "open"
            raise
```

## Recovery Pattern 3: Fallback

```python
async def search_with_fallback(query: str) -> dict:
    """Try knowledge base first, fall back to web search."""
    try:
        result = await search_knowledge_base(query)
        return {"source": "knowledge_base", "result": result, "quality": "high"}
    except ToolError as e:
        if e.category == "transient":
            # Try fallback for transient failures
            try:
                result = await web_search(query)
                return {
                    "source": "web_search",
                    "result": result,
                    "quality": "medium",
                    "note": "Knowledge base unavailable — results from web search may be less accurate"
                }
            except Exception:
                pass
        # For non-transient errors, don't use fallback — the problem needs fixing
        raise
```

## Recovery Pattern 4: Graceful Degradation

```python
async def get_customer_full_profile(customer_id: str) -> dict:
    """Gets all customer data — degrades gracefully if some sources fail."""
    results = {"customer_id": customer_id}
    missing_data = []

    # Try to get each data component independently
    for component, fetch_fn in [
        ("profile",         get_customer_profile),
        ("order_history",   get_order_history),
        ("payment_history", get_payment_history),
        ("support_history", get_support_history),
    ]:
        try:
            results[component] = await fetch_fn(customer_id)
        except ToolError as e:
            results[component] = None
            missing_data.append({"component": component, "reason": str(e)})

    if missing_data:
        results["_incomplete"] = True
        results["_missing_components"] = missing_data
        results["_note"] = f"Profile is incomplete — {len(missing_data)} components unavailable"

    return results
```

## Key Takeaways

1. **Retry with backoff** for transient errors — exponential delays
2. **Circuit breaker** prevents cascading failures under sustained outage
3. **Fallback** provides alternative path for transient failures only
4. **Graceful degradation** returns partial data, clearly labeled as incomplete
5. **Never use fallback for validation or permission errors** — different root cause
