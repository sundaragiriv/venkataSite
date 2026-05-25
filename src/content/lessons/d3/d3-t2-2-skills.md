---
id: "d3-t2-2-skills"
title: "Skills — Reusable Sub-Agent Workflows with Context Isolation"
domain: "d3"
taskRef: "T3.2"
order: 5
xp: 35
tag: "Core"
duration: "8 min"
analogy: "Calling a specialist consultant. When you hire a database consultant to review your schema, they work independently — they don't have access to your other conversations or your main project context. They do their job and hand you a report. Skills work the same way: isolated execution, just the output comes back."
examTrap: "Confusing Skills with Slash Commands. Slash commands inject a prompt into the CURRENT session's context. Skills run in an ISOLATED sub-agent context — their internal work (file reads, analysis) doesn't pollute the main conversation context."
keyPoints:
  - "Skills are markdown files with a SKILL.md frontmatter that run as isolated sub-agents."
  - "context: fork means the skill runs in its own context — output does NOT accumulate in the main conversation."
  - "Skills are used for verbose, exploratory tasks that would fill the main context window if run inline."
  - "The skill's final output (its conclusion) is returned to the main conversation — not its working steps."
  - "Skills are the correct pattern for: codebase exploration, test runs with verbose output, analysis tasks."
antiPatterns:
  - "Running verbose analysis directly in the main conversation — fills context with intermediate steps"
  - "Using Skills for simple, non-verbose tasks — overhead isn't worth it for small tasks"
  - "Expecting Skills to share context with the main conversation during execution — they're isolated"
  - "Confusing the Skill file with the output — the SKILL.md defines the workflow, not the result"
tbChallenge: "Your team needs to run a comprehensive security audit of the codebase before every major release. Should this be a Slash Command or a Skill? Explain the tradeoffs and write whichever you'd choose."
---

## Skill File Structure

```
.claude/
└── skills/
    ├── security-audit.md      # Security audit skill
    ├── test-coverage.md       # Coverage analysis skill
    └── dependency-check.md    # Dependency vulnerability skill
```

## Writing a Skill

```markdown
<!-- .claude/skills/security-audit.md -->
---
description: "Comprehensive security audit of the codebase"
context: fork
allowed-tools: file_read, grep, glob, bash
---

# Security Audit Skill

Perform a comprehensive security audit of this codebase.

## What to Check

### 1. Credential Exposure
Search for any hardcoded credentials, API keys, or secrets:
- grep for patterns: password=, api_key=, secret=, token=, AWS_SECRET
- Check all .env.example files for real values (should be placeholders)
- Check test files for real credentials

### 2. Injection Vulnerabilities
- grep for string concatenation in SQL queries
- Check for unsanitized user input in shell commands
- Look for template literals with user-provided data in queries

### 3. Authentication Gaps
- Check all API endpoints for authentication middleware
- Identify any routes missing auth decorators
- Check for missing authorization checks (authn vs authz)

### 4. Dependency Vulnerabilities
bash("npm audit --json") or bash("pip-audit --json")
Parse results and flag HIGH and CRITICAL severity

### 5. Logging Security
- Check that no PII or credentials appear in log statements
- Verify error messages don't expose internal paths or system info

## Output Format
Return a structured security report:
- CRITICAL findings (require immediate fix before release)
- HIGH findings (fix within current sprint)
- MEDIUM findings (schedule for backlog)
- LOW findings (note for awareness)

For each finding: {severity, category, file, line, description, recommendation}
```

## Skill vs Slash Command: When to Use Each

| Characteristic | Slash Command | Skill |
|---|---|---|
| Runs in main context | Yes | No — isolated |
| Output goes into conversation | Fully | Summary only |
| Good for verbose analysis | No — pollutes context | Yes — isolation prevents this |
| Access to conversation history | Yes | No |
| Use for | Prompting, simple actions | Analysis, exploration, verbose tasks |

## How Skills Prevent Context Pollution

```
Without Skill (runs inline):
Main conversation grows with:
  → Analysis request
  → grep output (1000 lines)
  → file content (2000 lines)
  → more grep output (500 lines)
  → analysis results
  
Context window: 50% consumed by intermediate steps

With Skill (isolated):
Main conversation grows with:
  → Skill invocation
  → Skill result (100-line summary)
  
Context window: 5% consumed — room for more work
```

## Key Takeaways

1. **Skills = isolated sub-agent execution** — internal work doesn't touch main context
2. **context: fork** is what creates the isolation
3. **Use Skills for verbose, exploratory tasks** — security audits, coverage analysis, dependency scans
4. **Use Slash Commands for simpler prompts** — PR templates, code style checks, quick actions
5. **Output is the summary** — not the working steps, not the intermediate files read
