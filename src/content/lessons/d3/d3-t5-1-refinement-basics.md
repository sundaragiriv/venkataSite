---
id: "d3-t5-1-refinement-basics"
title: "Iterative Refinement — Getting to the Right Output"
domain: "d3"
taskRef: "T3.5"
order: 13
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A sculptor and client relationship. Not one shot — rough shape first, feedback, refine, feedback, polish. Each iteration is faster because direction is clearer. The best Claude Code workflows plan for this."
examTrap: "Expecting perfect output on the first attempt for complex tasks, then treating the need for iteration as a failure. Iteration is a planned workflow, not a sign that something went wrong."
keyPoints:
  - "Plan for 2-3 iterations for complex outputs — budget this into your workflow."
  - "Concrete input/output examples in the initial prompt dramatically reduce iterations needed."
  - "Review structure first, content second, style last — don't give style feedback on draft 1."
  - "Specific feedback beats vague — include the exact correction you want."
  - "If the same feedback doesn't land, the instruction needs to change — not just be repeated."
antiPatterns:
  - "Vague feedback: 'make it better', 'that's not right' — Claude needs to know what better means"
  - "Style feedback on draft 1 — fix structure before worrying about formatting"
  - "Repeating the same feedback twice — change the instruction if it's not working"
  - "No examples in initial prompt — Claude has to infer your standard from nothing"
tbChallenge: "Claude generated API documentation that is technically accurate but uses a completely different format from your team standard. Write specific feedback that gets you from current output to your format in exactly one more iteration."
---

## Iteration Planning

```
Draft 1 → Feedback on STRUCTURE
  Is the overall shape right? Are all sections present? Is the order correct?
  Don't comment on style, wording, or details yet.

Draft 2 → Feedback on CONTENT  
  Are the details accurate? Are edge cases covered? Are examples correct?
  Don't comment on formatting yet.

Draft 3 → Feedback on STYLE
  Does it match the team standard? Is formatting consistent?
  This is the polish pass.
```

## Concrete Examples Reduce Iterations

```markdown
# Without examples — typically 3+ iterations
Generate API documentation for the refund endpoint.

# With examples — typically 1 iteration
Generate documentation for POST /api/v2/refunds following this EXACT format:

---
## POST /api/v2/refunds

**Description**: One sentence, active voice, describes what this endpoint does.

**Authentication**: Bearer token required | None

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| order_id | string | ✓ | Format: ORD-XXXXXXXX |

**Response 200**:
\```json
{"refund_id": "REF-123456", "status": "processing", "estimated_date": "2024-12-01"}
\```

**Error Codes**: 400 (invalid input), 404 (order not found), 422 (ineligible)
---

Now document all endpoints in src/api/v2/refunds.py using this format.
```

## Specific Feedback

```
# ❌ Vague
"The error handling documentation isn't right"

# ✅ Specific — tells Claude exactly what to fix
"Error response documentation is missing two required fields:
1. 'code' — machine-readable error identifier (e.g., VALIDATION_ERROR, REFUND_INELIGIBLE)
2. 'field' — which request field caused the error (if applicable)

Current format: {error: string, message: string}
Required format: {error: string, code: string, message: string, field: string|null}

Update all error response examples to include these two additional fields."
```

## Key Takeaways

1. **Plan 2-3 iterations** — not a failure, a workflow
2. **Concrete examples** reduce iterations dramatically
3. **Structure → Content → Style** — in that order
4. **Specific feedback** with exact corrections needed
5. **Change the instruction** if feedback isn't working — not just repeat it
