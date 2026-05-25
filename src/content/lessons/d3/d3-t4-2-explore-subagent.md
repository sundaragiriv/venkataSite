---
id: "d3-t4-2-explore-subagent"
title: "The Explore Subagent — Context-Efficient Discovery"
domain: "d3"
taskRef: "T3.4"
order: 11
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Sending a scout ahead before moving the army. The scout maps terrain, identifies obstacles, returns with a briefing. The army acts on the briefing — not the raw scouting experience. The Explore subagent is that scout."
examTrap: "Running extensive codebase exploration directly in the main session, which fills context with raw file contents and intermediate output, leaving no room for implementation work."
keyPoints:
  - "Explore subagent: isolated sub-session for verbose discovery — returns only a structured summary."
  - "context: fork creates isolation — the Explore subagent's file reading doesn't accumulate in main context."
  - "Explore output is a structured summary (JSON or organized markdown) — NOT raw file contents."
  - "Use /compact to compress main session context mid-task — preserves key decisions, removes verbose history."
  - "After Explore returns, main session has intelligence without the noise — full context window for implementation."
antiPatterns:
  - "Reading dozens of files directly in main session before starting work"
  - "Explore returning raw file contents — defeats the isolation benefit"
  - "Explore scope too broad — map the relevant area, not the entire codebase"
  - "Not using Explore at all — main session fills up during discovery phase"
tbChallenge: "Your main Claude Code session has been running for 90 minutes. You've read 40 files and the context is now 60% full. You still need to implement the changes. What are your options and which do you choose?"
---

## Writing an Effective Explore Prompt

```markdown
Explore the authentication system in this codebase.

## What to Find
1. All auth entry points (middleware, decorators, route guards)
2. Token creation and validation locations
3. Session management approach
4. Security concerns (TODOs, known issues, incomplete implementations)

## Output Format (JSON — not raw file contents)
{
  "auth_entry_points": [
    {"file": "...", "type": "middleware|decorator", "mechanism": "...", "applies_to": "..."}
  ],
  "token_handling": {
    "creation": "file:function()",
    "validation": "file:function()",
    "expiry": "description of how handled"
  },
  "session_approach": "stateless JWT | server-side sessions | ...",
  "files_examined": 0,
  "security_concerns": ["...", "..."]
}

Return ONLY this JSON. Do not include file contents or grep output.
```

## Context Management with /compact

When the main session grows too large:

```
/compact
```

Claude Code summarizes the conversation history — preserving:
- Key decisions made
- Important findings
- Current task state
- What has and hasn't been done

Removing:
- Verbose intermediate output
- Raw tool results already processed
- Repetitive context

Use `/compact` when context is above 50% to preserve room for implementation.

## The Explore → Implement Flow

```
1. Main session starts: receives task
2. Main session spawns Explore subagent
3. Explore subagent:
   - Reads 40+ files
   - Runs multiple greps
   - Builds comprehensive map
   - Returns: structured 200-line summary
4. Main session receives: 200-line summary (not 10,000 lines of raw files)
5. Main session implements: with full context window available
```

## Key Takeaways

1. **Explore pattern** isolates verbose discovery from implementation context
2. **Structured summary output** — JSON or organized markdown, not raw content
3. **context: fork** creates the isolation — don't skip it
4. **/compact** for compressing a full session mid-task
5. **Explore before large implementations** — map first, build second
