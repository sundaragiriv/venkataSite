---
id: "d3-t1-1-hierarchy"
title: "CLAUDE.md Hierarchy — The Layered Configuration System"
domain: "d3"
taskRef: "T3.1"
order: 1
xp: 40
tag: "⚡ Exam Tested"
duration: "10 min"
analogy: "A company's policy hierarchy. Company-wide policies (user-level) apply to everyone. Department policies (project-level) apply within that department. Team-specific guidelines (directory-level) apply to specific workflows. Each level refines the one above — lower levels add specificity without invalidating higher ones."
examTrap: "Assuming user-level CLAUDE.md is shared via git and applies to all team members. It is NOT committed to version control — it lives in ~/.claude/CLAUDE.md on each individual machine. A new team member joining has no user-level settings until they create them manually."
keyPoints:
  - "Three levels: user-level (~/.claude/CLAUDE.md), project-level (.claude/CLAUDE.md in repo root), directory-level (CLAUDE.md in subdirectories)."
  - "User-level is personal and NOT version-controlled — exists on one machine only, never shared via git."
  - "Project-level is committed to git — shared across the entire team and applies to the whole project."
  - "Directory-level applies only when Claude is working within that directory — used for module-specific conventions."
  - "Settings cascade: lower level (more specific) settings supplement but do not replace higher level settings."
antiPatterns:
  - "Putting personal preferences (API keys, personal shortcuts) in project-level CLAUDE.md — shared with all team members"
  - "Assuming new team members have user-level settings — they won't until they create them"
  - "Using directory-level CLAUDE.md for global project conventions — use project-level instead"
  - "Not using hierarchy at all — one massive CLAUDE.md becomes unmaintainable"
tbChallenge: "A new developer joins your team, clones the repo, and starts using Claude Code. What CLAUDE.md settings do they have immediately, and what do they need to set up manually? Why does this distinction matter?"
---

## The Three Levels

```
~/.claude/CLAUDE.md                    ← User-level (personal, not in git)
│
└── /project-root/
    ├── .claude/CLAUDE.md              ← Project-level (in git, shared with team)
    │
    ├── src/
    │   └── CLAUDE.md                  ← Directory-level (in git, module-specific)
    │
    └── tests/
        └── CLAUDE.md                  ← Directory-level (in git, test-specific)
```

## User-Level: Personal Preferences

Located at `~/.claude/CLAUDE.md` on each developer's machine. This file:
- Is **never committed to git**
- Contains personal preferences and machine-specific settings
- Applies to ALL Claude Code sessions on that machine

```markdown
# ~/.claude/CLAUDE.md (developer's personal file — not in repo)

## My Personal Preferences
- I prefer verbose output with reasoning shown
- Always use Python type hints in new code
- Default to pytest for Python tests
- When I say "clean up", organize imports and remove dead code

## My Local Environment
- Local database is at localhost:5432
- Use virtual environment at ~/.venvs/main

## My Coding Style
- I prefer explicit over implicit
- Always add docstrings to public functions
```

## Project-Level: Team Conventions

Located at `.claude/CLAUDE.md` in the repository root. This file:
- **Is committed to git** and shared with all team members
- Contains project architecture, conventions, and standards
- Applies to all Claude Code sessions in that project

```markdown
# .claude/CLAUDE.md (project-level — committed to git)

## Project Architecture
This is a FastAPI + PostgreSQL service for payment processing.

Key directories:
- src/api/ — REST endpoint handlers
- src/services/ — Business logic layer
- src/models/ — SQLAlchemy models
- src/repositories/ — Database access layer

## Coding Conventions
- Use repository pattern for all database access — never query DB directly in services
- All monetary amounts stored as integers (cents) in the database
- Timestamps always stored in UTC, converted at API boundary

## Testing Requirements
- Minimum 80% coverage for new code
- Use pytest fixtures, not class-based tests
- Mock external services, never call them in tests

## Never Do These
- Direct SQL queries outside of repository classes
- Storing sensitive data in logs
- Synchronous HTTP calls in async request handlers
```

## Directory-Level: Module-Specific Guidelines

Located in subdirectories. Applies only when Claude is working in that directory.

```markdown
# src/api/CLAUDE.md (directory-level — committed to git)

## API Layer Conventions
This directory contains only request/response handling.

Rules specific to this directory:
- No business logic here — delegate to services
- Validate all inputs with Pydantic models
- Return consistent error responses using ErrorResponse schema
- Use dependency injection for all service dependencies

## Response Format
Always use these status codes:
- 200: success with body
- 201: created
- 400: client error (validation)
- 401: authentication required
- 403: forbidden
- 404: not found
- 422: validation error (Pydantic)
- 500: server error (never expose internal details)
```

## The @import Syntax

For large projects, CLAUDE.md files can import content from other files:

```markdown
# .claude/CLAUDE.md

## Architecture
@import ./docs/architecture.md

## API Conventions  
@import ./docs/api-conventions.md

## Testing Standards
@import ./docs/testing-standards.md
```

This keeps CLAUDE.md itself concise while pulling in detailed documentation.

## What a New Team Member Has On Day One

When a new developer clones your repo:

**Has immediately (from git):**
- Project-level `.claude/CLAUDE.md` — all project conventions
- All directory-level `CLAUDE.md` files — module-specific conventions

**Doesn't have (must create manually):**
- `~/.claude/CLAUDE.md` — their personal preferences

This means team conventions work from day one. Personal preferences require each developer to set up their own user-level file.

**The exam implication:** If you put something in user-level CLAUDE.md and expect it to affect all team members' Claude Code behavior, you're wrong. Only project-level and directory-level files are shared via git.

## The /memory Command

The `/memory` command lets you update CLAUDE.md files interactively during a session:

```
/memory project   # Edit project-level CLAUDE.md
/memory user      # Edit user-level CLAUDE.md
/memory           # Edit the most relevant CLAUDE.md for current directory
```

This is how you add findings from a session to persistent memory — "add to memory that we use the repository pattern for all DB access."

## Key Takeaways

1. **User-level**: personal, machine-specific, NOT in git, not shared
2. **Project-level**: team conventions, committed to git, applies to whole project
3. **Directory-level**: module-specific, committed to git, applies when in that directory
4. **New team members get project-level and directory-level immediately** from git clone
5. **@import** for keeping CLAUDE.md concise while linking to detailed docs
6. **/memory command** for updating CLAUDE.md interactively during sessions
