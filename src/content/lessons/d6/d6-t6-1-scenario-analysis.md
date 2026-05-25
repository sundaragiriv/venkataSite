---
id: "d6-t6-1-scenario-analysis"
title: "Full Scenario Walkthroughs — Mapping All 6 Exam Scenarios"
domain: "d6"
taskRef: "T6.6"
order: 11
xp: 50
tag: "⚡ EXAM CRITICAL"
duration: "15 min"
analogy: "A chess player who's memorized the openings. They don't have to calculate from the first move every game — they recognize the opening and know the correct response. Knowing the exam scenarios is knowing the openings — you recognize the pattern and know which domains and principles apply."
examTrap: "Going into the exam without mapping scenarios to domains. The exam randomly selects 4 of 6 scenarios. Each scenario tests specific domain combinations. If you don't know which domains map to which scenarios, you're guessing under time pressure."
keyPoints:
  - "Six scenarios, 4 selected randomly for each exam sitting — you must be ready for all 6."
  - "Each scenario emphasizes specific domain combinations — knowing the map prevents surprise."
  - "Scenario 1 (Agentic Coding): heavy D1 + D3 + some D4."
  - "Scenario 2 (Document Processing): heavy D4 + D5 + D2 tools."
  - "Scenario 3 (Customer Support): heavy D1 + D2 + D5 confidence routing."
  - "Scenario 4 (Research): heavy D1 orchestration + D5 source attribution."
  - "Scenario 5 (Code Review): D3 + D4 multi-instance + D5 quality."
  - "Scenario 6 (Data Extraction): D4 schemas + D5 validation + Batch API."
antiPatterns:
  - "Studying only your strongest domains — you might get 4 scenarios that hit your weak spots"
  - "Not knowing which scenario you're in during the exam — wastes time reorienting"
  - "Treating all scenarios as interchangeable — each has specific traps"
  - "Not reading the scenario setup carefully — the context determines which principles apply"
tbChallenge: "Describe the domain composition of each scenario, the most likely exam trap in each, and the one concept you absolutely must know cold for each one."
---

## The Six Scenario Maps

### Scenario 1: Agentic Coding Assistant

**Context:** Claude Code agent helping developers write, test, and review code.

**Domain emphasis:**
- D1 (heavy): Agent loop, plan mode decision, task decomposition
- D3 (heavy): CLAUDE.md hierarchy, slash commands, CI/CD integration
- D4 (moderate): Few-shot for code style, structured output for code review

**Most likely trap:** 
Using prompts for code quality enforcement when hooks/CI are the answer. "Always format with prettier" → CI rule, not prompt.

**Must know cold:**
- When plan mode triggers (45+ files, multiple approaches)
- The -p flag requirement for CI/CD usage
- How CLAUDE.md hierarchy works (project vs user vs directory)

---

### Scenario 2: Document Processing Pipeline

**Context:** Extracting structured data from invoices, contracts, or other documents.

**Domain emphasis:**
- D4 (heavy): JSON schemas, tool_choice, few-shot for format, retry patterns
- D5 (heavy): Validation layers, confidence scoring, batch API, human review routing
- D2 (moderate): Tool descriptions for extraction schemas, error categories

**Most likely trap:**
Using tool_choice: 'auto' when document type is unknown (should be 'any'), or using Batch API for real-time pipelines.

**Must know cold:**
- auto vs any vs forced tool_choice and when each applies
- Schema eliminates syntax errors but not semantic errors
- Batch API = up to 24 hours, never for latency-sensitive work

---

### Scenario 3: Customer Support Agent

**Context:** Multi-turn customer service agent with refund processing, identity verification, escalation.

**Domain emphasis:**
- D1 (heavy): Loop control, hook enforcement for compliance, human-in-the-loop
- D2 (heavy): Tool scoping, error categories, scoped access by agent role
- D5 (moderate): Confidence routing for unusual cases, structured error propagation

**Most likely trap:**
Prompt-based identity verification instead of PreToolUse hooks. "Always verify identity before refunds" in prompt = probabilistic. Hook = deterministic.

**Must know cold:**
- Programmatic enforcement vs prompt guidance (the #1 most-tested concept)
- isRetryable in error responses
- Human-in-the-loop triggers: scope exceeded, irreversible high-blast, ambiguous

---

### Scenario 4: Research and Synthesis

**Context:** Multi-agent research coordinator with parallel web search, synthesis, source attribution.

**Domain emphasis:**
- D1 (heavy): Coordinator-subagent, parallel execution, hub-and-spoke
- D5 (heavy): Source attribution, conflict detection, partial failure, confidence in synthesis

**Most likely trap:**
Coordinator trap — decomposing a broad topic into subtasks that miss entire categories. The agent's subtasks succeed but the synthesis is incomplete.

**Must know cold:**
- Coordinator trap and the scope verification step
- Structured error propagation from failed subagents to coordinator
- Conflict detection: present both conflicting values, not one

---

### Scenario 5: Automated Code Review

**Context:** Claude Code in CI/CD reviewing pull requests for security, coverage, architecture.

**Domain emphasis:**
- D3 (heavy): CI/CD integration, headless mode, -p flag, review pipelines
- D4 (heavy): Multi-instance review, per-file vs all-at-once, confidence
- D5 (moderate): Confidence thresholds for blocking vs warning

**Most likely trap:**
Self-review (same session) vs independent review (separate call). Reviewer must not have generation context.

**Must know cold:**
- The -p flag is REQUIRED for CI/CD (without it, pipeline hangs)
- Independent review = separate API call, no generation history
- Specialized review stages > generalist review

---

### Scenario 6: Large-Scale Data Extraction

**Context:** Processing thousands of documents — invoices, forms, records — for downstream processing.

**Domain emphasis:**
- D4 (heavy): Schemas, few-shot, retry patterns, validation
- D5 (heavy): Batch API, context efficiency, stratified sampling
- D2 (moderate): Tool schemas for extraction, error handling

**Most likely trap:**
Using Batch API for blocking pipelines, or missing the two-layer validation (schema catches syntax, semantic validation catches wrong-but-valid).

**Must know cold:**
- Batch API: 50% cost, up to 24h, no SLA — never for user-blocking
- Two validation layers: schema = syntax, semantic = business rules
- Stratified sampling (not random) for quality validation

## Key Takeaways

1. **Know all 6 scenarios** — 4 are selected randomly, you can't predict which
2. **Scenario 3** (Customer Support) + **Scenario 1** (Coding) most heavily test D1
3. **Scenario 2** (Documents) + **Scenario 6** (Extraction) most heavily test D4
4. **Scenario 4** (Research) most heavily tests D5 source attribution
5. **Scenario 5** (Code Review) is where D3 CI/CD and D4 multi-instance intersect
