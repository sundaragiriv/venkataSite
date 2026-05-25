---
id: "d3-t6-3-review-pipelines"
title: "Specialized Review Pipelines — Focused Claude Code Reviews"
domain: "d3"
taskRef: "T3.6"
order: 18
xp: 30
tag: "Core"
duration: "7 min"
analogy: "Quality assurance stations on an assembly line — each specialized for one dimension. Security station checks vulnerabilities. Coverage station checks test completeness. Architecture station checks patterns. Specialized reviewers catch more than one generalist trying to check everything."
examTrap: "Building one 'review everything' Claude Code step. Specialized stages with focused context produce better findings. A security reviewer focused on credentials will catch more than a reviewer trying to simultaneously check security, coverage, and architecture."
keyPoints:
  - "Specialized review steps outperform generalist reviews — focused attention, specific findings, clearer ownership."
  - "Each review stage receives only relevant context — security rules for security review, architecture rules for architecture review."
  - "Prior findings can be passed to subsequent stages — stage 3 can know what stage 1 found."
  - "JSON output with severity levels for automated pipeline gating decisions."
  - "CRITICAL blocks merge, HIGH requires sign-off, MEDIUM tracked, LOW noted."
antiPatterns:
  - "One generalist 'review everything' step — unfocused, produces vague findings"
  - "All stages receiving identical full context — irrelevant information dilutes focus"
  - "Free-text output — pipeline cannot automate gating decisions"
  - "No severity levels — all findings treated as equal blockers or none are"
tbChallenge: "Stage 2 (coverage check) found that 3 new functions have no tests. How does this information get passed to stage 3 (architecture review)? Why would the architecture reviewer want to know this?"
---

## Three-Stage Specialized Pipeline

```bash
# Stage 1: Security (security rules only, read-only tools)
claude -p \
  --allowedTools "file_read,grep,glob" \
  --output-format json --timeout 120 \
  "SECURITY REVIEW ONLY.

Rules: $(grep -A 20 -i 'security\|credential' .claude/CLAUDE.md)
Files: $CHANGED_CONTENT

Check: credentials, injection, auth gaps, PII in logs.
Return: {pass: bool, findings: [{severity: CRITICAL|HIGH|MEDIUM|LOW, file, line, issue, fix}]}" \
  > stage1.json

# Stage 2: Coverage (coverage data + test runner access)
COVERAGE=$(pytest --cov=src --cov-report=json -q 2>&1)
claude -p \
  --allowedTools "file_read,bash,glob" \
  --output-format json --timeout 120 \
  "COVERAGE REVIEW ONLY.

Coverage: $COVERAGE
Files: $CHANGED_CONTENT

For each new public function: test exists?
Return: {pass: bool, adequate: bool, missing: [{function, file, what_to_test}]}" \
  > stage2.json

# Stage 3: Architecture (full CLAUDE.md + prior findings for awareness)
claude -p \
  --allowedTools "file_read,grep" \
  --output-format json --timeout 120 \
  "ARCHITECTURE REVIEW ONLY.

Conventions: $(cat .claude/CLAUDE.md)
Prior findings (awareness): $(jq '{security: .findings, coverage_gaps: .missing}' stage1.json stage2.json)
Files: $CHANGED_CONTENT

Check: repository pattern, service boundaries, naming.
Return: {pass: bool, violations: [{rule, file, line, current, correct}]}" \
  > stage3.json

# Gating
python3 -c "
import json, sys
s1=json.load(open('stage1.json')); s2=json.load(open('stage2.json')); s3=json.load(open('stage3.json'))
blockers=[f for f in s1.get('findings',[]) if f['severity']=='CRITICAL']+s3.get('violations',[])
if blockers: print('BLOCKED:', len(blockers), 'issue(s)'); sys.exit(1)
print('PASSED')
"
```

## Context Per Stage

```
Stage 1 (Security):
  ✓ Changed files
  ✓ Security-specific CLAUDE.md sections
  ✗ Coverage data, architecture rules

Stage 2 (Coverage):
  ✓ Changed files
  ✓ Coverage report
  ✗ Security rules, architecture rules

Stage 3 (Architecture):
  ✓ Changed files
  ✓ Full CLAUDE.md
  ✓ Prior findings from stages 1 and 2 (awareness)
```

## Key Takeaways

1. **Specialized stages** — focused context, better findings
2. **Relevant context only** per stage — no dilution
3. **Pass prior findings** to later stages where relevant
4. **JSON + severity levels** for automated gating
5. **CRITICAL blocks, HIGH warns, MEDIUM tracks** — proportional responses
