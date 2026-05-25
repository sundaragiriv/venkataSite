---
id: "d5-t2-2-recovery-patterns"
title: "Recovery Patterns — Retry, Fallback, Graceful Degradation"
domain: "d5"
taskRef: "T5.2"
order: 5
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A GPS rerouting when a road is closed. It doesn't repeat the blocked route. It doesn't pretend the road is open. It acknowledges the closure, finds an alternative, and continues. Error recovery in agentic systems works the same way — acknowledge, adapt, continue."
examTrap: "Using the same recovery strategy for all error types. Transient errors get retried. Permission errors need authorization changes — retrying is pointless. Business rule violations need alternative actions, not retries."
keyPoints:
  - "Retry with exponential backoff for transient errors only — network timeouts, rate limits, temporary unavailability."
  - "Circuit breaker pattern: after N consecutive failures, stop trying and fail fast — prevents cascading failures."
  - "Fallback: alternative data source or reduced-quality result when primary fails — only for transient failures."
  - "Graceful degradation: return partial results clearly labeled as incomplete rather than failing entirely."
  - "Never use fallback or retry for permission errors or validation errors — fix the root cause instead."
antiPatterns:
  - "Retrying permission errors — authorization hasn't changed between retries"
  - "Infinite retry loops without circuit breaking"
  - "Fallback that silently provides lower-quality data without flagging the quality reduction"
  - "Treating all errors as retryable — wastes time and cost on unretryable errors"
tbChallenge: "Your knowledge base search returns a 503. Your web search backup also fails. Your circuit breaker has tripped after 5 failures. What does the recovery chain look like and what does the coordinator ultimately receive?"
---

## Retry With Exponential Backoff

```python
import asyncio
from typing import Callable, TypeVar

T = TypeVar('T')

async def retry_transient(
    fn: Callable,
    max_retries: int = 3,
    base_delay: float = 1.0
) -> T:
    """Only for transient errors. Never for permission/validation/business errors."""
    last_error = None
    
    for attempt in range(max_retries):
        try:
            return await fn()
        except (TimeoutError, ServiceUnavailableError, RateLimitError) as e:
            last_error = e
            if attempt < max_retries - 1:
                delay = base_delay * (2 ** attempt)  # 1s, 2s, 4s
                await asyncio.sleep(delay)
        except (PermissionError, ValidationError, BusinessRuleError):
            raise  # Never retry these — raise immediately
    
    raise last_error
```

## Circuit Breaker

```python
class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, reset_timeout: float = 60.0):
        self.failures = 0
        self.threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.last_failure_time = None
        self.state = "closed"  # closed=normal, open=blocking
    
    async def call(self, fn: Callable) -> any:
        if self.state == "open":
            elapsed = time.time() - self.last_failure_time
            if elapsed > self.reset_timeout:
                self.state = "half-open"
            else:
                raise CircuitOpenError(
                    f"Circuit open — service unavailable. "
                    f"Retry in {self.reset_timeout - elapsed:.0f}s."
                )
        
        try:
            result = await fn()
            if self.state == "half-open":
                self.state = "closed"
                self.failures = 0
            return result
        except Exception as e:
            self.failures += 1
            self.last_failure_time = time.time()
            if self.failures >= self.threshold:
                self.state = "open"
            raise
```

## Graceful Degradation

```python
async def get_customer_profile_with_degradation(customer_id: str) -> dict:
    """Returns whatever data is available, clearly labeled."""
    
    results = {"customer_id": customer_id, "_incomplete": False, "_missing": []}
    
    for component, fetch_fn in [
        ("profile",       lambda: get_profile(customer_id)),
        ("order_history", lambda: get_orders(customer_id)),
        ("payment_data",  lambda: get_payments(customer_id)),
    ]:
        try:
            results[component] = await fetch_fn()
        except Exception as e:
            results[component] = None
            results["_incomplete"] = True
            results["_missing"].append({
                "component": component,
                "error": str(e)
            })
    
    if results["_incomplete"]:
        results["_note"] = (
            f"Profile is incomplete. Missing: "
            f"{', '.join(m['component'] for m in results['_missing'])}. "
            f"Decisions based on available data only."
        )
    
    return results
```

## Recovery Decision Matrix

```python
def choose_recovery(error_category: str, attempt: int) -> str:
    """Which recovery strategy based on error type and attempt number."""
    
    strategies = {
        "transient": {
            0: "retry",
            1: "retry_with_backoff",
            2: "fallback",
            3: "graceful_degrade"
        },
        "permission":   {0: "fail_with_message"},  # Never retry
        "validation":   {0: "fail_with_message"},  # Fix the input
        "business":     {0: "alternative_action"}, # Different workflow
        "unknown":      {0: "retry", 1: "escalate_to_human"},
    }
    
    category_strategies = strategies.get(error_category, {"0": "fail"})
    return category_strategies.get(min(attempt, max(category_strategies.keys())), "fail")
```

## Key Takeaways

1. **Retry for transient** — exponential backoff, cap at 3 attempts
2. **Circuit breaker** — prevents cascading failure under sustained outage
3. **Fallback** — alternative source for transient failures only, label quality reduction
4. **Graceful degradation** — partial results with clear incomplete labels
5. **Never retry permission/validation** — fix the root cause
