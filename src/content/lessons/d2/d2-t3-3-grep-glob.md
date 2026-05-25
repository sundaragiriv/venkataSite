---
id: "d2-t3-3-grep-glob"
title: "Grep vs Glob — The Commonly Confused Code Navigation Tools"
domain: "d2"
taskRef: "T2.3"
order: 9
xp: 25
tag: "⚡ Exam Tested"
duration: "6 min"
analogy: "The difference between a metal detector and a map. A metal detector (grep) scans through soil looking for signals inside it — it searches CONTENT. A map (glob) shows you where paths lead based on their structure — it matches FILE PATHS by pattern."
examTrap: "Using grep when you need glob or vice versa. The exam tests this with specific scenarios — 'find all files named *.test.tsx' needs glob, 'find all files containing the function callRefund' needs grep."
keyPoints:
  - "Grep searches FILE CONTENTS for a pattern — it opens files and looks inside them. Use when you know what the code says but not where it lives."
  - "Glob matches FILE PATHS by pattern — it looks at file names and directory structure without opening files. Use when you know where code lives by its naming convention."
  - "Grep use cases: find all callers of a function, find all files that import a module, find error messages, find TODO comments."
  - "Glob use cases: find all test files (*.test.tsx), find all files in a directory (src/**/*.ts), find all config files."
  - "Combining them is powerful: glob to find candidate files, grep to filter by content."
antiPatterns:
  - "Using grep to find all test files — grep opens every file looking for content, glob finds them by name pattern"
  - "Using glob to find all callers of a function — glob doesn't look inside files"
  - "Not knowing which to use results in the wrong tool call on the exam"
tbChallenge: "For each scenario, tell me grep, glob, or both: (1) Find all TypeScript files that use the 'useAuth' hook. (2) Find all configuration files in the project. (3) Find all places where 'processPayment' is called. (4) Find all files in the components directory that are test files."
---

## Grep — Search File Contents

```python
# Grep: opens files and searches INSIDE them for a pattern

# Find all files that call the processPayment function
grep_result = grep(
    pattern="processPayment",
    path="src/",
    recursive=True
)
# Returns: list of {file, line_number, line_content} matches

# Find all files that import from the auth module
grep_result = grep(
    pattern=r"from ['\"]\./auth['\"]|from ['\"]../auth['\"]",
    path="src/",
    recursive=True
)

# Find all TODO comments
grep_result = grep(
    pattern="// TODO",
    path="src/",
    recursive=True
)
```

**Use grep when you know WHAT the code says but not WHERE it lives.**

## Glob — Match File Paths

```python
# Glob: matches file NAMES and PATHS by pattern — doesn't open files

# Find all TypeScript test files
test_files = glob("src/**/*.test.tsx")
test_files = glob("src/**/*.spec.ts")

# Find all configuration files
config_files = glob("**/*.config.{js,ts,json}")

# Find all files in the components directory
component_files = glob("src/components/**/*.tsx")

# Find all files matching a naming convention
api_files = glob("src/api/**/index.ts")
```

**Use glob when you know WHERE code lives by its naming convention.**

## Combining Grep and Glob

```python
# Find all TypeScript test files that test the auth module
# Step 1: Glob — find all test files by name
all_test_files = glob("src/**/*.test.ts")

# Step 2: Grep — filter to only ones that test auth
auth_test_files = []
for file in all_test_files:
    if grep(pattern="import.*auth", path=file):
        auth_test_files.append(file)
```

## The Exam Scenario Table

| Task | Tool |
|---|---|
| Find all callers of `sendEmail()` | Grep |
| Find all `*.test.tsx` files | Glob |
| Find all files that import from `../utils` | Grep |
| Find all `index.ts` files in `src/` | Glob |
| Find where `MAX_RETRIES` constant is defined | Grep |
| Find all JSON config files | Glob |
| Find all TODO comments | Grep |
| Find all files in the `components/` directory | Glob |

## Key Takeaways

1. **Grep = searches inside files** — finds patterns in content
2. **Glob = matches file paths** — finds files by name/location pattern
3. **Use grep** when you know what the code says
4. **Use glob** when you know where the code lives by naming convention
5. **Combine them** for maximum precision — glob to find candidate files, grep to filter by content
