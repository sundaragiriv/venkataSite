---
id: "d3-t1-3-rules-system"
title: "Path-Specific Rules — Conditional Convention Loading"
domain: "d3"
taskRef: "T3.1"
order: 3
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "A context-aware employee handbook. Instead of reading 400 pages every day, the system shows you only the sections relevant to what you're currently working on. Working on an API endpoint? The API conventions section activates. Writing a test? The testing standards section activates."
examTrap: "Using directory-level CLAUDE.md when path-specific rules with glob patterns are the better choice. Directory CLAUDE.md always loads for everything in that directory. Path-specific rules load only when editing files matching the glob pattern — more precise and lower noise."
keyPoints:
  - "Path-specific rules live in .claude/rules/ directory as individual YAML files with glob pattern frontmatter."
  - "Rules load ONLY when Claude is editing files matching the glob pattern — targeted, not always-on."
  - "This is better than directory CLAUDE.md when the convention applies to specific file types across multiple directories."
  - "Example: test conventions apply to *.test.tsx files anywhere in the project — a path-specific rule beats a CLAUDE.md in every directory."
  - "YAML frontmatter specifies: which paths this rule applies to, when it loads, and the rule content."
antiPatterns:
  - "Using directory CLAUDE.md for conventions that should only apply to specific file types"
  - "Creating rules so broad they load for almost everything (no benefit over project-level CLAUDE.md)"
  - "Creating rules so narrow they almost never load (wasted configuration)"
  - "Not using path-specific rules at all — missing the most powerful targeting mechanism"
tbChallenge: "You have test conventions that apply to all *.test.ts and *.spec.ts files across the entire project. You have API conventions that apply to all files in src/api/ but NOT test files. Design both using the correct mechanism for each."
---

## Path-Specific Rules in .claude/rules/

```
.claude/
├── CLAUDE.md              # Project-wide conventions
├── settings.json          # Tool permissions
└── rules/
    ├── test-conventions.yaml      # Applies to *.test.* files
    ├── api-conventions.yaml       # Applies to src/api/**
    ├── migration-rules.yaml       # Applies to migrations/**
    └── react-components.yaml     # Applies to src/components/**/*.tsx
```

## Writing a Rule File

```yaml
# .claude/rules/test-conventions.yaml
---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
description: "Testing conventions for all test files"
---

# Testing Conventions (loads only when editing test files)

## Test Structure
- Use `describe` blocks to group related tests
- Each `it` or `test` block tests ONE behavior, not multiple
- Test description must complete this sentence: "it should..."

## Mocking
- Mock external services and databases — never call real ones in tests
- Use `vi.mock()` for module mocks (Vitest) or `jest.mock()` (Jest)
- Reset all mocks in `afterEach` or `beforeEach`

## Assertions
- Prefer `expect(result).toEqual(expected)` over `expect(result).toBe(expected)` for objects
- Always assert on the specific property you care about, not the entire object
- Use `toThrow` matchers for error cases, not try/catch

## Fixtures
- Define fixtures in `__fixtures__` directories, not inline in tests
- Fixture data should be realistic but anonymized
```

```yaml
# .claude/rules/api-conventions.yaml
---
paths:
  - "src/api/**/*.ts"
  - "src/api/**/*.tsx"
  - "!src/api/**/*.test.ts"    # Exclude test files — those use test-conventions
description: "API layer conventions"
---

# API Layer Rules (loads only for src/api/ non-test files)

## Request Handling
- Validate all inputs with Zod schemas before processing
- Extract and validate path params, query params, body separately
- Never pass raw request objects to service layer

## Error Responses
Always use the ErrorResponse schema:
{error: string, code: string, details?: object}

HTTP status mapping:
- 400: validation failure
- 401: unauthenticated  
- 403: unauthorized
- 404: resource not found
- 422: business rule violation
- 500: unexpected error (log details, don't expose them)

## Dependencies
- Inject all services via constructor — never instantiate in handlers
- Use typed interfaces for all injected dependencies
```

## Path Glob Patterns

| Pattern | Matches |
|---|---|
| `**/*.test.ts` | All .test.ts files anywhere |
| `src/api/**` | All files inside src/api/ |
| `!src/api/**/*.test.ts` | Exclusion — all except test files |
| `migrations/*.sql` | SQL files directly in migrations/ |
| `src/components/**/*.tsx` | .tsx files anywhere in components/ |

## Directory CLAUDE.md vs Path-Specific Rules

| Situation | Best Approach |
|---|---|
| Convention applies to all files in a specific directory | Directory CLAUDE.md |
| Convention applies to specific file types across many directories | Path-specific rules |
| Convention should NOT apply to test files in that directory | Path-specific rules with exclusion |
| Mixed: different rules for different file types in same directory | Path-specific rules for each type |

## Key Takeaways

1. **Path-specific rules** live in `.claude/rules/` with YAML frontmatter
2. **Glob patterns** control exactly which files trigger the rule
3. **Exclusion patterns** (`!pattern`) prevent rules from loading for specific files
4. **More precise than directory CLAUDE.md** for cross-directory file-type conventions
5. **Lower noise** — Claude only sees relevant conventions for what it's editing
