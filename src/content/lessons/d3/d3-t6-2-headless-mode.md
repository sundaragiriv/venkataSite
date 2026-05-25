---
id: "d3-t6-2-headless-mode"
title: "Headless Claude Code — Tool Restriction and Configuration"
domain: "d3"
taskRef: "T3.6"
order: 17
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A remote-controlled drone vs a piloted plane. The drone follows programmed constraints exactly — you can't course-correct in real time. Precise upfront configuration is critical: restrict what it can do to what it should do."
examTrap: "Giving headless Claude Code all tools for flexibility. In non-interactive mode, you cannot intervene if Claude calls file_delete when it shouldn't. Restrict to minimum necessary."
keyPoints:
  - "--allowedTools: explicit whitelist of permitted tools for this invocation only."
  - "--disallowedTools: explicit blacklist — useful when you want most tools except specific dangerous ones."
  - "Timeouts are critical for all headless runs — unconstrained runs block pipelines."
  - "Idempotent operations: headless jobs should be safe to re-run without double processing."
  - "--env for configuration — pass settings without hardcoding credentials in commands."
antiPatterns:
  - "All tools allowed in headless mode — write/delete can cause damage without intervention"
  - "No timeout set — jobs can run for hours blocking pipelines"
  - "Non-idempotent headless jobs — re-runs cause data corruption"
  - "Hardcoded API keys or config in commands — use environment variables"
tbChallenge: "Design a headless Claude Code job for nightly documentation generation. What tools are needed, which should be blocked, what's the timeout, and how do you make it idempotent?"
---

## Tool Selection by Task Type

```bash
# Read-only review — no write tools
claude -p \
  --allowedTools "file_read,grep,glob" \
  --timeout 120 \
  "Analyze code quality..."

# Documentation generation — write but not delete or bash
claude -p \
  --allowedTools "file_read,file_write,glob" \
  --disallowedTools "bash,file_delete" \
  --timeout 180 \
  "Generate API documentation..."

# Test runner — needs bash for test execution, not file write
claude -p \
  --allowedTools "file_read,bash,grep" \
  --timeout 300 \
  "Run tests and report coverage gaps..."

# Environment-specific configuration
claude -p \
  --allowedTools "file_read,bash" \
  --env "DATABASE_URL=postgresql://localhost/test_db" \
  --env "ENVIRONMENT=ci" \
  --timeout 240 \
  "Run integration tests..."
```

## Idempotency — Check Before Doing

```bash
# Non-idempotent: running twice creates duplicate entries
claude -p "Add changelog entry for version $VERSION to CHANGELOG.md"

# Idempotent: safe to re-run
claude -p \
  --allowedTools "file_read,file_write" \
  "Check CHANGELOG.md for a version $VERSION entry.
  If found: return {action: 'skip', reason: 'already exists'}
  If not found: add the entry and return {action: 'added'}"
```

## Tool Access Reference

| Task | Allowed | Blocked |
|---|---|---|
| Code review | file_read, grep, glob | file_write, bash, file_delete |
| Doc generation | file_read, file_write | bash, file_delete |
| Test analysis | file_read, bash | file_write, file_delete |
| Security scan | file_read, grep, glob | file_write, file_delete |

## Timeout Handling

```bash
# Bash timeout with exit code handling
timeout 300 claude -p "..." > output.txt
EXIT=$?
if [ $EXIT -eq 124 ]; then
  echo "Timed out after 300 seconds"; exit 1
elif [ $EXIT -ne 0 ]; then
  echo "Claude Code failed: exit $EXIT"; exit 1
fi
```

## Key Takeaways

1. **Minimum tools** — cannot intervene in non-interactive mode
2. **Always set timeout** — prevent indefinite pipeline hangs
3. **Idempotent design** — check before doing, safe to re-run
4. **--env for config** — not hardcoded in commands
5. **--disallowedTools** when you want most tools except specific dangerous ones
