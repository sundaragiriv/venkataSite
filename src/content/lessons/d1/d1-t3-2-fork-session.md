---
id: "d1-t3-2-fork-session"
title: "fork_session — Branching Agent Execution from a Shared Baseline"
domain: "d1"
taskRef: "T1.3"
order: 8
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Save states in a video game. You reach a decision point, save your progress, then explore two different paths — knowing you can compare the outcomes. fork_session is that save state for your agent — same starting context, different execution paths from that point."
examTrap: "Confusing fork_session with spawning independent subagents. fork_session creates branches from a shared baseline that have read access to the parent's context at the fork point. Independent Task subagents start completely blank."
keyPoints:
  - "fork_session creates a branch from the current conversation state — the branch inherits the conversation history up to the fork point."
  - "Branches are independent after forking — changes in one branch don't affect others."
  - "Primary use case: comparing two approaches to the same problem from a shared analysis baseline (e.g., two refactoring strategies after shared codebase exploration)."
  - "fork_session is distinct from spawning an independent subagent — forks have parent context, subagents start blank."
  - "Changes to files or external state in one branch DO affect the shared environment — fork_session isolates conversation context, not external side effects."
antiPatterns:
  - "Using fork_session when you need completely isolated subagents — use Task tool instead"
  - "Expecting fork_session to isolate external side effects (file writes, database changes)"
  - "Forking when branches will need to communicate their results — they can't, results must be compared at the coordinator level"
  - "Using --resume with a session ID instead of a session name — sessions use names"
tbChallenge: "When would you use fork_session instead of spawning two independent subagents with the Task tool? Give me a concrete production example where fork_session is the right choice and explain why."
---

## What fork_session Is For

fork_session addresses a specific scenario: you've done expensive shared work (like exploring a large codebase), and now you want to explore multiple different approaches to the same problem — without repeating that shared work for each approach.

**Without fork_session:**
```
Explore codebase (20 min)
  → Approach A investigation (5 min)
  → Approach B investigation (5 min)  ← must repeat codebase exploration
Total: 30 min
```

**With fork_session:**
```
Explore codebase (20 min)
  → Fork
    Branch A: Approach A investigation (5 min)
    Branch B: Approach B investigation (5 min)  ← starts from shared baseline
Total: 25 min (branches can run in parallel: 20+5=25 not 20+10=30)
```

## When to Use fork_session vs Task Tool

| Scenario | Use |
|---|---|
| Subagent needs independent, clean context | Task tool |
| Subagent needs accumulated coordinator context | fork_session |
| Comparing two implementations of the same system | fork_session |
| Running parallel research on different topics | Task tool |
| Two reviewers analyzing the same code from same baseline | fork_session |
| Specialized agents with different tool access | Task tool |

## Using fork_session in Practice

```python
# In Claude Code, fork_session creates a branch
# The branch inherits all conversation history up to this point

# Example: After extensive codebase analysis, explore two refactoring approaches

# Phase 1: Shared exploration (expensive — do once)
# Claude has been exploring the codebase for multiple turns...

# Phase 2: Fork at the decision point
# Claude calls fork_session tool to branch
# Branch A: Implement using Repository Pattern
# Branch B: Implement using Service Layer Pattern

# Phase 3: Compare results
# Your orchestration receives both branch outcomes
# Coordinator compares: test coverage, complexity metrics, migration risk
# Makes a recommendation based on the comparison
```

## The Key Distinction: Context Inheritance

```python
# Task tool subagent — blank context
subagent_prompt = """
Here is the codebase analysis: {analysis}
Here is what we're trying to do: {goal}
...everything the subagent needs, explicitly passed...
"""

# fork_session branch — inherits parent context
# The branch already knows:
# - Everything in the coordinator's conversation history
# - All tool results accumulated so far
# - The codebase exploration details
# You just specify what's different in this branch:
fork_instruction = """
We're now exploring Approach A: Repository Pattern.
Given the codebase context established, investigate how this
pattern would apply and estimate the migration effort.
"""
```

## Session Management: --resume and Named Sessions

Related to fork_session: Claude Code sessions use names, not IDs.

```bash
# Start a named session
claude --session-name "refactor-investigation-v1"

# Resume a specific named session later
claude --resume "refactor-investigation-v1"

# Fork from current session
claude fork_session "refactor-approach-A"
```

**When to resume vs restart with summary injection:**

| Condition | Approach |
|---|---|
| Prior context is still valid, continuing same investigation | `--resume` |
| Prior tool results are stale (code changed since last session) | Fresh session + inject summary |
| Want to try a different approach from same baseline | `fork_session` |

Resuming a session with stale tool results is dangerous — Claude may reference "the authentication module we analyzed" when that module has since been completely rewritten. Start fresh and inject a summary of what's still relevant.

## Key Takeaways

1. **fork_session = branching from shared baseline**, not creating blank subagents
2. **Branches inherit parent conversation context** — no need to re-pass prior work
3. **External side effects are not isolated** — only conversation context forks
4. **Use --resume with session NAMES**, not IDs
5. **Stale tool results → fresh session + summary**, not resume
6. **Parallel branches from a fork** can reduce total latency significantly
