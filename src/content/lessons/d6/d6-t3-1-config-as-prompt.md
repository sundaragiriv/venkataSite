---
id: "d6-t3-1-config-as-prompt"
title: "D3 + D4: CLAUDE.md Is a System Prompt — The Critical Insight"
domain: "d6"
taskRef: "T6.3"
order: 5
xp: 45
tag: "⚡ Exam Tested"
duration: "9 min"
analogy: "An employee handbook and a job description are both forms of instruction — one is company-wide, one is role-specific. CLAUDE.md is the employee handbook. A D4 system prompt is the job description. They work together, they're not substitutes for each other, and good employees follow both simultaneously."
examTrap: "Treating CLAUDE.md as configuration (D3) and system prompts as prompting (D4) as completely separate concerns. The exam tests that you understand CLAUDE.md IS a form of system prompting — and that D4 principles of explicit criteria, few-shot examples, and structured output apply equally to CLAUDE.md authoring."
keyPoints:
  - "CLAUDE.md is processed as a system prompt — D4 prompt engineering principles apply to writing it."
  - "Specific and verifiable rules (D4 explicit criteria) make CLAUDE.md effective. Vague aspirations make it useless."
  - "CLAUDE.md at project-level + D4 system prompt at session-level creates a two-layer instruction hierarchy."
  - "Conflicts between CLAUDE.md and runtime system prompts: runtime generally wins for specific instructions."
  - "D3's path-specific rules are conditional prompt injection — different files trigger different instruction sets."
antiPatterns:
  - "CLAUDE.md written with vague aspirational rules — 'write good code' — instead of D4 explicit criteria"
  - "Duplicating rules between CLAUDE.md and session system prompt — inconsistency when one is updated"
  - "Not applying D4 'include negative examples' to CLAUDE.md — rules without counter-examples are ambiguous"
  - "Treating path-specific rules as 'configuration' not 'conditional prompting'"
tbChallenge: "Rewrite this CLAUDE.md rule using D4 principles: 'Write comprehensive tests.' Show the before (current), the after (D4-enhanced), and explain specifically which D4 principle you applied and why it matters."
---

## CLAUDE.md as a System Prompt Layer

```
Request processing stack:
                                           ┌──────────────────┐
User request                               │   User Message    │
                                           └────────┬─────────┘
                                                    │
                                           ┌────────▼─────────┐
Session system prompt (D4)                 │  Session Prompt   │  ← runtime D4 prompt
"You are a code reviewer..."               └────────┬─────────┘
                                                    │
                                           ┌────────▼─────────┐
Project-level CLAUDE.md (D3)              │  Project CLAUDE.md│  ← processed as system content
"Repository pattern required..."           └────────┬─────────┘
                                                    │
                                           ┌────────▼─────────┐
Directory-level CLAUDE.md (D3)            │  Directory Rules  │  ← path-specific injection
"API layer conventions..."                 └────────┬─────────┘
                                                    │
                                           ┌────────▼─────────┐
User-level CLAUDE.md (D3)                 │   User Prefs      │  ← personal layer
"Prefer verbose output..."                 └────────┬─────────┘
                                                    │
                                                  Claude
```

All four layers are effectively instructions to Claude. D4 principles improve every layer.

## Applying D4 to CLAUDE.md

### Before (vague — D4 violation)
```markdown
# CLAUDE.md rule
- Write comprehensive tests
- Handle errors properly  
- Keep functions small
```

### After (explicit criteria — D4 applied)
```markdown
# CLAUDE.md rule

## Test Requirements (D4: explicit, verifiable criteria)
Every new public function must have:
- At minimum ONE happy path test
- At minimum ONE error path test for each documented exception
- Tests use pytest fixtures from tests/conftest.py (not setUp/tearDown)
- External services mocked — no real API calls in tests

Example of SUFFICIENT test coverage:
  def test_get_customer_success(mock_db):
      result = get_customer("C-123456")
      assert result["name"] == "Test Customer"
  
  def test_get_customer_not_found(mock_db):
      mock_db.returns_none()
      with pytest.raises(CustomerNotFoundError):
          get_customer("C-999999")

Example of INSUFFICIENT test coverage (do not accept PRs with only this):
  def test_get_customer():
      # only tests that function runs, not correct behavior
      result = get_customer("C-123456")
      assert result is not None
```

The D4 improvements:
- **Explicit criteria** (D4 T4.1): "ONE happy path + ONE error path" not "comprehensive"
- **Positive examples** (D4 T2.1): shows what sufficient coverage looks like
- **Negative/rejection examples** (D4 T2.1): shows what INSUFFICIENT looks like
- **Verifiable** (D4 T4.1): a reviewer can check these requirements objectively

## Path-Specific Rules as Conditional Prompt Injection

```yaml
# .claude/rules/api-conventions.yaml
# D3: Only loads when editing src/api/** files
# D4 lens: This is conditional system prompt injection
---
paths:
  - "src/api/**/*.ts"
description: "API layer conventions"
---

# D4 principle: Specific and verifiable criteria
Response validation requirements:
- All responses use ErrorResponse schema: {error: string, code: string}
- Status codes: 400 (input invalid), 401 (auth required), 403 (forbidden), 404 (not found)

# D4 principle: Include rejection examples
WRONG — do not do this:
  return res.status(400).json({message: "Invalid input"})  // not using ErrorResponse schema

CORRECT:
  return res.status(400).json({error: "Invalid input", code: "VALIDATION_ERROR"})
```

## Key Takeaways

1. **CLAUDE.md is system prompting** — D4 principles apply when writing it
2. **Replace vague rules with explicit criteria** — verifiable, not aspirational
3. **Include both examples** (positive and negative) in CLAUDE.md rules
4. **Path-specific rules = conditional prompt injection** — different files, different instructions
5. **Two-layer hierarchy**: project CLAUDE.md for team conventions, session prompt for task specifics
