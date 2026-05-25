---
id: "d1-t5-1-state-basics"
title: "Agent State Management — What Agents Remember and How"
domain: "d1"
taskRef: "T1.6"
order: 13
xp: 30
tag: "Core"
duration: "8 min"
analogy: "A detective's case file. The detective doesn't try to remember everything in their head — they write case notes, maintain evidence logs, and keep a timeline. When they come back to the case after a break, they read the case file. Your agent's messages array is that case file."
examTrap: "Thinking that state must be managed externally in a database for production agents. The messages array IS the state — it contains the complete record of everything that happened. External state is only needed for things that must survive beyond a single conversation session."
keyPoints:
  - "The messages array is the agent's state — it contains the complete conversation history including all tool calls and results."
  - "State within a session is managed by accumulating messages — never reinitialize the array mid-session."
  - "State across sessions requires explicit serialization — save the messages array (or a summary) to persistent storage."
  - "Stateful design: every tool result, every Claude response, every decision is recorded in the conversation history."
  - "For long-running agents, the messages array grows without bound — context window management is required to prevent overflow."
antiPatterns:
  - "Reinitializing messages = [] at the start of each loop iteration"
  - "Relying on agent 'memory' without appending results to the conversation history"
  - "Treating the messages array as temporary — it IS the state"
  - "Not planning for context window growth in long-running agents"
tbChallenge: "An agent is processing a long-running task and has been running for 45 minutes. The messages array now contains 200 tool calls and results. What are the risks and what are your options?"
---

## The Messages Array Is the State

Every interaction in Claude's agentic loop is recorded in the messages array:

```python
messages = [
    # Initial user request
    {"role": "user", "content": "Analyze our Q3 revenue data and identify growth opportunities"},

    # Claude's first response — decided to search for data
    {"role": "assistant", "content": [
        {"type": "text", "text": "I'll start by pulling the Q3 revenue data."},
        {"type": "tool_use", "id": "tool_001", "name": "get_revenue_data",
         "input": {"quarter": "Q3", "year": 2024}}
    ]},

    # Tool result
    {"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": "tool_001",
         "content": '{"total": 2400000, "by_product": {...}, "by_region": {...}}'}
    ]},

    # Claude's second response — noticed something interesting, wants more data
    {"role": "assistant", "content": [
        {"type": "text", "text": "Q3 revenue was $2.4M. APAC region shows 47% growth. Let me dig deeper."},
        {"type": "tool_use", "id": "tool_002", "name": "get_segment_breakdown",
         "input": {"region": "APAC", "quarter": "Q3"}}
    ]},

    # ... this continues until task is complete
]
```

This array contains:
- Every decision Claude made
- Every tool it called and why
- Every result it received
- Its reasoning at each step

It IS the agent's state. Lose it and you lose all context.

## State Within a Session

Within a single agentic run, state management is simple: append correctly and never reset.

```python
def run_agent(user_query: str, tools: list) -> str:
    # Initialize once
    messages = [{"role": "user", "content": user_query}]

    while True:
        response = call_claude(messages, tools)

        if response.stop_reason == "end_turn":
            return extract_text(response)

        # Append Claude's response to state
        messages.append({"role": "assistant", "content": response.content})

        # Execute tools, append results to state
        tool_results = execute_all_tools(response)
        messages.append({"role": "user", "content": tool_results})

        # messages now contains the complete state of this session
        # DO NOT reset it. DO NOT create a new messages array.
```

## State Across Sessions

When an agent needs to pause and resume:

```python
import json
from datetime import datetime

class PersistentAgent:
    def __init__(self, session_id: str, storage: Storage):
        self.session_id = session_id
        self.storage = storage

    def save_session(self, messages: list, metadata: dict):
        """Persist the complete session state."""
        session_data = {
            "session_id": self.session_id,
            "messages": messages,
            "metadata": metadata,
            "saved_at": datetime.utcnow().isoformat(),
            "message_count": len(messages)
        }
        self.storage.save(f"session:{self.session_id}", session_data)

    def load_session(self) -> tuple[list, dict]:
        """Restore a previous session."""
        data = self.storage.load(f"session:{self.session_id}")
        if not data:
            return [], {}
        return data["messages"], data["metadata"]

    async def run(self, user_query: str = None) -> str:
        # Try to restore existing session
        messages, metadata = self.load_session()

        if not messages:
            # New session
            messages = [{"role": "user", "content": user_query}]
            metadata = {"created_at": datetime.utcnow().isoformat()}

        while True:
            response = await call_claude(messages, self.tools)

            if response.stop_reason == "end_turn":
                result = extract_text(response)
                # Save final state
                self.save_session(messages, {**metadata, "completed": True})
                return result

            messages.append({"role": "assistant", "content": response.content})
            tool_results = await execute_all_tools(response)
            messages.append({"role": "user", "content": tool_results})

            # Save state after each iteration — crash recovery
            self.save_session(messages, metadata)
```

## Managing Context Window Growth

For long-running agents, the messages array grows unbounded. Options:

### Option 1: Summary injection at threshold

```python
MAX_MESSAGES = 40

if len(messages) > MAX_MESSAGES:
    # Summarize old messages, keep recent ones
    old_messages = messages[:-10]
    recent_messages = messages[-10:]

    summary = await call_claude(
        f"Summarize the key findings and decisions from this conversation:\n\n"
        f"{format_messages(old_messages)}"
    )

    # Start fresh with summary + recent messages
    messages = [
        {"role": "user", "content": f"Previous session summary:\n{summary}"},
        {"role": "assistant", "content": "Understood. Continuing from where we left off."},
        *recent_messages
    ]
```

### Option 2: Extract facts to persistent store

```python
# After each tool result, extract structured facts
async def extract_and_store_facts(tool_name: str, tool_result: str, fact_store: dict):
    if tool_name == "get_revenue_data":
        # Parse and store specific facts outside conversation history
        revenue_data = json.loads(tool_result)
        fact_store["q3_revenue"] = revenue_data["total"]
        fact_store["q3_regions"] = revenue_data["by_region"]
        # Return abbreviated result to conversation history
        return f"Revenue data retrieved: ${revenue_data['total']:,.0f} total"
    return tool_result
```

The full data lives in fact_store (external, no context impact). The conversation history only stores the summary.

## Key Takeaways

1. **Messages array IS the state** — not a log, the actual state
2. **Never reinitialize within a session** — always append, never reset
3. **Cross-session state requires serialization** — save messages to persistent storage
4. **Save after each iteration** — enables crash recovery
5. **Context window grows with messages** — plan for summarization or fact extraction
6. **External state for large data** — keep conversation history concise, details in storage
