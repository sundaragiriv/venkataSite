---
id: "d3-t5-3-interview-pattern"
title: "The Interview Pattern — Surface Ambiguity Before Implementation"
domain: "d3"
taskRef: "T3.5"
order: 15
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A contractor's pre-build consultation. Good contractors ask about soil conditions, underground utilities, local codes — things that if unanswered require tearing down walls later. The interview pattern does this for code."
examTrap: "Answering Claude's questions one at a time in back-and-forth dialogue. The correct pattern: Claude surfaces ALL questions at once, you answer ALL at once, then implementation proceeds without interruption."
keyPoints:
  - "Interview pattern: Claude lists all questions, you resolve them all at once, then implementation begins."
  - "All questions at once, all answers at once — minimizes interruptions to implementation flow."
  - "Surfaces questions you didn't think of — Claude sees implementation implications you might miss."
  - "Works mid-task too: when Claude hits an ambiguous decision point, surface it rather than guess."
  - "Resolved questions become documentation — capturing design decisions before code is written."
antiPatterns:
  - "One question at a time dialogue — slow, breaks implementation flow"
  - "Claude guessing at ambiguity — always surface and resolve"
  - "Skipping the interview for 'simple' features — complexity reveals itself during implementation"
  - "Not documenting resolved questions — design decisions get lost"
tbChallenge: "You're implementing a bulk user export endpoint. List 10 questions Claude should ask before writing any code. For each, explain why that question matters for implementation."
---

## The Interview Pattern Prompt

```markdown
Before writing any code for: [Bulk user export endpoint GET /api/admin/users/export]

List ALL questions you need answered to implement this correctly.

Consider:
- Data format and structure decisions (multiple valid choices)
- Performance and scale decisions (affects architecture)
- Security and authorization decisions (affects access control)
- Privacy and compliance decisions (affects which data is included)
- Delivery mechanism decisions (sync vs async)
- Error handling edge cases
- Anything that could reasonably be implemented two valid ways

List ALL questions. I'll answer them all at once. Then we implement.
```

## Model Interview Output

```
Questions before implementing bulk user export:

1. FORMAT: CSV, JSON, or support both? If CSV, include column headers?

2. FIELDS: Which user fields to include?
   Including: id, email, name, date_joined, tier?
   Excluding: password_hash, mfa_secret, phone (PII concern)?

3. SCOPE: Filter options? All active users? Date range for date_joined?
   Inactive users included?

4. SCALE: Expected max export size?
   <10k → synchronous response
   >10k → async job with email delivery when ready?

5. AUTH: Admin role required? Specific permission flag?

6. AUDIT: Log who exported what and when? Required for compliance?

7. PRIVACY: GDPR — EU users require consent before data export?

8. RATE LIMIT: Max exports per admin per day/hour?

9. DELIVERY: Sync download or async job with email link?

10. EXISTING PATTERN: Any existing export endpoint to follow?
    (jobs/export_orders.py?)
```

## Documenting Resolved Decisions

```markdown
## Bulk Export Design Decisions — [2024-11-22]

Resolved before implementation:
- Format: CSV with headers
- Fields: id, email, name, date_joined, tier (no phone, no address)
- Scope: Active users only, optional date_joined range filter
- Scale: Async for >10k, sync for ≤10k
- Auth: admin_export permission required
- Audit: Yes — log to audit_events table
- Privacy: Skip EU users without explicit export consent
- Rate limit: 10 exports per admin per day
- Delivery: Async — email with signed download URL (24hr expiry)
- Pattern: Follow jobs/export_orders.py structure
```

These decisions are now explicit before a line of code is written.

## Key Takeaways

1. **All questions at once** — not a dialogue
2. **All answers at once** — then uninterrupted implementation
3. **Mid-task ambiguity** → surface it, don't guess
4. **Document resolved questions** — they're design decisions
5. **Trust Claude's questions** — it sees implications you might miss
