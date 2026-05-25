---
id: "d3-t3-1-path-rules"
title: "Path Rules in Practice — Real-World Rule Design"
domain: "d3"
taskRef: "T3.3"
order: 7
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Smart building access control. Different rooms have different access rules — the server room has stricter requirements than the cafeteria. Path-specific rules apply different Claude Code guidelines to different parts of your codebase automatically."
examTrap: "Writing rules so broad they're equivalent to project-level CLAUDE.md, or so narrow they almost never activate. The power of path-specific rules is precision — the right guidance, at the right time, for the right files."
keyPoints:
  - "Rules should be as specific as possible — the more targeted, the more useful."
  - "Multiple rules can apply to the same file if its path matches multiple patterns — all active rules are combined."
  - "Rule files should be focused on the specific concerns of that file type — not general project conventions."
  - "Test your glob patterns — a rule with a broken pattern never loads, and you won't know unless you test it."
  - "Rules are additive — they supplement project-level CLAUDE.md, not replace it."
antiPatterns:
  - "Rules that duplicate project-level CLAUDE.md content — adds noise without value"
  - "Rules with patterns that are too broad and load for most files (not selective enough)"
  - "Rules with patterns so specific they load for 2 files in the entire project"
  - "No testing of glob patterns — rules may not load for files you think they apply to"
tbChallenge: "Design three path-specific rules for a Next.js project: one for API routes, one for React components, and one for database migration files. Show the frontmatter for each."
---

## Three Focused Rules for a Next.js Project

```yaml
# .claude/rules/api-routes.yaml
---
paths:
  - "app/api/**/*.ts"
  - "pages/api/**/*.ts"
description: "Next.js API route conventions"
---

# API Route Rules

- All routes must validate request body with Zod before processing
- Use NextResponse.json() for all responses, never Response directly
- Authentication check must be first action in every protected route
- Rate limiting applied via middleware, not in route handler
- Error responses always include: {error: string, code: string}
- Log all errors to structured logger before returning 500 response
```

```yaml
# .claude/rules/react-components.yaml
---
paths:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
  - "!app/api/**"              # Exclude API routes
  - "!**/*.test.tsx"           # Exclude test files
description: "React component conventions"
---

# React Component Rules

## Component Structure
- One component per file
- Named export, not default (except page components)
- Props interface defined directly above component

## State Management
- Local state: useState for UI state
- Server state: React Query for async data
- Global state: Zustand store (see stores/ directory)
- No Redux — we migrated away from it

## Accessibility
- All images have alt text
- Interactive elements are keyboard navigable
- Color is never the only information conveyor
```

```yaml
# .claude/rules/migrations.yaml
---
paths:
  - "migrations/**/*.sql"
  - "migrations/**/*.ts"
  - "db/migrations/**"
description: "Database migration rules"
---

# Migration Rules — CRITICAL

## Never
- Never modify an existing migration file after it has been run in production
- Never use raw string concatenation in SQL
- Never drop columns without a separate migration with a grace period

## Always
- New migrations must be additive or have a rollback plan
- Include both UP and DOWN operations
- Test migration on a copy of production data before merging
- Get review from a senior engineer before merging any migration

## Naming Convention
YYYY_MM_DD_HHMM_description_of_change.sql
Example: 2024_11_22_1430_add_refund_amount_to_orders.sql
```

## Testing Glob Patterns

Before deploying rules, verify patterns work:

```bash
# Test which files match your pattern
find . -path "./app/api/**/*.ts" | head -20
find . -name "*.test.tsx" | head -20

# Verify exclusion works
find . -path "./components/**/*.tsx" ! -path "./**/*.test.tsx" | head -20
```

## Key Takeaways

1. **Rules are focused** — specific to the concerns of that file type
2. **Rules are additive** — they add to, not replace, project-level CLAUDE.md
3. **Multiple rules can apply to one file** — all matching patterns load
4. **Test glob patterns** before committing — broken patterns load silently
5. **Exclusion patterns** prevent overlap between rule types
