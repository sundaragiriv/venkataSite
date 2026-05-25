---
id: "d1-t5-3-human-in-the-loop"
title: "Human-in-the-Loop Design — When and How to Interrupt Agents"
domain: "d1"
taskRef: "T1.2"
order: 20
xp: 35
tag: "Core"
duration: "8 min"
analogy: "A surgeon's protocol for unexpected findings. If the surgeon finds something unexpected during a procedure, they pause, consult with the patient (if awake) or next of kin, and get explicit approval before proceeding beyond the original scope. Agents need the same protocol."
examTrap: "Treating human-in-the-loop as an afterthought that you add when something goes wrong. It's an architectural decision that must be designed in from the start — where the checkpoints are, what triggers them, and what information the human sees when they're asked to review."
keyPoints:
  - "Human-in-the-loop interrupts are designed checkpoint points where the agent pauses and requests human review or approval before proceeding."
  - "Triggers: scope exceeded original request, irreversible action required, low confidence in decision, ambiguous instructions, error recovery needed."
  - "The interrupt must provide enough context for a human to make an informed decision quickly — not dump the entire conversation history."
  - "After human approval, the agent resumes from the interrupt point with the human's decision incorporated into the conversation."
  - "Clarifying ambiguity before starting a long autonomous run is more efficient than interrupting mid-run."
antiPatterns:
  - "No human-in-the-loop checkpoints in long-running agents — errors compound without oversight"
  - "Interrupting the human for every minor decision — defeats the purpose of automation"
  - "Providing insufficient context in the interrupt — human can't make an informed decision"
  - "Not incorporating the human's decision into the conversation before resuming"
  - "Starting a long ambiguous task without clarifying scope first"
tbChallenge: "Design the human-in-the-loop interrupt points for an agent that is tasked with 'reorganize the project's file structure.' What triggers an interrupt, what does the human see, and how does the agent resume after approval?"
---

## Where to Place Checkpoints

Not every step needs human review. The goal is to catch the high-risk decision points while allowing routine steps to proceed automatically.

**Always interrupt for:**
- Irreversible actions at scale (deleting 500 files, sending mass email)
- Actions that exceed original scope
- Actions requiring permissions beyond what was initially granted
- Error recovery requiring choices that affect the outcome significantly

**Never interrupt for:**
- Reading/analyzing data (non-destructive)
- Generating reports for human review
- Routine tool calls within well-defined scope
- Decisions explicitly pre-authorized in the original request

## Designing the Interrupt Interface

The interrupt must answer three questions for the human reviewer:
1. What is the agent trying to do?
2. Why does it need approval?
3. What are the options?

```python
class AgentInterrupt(Exception):
    def __init__(
        self,
        reason: str,
        planned_action: dict,
        impact_summary: str,
        options: list[dict],
        agent_state: dict
    ):
        self.reason = reason
        self.planned_action = planned_action
        self.impact_summary = impact_summary
        self.options = options  # Each option has: label, action, consequence
        self.agent_state = agent_state  # Serialized state for resume

# Example interrupt
raise AgentInterrupt(
    reason="Irreversible bulk action exceeds pre-authorized scope",
    planned_action={
        "action": "delete_files",
        "files": file_list,
        "count": 847,
        "total_size_mb": 2340
    },
    impact_summary=(
        "The agent found 847 files matching the 'old test files' pattern "
        "(2.3 GB total). This exceeds the 'small cleanup' scope implied in "
        "the original request. Deletion cannot be undone."
    ),
    options=[
        {
            "label": "Proceed with all 847 files",
            "action": "proceed_all",
            "consequence": "All 847 files deleted immediately. Not recoverable."
        },
        {
            "label": "Proceed with only files older than 1 year (312 files)",
            "action": "proceed_scoped",
            "scope_filter": {"max_age_days": 365},
            "consequence": "312 files deleted. 535 newer files preserved."
        },
        {
            "label": "Move to staging instead of deleting",
            "action": "stage_only",
            "consequence": "All 847 files moved to /tmp/cleanup_staging. Review before permanent deletion."
        },
        {
            "label": "Cancel this operation",
            "action": "cancel",
            "consequence": "No files changed. Agent stops."
        }
    ],
    agent_state=serialize_agent_state(current_messages)
)
```

## Resuming After Human Decision

After the human makes a decision, the agent resumes with that decision incorporated:

```python
async def resume_after_approval(agent_state: dict, human_decision: dict) -> str:
    """Resume agent execution after human review."""

    # Restore agent state
    messages = deserialize_messages(agent_state)

    # Incorporate human's decision into the conversation
    decision_context = format_human_decision(human_decision)
    messages.append({
        "role": "user",
        "content": f"Human review completed. Decision: {decision_context}\n\n"
                   f"Please proceed according to this decision."
    })

    # Resume the agentic loop from this point
    return await run_agent_loop(messages, tools)

# Example decision formatting
def format_human_decision(decision: dict) -> str:
    if decision["action"] == "proceed_scoped":
        return (
            f"Proceed with deletion, but only files older than "
            f"{decision['scope_filter']['max_age_days']} days. "
            f"Do not delete files newer than this threshold."
        )
    elif decision["action"] == "stage_only":
        return "Move files to staging directory instead of deleting. Do not perform any permanent deletions."
    elif decision["action"] == "cancel":
        return "Cancel the cleanup operation. Do not modify any files."
```

## Clarifying Ambiguity Before Starting

The most efficient place for human input is at the start, before the agent begins work that may need to be undone.

```python
async def start_with_clarification(task: str, agent: Agent) -> str:
    """
    For ambiguous tasks with potential large scope, clarify before starting.
    """
    # Quick scope assessment
    scope_assessment = await agent.assess_scope(task)

    if scope_assessment["ambiguous"] or scope_assessment["blast_radius"] == "high":
        # Ask clarifying questions upfront
        clarification_request = format_clarification_request(task, scope_assessment)
        human_clarification = await request_human_clarification(clarification_request)

        # Incorporate clarification into the task
        clarified_task = f"""
Original task: {task}

Clarified scope (confirmed by human):
{human_clarification}

Proceed with the clarified scope. Do not exceed it without additional approval.
"""
        return await agent.run(clarified_task)
    else:
        # Unambiguous task — run autonomously
        return await agent.run(task)
```

## Key Takeaways

1. **Design checkpoints in from the start** — not as an afterthought
2. **Triggers**: irreversible at scale, scope exceeded, high ambiguity, error recovery choices
3. **Good interrupt interface**: what is planned, why approval needed, what are the options
4. **Resume with human decision incorporated** into the conversation
5. **Clarify ambiguity before starting** — more efficient than mid-run interrupts
6. **Don't interrupt for routine steps** — defeats the purpose of automation
