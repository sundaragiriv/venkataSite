---
id: "d3-t1-2-version-control"
title: "CLAUDE.md and Version Control — What Gets Committed and Why"
domain: "d3"
taskRef: "T3.1"
order: 2
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A shared employee handbook vs a personal notebook. The handbook (project-level CLAUDE.md) is published, applies to everyone, and updates go through review. Your personal notebook (user-level) is yours alone. You wouldn't put your personal passwords in the company handbook — and you wouldn't expect colleagues to follow rules only in your personal notebook."
examTrap: "Including sensitive information (API keys, credentials, personal paths) in project-level CLAUDE.md. This gets committed to git and shared with everyone who clones the repo — potentially including external contributors."
keyPoints:
  - "Project-level and directory-level CLAUDE.md files SHOULD be committed — they are team assets."
  - "User-level ~/.claude/CLAUDE.md should NEVER be committed — add to .gitignore if needed."
  - "Never put credentials, personal API keys, local paths, or personal preferences in project-level files."
  - "CLAUDE.md should be treated like other team documentation — reviewed, kept up to date, reflects actual team practices."
  - "The .claude/ directory at project root may contain CLAUDE.md and settings.json — both should generally be committed."
antiPatterns:
  - "Committing user-level CLAUDE.md to the repository"
  - "Putting personal API keys or credentials in project-level CLAUDE.md"
  - "Never reviewing or updating CLAUDE.md — it drifts from actual practices"
  - "Not adding .claude/CLAUDE.md to the repo when team conventions exist — new members miss them"
tbChallenge: "Your team's CLAUDE.md has been in the repo for 6 months. A security audit finds it contains a developer's personal GitHub token that was accidentally added. What went wrong architecturally, and how do you prevent this going forward?"
---

## What to Commit

```
# These SHOULD be committed to git
.claude/
├── CLAUDE.md          # Project conventions — YES, commit
└── settings.json      # Project tool permissions — YES, commit

src/
└── CLAUDE.md          # Module conventions — YES, commit

tests/
└── CLAUDE.md          # Test conventions — YES, commit
```

```
# These should NOT be committed
~/.claude/CLAUDE.md    # Personal file — lives outside repo, can't accidentally commit
```

## .gitignore for Claude Files

If your project generates any local Claude files in the working directory:

```gitignore
# .gitignore
.claude/local.json     # Local-only overrides (if your setup uses this)
.claude/.sessions/     # Session data (if stored locally)

# Never gitignore the main CLAUDE.md files — they should be committed
# .claude/CLAUDE.md    # Don't ignore this
# .claude/settings.json # Don't ignore this
```

## What Belongs in Project-Level CLAUDE.md

```markdown
# ✅ These belong in project-level CLAUDE.md (shared, not sensitive)

## Architecture decisions
## Coding conventions
## Testing requirements
## File naming conventions
## Error handling patterns
## Branch naming rules
## PR template guidelines
## Common gotchas for this codebase
```

```markdown
# ❌ These do NOT belong in project-level CLAUDE.md

## Personal API keys or tokens
## Individual developer preferences
## Local machine paths (/Users/raj/projects/...)
## Credentials of any kind
## Personal shortcuts or aliases
## Local environment specifics
```

## Treating CLAUDE.md Like Documentation

CLAUDE.md files should be reviewed in PRs when they change:

```markdown
# PR template addition
## CLAUDE.md Changes
If this PR updates any CLAUDE.md file, explain:
- What convention changed and why
- Whether this is a clarification or a new rule
- Whether existing code needs to be updated to comply
```

This prevents CLAUDE.md from drifting out of sync with actual team practices.

## The .claude/settings.json File

Alongside CLAUDE.md, projects often have `.claude/settings.json` which controls tool permissions:

```json
{
  "allowedTools": [
    "file_read",
    "file_write",
    "bash",
    "grep",
    "glob"
  ],
  "disallowedTools": [
    "web_search"
  ],
  "maxTokensPerRequest": 4096
}
```

This file **should be committed** — it establishes the baseline tool access for Claude Code in this project. Individual developers can override with their user-level settings, but the project baseline is shared.

## Key Takeaways

1. **Commit project-level and directory-level CLAUDE.md** — they are team assets
2. **Never commit user-level** — lives outside the repo by design
3. **No credentials, no personal paths, no personal preferences** in committed files
4. **Review CLAUDE.md changes in PRs** — same rigor as other documentation
5. **settings.json should also be committed** — establishes project baseline tool access
