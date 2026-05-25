---
id: "d6-t3-2-layering-strategy"
title: "D3 + D4: Prompt Layering Strategy — What Goes Where"
domain: "d6"
taskRef: "T6.3"
order: 6
xp: 40
tag: "Core"
duration: "7 min"
analogy: "A law firm's instruction hierarchy. The law firm's style guide (CLAUDE.md) applies to all attorneys. A partner's standing instructions (user-level CLAUDE.md) apply to their team. A case brief (session system prompt) applies to this case. A specific question in a meeting (user message) applies right now. Each layer is right for different types of instructions."
examTrap: "Putting task-specific instructions in CLAUDE.md or putting team conventions in the session prompt. The exam tests that you know which instruction types belong at which layer."
keyPoints:
  - "User-level CLAUDE.md: personal preferences, machine-specific config — never committed to git."
  - "Project-level CLAUDE.md: team conventions, architecture rules, testing standards — committed, shared."
  - "Session system prompt: task-specific context, what this agent does, what tools it has — set at runtime."
  - "Path-specific rules: file-type conventions — conditional, fine-grained."
  - "Never duplicate: if a rule is in CLAUDE.md, don't repeat it in the session prompt — maintain one source of truth."
antiPatterns:
  - "Task context in project CLAUDE.md — now every session has the context of this one task"
  - "Team conventions in session prompts — not shared, not discoverable by new team members"
  - "Same rule in both CLAUDE.md and session prompt — one becomes stale, creates conflicts"
  - "Personal preferences in project CLAUDE.md — applied to all team members"
tbChallenge: "Categorize these instructions into the correct layer: (1) 'always use repository pattern', (2) 'I prefer verbose output', (3) 'you are analyzing the Q3 refund data for signs of fraud', (4) 'Python files must have type hints'. Which layer for each?"
---

## The Layer Decision Framework

```python
INSTRUCTION_LAYER_DECISION = {
    "applies_to_all_sessions_all_team": {
        "layer": "project_CLAUDE_md",
        "examples": [
            "Repository pattern required for all database access",
            "Minimum 80% test coverage",
            "All amounts stored as integers (cents)",
            "Type hints on all public functions",
        ],
        "committed_to_git": True,
        "shared_with_team": True,
    },
    
    "applies_to_files_of_specific_type": {
        "layer": "path_specific_rules",
        "examples": [
            "API route handlers must validate with Zod",
            "Test files use pytest fixtures not setUp/tearDown",
            "Migration files must have both UP and DOWN",
        ],
        "committed_to_git": True,
        "conditional": True,  # Only loads for matching file paths
    },
    
    "personal_preference_one_developer": {
        "layer": "user_CLAUDE_md",
        "examples": [
            "I prefer verbose output with reasoning",
            "Use Python virtual environment at ~/.venvs/main",
            "Default to async/await over callbacks",
        ],
        "committed_to_git": False,
        "shared_with_team": False,
    },
    
    "this_session_this_task": {
        "layer": "session_system_prompt",
        "examples": [
            "You are analyzing Q3 2024 refund data for fraud patterns",
            "The customer you're helping is Jane Smith, Premium tier",
            "Your task is to review the authentication module for security issues",
        ],
        "set_at_runtime": True,
        "task_specific": True,
    }
}
```

## Teach-Back Answers

```python
CATEGORIZATIONS = {
    "'always use repository pattern'": {
        "layer": "project_CLAUDE_md",
        "reason": "Team convention, applies to all sessions and all developers"
    },
    "'I prefer verbose output'": {
        "layer": "user_CLAUDE_md",
        "reason": "Personal preference of one developer — not for the whole team"
    },
    "'analyzing Q3 refund data for fraud'": {
        "layer": "session_system_prompt",
        "reason": "Task-specific context for this particular session — not general"
    },
    "'Python files must have type hints'": {
        "layer": "project_CLAUDE_md OR path_specific_rules",
        "reason": (
            "project_CLAUDE_md if it applies everywhere. "
            "path_specific_rules (*.py glob) if you want it conditional on Python files only."
        )
    }
}
```

## Conflict Resolution

```python
# When session prompt conflicts with CLAUDE.md:
# Session prompt (runtime) wins for specific task instructions
# CLAUDE.md wins for general team conventions that weren't explicitly overridden

# Example:
# CLAUDE.md: "Use async/await for all database calls"
# Session prompt: "This is a sync-only environment, use synchronous calls"
# Result: Claude follows the session prompt for this session

# The session prompt can override CLAUDE.md for a specific session.
# CLAUDE.md cannot override the session prompt.
# This is the intended hierarchy — runtime context wins.
```

## Key Takeaways

1. **Project CLAUDE.md** — team conventions, architecture, testing — committed, shared
2. **Path-specific rules** — file-type conventions — conditional, committed
3. **User CLAUDE.md** — personal preferences — NOT committed, NOT shared
4. **Session prompt** — task context, agent role — set at runtime
5. **Never duplicate** — one source of truth for each rule type
