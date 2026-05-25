---
id: "d1-t6-3-crash-recovery"
title: "Crash Recovery — Building Agents That Survive Failures"
domain: "d1"
taskRef: "T1.6"
order: 15
xp: 35
tag: "Core"
duration: "8 min"
analogy: "A flight plan with checkpoints. If the plane has to divert due to weather, it can resume from the last checkpoint rather than returning to the departure airport. Your agent's state checkpoints are those waypoints — crash and resume from the last known good state."
examTrap: "Thinking crash recovery requires complex infrastructure. The simplest effective pattern is: save state after every iteration, load state on startup. If the agent crashed, it loads the last saved state and continues."
keyPoints:
  - "Crash recovery requires saving agent state (messages array + metadata) after every loop iteration, before returning control to the caller."
  - "On agent startup, check for an existing saved state — if found, resume from that point rather than starting over."
  - "Each agent in a multi-agent system should export its state independently — the coordinator loads a manifest of agent states on resume."
  - "State export format matters: include enough context to reconstruct the agent's situation without the raw conversation history."
  - "Idempotent tool calls are safe to re-execute on recovery — non-idempotent calls (sending emails, processing payments) require deduplication."
antiPatterns:
  - "Saving state only at the end of a run — loses all progress on crash"
  - "Not checking for existing state on startup — always starts over"
  - "Re-executing non-idempotent tools on recovery without checking if they already ran"
  - "Saving raw messages array only — should also save structured metadata for faster recovery"
tbChallenge: "Design crash recovery for a multi-agent research system that has already run for 2 hours and completed 8 of 12 planned subagents when it crashes. How does it know where to resume?"
---

## The Checkpoint Pattern

The simplest effective crash recovery: save after every iteration, load on startup.

```python
class CrashRecoverableAgent:
    def __init__(self, run_id: str, storage: Storage):
        self.run_id = run_id
        self.storage = storage
        self.checkpoint_key = f"checkpoint:{run_id}"

    def save_checkpoint(self, messages: list, metadata: dict):
        """Called after every successful iteration."""
        checkpoint = {
            "run_id": self.run_id,
            "messages": messages,
            "metadata": metadata,
            "iteration": metadata.get("iteration", 0),
            "saved_at": datetime.utcnow().isoformat(),
            "status": "in_progress"
        }
        self.storage.save(self.checkpoint_key, checkpoint)

    def load_checkpoint(self) -> tuple[list, dict] | None:
        """Called on startup — returns None if no checkpoint exists."""
        checkpoint = self.storage.load(self.checkpoint_key)
        if checkpoint and checkpoint["status"] == "in_progress":
            return checkpoint["messages"], checkpoint["metadata"]
        return None

    def mark_complete(self):
        """Mark the run as complete so it's not accidentally resumed."""
        checkpoint = self.storage.load(self.checkpoint_key)
        if checkpoint:
            checkpoint["status"] = "complete"
            checkpoint["completed_at"] = datetime.utcnow().isoformat()
            self.storage.save(self.checkpoint_key, checkpoint)

    async def run(self, initial_query: str) -> str:
        # Check for existing checkpoint
        existing = self.load_checkpoint()

        if existing:
            messages, metadata = existing
            print(f"Resuming from iteration {metadata.get('iteration', 0)}")
        else:
            messages = [{"role": "user", "content": initial_query}]
            metadata = {"iteration": 0, "started_at": datetime.utcnow().isoformat()}
            print("Starting fresh run")

        while True:
            response = await call_claude(messages, self.tools)

            if response.stop_reason == "end_turn":
                result = extract_text(response)
                self.mark_complete()
                return result

            messages.append({"role": "assistant", "content": response.content})
            tool_results = await execute_all_tools(response)
            messages.append({"role": "user", "content": tool_results})

            metadata["iteration"] += 1
            # Save checkpoint BEFORE next iteration
            self.save_checkpoint(messages, metadata)
```

## Multi-Agent Crash Recovery

In multi-agent systems, each subagent saves its own state. The coordinator tracks which subagents completed:

```python
class MultiAgentCoordinator:
    def __init__(self, run_id: str, storage: Storage):
        self.run_id = run_id
        self.storage = storage

    def save_manifest(self, planned_tasks: list, completed_tasks: dict):
        """Coordinator saves a manifest of all planned and completed tasks."""
        manifest = {
            "run_id": self.run_id,
            "planned_tasks": planned_tasks,
            "completed_tasks": completed_tasks,  # task_id -> result
            "saved_at": datetime.utcnow().isoformat()
        }
        self.storage.save(f"manifest:{self.run_id}", manifest)

    def load_manifest(self) -> dict | None:
        return self.storage.load(f"manifest:{self.run_id}")

    async def run(self, tasks: list) -> dict:
        # Check for existing manifest
        manifest = self.load_manifest()

        if manifest:
            completed = manifest["completed_tasks"]
            remaining_tasks = [
                t for t in tasks
                if t["id"] not in completed
            ]
            print(f"Resuming: {len(completed)} completed, {len(remaining_tasks)} remaining")
        else:
            completed = {}
            remaining_tasks = tasks

        # Process remaining tasks
        for task_batch in batch_by_dependency(remaining_tasks):
            results = await asyncio.gather(*[
                self.run_subagent(task) for task in task_batch
            ])

            for task, result in zip(task_batch, results):
                completed[task["id"]] = result
                # Save manifest after each task completes
                self.save_manifest(tasks, completed)

        return completed
```

## Handling Non-Idempotent Operations

Some tool calls cannot safely be re-executed:

```python
class IdempotencyGuard:
    def __init__(self, storage: Storage):
        self.storage = storage

    def has_executed(self, operation_id: str) -> bool:
        return self.storage.load(f"executed:{operation_id}") is not None

    def mark_executed(self, operation_id: str, result: any):
        self.storage.save(f"executed:{operation_id}", {
            "executed_at": datetime.utcnow().isoformat(),
            "result": result
        })

    def get_result(self, operation_id: str) -> any:
        record = self.storage.load(f"executed:{operation_id}")
        return record["result"] if record else None

# Use the guard for non-idempotent operations
async def send_notification_safely(
    notification_id: str,
    recipient: str,
    message: str,
    guard: IdempotencyGuard
) -> str:
    if guard.has_executed(notification_id):
        # Already sent — return cached result without re-sending
        return guard.get_result(notification_id)

    # Send the notification
    result = await send_notification(recipient, message)
    guard.mark_executed(notification_id, result)
    return result
```

## Key Takeaways

1. **Save checkpoint after every iteration** — not at the end
2. **Check for checkpoint on startup** — resume vs restart decision
3. **Multi-agent: each subagent saves state + coordinator saves manifest**
4. **Mark complete when done** — prevents accidental resume of finished runs
5. **Non-idempotent operations need deduplication** — check before re-executing
6. **Crash recovery is about state isolation** — coordinator knows exactly where to resume
