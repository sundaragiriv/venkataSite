---
id: "d1-t6-2-session-management"
title: "Session Management — Resume, Restart, and When to Choose Each"
domain: "d1"
taskRef: "T1.6"
order: 14
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Returning to a project after time away. If your notes and code are still accurate, you pick up where you left off. If the codebase changed significantly since your last session, you start fresh — but you read your notes first so you don't repeat work."
examTrap: "Resuming a session when the underlying data has changed. A resumed session where prior tool results reference outdated state (files changed, database updated, API results stale) causes Claude to reason about facts that are no longer true."
keyPoints:
  - "Resume (--resume) is correct when: prior context is valid, files haven't changed, tool results are still accurate."
  - "Fresh session + summary injection is correct when: prior tool results are stale, the environment has changed, or you're starting a related but different investigation."
  - "Always inform a resumed session about what has changed since the last session — don't let Claude reference stale context silently."
  - "Session names, not IDs, are used with --resume in Claude Code."
  - "A summary injected into a fresh session should capture decisions made, findings discovered, and the current state — not reproduce the raw conversation."
antiPatterns:
  - "Resuming when files have been modified since the last session — Claude references old file contents"
  - "Starting completely fresh when significant prior work can be reused"
  - "Not injecting a summary when starting fresh — wastes time re-discovering already-known facts"
  - "Including raw tool results in session summaries — too verbose, inject structured findings instead"
tbChallenge: "You ran a codebase analysis yesterday that took 3 hours. Overnight, one team committed 15 files of changes. Today you need to continue the analysis. Should you resume or start fresh? Walk me through your decision process."
---

## The Resume vs Restart Decision

The key question: **Are the prior tool results still accurate?**

If tool results are stale, Claude will reason about a world that no longer exists. This produces incorrect outputs that are hard to detect — they look plausible but reference old state.

```python
# Decision framework
def should_resume_session(session_id: str, environment_changes: list) -> bool:
    """
    Returns True if resuming makes sense, False if fresh session is better.
    """
    if not environment_changes:
        return True  # Nothing changed — resume is safe

    # Check if changes affect what we were investigating
    stale_tools = check_which_tool_results_are_stale(session_id, environment_changes)

    if len(stale_tools) == 0:
        return True  # Changes don't affect prior tool results — resume

    if len(stale_tools) < 3:
        # Few stale results — resume but mention changes
        return True  # Inform session about changes

    # Many stale results — fresh session with summary is cleaner
    return False
```

## The Resume Path

When resuming, always inform the session about what changed:

```bash
# Resume with context about changes
claude --resume "codebase-analysis-2024-01-15" \
  --context "Since the last session: 15 files were modified in the authentication module. 
             The token validation logic in auth/jwt.py was completely rewritten. 
             Please re-analyze the affected areas and update your findings."
```

Or in the API, inject an update message:

```python
# Load existing session
messages = load_session("codebase-analysis-2024-01-15")

# Add update about environment changes
messages.append({
    "role": "user",
    "content": """Important update since last session:
    15 files were modified in the authentication module since our last analysis.
    Specifically: auth/jwt.py was completely rewritten (token validation logic changed).
    
    Please re-analyze the authentication module to update our security findings.
    Your prior analysis of the payment module remains valid."""
})

# Continue the session
result = run_agent_loop(messages, tools)
```

## The Fresh Session + Summary Path

When starting fresh, inject a summary that gives Claude the context it needs without reproducing stale tool results:

```python
def create_session_summary(previous_session: dict) -> str:
    """
    Creates a concise summary for injection into a fresh session.
    NOT a reproduction of the conversation — a structured briefing.
    """
    return f"""
# Session Continuity Brief

## What We Were Doing
{previous_session['goal']}

## Key Findings (Still Valid)
{format_findings(previous_session['confirmed_findings'])}

## Decisions Made
{format_decisions(previous_session['decisions'])}

## Outstanding Questions
{format_questions(previous_session['open_questions'])}

## What Has Changed Since Last Session
{previous_session['environment_changes']}

## What Needs Re-investigation
{previous_session['stale_areas']}

Continue the investigation from this point, focusing on the outstanding questions 
and re-investigating the stale areas given the changes.
"""

# Fresh session with summary
messages = [
    {"role": "user", "content": create_session_summary(previous_session)}
]
result = run_agent_loop(messages, tools)
```

## Key Takeaways

1. **Resume when prior tool results are still accurate** — environment hasn't changed
2. **Fresh + summary when environment changed** — don't reason about stale state
3. **Always inform resumed sessions about changes** — "since last session, X changed"
4. **Session summaries are structured briefings**, not conversation reproductions
5. **Use session names with --resume**, not IDs
