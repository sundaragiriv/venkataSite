---
id: "d1-t6-1-state-design"
title: "Stateful vs Stateless Agent Design — Tradeoffs and When to Choose Each"
domain: "d1"
taskRef: "T1.6"
order: 21
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A doctor's appointment vs an emergency room visit. Your doctor knows your history — stateful. The ER treats you based only on what's in front of them right now — stateless (they'll ask for your history, but they start fresh). Each is appropriate for its context."
examTrap: "Thinking stateful is always better because it has more context. Stateless design is often preferable for high-volume, short-duration tasks where the overhead of state management exceeds its benefit."
keyPoints:
  - "Stateful agents maintain conversation history across multiple turns — high context, higher memory cost, better for complex multi-step tasks."
  - "Stateless agents start fresh each request with only the current input — lower cost, simpler, better for high-volume short tasks."
  - "Most production systems combine both: a stateful coordinator managing stateless specialized workers."
  - "Stateful designs require explicit state management — persist, restore, and eventually expire or archive the state."
  - "Stateless designs require all necessary context to be passed in the request — no reliance on accumulated history."
antiPatterns:
  - "Using stateful design for high-volume simple tasks — context window fills, cost explodes"
  - "Using stateless design for complex multi-step tasks — context must be re-passed in full every time"
  - "Not expiring or archiving old stateful sessions — state accumulates indefinitely"
  - "Treating the coordinator as stateless in a multi-agent system — the coordinator needs state to track progress"
tbChallenge: "You're building a customer support system that handles 50,000 conversations per day. Each conversation is typically 3-5 turns. Should your agents be stateful or stateless? What's your reasoning?"
---

## Stateful Design

The agent maintains and accumulates context across multiple interactions.

**When to use:**
- Multi-step workflows where each step builds on prior steps
- Tasks that take multiple turns to complete
- Complex reasoning that requires tracking many pieces of information
- Situations where re-providing context would be expensive or error-prone

**Implementation:**

```python
class StatefulAgent:
    """
    Maintains conversation history across turns.
    Each new request appends to the existing history.
    """
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.messages = []  # Accumulates across turns

    async def process_turn(self, user_input: str) -> str:
        # Append new input to accumulated history
        self.messages.append({"role": "user", "content": user_input})

        response = await call_claude(self.messages, self.tools)

        if response.stop_reason == "end_turn":
            result = extract_text(response)
            self.messages.append({"role": "assistant", "content": result})
            return result

        # Handle tool calls, append to history...
        # Context grows with each turn
```

**Tradeoffs:**

| Benefit | Cost |
|---|---|
| Rich context available | Memory grows with each turn |
| No re-providing prior context | State must be persisted across turns |
| Better coherence for complex tasks | Context window eventually fills |
| Natural conversation flow | Session management complexity |

## Stateless Design

Each request is processed independently with all necessary context provided in that request.

**When to use:**
- High-volume tasks with limited context per task
- Tasks that are fully specified in a single request
- Independent workers in a pipeline where context is passed explicitly
- Situations where conversation history adds no value

**Implementation:**

```python
class StatelessAgent:
    """
    Each call is independent. No accumulated history.
    All context must be provided in each request.
    """
    async def process_request(self, context: dict) -> str:
        # Build complete context for this request
        prompt = self.build_complete_prompt(context)

        # Fresh messages array every time
        messages = [{"role": "user", "content": prompt}]

        response = await call_claude(messages, self.tools)
        return extract_result(response)

    def build_complete_prompt(self, context: dict) -> str:
        """
        Must include everything needed — no reliance on prior state.
        """
        return f"""
Task: {context['task']}

Customer Information:
{json.dumps(context['customer_data'])}

Order Information:
{json.dumps(context['order_data'])}

Relevant Policy:
{context['applicable_policy']}

Instructions: {context['instructions']}
"""
```

## The Hybrid Pattern

Most production systems use both:

```
Stateful Coordinator
    │
    │ (tracks overall progress, accumulated findings)
    │
    ├──────────────────────────────────┐
    │                                  │
    ▼                                  ▼
Stateless Worker A               Stateless Worker B
(receives full context           (receives full context
 for its specific task)           for its specific task)
```

The coordinator is stateful — it needs to track which subagents have completed, accumulate their results, and maintain the overall workflow state.

The workers are stateless — each receives everything they need in their prompt, executes, returns a result. Simple, parallelizable, cost-effective.

```python
class HybridSystem:
    def __init__(self):
        # Coordinator is stateful
        self.coordinator = StatefulCoordinator(session_id=generate_id())

        # Workers are stateless
        self.search_worker = StatelessSearchAgent()
        self.analysis_worker = StatelessAnalysisAgent()
        self.synthesis_worker = StatelessSynthesisAgent()

    async def process_request(self, user_request: str) -> str:
        # Coordinator plans work (stateful — knows overall progress)
        plan = await self.coordinator.create_plan(user_request)

        # Workers execute their tasks (stateless — each gets full context)
        results = await asyncio.gather(*[
            self.search_worker.process_request(self.build_search_context(plan, task))
            for task in plan.search_tasks
        ])

        # Coordinator tracks results and creates next steps (stateful)
        return await self.coordinator.synthesize(results)
```

## State Expiration and Archiving

Stateful sessions must be managed:

```python
class SessionManager:
    SESSION_TTL_HOURS = 24  # Active sessions expire after 24 hours
    ARCHIVE_AFTER_DAYS = 30  # Archive expired sessions after 30 days

    def cleanup_expired_sessions(self):
        expired = self.storage.query(
            "status = 'active' AND updated_at < NOW() - INTERVAL '24 hours'"
        )
        for session in expired:
            session["status"] = "expired"
            self.storage.save(session)

    def archive_old_sessions(self):
        old = self.storage.query(
            "status = 'expired' AND updated_at < NOW() - INTERVAL '30 days'"
        )
        for session in old:
            self.archive.save(session)
            self.storage.delete(session["id"])
```

## Key Takeaways

1. **Stateful** for complex multi-step tasks that require accumulated context
2. **Stateless** for high-volume simple tasks where context is fully provided per request
3. **Hybrid** for production systems — stateful coordinator, stateless workers
4. **State must be managed** — persistence, expiration, archiving
5. **Stateless workers** are simpler to scale and parallelize
6. **Coordinator needs state** to track overall progress in multi-agent systems
