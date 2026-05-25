---
id: "d1-t3-1-task-tool"
title: "The Task Tool — How Coordinators Spawn Subagents"
domain: "d1"
taskRef: "T1.3"
order: 7
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A manager filling out a work order. The work order specifies what needs to be done, what resources the worker has access to, and what a successful outcome looks like. The Task tool is that work order — it defines the subagent's entire working context."
examTrap: "Thinking the Task tool is built into Claude. It isn't — your orchestration layer implements what happens when Claude calls a tool named 'Task'. You define the tool schema and the orchestration logic."
keyPoints:
  - "The Task tool is a pattern, not a built-in Claude feature — you define it in your tools array and your code executes it when Claude calls it."
  - "allowedTools in the coordinator's tool definition controls what tools the coordinator can use — the subagent's tools are passed separately in the Task input."
  - "A subagent spawned by the Task tool runs its own complete agentic loop — it can use tools, make decisions, and return a final result."
  - "The coordinator receives the subagent's final response as the tool_result — it sees only the final output, not the subagent's internal reasoning."
  - "Subagent tool access should be scoped to minimum necessary — a search subagent doesn't need file write access."
antiPatterns:
  - "Giving the coordinator's Task tool definition a vague description — Claude uses the description to decide when and how to call it"
  - "Giving subagents access to all available tools instead of scoped access"
  - "Not handling subagent failures in the Task tool executor"
  - "Expecting the coordinator to see the subagent's internal reasoning steps — it only sees the final output"
tbChallenge: "Explain the Task tool pattern to me. What is it, who implements it, what does it actually do when called, and why does the coordinator only see the subagent's final answer and not its reasoning?"
---

## The Task Tool Is Your Implementation

When you read about agentic frameworks using a "Task tool," it can sound like a built-in Claude capability. It isn't. The Task tool is a pattern you implement.

Here's what that means in practice:

1. You define a tool called "Task" in your tools array with a schema
2. Claude learns from the description when to call this tool
3. When Claude calls "Task," your orchestration code runs a new agent loop
4. The result of that agent loop becomes the tool_result you send back

You control everything: how subagents are initialized, what tools they have access to, how long they can run, and what happens when they fail.

## Defining the Task Tool

```python
TASK_TOOL = {
    "name": "Task",
    "description": """Spawn a specialized subagent to handle a specific component of work.
    Use this when:
    - A subtask requires specialized tools or focus
    - A subtask can run independently and in parallel with others
    - You need to isolate a complex operation for better accuracy
    
    The subagent will receive its own context and run independently.
    You will receive its final result when complete.""",
    "input_schema": {
        "type": "object",
        "properties": {
            "description": {
                "type": "string",
                "description": "Brief description of what this subagent should accomplish"
            },
            "prompt": {
                "type": "string",
                "description": "Complete context and instructions for the subagent. Include everything it needs — it has no access to your context."
            },
            "allowed_tools": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of tool names this subagent is permitted to use"
            },
            "max_tokens": {
                "type": "integer",
                "description": "Maximum tokens for subagent response (default: 4096)"
            }
        },
        "required": ["description", "prompt"]
    }
}
```

## Executing the Task Tool

When Claude calls the Task tool, your executor runs:

```python
async def execute_task_tool(task_input: dict) -> str:
    """
    This function runs when Claude calls the Task tool.
    It spawns a complete subagent with its own agentic loop.
    """
    prompt = task_input["prompt"]
    allowed_tool_names = task_input.get("allowed_tools", [])
    max_tokens = task_input.get("max_tokens", 4096)

    # Get the tool definitions for allowed tools
    subagent_tools = [
        tool for tool in ALL_AVAILABLE_TOOLS
        if tool["name"] in allowed_tool_names
    ]

    # Run the subagent's complete agentic loop
    try:
        result = await run_agent_loop(
            messages=[{"role": "user", "content": prompt}],
            tools=subagent_tools,
            max_tokens=max_tokens,
            max_iterations=20
        )
        return result
    except Exception as e:
        return f"Subagent failed: {type(e).__name__}: {str(e)}"
```

## Tool Scoping — Minimum Necessary Access

Each subagent should have access to only the tools it needs:

```python
# Tool registry
ALL_TOOLS = {
    "web_search":         web_search_tool,
    "database_query":     database_query_tool,
    "file_read":          file_read_tool,
    "file_write":         file_write_tool,
    "send_email":         send_email_tool,
    "process_payment":    payment_tool,
}

# Search subagent — read-only external access only
SEARCH_AGENT_TOOLS = ["web_search"]

# Analysis subagent — can read files and query database
ANALYSIS_AGENT_TOOLS = ["file_read", "database_query"]

# Summary subagent — no external tools needed, just reasoning
SUMMARY_AGENT_TOOLS = []

# Never give a search agent file_write or payment access
```

The exam specifically tests this: giving agents more tool access than needed is an anti-pattern. It increases the blast radius of errors and reduces reliability of tool selection.

## Key Takeaways

1. **Task tool is your implementation** — define the schema, write the executor
2. **Subagents run complete agentic loops** — they can use tools and make decisions
3. **Coordinator sees only final output** — not internal reasoning or intermediate steps
4. **Scope tool access tightly** — minimum necessary for each subagent role
5. **Handle subagent failures** — return error as tool_result, don't crash
