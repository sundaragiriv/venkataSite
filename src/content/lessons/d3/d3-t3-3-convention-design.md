---
id: "d3-t3-3-convention-design"
title: "Convention Design — Writing Rules Claude Actually Follows"
domain: "d3"
taskRef: "T3.3"
order: 9
xp: 25
tag: "Core"
duration: "6 min"
analogy: "The difference between a vague rule ('write clean code') and a specific one ('functions must have fewer than 20 lines and a single responsibility, with no nested conditionals deeper than 2 levels'). The vague rule is ignored. The specific rule is actionable."
examTrap: "Writing conventions as aspirations rather than verifiable rules. 'Write good error handling' is an aspiration. 'Every async function must have a try/catch block and log errors to the structured logger before re-throwing' is a verifiable rule."
keyPoints:
  - "Rules must be specific and verifiable — Claude (and code review) can check if they're followed."
  - "Include positive examples (do this) AND negative examples (not this) for the most important rules."
  - "Rules should explain WHY — context helps Claude make correct judgment calls in edge cases."
  - "Prioritize rules — not every rule is equally important. Mark critical ones explicitly."
  - "Rules decay — review CLAUDE.md quarterly and remove rules that no longer apply."
antiPatterns:
  - "Aspirational rules: 'write readable code', 'handle errors gracefully'"
  - "Rules without context for why — Claude makes better decisions when it understands the reason"
  - "Too many equally-weighted rules — Claude loses focus on what actually matters"
  - "Never removing outdated rules — CLAUDE.md becomes a historical artifact"
tbChallenge: "Your team has 'Always write comprehensive tests' in CLAUDE.md. Rewrite this as a concrete, verifiable rule that Claude can actually enforce."
---

## Specific vs Vague Rules

```markdown
# ❌ Vague — cannot be verified or enforced
- Write comprehensive tests
- Handle errors properly
- Use good variable names
- Keep functions small

# ✅ Specific — verifiable and actionable
- Every new public function must have at least one test covering the happy path
  and at least one test covering the expected error cases
- Async functions must wrap in try/catch. Errors must be logged via
  structuredLogger.error() before re-throwing. Never swallow exceptions.
- Variable names for booleans must start with is_, has_, can_, or should_
  (e.g., isAuthenticated, hasPermission, canRefund)
- Functions must not exceed 30 lines. Extract helpers if longer.
```

## The Why Context

```markdown
# Without why — Claude might find exceptions that seem reasonable
- All monetary amounts stored as integers (cents)

# With why — Claude understands the constraint and applies it consistently
- All monetary amounts stored as integers (cents), never floats.
  REASON: floating point arithmetic produces precision errors.
  0.1 + 0.2 = 0.30000000000000004 in IEEE 754.
  A $9.99 + $0.01 calculation could produce $9.999999999999998.
  Store cents, convert only at the display layer.
```

## Including Examples

```markdown
## Error Handling Pattern

Every async service method must follow this pattern:

✅ DO THIS:
async function processRefund(orderId: string, amount: number): Promise<Refund> {
  try {
    const result = await refundService.process(orderId, amount);
    return result;
  } catch (error) {
    structuredLogger.error('processRefund failed', {
      orderId,
      amount,
      error: error.message,
      stack: error.stack
    });
    throw new RefundProcessingError('Refund processing failed', { cause: error });
  }
}

❌ NOT THIS:
async function processRefund(orderId, amount) {
  return await refundService.process(orderId, amount); // No error handling
}

❌ NOT THIS:
async function processRefund(orderId, amount) {
  try {
    return await refundService.process(orderId, amount);
  } catch (error) {
    return null; // Swallowed exception
  }
}
```

## Prioritizing Rules

```markdown
## CRITICAL — These must never be violated
- No credentials in code
- No raw SQL queries outside repository classes
- No synchronous HTTP calls in async handlers

## IMPORTANT — Follow unless there's a documented reason not to
- Repository pattern for all DB access
- 80% test coverage for new code
- Type hints on all public functions

## PREFERRED — Team standard, but judgment allowed
- Named exports over default exports
- Async/await over Promise chains
- Functional approach over class-based where appropriate
```

## Key Takeaways

1. **Specific and verifiable** beats aspirational and vague
2. **Include why** — context helps Claude handle edge cases correctly
3. **Include examples** — both good and bad
4. **Prioritize explicitly** — not all rules are equally critical
5. **Review quarterly** — remove outdated rules, update changed ones

---
id: "d3-t4-1-plan-mode"
title: "Plan Mode — When to Think Before Acting"
domain: "d3"
taskRef: "T3.4"
order: 10
xp: 40
tag: "⚡ Exam Tested"
duration: "10 min"
analogy: "An architect drawing blueprints before construction starts. For a garden shed, you might just start building. For a hospital, you draft and review plans extensively before a single nail is driven. Plan mode is the blueprint phase — mandatory for complex buildings, optional for sheds."
examTrap: "Thinking plan mode is always better because it 'thinks more carefully.' Plan mode adds latency and cost. For a single-file bug fix with clear scope, direct execution is faster and equally reliable. Plan mode is right for complexity, not correctness."
keyPoints:
  - "Plan mode triggers: 45+ file changes, multiple valid architectural approaches, library migrations, breaking changes, anything requiring design decisions before implementation."
  - "Direct execution triggers: single file bug fix, clear unambiguous scope, adding a function to an existing pattern, fixing a failing test."
  - "Plan mode produces a detailed plan for human review before ANY code is modified — the plan is the output of plan mode."
  - "After plan review and approval, execution mode implements the approved plan."
  - "Plan mode is NOT the same as extended thinking — it's a workflow mode, not a model capability."
antiPatterns:
  - "Using plan mode for every task — adds unnecessary latency for simple operations"
  - "Skipping plan mode for complex architectural changes — risk of implementing the wrong approach"
  - "Approving a plan without reading it — defeats the entire purpose"
  - "Using plan mode and then changing the scope mid-execution — plan becomes invalid"
tbChallenge: "Give me three concrete examples of tasks that should trigger plan mode, three that should use direct execution, and one that's genuinely ambiguous. For the ambiguous one, what information would make the decision clear?"
---

## The Plan Mode Decision Framework

```
Is the scope fully clear and unambiguous?
├── No → Plan mode
└── Yes → Is this more than 10 files?
    ├── Yes → Plan mode  
    └── No → Are there multiple valid architectural approaches?
        ├── Yes → Plan mode
        └── No → Direct execution
```

## Direct Execution — When It's Right

```
✅ Single file, clear fix:
"Fix the null pointer exception in src/services/payment_service.py line 47"
→ Direct execution: scope is clear, one file, one fix

✅ Adding to existing pattern:
"Add a getByEmail() method to CustomerRepository following the same pattern as getById()"
→ Direct execution: pattern is established, adding one method

✅ Failing test fix:
"test_calculate_refund_amount is failing — fix the function to make it pass"
→ Direct execution: the test defines what's correct, just fix the function

✅ Clear one-off task:
"Update the company name from 'Acme' to 'Acme Corp' in all strings in src/config/"
→ Direct execution: clear find-replace, no design decisions
```

## Plan Mode — When It's Required

```
⚠️ Architectural change:
"Migrate from class-based views to function-based views across the API layer"
→ Plan mode: 30+ files, multiple valid approaches, risk of inconsistency

⚠️ Library migration:
"Migrate from Axios to Fetch API across the frontend"
→ Plan mode: many files, edge cases in migration, needs consistent approach

⚠️ New system design:
"Design and implement the notification system — email, SMS, and push"
→ Plan mode: no existing pattern to follow, multiple valid architectures

⚠️ Breaking change:
"Rename all instances of 'user_id' to 'account_id' across the codebase"
→ Plan mode: risk of missing references, needs to verify all call sites
```

## What a Good Plan Looks Like

```markdown
# Migration Plan: Axios → Fetch API

## Scope Assessment
Files affected: 23 files in src/api/ and src/hooks/
Test files requiring updates: 8 files
Estimated changes: ~400 lines

## Approach
Option A: Direct replacement (Axios → native fetch)
  - Pros: simplest, no new dependency
  - Cons: lose Axios interceptors, must reimplement

Option B: Fetch wrapper matching Axios interface
  - Pros: minimal call site changes, preserves interceptor pattern
  - Cons: adds a wrapper layer

Recommendation: Option B — the interceptor pattern is used in 18 places for auth

## Execution Sequence
1. Create src/lib/http-client.ts (Fetch wrapper with interceptors)
2. Update tests for http-client
3. Replace Axios in shared utilities (2 files)
4. Replace Axios in API hooks (8 files)  
5. Replace Axios in direct API calls (13 files)
6. Remove Axios from package.json
7. Run test suite — fix any failures

## Risk Factors
- Streaming responses: Axios and Fetch handle streams differently — verify 2 uses
- Error handling: Fetch doesn't throw on 4xx/5xx — must handle in wrapper

## Estimated Impact
Zero behavior change for users. All HTTP calls should work identically post-migration.
```

This plan should be reviewed and approved before a single file is changed.

## Key Takeaways

1. **Plan mode** for: 45+ files, multiple valid approaches, architectural decisions, migrations
2. **Direct execution** for: single file, clear scope, adding to existing pattern
3. **Plan is reviewed before execution** — human approval is the purpose
4. **Plan includes**: scope, approach options, recommendation, sequence, risks
5. **Don't use plan mode for everything** — it's a tool for complexity, not a default
