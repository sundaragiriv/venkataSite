---
id: "d3-t3-2-glob-patterns"
title: "Glob Pattern Mastery — Precise File Targeting"
domain: "d3"
taskRef: "T3.3"
order: 8
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Regular expressions for file paths. Just as regex lets you match strings with precision, glob patterns let you target files with precision — not just by name, but by location, extension, depth, and exclusion."
examTrap: "The difference between * and ** in globs. A single * matches within one directory level. Double ** matches across any number of directory levels. 'src/*.ts' matches only TypeScript files directly in src/. 'src/**/*.ts' matches TypeScript files in src/ and all subdirectories."
keyPoints:
  - "* matches any characters within a single directory level — does not cross directory boundaries."
  - "** matches across any number of directory levels — the 'recursive' wildcard."
  - "? matches exactly one character."
  - "! at the start of a pattern means exclusion — matches everything EXCEPT this pattern."
  - "Patterns are evaluated relative to the project root — use ./ prefix if needed for clarity."
antiPatterns:
  - "Using * when ** is needed — fails to match files in subdirectories"
  - "Forgetting ! for exclusions — rules load for files they shouldn't"
  - "Patterns that are too broad — **/*.ts matches EVERY TypeScript file in the project"
  - "Not testing patterns with actual file paths before deploying rules"
tbChallenge: "Write glob patterns for: (1) All TypeScript files in src/ and its subdirectories but NOT test files, (2) All SQL files anywhere in the project, (3) All files directly in the root directory (not subdirectories), (4) All files named index.ts anywhere."
---

## Glob Pattern Reference

```
*           Matches any characters within ONE directory level
**          Matches across any number of directory levels
?           Matches exactly ONE character
[abc]       Matches one character from the set (a, b, or c)
{a,b}       Matches either pattern a or pattern b
!pattern    Exclusion — matches everything except this
```

## Pattern Examples

```bash
# All TypeScript files in src/ only (not subdirectories)
"src/*.ts"

# All TypeScript files in src/ AND all subdirectories
"src/**/*.ts"

# All TypeScript files anywhere in project
"**/*.ts"

# All TypeScript files except test files
"src/**/*.ts"
"!src/**/*.test.ts"
"!src/**/*.spec.ts"

# All files directly in root (no subdirectories)
"./*.json"

# All index.ts files anywhere
"**/index.ts"

# Files with multiple extensions
"**/*.{ts,tsx,js,jsx}"

# Specific directory names at any level
"**/components/**/*.tsx"

# Files in __tests__ directories
"**/__tests__/**"
```

## The Common Mistakes

```bash
# ❌ Wrong: only matches src/auth.ts — not src/api/auth.ts
"src/*.ts"

# ✅ Right: matches TypeScript files at any depth in src/
"src/**/*.ts"

# ❌ Wrong: matches ALL TypeScript files — probably too broad
"**/*.ts"

# ✅ Right: matches only source TypeScript, excluding tests and config
"src/**/*.ts"
"!src/**/*.test.ts"
"!src/**/*.spec.ts"
"!**/*.config.ts"
```

## Answers to the Teach-Back Challenge

```bash
# 1. TypeScript files in src/ and subdirectories, NOT test files
"src/**/*.ts"
"src/**/*.tsx"
"!src/**/*.test.ts"
"!src/**/*.test.tsx"
"!src/**/*.spec.ts"

# 2. All SQL files anywhere
"**/*.sql"

# 3. All files directly in root (not subdirectories)
"./*"
# Or more specific:
"./*.json"
"./*.ts"

# 4. All index.ts files anywhere
"**/index.ts"
```

## Key Takeaways

1. `*` = one directory level, `**` = across all levels
2. `!` prefix for exclusion — essential for precise targeting
3. `{a,b}` for multiple extensions in one pattern
4. Test patterns with `find` command before committing
5. More specific patterns are almost always better than broad ones
