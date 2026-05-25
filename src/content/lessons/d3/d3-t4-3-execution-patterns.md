---
id: "d3-t4-3-execution-patterns"
title: "Execution Patterns — Sequencing Claude Code for Complex Tasks"
domain: "d3"
taskRef: "T3.4"
order: 12
xp: 25
tag: "Core"
duration: "7 min"
analogy: "A project manager breaking work into phases. Phase 1: understand. Phase 2: plan. Phase 3: build. Phase 4: verify. Each phase has a clear output that gates the next. Skipping phases saves time upfront but costs more time in rework."
examTrap: "Treating Claude Code as single-shot — one big prompt, full implementation. Complex tasks need phases: Explore, Plan, Implement, Verify. The phases reduce total time even though they add upfront steps."
keyPoints:
  - "Phased execution: Explore → Plan → Implement → Verify — each phase gates the next."
  - "Sequential issue resolution: one failing test at a time — fix, verify, move to next."
  - "bash() tool between iterations to run tests and verify progress automatically."
  - "Existing tests as spec: use them as the ground truth for what the implementation must do."
  - "The interview pattern: before implementing, surface all ambiguities and resolve them first."
antiPatterns:
  - "Single-shot implementation for complex tasks — high risk of inconsistency"
  - "Fixing all failing tests simultaneously — interactions between fixes cause new failures"
  - "Not running tests between iterations — accumulating unverified changes"
  - "Skipping the interview pattern for ambiguous features — discovering ambiguity mid-implementation"
tbChallenge: "15 tests are failing after a major dependency upgrade. Walk me through your phased approach: how do you categorize them, what order do you tackle them, and when do you verify?"
---

## Phased Execution Model

```
Phase 1: EXPLORE (if unfamiliar codebase/area)
  → Explore subagent maps the relevant area
  → Output: structured understanding

Phase 2: PLAN (if complex or ambiguous)
  → Plan mode produces implementation plan
  → Human reviews and approves
  → Output: approved plan

Phase 3: IMPLEMENT (follows the plan)
  → Direct execution per plan
  → bash() to verify after each logical unit
  → Output: changed files, passing tests

Phase 4: VERIFY (full test suite)
  → Run complete test suite
  → Check coverage thresholds
  → Output: all green, coverage met
```

## Sequential Test Resolution

```markdown
15 failing tests after dependency upgrade.

Step 1: Categorize
Run: bash("pytest --tb=short 2>&1 | head -100")
Identify: are failures concentrated in one module? One fixture? One pattern?

Step 2: Fix simplest first
Fix ONE test. Run ONLY that test.
bash("pytest tests/test_auth.py::test_login_success -v")
Must pass before moving on.

Step 3: Run full suite
bash("pytest -v 2>&1 | tail -30")
Did fixing test 1 break anything else?

Step 4: Repeat
Fix next simplest failing test. Verify. Check full suite.
```

## The Interview Pattern

```markdown
Before writing any code for this feature:
List all the questions I need to answer to implement it correctly.

Consider: data format, scale, security, edge cases, integration points,
anything that could reasonably go either way architecturally.

List ALL questions. I will answer them all. Then we implement.
```

## Key Takeaways

1. **Four phases**: Explore → Plan → Implement → Verify
2. **One failing test at a time** — sequential resolution prevents interactions
3. **bash() to verify** after each change — don't let unverified changes accumulate
4. **Interview before implementing** — surface ambiguity early, not during
5. **Existing tests are the spec** — implement to pass them, don't change them

---
id: "d3-t5-1-refinement-basics"
title: "Iterative Refinement — Getting to the Right Output"
domain: "d3"
taskRef: "T3.5"
order: 13
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A sculptor and a client. Not one shot — rough shape first, feedback, refine, feedback, polish. Each iteration is faster because direction is clearer. Claude Code works the same way for complex outputs."
examTrap: "Expecting perfect output on the first attempt for complex tasks. The best Claude Code workflows plan for 2-3 iterations — this is a workflow design, not a sign of failure."
keyPoints:
  - "Iteration is planned, not reactive — budget 2-3 rounds from the start for complex outputs."
  - "Concrete input/output examples dramatically reduce iterations — Claude sees exactly what you want."
  - "Review structure first, content second, style third — don't give style feedback on draft 1."
  - "Specific feedback beats vague feedback — 'error messages must include the field name' vs 'improve errors.'"
  - "When Claude isn't incorporating feedback, the instruction needs to change — not just repeat."
antiPatterns:
  - "Vague feedback: 'make it better', 'that's not right' — Claude doesn't know what better means"
  - "Style feedback on draft 1 — fix structure before style"
  - "Giving the same feedback twice — if it's not landing, change the instruction"
  - "No examples in initial prompt — Claude has to infer your standard"
tbChallenge: "You asked Claude to generate API documentation. The output is technically accurate but uses a completely different format than your team standard. Write the specific feedback that gets you from current output to your standard in one iteration."
---

## Concrete Examples in the Initial Prompt

```markdown
# Without examples — many iterations
Generate API documentation for the endpoints in src/api/

# With examples — typically 1-2 iterations  
Generate API documentation for the endpoints in src/api/
matching EXACTLY this format:

## POST /api/v2/refunds

**Description**: Process a refund for a completed order.

**Auth**: Bearer token required

**Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| order_id | string | Yes | Format: ORD-XXXXXXXX |
| amount | integer | Yes | Amount in cents |
| reason | string | Yes | One of: defective, not_received, wrong_item |

**200 Response**:
```json
{"refund_id": "REF-123456", "status": "processing"}
```

**Error codes**: 400 (validation), 404 (order not found), 422 (not eligible)
---
Apply this exact format to all endpoints in src/api/
```

## Specific Feedback That Works

```
# ❌ Vague
"The error handling isn't right"
"Make the format match our standard"

# ✅ Specific
"Error responses must include four fields:
  - status (HTTP code as integer)
  - code (machine-readable string like VALIDATION_ERROR)
  - message (human readable explanation)
  - field (which input field caused the error, if applicable)
Current output includes only message. Add the other three."

"The parameter table is using backtick code formatting for types (string).
Use plain text instead. Also, move Required column before Description."
```

## Iteration Planning

```
Draft 1 → Review STRUCTURE only
  Does the overall shape match what I need?
  Is the coverage complete?

Draft 2 → Review CONTENT
  Are the details correct?
  Are edge cases covered?

Draft 3 → Review STYLE and FORMAT
  Does it match team standards?
  Is it consistent throughout?
```

## Key Takeaways

1. **Plan 2-3 iterations** for complex outputs — not a failure, a workflow
2. **Concrete examples** in the initial prompt reduce iterations dramatically
3. **Structure first, content second, style third** — don't jump to style
4. **Specific feedback** over vague — include the exact correction needed
5. **Change the instruction** if feedback isn't landing — don't just repeat it

---
id: "d3-t5-2-test-driven"
title: "Test-Driven Workflows with Claude Code"
domain: "d3"
taskRef: "T3.5"
order: 14
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Building to a blueprint vs hoping it fits. Tests are executable blueprints. Claude knows exactly what 'done' means before writing a single line of implementation code."
examTrap: "Writing tests and implementation together and calling it TDD. True TDD is tests first, implementation second — the tests define correctness independently."
keyPoints:
  - "Tests first, implementation second — Claude has unambiguous acceptance criteria before writing production code."
  - "Existing failing tests are the highest quality spec — unambiguous and automatically verifiable."
  - "bash() tool to run tests between changes — automated verification in the loop."
  - "Never modify tests to make them pass — fix the implementation."
  - "Red-green-refactor works naturally: failing test → minimal implementation → passing → clean up."
antiPatterns:
  - "Writing tests after implementation — tests describe what code does, not what it should do"
  - "Not running tests after each iteration — accumulating uncertainty"
  - "Modifying tests to pass — spec becomes what Claude wrote, not what you intended"
  - "No error path tests — Claude needs to know what NOT to do as much as what to do"
tbChallenge: "Walk me through the complete TDD workflow with Claude Code for implementing a calculateShippingCost() function. Start from 'no tests exist' and end at 'all tests green.'"
---

## TDD Workflow: Tests First

```markdown
# Step 1: Write tests (not implementation)

Write comprehensive tests for calculateShippingCost() before I write the implementation.

Function signature: calculateShippingCost(weight_kg: float, distance_km: int, service: str) -> int
Returns: cost in cents

Business rules:
- Standard service: $0.50/km base + $2.00/kg
- Express service: 2x standard rate
- Free shipping for orders over $100 total (but this function receives pre-discount amount)
- Minimum charge: $500 (cents) for any shipment
- Invalid service name raises ValueError
- Negative weight or distance raises ValueError

Write tests that FAIL before the implementation exists.
Include: happy paths for each service, boundary conditions, error cases.
Do NOT write the implementation — tests only.
```

```python
# Claude generates tests like:
def test_standard_shipping_basic():
    assert calculate_shipping_cost(5, 100, "standard") == 1250  # $12.50

def test_express_is_double_standard():
    standard = calculate_shipping_cost(5, 100, "standard")
    express = calculate_shipping_cost(5, 100, "express")
    assert express == standard * 2

def test_minimum_charge_applies():
    assert calculate_shipping_cost(0.1, 1, "standard") == 500  # $5.00 minimum

def test_invalid_service_raises():
    with pytest.raises(ValueError, match="Invalid service"):
        calculate_shipping_cost(1, 100, "overnight")

def test_negative_weight_raises():
    with pytest.raises(ValueError):
        calculate_shipping_cost(-1, 100, "standard")
```

```markdown
# Step 2: Run tests — they should ALL fail
bash("pytest tests/test_shipping.py -v")
Expected: all FAILED (implementation doesn't exist)

# Step 3: Implement minimum code to pass ALL tests
Write the implementation. Run after writing:
bash("pytest tests/test_shipping.py -v")
Expected: all PASS

# Step 4: Run full test suite — no regressions
bash("pytest -v")
Expected: all existing tests still pass
```

## Using Existing Failing Tests

```markdown
8 tests are failing in tests/test_payment_service.py after the refactor.
DO NOT modify any test files.
Each test defines what PaymentService must do.
Implement PaymentService to make all 8 tests pass.
Run bash("pytest tests/test_payment_service.py -v") after each significant change.
```

## Key Takeaways

1. **Tests first** — define correctness before writing production code
2. **bash() in the loop** — verify after each change, don't accumulate uncertainty
3. **Never modify tests** to make them pass — fix the implementation
4. **Existing tests are the spec** — they're the most precise requirements you have
5. **Red-green-refactor** — get passing first, then clean up

---
id: "d3-t5-3-interview-pattern"
title: "The Interview Pattern — Resolving Ambiguity Before Implementation"
domain: "d3"
taskRef: "T3.5"
order: 15
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A contractor's pre-build consultation. They ask about soil, utilities, building codes — things that if unaddressed could require tearing walls down. The interview pattern does this for code: surfaces implementation questions before any code is written."
examTrap: "Answering interview questions one at a time in a dialogue. The correct pattern is: Claude asks ALL questions at once, you answer ALL at once, then implementation begins. Back-and-forth questioning delays implementation unnecessarily."
keyPoints:
  - "Interview pattern: Claude lists all questions, you resolve them all at once, then implementation proceeds without ambiguity."
  - "Surfaces edge cases and architectural decisions you might not have thought of."
  - "Also works mid-task: when Claude hits an ambiguous decision point, surface it rather than guess."
  - "Resolved questions become documentation — capturing design decisions made during implementation."
  - "The interview is especially valuable for features that touch multiple systems or have security implications."
antiPatterns:
  - "One question at a time dialogue — slow and interrupts flow"
  - "Skipping interview for 'simple' features — complexity reveals itself during implementation"
  - "Not documenting resolved questions — losing design decisions"
  - "Claude guessing at ambiguities — always surface and resolve"
tbChallenge: "You're implementing a bulk user export endpoint. Before writing code, what are the 10 most important questions Claude should ask? Include questions about format, scope, scale, security, and delivery."
---

## The Interview Pattern Prompt

```markdown
Before writing any code for this feature:

Feature: Bulk export users endpoint (GET /api/v2/admin/users/export)

List ALL the questions you need answered to implement this correctly.

Consider:
- Data format and structure decisions
- Performance and scale decisions  
- Security and authorization decisions
- Edge cases and error handling
- Integration with existing systems
- Anything that could reasonably be implemented two valid ways

List all questions. I'll answer them all at once. Then we implement.
```

## What Claude Should Ask (Example)

```
1. FORMAT: CSV, JSON, or both? If CSV, include headers?
   
2. SCOPE: All users or filter by: status (active/inactive), date_joined range, role?
   
3. SCALE: Expected max? 1k users (sync OK) or 100k users (need async)?
   
4. FIELDS: Which fields? Is email/phone available to export requester?
   
5. AUTH: Admin role only? Which permission level?
   
6. AUDIT: Do we log who exported what, when?
   
7. PRIVACY: GDPR — is consent required for export of EU users?
   
8. RATE LIMIT: Max exports per admin per day?
   
9. DELIVERY: Immediate download or async job with email?
   
10. EXISTING PATTERN: Any existing export to follow?
```

## Documenting Decisions

```markdown
# After interview — document resolved decisions

## Bulk Export Design Decisions [2024-11-22]

Format: CSV with headers
Scope: All active users, optional date_joined filter
Scale: Max 50k — async job for >10k, sync for ≤10k
Fields: id, email, name, tier, date_joined (no phone/address)
Auth: Admin role required
Audit: Yes — log to audit_log table
Privacy: Skip EU users unless explicit consent flag is set
Rate limit: 5 exports per admin per day
Delivery: Async for >10k, sync download for ≤10k
Existing pattern: Follow jobs/export_orders.py
```

These decisions are captured before a line of code is written.

## Key Takeaways

1. **All questions at once** — not one at a time
2. **All answers at once** — then implementation begins
3. **Mid-task ambiguity** → surface it, don't guess
4. **Document resolved decisions** — they're design artifacts
5. **Trust Claude's questions** — it sees implementation implications you might miss

---
id: "d3-t6-1-cicd-basics"
title: "CI/CD Integration — Running Claude Code in Pipelines"
domain: "d3"
taskRef: "T3.6"
order: 16
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "An automated quality inspector on an assembly line. Checks every piece consistently, without fatigue. Catches defects that humans miss when reviewing 50 PRs a week. Doesn't replace human judgment — augments it."
examTrap: "Forgetting the -p / --print flag. Without -p, Claude Code runs in interactive mode and waits for keyboard input. The CI/CD pipeline hangs indefinitely. -p is REQUIRED for all pipeline usage."
keyPoints:
  - "-p / --print flag: runs Claude Code non-interactively — processes prompt, outputs to stdout, exits. REQUIRED for CI/CD."
  - "--output-format json: returns structured JSON output that pipelines can parse programmatically."
  - "--allowedTools: restricts which tools Claude Code can use — minimum necessary for the pipeline task."
  - "Independent review instances: fresh Claude Code invocation for review, separate from any generation invocation."
  - "Exit codes matter: non-zero exit from Claude Code should fail the pipeline step."
antiPatterns:
  - "Running without -p flag in CI/CD — pipeline hangs waiting for input"
  - "Same instance generating AND reviewing — biased toward approving its own work"
  - "Not parsing exit codes — pipeline continues through Claude Code failures"
  - "All tools allowed in headless mode — can't intervene if wrong tool runs"
tbChallenge: "Show me the exact bash command to run a security review of changed files in CI/CD. Include: the -p flag, JSON output, tool restriction, timeout, and exit code handling."
---

## The -p Flag

```bash
# ❌ Interactive mode — hangs in CI/CD
claude "Review this code"

# ✅ Non-interactive mode — processes and exits
claude -p "Review this code"
#      ^^^ REQUIRED for CI/CD
```

## Complete CI/CD Security Review Command

```bash
#!/bin/bash
set -e

# Get changed files content
CHANGED_CONTENT=$(git diff origin/main...HEAD --name-only | while read f; do
  [ -f "$f" ] && echo "=== $f ===" && cat "$f" && echo
done)

# Run Claude security review
timeout 300 claude -p \
  --allowedTools "file_read,grep,glob" \
  --output-format json \
  "Review these changed files for security issues only:

$CHANGED_CONTENT

Check for: hardcoded credentials, SQL injection, missing auth checks, PII in logs.

Return JSON ONLY:
{
  \"pass\": true|false,
  \"findings\": [{\"severity\": \"CRITICAL|HIGH|MEDIUM|LOW\", \"file\": \"\", \"issue\": \"\", \"fix\": \"\"}]
}" > security_review.json

# Parse results
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Claude Code failed (exit code: $EXIT_CODE)"
  exit 1
fi

CRITICAL=$(jq '[.findings[] | select(.severity=="CRITICAL")] | length' security_review.json)
if [ "$CRITICAL" -gt 0 ]; then
  echo "❌ Critical security findings:"
  jq '.findings[] | select(.severity=="CRITICAL")' security_review.json
  exit 1
fi

echo "✅ Security review passed"
```

## GitHub Actions Integration

```yaml
- name: Claude Security Review
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  timeout-minutes: 5
  run: |
    # (command from above)
    
- name: Fail on Security Issues
  if: failure()
  run: |
    echo "Security review failed — see logs above"
    exit 1
```

## Independent Review Instance

```bash
# Generation job (one invocation)
claude -p "Implement the feature..." > implementation.txt

# Review job (SEPARATE invocation — no shared context)
IMPL=$(cat implementation.txt)
claude -p "Review this implementation for bugs and security:
$IMPL
This was generated by a separate process. Evaluate independently." > review.txt
```

## Key Takeaways

1. **-p flag REQUIRED** for CI/CD — non-negotiable
2. **--output-format json** for parseable pipeline output
3. **--allowedTools** restricts scope — minimum necessary
4. **timeout** prevents pipeline hangs
5. **Parse exit codes** — treat Claude failures as pipeline failures
6. **Independent review instances** — separate invocations for generation and review

---
id: "d3-t6-2-headless-mode"
title: "Headless Claude Code — Configuration for Automation"
domain: "d3"
taskRef: "T3.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A remote-controlled vehicle. Precise control from a distance — but you must specify exactly what it can do. No ability to course-correct in real time. Restrict tools carefully."
examTrap: "Giving headless Claude Code all tools because 'it might need them.' In non-interactive mode, you cannot intervene. Restrict to exactly what the task needs."
keyPoints:
  - "--allowedTools: explicit whitelist of permitted tools for this invocation."
  - "--disallowedTools: explicit blacklist — useful when you want most tools except specific dangerous ones."
  - "Timeouts are critical: a hung headless Claude Code invocation blocks the pipeline indefinitely."
  - "Idempotent operations: headless jobs should be safe to re-run — check before doing, don't just do."
  - "--env for configuration: pass environment-specific settings without hardcoding."
antiPatterns:
  - "All tools allowed in headless mode — write/delete tools can cause damage without ability to intervene"
  - "No timeout — headless jobs can hang for hours"
  - "Non-idempotent headless jobs — re-running causes double processing or data corruption"
  - "Hardcoded API keys in commands — use environment variables"
tbChallenge: "Design a nightly headless Claude Code job that checks code quality across all PRs merged in the last 24 hours. What's the exact command structure, what tools are allowed, and how do you handle idempotency?"
---

## Headless Command Structure

```bash
# Read-only review — no write tools
claude -p \
  --allowedTools "file_read,grep,glob" \
  --timeout 120 \
  "Analyze test coverage for these files..."

# Analysis with bash (read-only commands)
claude -p \
  --allowedTools "file_read,bash,grep,glob" \
  --timeout 300 \
  "Run test suite and report results..."

# Documentation generation (needs write)
claude -p \
  --allowedTools "file_read,file_write,glob" \
  --disallowedTools "bash,file_delete" \
  --timeout 180 \
  "Generate API docs..."

# With environment config
claude -p \
  --allowedTools "file_read,bash" \
  --env "ENVIRONMENT=production" \
  --env "LOG_LEVEL=error" \
  --timeout 240 \
  "Run production health checks..."
```

## Idempotency Pattern

```bash
# Check before doing — safe to re-run
claude -p \
  --allowedTools "file_read,file_write" \
  "Check if CHANGELOG.md already has an entry for version $VERSION.
  If it does: return {action: 'skip', reason: 'already_exists'}
  If it doesn't: add the entry and return {action: 'added'}"
```

## Tool Access by Task Type

| Task | Allow | Block |
|---|---|---|
| Code review | file_read, grep, glob | file_write, bash, file_delete |
| Doc generation | file_read, file_write | bash, file_delete |
| Test analysis | file_read, bash | file_write, file_delete |
| Security scan | file_read, grep, glob | file_write, file_delete |

## Key Takeaways

1. **Minimum tools** — cannot intervene in non-interactive mode
2. **Always set timeout** — prevent indefinite hangs
3. **Idempotent design** — safe to re-run without side effects
4. **Environment variables** for configuration — not hardcoded
5. **bash access** for read-only commands (test runners) — restrict for write operations

---
id: "d3-t6-3-review-pipelines"
title: "Code Review Pipelines — Specialized Claude Code Reviews"
domain: "d3"
taskRef: "T3.6"
order: 18
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A quality assurance assembly line with multiple inspection stations. Security station. Coverage station. Architecture station. Each is specialized — not one generalist checker for everything. Specialized reviews are more reliable and produce more actionable output."
examTrap: "Building one 'review everything' Claude Code step. Focused review steps produce better output — Claude concentrates on one dimension at a time, and failures are easier to diagnose."
keyPoints:
  - "Specialized review steps outperform generalist reviews — focused attention, better findings."
  - "Each review stage receives only relevant context — not everything, just what matters for that check."
  - "Independent review instances — never the instance that generated the code."
  - "JSON output for pipeline gating decisions — human-readable details alongside machine-parseable structure."
  - "Threshold-based gating — CRITICAL blocks, HIGH warns, LOW notes."
antiPatterns:
  - "One 'review everything' step — unfocused, generic findings"
  - "Review receiving same context as generation — biased toward approving its own work"
  - "Free-text output — pipeline can't make gating decisions"
  - "All findings treated equally — CRITICAL and LOW need different pipeline responses"
tbChallenge: "Design a 3-stage pipeline: security review, test coverage check, and architecture compliance. For each stage: what context does it receive, what tools are allowed, and what's the output structure?"
---

## Three-Stage Review Pipeline

```bash
#!/bin/bash

CHANGED_FILES=$(git diff --name-only origin/main...HEAD)
CHANGED_CONTENT=$(echo "$CHANGED_FILES" | while read f; do
  [ -f "$f" ] && printf "=== %s ===\n%s\n\n" "$f" "$(cat "$f")"
done)

# Stage 1: Security
claude -p \
  --allowedTools "file_read,grep,glob" \
  --output-format json \
  --timeout 120 \
  "SECURITY REVIEW ONLY.

TEAM SECURITY RULES:
$(grep -A 20 'security\|credential\|auth' .claude/CLAUDE.md)

CHANGED FILES:
$CHANGED_CONTENT

Return JSON:
{
  'pass': boolean,
  'findings': [{'severity': 'CRITICAL|HIGH|MEDIUM|LOW', 'file': '', 'line': 0, 'issue': '', 'fix': ''}]
}" > security.json

# Stage 2: Coverage
COVERAGE_REPORT=$(bash("pytest --cov=src --cov-report=json -q 2>&1"))
claude -p \
  --allowedTools "file_read,glob" \
  --output-format json \
  --timeout 120 \
  "TEST COVERAGE REVIEW ONLY.

CURRENT COVERAGE:
$COVERAGE_REPORT

CHANGED FILES:
$CHANGED_CONTENT

For each new public function: does a test exist?
Return JSON:
{
  'pass': boolean,
  'coverage_sufficient': boolean,
  'missing_tests': [{'function': '', 'file': '', 'what_to_test': ''}]
}" > coverage.json

# Stage 3: Architecture
claude -p \
  --allowedTools "file_read,grep" \
  --output-format json \
  --timeout 120 \
  "ARCHITECTURE COMPLIANCE REVIEW ONLY.

TEAM ARCHITECTURE RULES:
$(cat .claude/CLAUDE.md)

CHANGED FILES:
$CHANGED_CONTENT

Check: repository pattern, service boundaries, naming conventions.
Return JSON:
{
  'pass': boolean,
  'violations': [{'rule': '', 'file': '', 'line': 0, 'current': '', 'correct': ''}]
}" > architecture.json

# Gating Decision
python3 - <<'EOF'
import json, sys

sec = json.load(open('security.json'))
cov = json.load(open('coverage.json'))
arch = json.load(open('architecture.json'))

blockers = (
    [f for f in sec.get('findings', []) if f['severity'] == 'CRITICAL'] +
    arch.get('violations', [])
)

if blockers:
    print('❌ PR blocked:')
    for b in blockers:
        print(f"  - {b.get('file', 'unknown')}: {b.get('issue', b.get('rule', ''))}")
    sys.exit(1)

warnings = [f for f in sec.get('findings', []) if f['severity'] == 'HIGH']
if warnings:
    print(f'⚠️  {len(warnings)} HIGH severity findings — review required')

print('✅ All checks passed')
EOF
```

## Context Per Stage (Not Everything)

```
Security review receives:
  ✓ Changed file content
  ✓ Security-specific CLAUDE.md sections
  ✗ Full project history
  ✗ Coverage reports (irrelevant)

Coverage review receives:
  ✓ Changed file content
  ✓ Current coverage report
  ✗ Security rules (irrelevant)
  ✗ Architecture conventions (irrelevant)
```

Focused context → focused output → actionable findings.

## Key Takeaways

1. **Specialized stages** beat one generalist review
2. **Each stage gets only relevant context** — focused input, focused output
3. **Independent instances** — never the generator reviewing itself
4. **JSON + thresholds** for pipeline gating decisions
5. **CRITICAL blocks, HIGH warns, LOW notes** — different pipeline responses for different severities
