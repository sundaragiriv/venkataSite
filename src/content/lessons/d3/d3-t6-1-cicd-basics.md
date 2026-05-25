---
id: "d3-t6-1-cicd-basics"
title: "CI/CD Integration — Claude Code in Automated Pipelines"
domain: "d3"
taskRef: "T3.6"
order: 16
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "An automated quality inspector on a factory assembly line. Consistent. Tireless. Catches what humans miss when reviewing 50 PRs a week. The key: it must be configured to run unattended — no keyboard, no prompts."
examTrap: "The -p / --print flag. Without it, Claude Code runs interactively and WAITS for keyboard input. In CI/CD, there is no keyboard. The pipeline hangs indefinitely until killed. -p is non-negotiable for all pipeline usage."
keyPoints:
  - "-p / --print: non-interactive mode — processes prompt, outputs to stdout, exits. REQUIRED for CI/CD."
  - "--output-format json: structured output pipelines can parse programmatically for gating decisions."
  - "Independent review instances: fresh Claude Code invocation for review — separate from any generation."
  - "Exit codes: non-zero exit from Claude Code should fail the pipeline step."
  - "--allowedTools in CI/CD: minimum necessary — cannot intervene if wrong tool runs in headless mode."
antiPatterns:
  - "No -p flag in CI/CD — pipeline hangs waiting for keyboard input"
  - "Same Claude Code instance generating and reviewing — biased toward approving its own work"
  - "Not parsing exit codes — pipeline continues through Claude Code failures silently"
  - "All tools allowed — no guardrails in non-interactive mode"
tbChallenge: "Write the exact bash command for a CI/CD security review. Include: -p flag, JSON output, tool restriction, timeout, and exit code handling. Then explain what each option does."
---

## The -p Flag — Why It's Critical

```bash
# ❌ This HANGS in CI/CD
claude "Review this code"
# Claude waits for keyboard input → pipeline hangs

# ✅ This runs and exits
claude -p "Review this code"
# Processes prompt, outputs to stdout, exits with 0 or non-zero
```

## Complete Security Review Step

```bash
#!/bin/bash
set -e

# Get changed files
CHANGED=$(git diff --name-only origin/main...HEAD | \
  xargs -I {} sh -c '[ -f "{}" ] && echo "=== {} ===" && cat "{}"')

# Run security review — all options explained:
timeout 300 \                       # Kill after 5 minutes
claude -p \                         # Non-interactive: REQUIRED
  --allowedTools "file_read,grep,glob" \  # Minimum necessary tools
  --output-format json \            # Machine-parseable output
  "Security review of changed files:

$CHANGED

Check: credentials, injection, auth gaps, PII in logs.
Return: {pass: bool, findings: [{severity: CRITICAL|HIGH|MEDIUM|LOW, file, issue, fix}]}" \
  > security_review.json

# Handle exit codes
EXIT=$?
[ $EXIT -ne 0 ] && { echo "Claude Code failed ($EXIT)"; exit 1; }

# Parse and gate
CRITICAL=$(jq '[.findings[] | select(.severity=="CRITICAL")] | length' security_review.json)
[ "$CRITICAL" -gt 0 ] && { echo "❌ Critical findings:"; jq '.findings[] | select(.severity=="CRITICAL")' security_review.json; exit 1; }
echo "✅ Security review passed"
```

## GitHub Actions Integration

```yaml
- name: Claude Security Review
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  timeout-minutes: 5
  run: bash scripts/claude-security-review.sh
```

## Independent Review Instance

```bash
# Generation job
claude -p "Implement the PaymentService..." > impl.txt

# Review job — COMPLETELY SEPARATE INVOCATION
IMPL=$(cat impl.txt)
claude -p "Review this implementation for correctness and security issues:
$IMPL
Evaluate independently — assume nothing about how it was created." > review.txt
```

## Key Takeaways

1. **-p flag is REQUIRED** — without it, pipelines hang
2. **--output-format json** for parseable results
3. **timeout** prevents indefinite hangs
4. **Parse exit codes** — non-zero = failure
5. **Independent review instances** — separate invocations

---
id: "d3-t6-2-headless-mode"
title: "Headless Claude Code — Tool Restriction and Configuration"
domain: "d3"
taskRef: "T3.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A remote-controlled drone vs a piloted plane. The drone follows its programmed constraints exactly — you can't course-correct in real time. This makes precise upfront configuration critical: restrict what it can do to what it should do."
examTrap: "Giving headless Claude Code all tools 'for flexibility.' In non-interactive mode, you cannot intervene. If Claude calls file_delete when it shouldn't, you can't stop it. Restrict to minimum necessary."
keyPoints:
  - "--allowedTools: whitelist of permitted tools for this invocation."
  - "--disallowedTools: blacklist — useful when you want most tools except specific dangerous ones."
  - "Timeouts are critical for headless runs — unconstrained runs can block pipelines."
  - "Idempotent operations: headless jobs should be safe to re-run without causing double processing."
  - "--env for configuration — pass settings without hardcoding in commands."
antiPatterns:
  - "All tools allowed in headless — write/delete tools can cause damage without ability to intervene"
  - "No timeout — jobs can hang for hours"
  - "Non-idempotent headless jobs — re-runs cause data corruption or duplicate processing"
  - "Hardcoded config in commands — use environment variables"
tbChallenge: "Design a headless Claude Code job for nightly code quality checks across all PRs merged in the last 24 hours. Show the command, justify each tool in allowedTools, and explain the idempotency strategy."
---

## Tool Selection by Task

```bash
# Read-only review — no write tools
claude -p \
  --allowedTools "file_read,grep,glob" \
  --timeout 120 \
  "Analyze test coverage..."

# Documentation generation — needs write, not delete or bash
claude -p \
  --allowedTools "file_read,file_write,glob" \
  --disallowedTools "bash,file_delete" \
  --timeout 180 \
  "Generate API documentation..."

# Test runner — needs bash for test execution
claude -p \
  --allowedTools "file_read,bash,grep" \
  --timeout 300 \
  "Run tests and identify coverage gaps..."

# With environment config
claude -p \
  --allowedTools "file_read,bash" \
  --env "DATABASE_URL=postgresql://localhost/test_db" \
  --env "ENVIRONMENT=ci" \
  --timeout 240 \
  "Run integration tests..."
```

## Idempotency Pattern

```bash
# Check before doing — safe to re-run
claude -p \
  --allowedTools "file_read,file_write" \
  "Check CHANGELOG.md for a $VERSION entry.
  If found: return {action: 'skip', message: 'already exists'}
  If not found: add the entry, return {action: 'added'}"
```

## Tool Access Reference

| Task | Allowed | Blocked |
|---|---|---|
| Code review | file_read, grep, glob | file_write, bash, file_delete |
| Doc generation | file_read, file_write | bash, file_delete |
| Test analysis | file_read, bash | file_write, file_delete |
| Security scan | file_read, grep, glob | file_write, file_delete |
| Full refactor | file_read, file_write, bash | file_delete |

## Key Takeaways

1. **Minimum tools** — cannot intervene in non-interactive mode
2. **Always set timeout** — prevent indefinite hangs
3. **Idempotent design** — check before doing, safe to re-run
4. **--env for config** — not hardcoded in commands
5. **--disallowedTools** when you want most tools except specific dangerous ones

---
id: "d3-t6-3-review-pipelines"
title: "Specialized Review Pipelines — Focused Claude Code Reviews"
domain: "d3"
taskRef: "T3.6"
order: 18
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Quality assurance stations on an assembly line — each specialized. Security station. Coverage station. Architecture station. Specialized reviewers catch more than generalists because they focus on one dimension with full attention."
examTrap: "Building one 'review everything' Claude Code step. Specialized stages with focused context produce better, more actionable findings than a generalist step trying to check everything simultaneously."
keyPoints:
  - "Specialized review steps outperform generalist reviews — focused attention, better findings."
  - "Each review stage receives only relevant context — not everything, just what matters for that check."
  - "Prior findings passed as context: if security review found issues, architecture review should know."
  - "JSON output structure for machine-parseable gating decisions plus human-readable details."
  - "Threshold-based gating: CRITICAL blocks merge, HIGH blocks or requires sign-off, MEDIUM is tracked."
antiPatterns:
  - "One 'review everything' Claude step — unfocused, produces generic output"
  - "All stages receiving identical context — irrelevant information dilutes focus"
  - "Free-text output — pipelines cannot make automated gating decisions"
  - "Binary pass/fail with no severity — all issues treated as blockers or none are"
tbChallenge: "Design a 3-stage pipeline: (1) security review, (2) test coverage, (3) architecture compliance. For each stage: what's in its context, what tools are allowed, what JSON output structure does it produce?"
---

## Three Specialized Stages

```bash
#!/bin/bash

CHANGED_CONTENT=$(get_changed_files_content)
CLAUDE_MD=$(cat .claude/CLAUDE.md)

# Stage 1: Security (read-only, security context only)
claude -p \
  --allowedTools "file_read,grep,glob" \
  --output-format json \
  --timeout 120 \
  "SECURITY REVIEW ONLY.

Security rules from team conventions:
$(grep -A 30 -i 'security\|credential\|auth\|injection' .claude/CLAUDE.md)

Changed files:
$CHANGED_CONTENT

Check ONLY: credentials, injection, missing auth, PII in logs.
Return: {pass: bool, findings: [{severity, file, line, issue, fix}]}" \
  > stage1_security.json

# Stage 2: Test Coverage (needs bash for test runner)
COVERAGE=$(pytest --cov=src --cov-report=json -q 2>&1 | tail -20)
claude -p \
  --allowedTools "file_read,bash,glob" \
  --output-format json \
  --timeout 120 \
  "TEST COVERAGE REVIEW ONLY.

Current coverage report:
$COVERAGE

Changed files:
$CHANGED_CONTENT

For each new public function: does a test exist?
Return: {pass: bool, coverage_adequate: bool, missing_tests: [{function, file, what_to_test}]}" \
  > stage2_coverage.json

# Stage 3: Architecture (receives prior security findings as context)
SECURITY_ISSUES=$(jq '.findings' stage1_security.json)
claude -p \
  --allowedTools "file_read,grep" \
  --output-format json \
  --timeout 120 \
  "ARCHITECTURE COMPLIANCE REVIEW ONLY.

Team architecture conventions:
$CLAUDE_MD

Prior security findings (for awareness):
$SECURITY_ISSUES

Changed files:
$CHANGED_CONTENT

Check ONLY: repository pattern, service boundaries, naming conventions.
Return: {pass: bool, violations: [{rule, file, line, current, correct}]}" \
  > stage3_architecture.json

# Gating decision
python3 - <<'EOF'
import json, sys

sec = json.load(open('stage1_security.json'))
cov = json.load(open('stage2_coverage.json'))
arch = json.load(open('stage3_architecture.json'))

# Blockers: CRITICAL security or architecture violations
blockers = (
    [f for f in sec.get('findings',[]) if f['severity']=='CRITICAL'] +
    arch.get('violations', [])
)

# Warnings: HIGH security or missing coverage
warnings = (
    [f for f in sec.get('findings',[]) if f['severity']=='HIGH'] +
    ([] if cov.get('coverage_adequate') else [{'issue': 'Insufficient test coverage'}])
)

if blockers:
    print(f"❌ PR BLOCKED — {len(blockers)} blocker(s)")
    for b in blockers: print(f"  • {b}")
    sys.exit(1)

if warnings:
    print(f"⚠️  {len(warnings)} warning(s) — review required before merge")
    for w in warnings: print(f"  • {w}")
    # Don't exit 1 — warn but allow with review

print("✅ All checks passed")
EOF
```

## Context Per Stage (Not Everything)

```
Stage 1 (Security):
  ✓ Changed file content
  ✓ Security-relevant CLAUDE.md sections
  ✗ Coverage data (irrelevant)
  ✗ Architecture rules (irrelevant)

Stage 2 (Coverage):
  ✓ Changed file content
  ✓ Coverage report
  ✗ Security rules (different domain)

Stage 3 (Architecture):
  ✓ Changed file content
  ✓ Full CLAUDE.md conventions
  ✓ Prior security findings (awareness, not duplication)
```

## Key Takeaways

1. **Specialized stages** — focused input, focused output, better findings
2. **Relevant context only** per stage — less noise, more signal
3. **Prior findings as context** where relevant (stage 3 knows security results)
4. **JSON output** for automated gating + severity-based threshold decisions
5. **CRITICAL blocks, HIGH warns, MEDIUM tracks** — proportional responses
