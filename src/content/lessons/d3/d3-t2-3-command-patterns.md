---
id: "d3-t2-3-command-patterns"
title: "Command Design Patterns — Building Effective Team Workflows"
domain: "d3"
taskRef: "T3.2"
order: 6
xp: 25
tag: "Core"
duration: "7 min"
analogy: "Standard Operating Procedures in a manufacturing plant. The SOP doesn't do the work — it ensures the work gets done the same way every time, regardless of who does it. Claude Code commands are SOPs for your development workflow."
examTrap: "Writing commands that are too generic to be useful or too specific to be reusable. The sweet spot is a command that handles a well-defined workflow consistently — specific enough to add value, general enough to be used repeatedly."
keyPoints:
  - "Good commands encode the team's collective knowledge about how to do something correctly — not just what to do."
  - "Commands should include quality criteria, not just task descriptions — what makes the output good?"
  - "Chained commands: one command can reference another via /command-name in its instructions."
  - "Commands with allowed-tools: restricting tools prevents commands from doing things beyond their intended scope."
  - "Argument-hint guides users at the point of invocation — reduces cognitive load for the caller."
antiPatterns:
  - "Commands with no quality criteria — 'write tests for this function' without specifying what good tests look like"
  - "Commands that try to do everything — break complex workflows into focused commands"
  - "No argument-hint — users don't know what to pass"
  - "Forgetting to specify allowed-tools for commands that should be read-only"
tbChallenge: "Your team has an inconsistent approach to adding error handling to async functions. Design a slash command that enforces your team's error handling pattern consistently. What quality criteria do you include?"
---

## Pattern 1: The Checklist Command

Encodes a multi-step review process that would otherwise be done inconsistently:

```markdown
<!-- .claude/commands/pre-commit-check.md -->
---
description: "Pre-commit verification — runs all team checks before git commit"
allowed-tools: file_read, grep, glob, bash
argument-hint: "[optional: specific files changed]"
---

Run pre-commit checks on $ARGUMENTS (or all changed files if none specified).

## Step 1: Tests Pass
bash("pytest tests/ -x --tb=short")
If any test fails: stop and report. Do not continue.

## Step 2: No TODO Comments in Changed Files
grep for "TODO" or "FIXME" in $ARGUMENTS
If found: list them. Ask if these are intentional (should they be tickets?).

## Step 3: No Debug Artifacts
grep for: console.log, print(, debugger, breakpoint()
These must be removed before commit.

## Step 4: Type Hints Present
For Python files: every new function must have type hints
For TypeScript: no `any` types without a comment explaining why

## Step 5: CLAUDE.md Compliance
Check that changes don't violate any rule in .claude/CLAUDE.md

Report: PASS (all checks clear) or FAIL (list of issues with file/line references)
```

## Pattern 2: The Generator Command

Generates code following team patterns:

```markdown
<!-- .claude/commands/add-repository.md -->
---
description: "Generates a new repository class following team patterns"
allowed-tools: file_read, file_write, glob
argument-hint: "<EntityName> (e.g., 'Customer', 'Order', 'Product')"
---

Create a repository class for the $ARGUMENTS entity.

Follow the exact pattern from src/repositories/customer_repository.py:
1. Create src/repositories/$ARGUMENTS_repository.py
2. Create tests/repositories/test_$ARGUMENTS_repository.py

The repository must:
- Extend BaseRepository
- Implement: find_by_id, find_all, create, update, delete
- All methods must be async
- All queries parameterized (no string concatenation)
- Include type hints for all parameters and return values

The tests must:
- Use pytest fixtures from tests/conftest.py
- Mock the database session (not real DB)
- Test happy path AND error paths for each method
- 100% coverage of the repository class
```

## Pattern 3: The Investigation Command

Designed for diagnosis, not modification:

```markdown
<!-- .claude/commands/debug-performance.md -->
---
description: "Investigates performance issues in the codebase"
allowed-tools: file_read, grep, glob, bash
argument-hint: "<endpoint or function to investigate>"
---

Investigate performance issues in: $ARGUMENTS

## Investigation Steps

1. Find the code: locate the function/endpoint
2. Check for N+1 queries: look for loops containing database calls
3. Check for missing indexes: identify fields used in WHERE clauses
4. Check for synchronous I/O in async code
5. Check for unnecessary data fetching (loading full objects when partial needed)

## Output
Produce a diagnosis report:
- Root cause hypothesis (ranked by likelihood)
- Evidence for each hypothesis
- Recommended fixes in order of expected impact
- Estimated effort for each fix

DO NOT modify any code — this is investigation only.
```

The `allowed-tools` without `file_write` enforces that this command only reads.

## Key Takeaways

1. **Include quality criteria** — not just task description, but what makes it good
2. **Focused commands** beat comprehensive ones — one workflow, done well
3. **argument-hint** guides callers at invocation time
4. **allowed-tools restriction** enforces command scope (read-only vs read-write)
5. **Chained commands** for complex workflows — `/check-coverage` then `/add-tests`
