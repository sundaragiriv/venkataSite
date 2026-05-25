---
id: "d1-t2-2-context-isolation"
title: "Subagent Context Isolation — What Each Agent Knows and Doesn't Know"
domain: "d1"
taskRef: "T1.2"
order: 5
xp: 35
tag: "Core"
duration: "8 min"
analogy: "Briefing a contractor on their first day. You can't say 'you know what the previous contractor did last week, just continue from there.' You write everything they need in their brief. Your contractor brief is your subagent prompt — it must be self-contained."
examTrap: "Assuming subagents share memory or state through any mechanism other than explicit passing. They don't. Not via the coordinator's system prompt, not via global variables, not via databases unless YOU implement that pattern explicitly."
keyPoints:
  - "Every subagent starts with a completely blank context — no coordinator history, no other subagent results, no shared state of any kind."
  - "Everything a subagent needs must be in its prompt — the user query, relevant prior findings, specific instructions, and any constraints."
  - "Subagent prompts should specify goals and quality criteria, not step-by-step procedures — this preserves the subagent's ability to adapt."
  - "Structured output from subagents makes coordinator aggregation reliable — unstructured text is hard to parse and combine."
  - "The coordinator's system prompt is NOT visible to subagents — common mistake is putting shared instructions there and expecting subagents to follow them."
antiPatterns:
  - "Passing 'see the coordinator's context for background' in a subagent prompt — subagents have no coordinator context"
  - "Relying on subagents to infer task details from minimal prompts"
  - "Writing step-by-step procedural instructions instead of goal + quality criteria"
  - "Asking subagents for unstructured text when you need to aggregate their results"
  - "Putting shared constraints in the coordinator system prompt assuming subagents will follow them"
tbChallenge: "Your multi-agent research system has three subagents: web search, document analysis, and synthesis. The synthesis subagent needs the results from both others. Walk me through exactly how the coordinator passes that information, and what the synthesis subagent's prompt looks like."
---

## The Blank Slate Reality

Every time you spawn a subagent, Claude starts fresh. There is no shared memory between agents. There is no automatic context inheritance. The subagent knows exactly what you put in its prompt — nothing more.

This is not a limitation to work around. It's a design feature. Isolated contexts mean:
- Each subagent's reasoning is clean and uninfluenced by irrelevant history
- You have explicit control over what each agent knows
- Failures in one subagent don't contaminate others
- The system is easier to reason about and debug

The challenge is writing good subagent prompts that contain exactly what each agent needs.

## What to Include in a Subagent Prompt

A well-written subagent prompt contains five elements:

### 1. The Goal
What this subagent is trying to accomplish. Not how — what.

```
Your goal is to identify the top 5 technical risks in the provided codebase
analysis and rank them by potential production impact.
```

### 2. The Context
Everything from the broader workflow that this subagent needs to know.

```
This analysis is for a financial services company migrating from a monolithic
Ruby application to microservices. The codebase handles payment processing.
Regulatory compliance (PCI-DSS) is a hard requirement.

Prior findings from the architecture review:
- 3 services identified as high coupling
- Database layer has 47 direct SQL queries that bypass the ORM
- Authentication is implemented inconsistently across modules
```

### 3. The Input
The actual data or content the subagent should work with.

```
Here is the codebase analysis report:
[full report content]
```

### 4. Quality Criteria
What makes a good output from this subagent. This is what the exam tests.

```
For each risk, provide:
- Risk name and description (1-2 sentences)
- Affected components (specific class/module names)
- Potential production impact (quantified where possible)
- Recommended mitigation approach
- Priority: Critical / High / Medium

Focus ONLY on risks with potential production impact.
Skip style issues, naming conventions, and technical debt that doesn't affect reliability.
```

### 5. Output Format
Specify the format so the coordinator can reliably parse and aggregate.

```
Return your findings as a JSON array with this structure:
[
  {
    "rank": 1,
    "name": "...",
    "description": "...",
    "affected_components": ["...", "..."],
    "production_impact": "...",
    "mitigation": "...",
    "priority": "Critical"
  }
]
```

## The Coordinator's Role in Passing Context

The coordinator accumulates findings as subagents complete. When spawning subsequent subagents that depend on prior results, it passes those results explicitly:

```python
# Coordinator has accumulated results from Phase 1 subagents
search_results = task_results["search_agent"]
analysis_results = task_results["analysis_agent"]

# Phase 2: Synthesis subagent gets all prior results
synthesis_prompt = f"""
You are synthesizing research findings into a comprehensive report.

RESEARCH QUESTION:
{original_user_query}

WEB SEARCH FINDINGS:
{search_results}

DOCUMENT ANALYSIS FINDINGS:
{analysis_results}

Your task:
Synthesize these findings into a coherent 3-section report:
1. Key conclusions (supported by multiple sources)
2. Contested findings (sources disagree — note the disagreement)
3. Gaps (what we couldn't find that would strengthen the analysis)

For every claim, cite its source explicitly.
Return structured JSON with sections as top-level keys.
"""

synthesis_result = spawn_subagent(synthesis_prompt, tools=["summarize"])
```

## Specifying Goals vs. Procedures — Why It Matters

### Procedural prompt (inflexible):
```
Step 1: Search for articles about AI adoption.
Step 2: Extract statistics from each article.
Step 3: Compile statistics into a table.
Step 4: Identify the three highest statistics.
Step 5: Write a paragraph summarizing findings.
```

If step 2 finds no statistics because the articles are commentary rather than data, the subagent is stuck following a procedure that doesn't apply.

### Goal-oriented prompt (adaptive):
```
Your goal is to understand the current landscape of enterprise AI adoption.
Investigate whatever sources and approaches will give you the most accurate
and comprehensive picture. I need:
- Adoption rate data (with sources and dates)
- Industry-specific patterns if they exist
- Geographic variations if significant
- Your assessment of source reliability

Quality criteria: Prioritize recent sources (2024+). Note any conflicting data.
Don't fabricate statistics — if you can't find a metric, say so explicitly.
```

The goal-oriented prompt lets the subagent adapt its approach based on what it actually finds.

## Structured Output — Making Aggregation Reliable

When a coordinator aggregates results from multiple subagents, unstructured text is a problem. If three subagents each return 500 words of prose, combining them requires another parsing step that introduces errors.

The fix: require structured output from subagents.

```python
# Subagent prompt specifies JSON output
subagent_prompt = """
...task description...

Return your findings as JSON matching this exact schema:
{
  "summary": "2-3 sentence executive summary",
  "key_findings": [
    {
      "finding": "...",
      "confidence": "high|medium|low",
      "source": "...",
      "supporting_evidence": "..."
    }
  ],
  "data_gaps": ["...", "..."],
  "recommended_follow_up": "..."
}
"""

# Coordinator can reliably parse and combine
result = json.loads(subagent_response)
all_findings.extend(result["key_findings"])
all_gaps.extend(result["data_gaps"])
```

This also makes quality assessment easier — a malformed JSON response tells you the subagent failed, without having to parse prose to figure out what happened.

## The Coordinator System Prompt Is Not Shared

This catches many engineers by surprise.

If your coordinator has a system prompt like:
```
You are a financial research coordinator. All analysis must comply with SEC regulations.
Never recommend specific securities.
```

Subagents you spawn do NOT have this system prompt. If you need subagents to follow those constraints, you must include them in each subagent's prompt explicitly.

```python
# Include compliance requirements in every subagent prompt
COMPLIANCE_REQUIREMENTS = """
IMPORTANT CONSTRAINTS — All findings must comply with these requirements:
- Do not recommend specific securities
- Do not provide investment advice
- All statistics must cite their source
- Flag any regulatory ambiguities for human review
"""

subagent_prompt = f"""
{COMPLIANCE_REQUIREMENTS}

Your specific task:
{specific_task_description}

Context:
{relevant_context}
"""
```

## Key Takeaways

1. **Every subagent starts blank** — no shared context of any kind
2. **Good subagent prompts have 5 elements** — goal, context, input, quality criteria, output format
3. **Specify goals, not procedures** — lets subagents adapt when reality differs from your plan
4. **Require structured output** — makes coordinator aggregation reliable
5. **Coordinator system prompt is invisible to subagents** — include constraints explicitly in each subagent prompt
6. **Context isolation is a feature** — clean reasoning, explicit control, predictable behavior
