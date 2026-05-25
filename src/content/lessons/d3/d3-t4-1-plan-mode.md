---
id: "d3-t4-1-plan-mode"
title: "Plan Mode — When to Think Before Acting"
domain: "d3"
taskRef: "T3.4"
order: 10
xp: 40
tag: "⚡ Exam Tested"
duration: "10 min"
analogy: "An architect drawing blueprints before construction starts. For a garden shed, you might just start building. For a hospital, you draft and review plans extensively before a single nail is driven. Plan mode is the blueprint phase — mandatory for complex builds, wasteful for simple ones."
examTrap: "Thinking plan mode is always better because it 'thinks more carefully.' Plan mode adds latency and cost. For a single-file bug fix with clear scope, direct execution is faster and equally good. Plan mode is right for complexity, not correctness."
keyPoints:
  - "Plan mode triggers: 45+ file changes, multiple valid architectural approaches, library migrations, breaking changes across the codebase."
  - "Direct execution triggers: single file bug fix, clear unambiguous scope, adding to an existing well-established pattern."
  - "Plan mode produces a detailed plan for human review BEFORE any code is modified — the plan itself is the output."
  - "After plan approval, execution mode implements the approved plan — they are separate phases."
  - "The exam tests the decision framework — which scenario triggers which mode."
antiPatterns:
  - "Using plan mode for every task — unnecessary latency for clear, simple operations"
  - "Skipping plan mode for complex architectural changes — risk of implementing wrong approach"
  - "Approving a plan without reading it — defeats the purpose of the review step"
  - "Treating plan mode as the same as extended thinking — they are different things"
tbChallenge: "Your team has a policy: 'always use plan mode.' A junior dev says this slows them down for simple bug fixes. Are they right? What's the correct policy?"
---

## The Decision Framework

```
Is scope fully clear and unambiguous?
├── No → Plan mode
└── Yes → More than 10 files affected?
    ├── Yes → Plan mode
    └── No → Multiple valid architectural approaches?
        ├── Yes → Plan mode
        └── No → Direct execution
```

## Direct Execution — Examples

```
✅ Single file, clear fix:
"Fix the null pointer exception in payment_service.py line 47"
One file. One fix. No design decisions.

✅ Adding to established pattern:
"Add getByEmail() to CustomerRepository following the same pattern as getById()"
Pattern exists. Adding one method.

✅ Failing test:
"Make test_calculate_refund_amount pass without modifying the test"
Test defines correct behavior.

✅ Simple find/replace with verification:
"Update company name from 'Acme' to 'Acme Corp' in all config strings"
Clear scope. No design decisions.
```

## Plan Mode — Examples

```
⚠️ Architecture change:
"Migrate from class-based views to function-based views across the API layer"
30+ files. Multiple valid approaches. Needs consistent strategy.

⚠️ Library migration:
"Replace Axios with native Fetch API across the frontend"
Many files. Edge cases. Needs coordinated approach.

⚠️ New system design:
"Design and implement the notification system — email, SMS, push"
No existing pattern. Multiple architectural options.

⚠️ Cross-cutting breaking change:
"Rename user_id to account_id everywhere in the codebase"
Many files. Risk of missed references.
```

## What a Good Plan Contains

```markdown
# Implementation Plan: Axios → Fetch Migration

## Scope
- 23 files in src/api/ and src/hooks/
- 8 test files requiring updates

## Approach Decision
Three options were considered:
A. Direct Fetch API replacement — simplest, loses interceptor pattern
B. Fetch wrapper matching Axios interface — preserves call sites, adds abstraction
C. Third-party library (ky, wretch) — adds dependency, not worth it

RECOMMENDATION: Option B — interceptors used in 18 places for auth token injection

## Execution Sequence
1. Create src/lib/http-client.ts (Fetch wrapper with auth interceptors)
2. Write tests for http-client
3. Migrate shared utilities (2 files)
4. Migrate API hooks (8 files)
5. Migrate direct calls (13 files)
6. Remove Axios from package.json, verify no remaining imports

## Risk: Streaming responses
Axios and Fetch handle streams differently. Two endpoints stream responses —
must be verified separately after migration.

## Estimated Impact
Zero behavior change for users. All 31 tests should pass post-migration.
```

This plan is reviewed, approved, then executed.

## Key Takeaways

1. **Plan mode** for: 45+ files, multiple valid approaches, architectural decisions
2. **Direct execution** for: clear scope, single file, established pattern
3. **Plan reviewed before ANY code changes** — human approval is the point
4. **Don't use plan mode for everything** — tool for complexity, not a default
5. **The exam tests the decision** — know which scenario triggers which mode
