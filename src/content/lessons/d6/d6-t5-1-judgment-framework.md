---
id: "d6-t5-1-judgment-framework"
title: "The Two-Right-Answers Pattern — Superior Architecture Judgment"
domain: "d6"
taskRef: "T6.5"
order: 9
xp: 50
tag: "⚡ MOST CRITICAL"
duration: "12 min"
analogy: "A senior engineer vs a junior engineer reviewing a PR. The junior says 'it works.' The senior says 'it works now, but this approach will create operational complexity at scale that the other approach avoids.' Both approaches work. One is architecturally superior. The CCA exam tests senior-engineer judgment."
examTrap: "Choosing based on what 'sounds right' or what you'd personally prefer. Two-right-answers questions test specific architectural principles: determinism over probabilism, explicit over implicit, minimum footprint, observable systems, and fail-loud over fail-silent."
keyPoints:
  - "Both options work technically — the question is which is architecturally superior and why."
  - "Principle 1: Deterministic enforcement beats probabilistic guidance for critical requirements."
  - "Principle 2: Explicit over implicit — if in doubt, make behavior explicit and auditable."
  - "Principle 3: Minimum footprint — request only what's needed, prefer reversible actions."
  - "Principle 4: Fail loudly over silently — a visible failure is easier to fix than invisible bad data."
  - "Principle 5: Observable systems — can you see what happened? If not, the design is wrong."
antiPatterns:
  - "Choosing based on which option is shorter to implement — wrong criterion"
  - "Choosing based on which sounds more sophisticated — wrong criterion"
  - "Not applying a specific principle — guessing instead of reasoning"
  - "Ignoring the word 'always' or 'must' in the scenario — these signal deterministic enforcement required"
tbChallenge: "Walk me through a two-right-answers question: Option A — add a system prompt instruction saying 'always verify identity before refunds'. Option B — add a PreToolUse hook that blocks process_refund until get_customer has been called this session. Both work. Which is architecturally superior and exactly which principle makes it so?"
---

## The Five Principles for Two-Right-Answers Questions

### Principle 1: Deterministic > Probabilistic for Critical Requirements

```python
# Signal words: "must always", "never permitted", "required for compliance"
# These signal: deterministic enforcement required

# Option A: Prompt guidance (probabilistic)
system_prompt = "Always verify customer identity before processing refunds."
# Works 99.9% of the time. Fails 0.1%. At 10,000 refunds/day = 10 failures/day.

# Option B: Hook enforcement (deterministic)
def pre_refund_hook(tool_name, tool_input, session):
    if tool_name == "process_refund" and not session.get("customer_verified"):
        return {"blocked": True, "error": "Identity not verified"}
# Works 100% of the time. No exceptions.

# Principle: For "must always" requirements → Option B is architecturally superior
```

### Principle 2: Explicit > Implicit

```python
# Signal words: "might", "could", "sometimes"
# These signal: make behavior explicit and auditable

# Option A: Implicit — subagent makes its own decision
coordinator_prompt = "Spawn appropriate subagents as needed."
# What subagents were spawned? Unknown. Why? Unknown. Auditable? No.

# Option B: Explicit — coordinator documents its decisions
coordinator_prompt = """
For each request, explicitly state:
1. Which subagents you're spawning and why
2. What information each will receive
3. How you'll synthesize their results
"""
# Decisions are visible, auditable, debuggable.

# Principle: For audit/observability requirements → explicit design wins
```

### Principle 3: Minimum Footprint

```python
# Signal words: "all available", "just in case", "full access"
# These signal: minimum footprint principle applies

# Option A: Maximum access "just in case"
agent_tools = all_20_available_tools  # "might need any of them"

# Option B: Minimum necessary access
agent_tools = [get_customer, get_order, send_email]  # only what this role needs

# Principle: Minimum footprint → Option B
# Why: reduces blast radius, improves tool selection reliability
```

### Principle 4: Fail Loudly

```python
# Signal words: "default values", "best effort", "continue anyway"
# These signal: fail-loud vs fail-silent decision

# Option A: Fail silently with defaults
def get_data():
    try:
        return fetch_data()
    except Exception:
        return {"revenue": 0, "customers": 0}  # Silent failure with wrong data

# Option B: Fail loudly with structured error
def get_data():
    try:
        return fetch_data()
    except Exception as e:
        return {
            "error": True,
            "error_type": type(e).__name__,
            "message": str(e),
            "is_retryable": isinstance(e, TimeoutError)
        }

# Principle: Fail-loud → Option B
# Why: coordinator can make informed decisions; Option A produces silent wrong answers
```

### Principle 5: Observable Systems

```python
# Signal words: "we'd know if", "how would you detect"
# These signal: observability requirement

# Option A: Opaque
async def process_batch(items):
    results = await asyncio.gather(*[process(i) for i in items])
    return [r for r in results if r]  # Failures silently dropped

# Option B: Observable
async def process_batch(items):
    results = await asyncio.gather(*[process(i) for i in items], return_exceptions=True)
    
    successes = [r for r in results if not isinstance(r, Exception)]
    failures  = [r for r in results if isinstance(r, Exception)]
    
    log.info(f"Batch: {len(successes)} success, {len(failures)} failures")
    if failures:
        log.error(f"Failures: {[str(f) for f in failures]}")
    
    return {"successes": successes, "failures": failures}

# Principle: Observable → Option B
# Why: problems are visible and diagnosable
```

## Applying the Framework to the Teach-Back

```
Question: Prompt instruction vs PreToolUse hook for identity verification?

Principle 1 applies: "always verify identity before refunds" = "must always" = critical requirement
→ Deterministic enforcement required
→ Prompt guidance is probabilistic (0.1% failure rate)
→ PreToolUse hook is deterministic (0% failure rate)
→ Option B (hook) is architecturally superior

The hook enforces the requirement programmatically.
The prompt guides behavior probabilistically.
For a financial compliance requirement, programmatic wins.
```

## Key Takeaways

1. **Determinism beats probabilism** for "must always" / "never" requirements
2. **Explicit beats implicit** for auditable systems
3. **Minimum footprint** when given "all available" vs "necessary only"
4. **Fail loudly** when given "default values" vs "structured error"
5. **Apply a principle** — don't guess. Two-right-answers questions always have a specific principle that resolves them.
