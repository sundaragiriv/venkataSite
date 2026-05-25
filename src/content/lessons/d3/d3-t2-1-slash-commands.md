---
id: "d3-t2-1-slash-commands"
title: "Slash Commands — Project and User-Scoped Shortcuts"
domain: "d3"
taskRef: "T3.2"
order: 4
xp: 30
tag: "Core"
duration: "8 min"
analogy: "Keyboard shortcuts vs typing menu paths. Both do the same thing — but a keyboard shortcut executes a complex sequence in one keystroke. Slash commands are keyboard shortcuts for Claude Code workflows — one command triggers a complete, consistent workflow."
examTrap: "Confusing project-scoped commands (in .claude/commands/) with user-scoped commands (in ~/.claude/commands/). Project commands are shared via git. User commands are personal and not shared."
keyPoints:
  - "Slash commands are reusable prompt templates invoked with /command-name in Claude Code."
  - "Project-scoped commands live in .claude/commands/ — committed to git, shared with team."
  - "User-scoped commands live in ~/.claude/commands/ — personal, not shared."
  - "Commands support $ARGUMENTS placeholder for passing context at invocation time."
  - "Commands can specify allowed-tools in frontmatter to control which tools Claude can use when the command runs."
antiPatterns:
  - "Duplicating the same complex prompt in multiple places — create a slash command instead"
  - "Commands with no arguments when they should be parameterized"
  - "Commands that are too broad — 'review everything' — not specific enough to be useful"
  - "Not using allowed-tools to constrain what Claude can do when a command runs"
tbChallenge: "Design a slash command for your team's PR review process. It should check for: test coverage, error handling, security issues, and adherence to the repository pattern. Show the full command file."
---

## Command File Structure

Commands are markdown files in `.claude/commands/` (project) or `~/.claude/commands/` (user):

```
.claude/
└── commands/
    ├── review-pr.md          # /review-pr command
    ├── add-tests.md          # /add-tests command
    ├── security-check.md     # /security-check command
    └── refactor-service.md   # /refactor-service command
```

## Writing a Slash Command

```markdown
<!-- .claude/commands/review-pr.md -->
---
description: "Comprehensive PR review checking all team standards"
allowed-tools: file_read, grep, glob, bash
argument-hint: "[optional: specific files or areas to focus on]"
---

# PR Review — Team Standards Check

Review the staged changes (or $ARGUMENTS if specified) against our team standards.

Check ALL of the following:

## 1. Repository Pattern Compliance
- All database queries go through repository classes in src/repositories/
- Services never import from models directly — only through repositories
- grep for "from '../models'" in src/services/ — should be zero results

## 2. Test Coverage
- Every new public function has at least one test
- Every error path has a test
- No test files reference real external services (mock everything)
- Run: bash("pytest --cov=src --cov-report=term-missing")

## 3. Error Handling
- All async functions have try/catch or are handled by middleware
- Errors are logged before being re-raised
- User-facing error messages don't expose internal details

## 4. Security
- No credentials, tokens, or secrets in code
- All user inputs validated before use
- SQL parameters are parameterized (no string concatenation)
- Sensitive data not written to logs

## 5. Monetary Values
- All money stored as integers (cents), never floats
- Conversion happens only at API boundary

Report findings by severity: Critical / High / Medium / Low
For each finding: file, line number, issue, recommendation.
```

## Using Arguments

The `$ARGUMENTS` placeholder captures text after the command name:

```
/review-pr src/api/payments.ts src/services/payment_service.ts
```

In the command file:
```markdown
Review these specific files: $ARGUMENTS

Apply all team standards from our CLAUDE.md to these files only.
```

## Tool Restriction in Commands

The `allowed-tools` frontmatter limits what Claude can do when this command runs:

```yaml
---
allowed-tools: file_read, grep, glob
# No file_write — this command should only READ, not modify
---
```

```yaml
---
allowed-tools: file_read, file_write, bash
# Full access — this command makes changes
---
```

## Project vs User Commands

```
Project commands (.claude/commands/) — in git, shared with team:
- /review-pr
- /add-tests
- /security-check
- /generate-migration

User commands (~/.claude/commands/) — personal, not shared:
- /my-daily-setup
- /quick-debug
- /personal-review-style
```

## Key Takeaways

1. **Slash commands** are reusable prompt templates — one command, consistent workflow
2. **Project commands** in `.claude/commands/` — committed, shared with team
3. **User commands** in `~/.claude/commands/` — personal, not shared
4. **$ARGUMENTS** for parameterized commands
5. **allowed-tools** controls what Claude can do when the command runs
6. **argument-hint** shows users what arguments are expected
