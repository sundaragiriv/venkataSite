---
id: "d1-t7-2-coordinator-trap"
title: "The Coordinator Trap — Avoiding Scope Narrowing in Task Decomposition"
domain: "d1"
taskRef: "T1.7"
order: 17
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "A project manager who is asked to 'improve customer satisfaction' and only assigns work on the website UX — ignoring customer service, product quality, and pricing, which are all part of customer satisfaction. The work done is high quality. The scope was wrong."
examTrap: "The exam presents a coordinator that has completed its assigned subtasks successfully, but the final output is incomplete because the decomposition was too narrow. The question asks for the root cause — it's always the coordinator's decomposition, not the subagents' execution."
keyPoints:
  - "The coordinator trap: a coordinator decomposes a broad task into subtasks that are internally consistent but collectively miss significant portions of the required scope."
  - "Subagents executing coordinator trap subtasks will succeed — they do exactly what they're asked. The failure is in what they were asked."
  - "Root cause identification: when the exam shows subagents that worked correctly but output is incomplete, look at the coordinator's decomposition first."
  - "Prevention: the coordinator should explicitly enumerate the full scope before creating subtasks, then verify all scope is covered."
  - "Scope enumeration is a separate step from decomposition — enumerate first, decompose second."
antiPatterns:
  - "Coordinator creates subtasks without first explicitly verifying the full scope"
  - "Assuming the first coherent decomposition covers everything"
  - "Blaming subagents for incomplete output when they executed their assignments correctly"
  - "Not reviewing the decomposition plan against the original task scope before spawning"
tbChallenge: "I ran a research system on 'AI impact on creative industries' and got a thorough report covering digital art, graphic design, and photography. My boss says it missed music, writing, and film. Where did the failure happen and how do I prevent it next time?"
---

## Why Coordinators Fall Into the Trap

Coordinators are doing two things when decomposing a task:
1. Understanding the full scope of what needs to be done
2. Breaking that scope into workable subtasks

The trap happens when step 1 is incomplete — the coordinator forms a coherent picture of ONE part of the scope and decomposes that, missing other parts entirely.

This is especially common with:
- **Broad categories**: "creative industries," "enterprise software," "financial services"
- **Ambiguous scope**: "analyze our product" — which products? which aspects?
- **Familiar domains**: coordinators tend toward subtopics they've seen more examples of

## Diagnosing the Trap in Exam Questions

The exam presents the trap as a symptoms-and-cause question. The symptoms are always:
- Subagents completed successfully
- Output quality within each subagent's scope is high
- But the aggregate output is missing entire categories

When you see this pattern, the root cause is always the coordinator's decomposition — not:
- Subagent tool selection (subagents used correct tools for their scope)
- Subagent prompts (subagents followed their instructions correctly)
- Synthesis logic (synthesis correctly combined what it received)
- Model capability (model performed well within the given scope)

**The diagnosis test:** Ask "Did each subagent do what it was asked?" If yes → coordinator trap.

## The Scope Enumeration Prevention Pattern

Add a scope verification step BEFORE decomposition:

```python
coordinator_system_prompt = """
You coordinate research tasks using specialized subagents.

MANDATORY PROCESS — follow this exactly:

Step 1: SCOPE ENUMERATION
Before creating any subtask plan, explicitly list ALL categories and aspects
that fall under the research topic. Be comprehensive — not just what you know
well, but everything that belongs in scope.

Step 2: SCOPE VERIFICATION  
Review your enumerated list. Ask: "Is there anything that belongs to this topic
that I haven't listed?" Add any missing categories.

Step 3: COVERAGE CHECK
Create your subtask plan. For every item in your scope enumeration, verify
there is at least one subtask that covers it. If any enumerated item has no
subtask — add one before proceeding.

Step 4: SPAWN SUBAGENTS
Only after Step 3 is complete, spawn the subagents.

NEVER spawn subagents based on the first decomposition that comes to mind
without completing Steps 1-3 first.
"""
```

## The Enumeration-First Prompt Pattern

```python
research_request = """
Research task: Analyze the impact of AI on creative industries.

Before creating your research plan:

1. First, explicitly list every category of creative industry you can identify.
   Do not skip any. Consider: what types of work do humans do creatively?
   
2. For each category you list, mark whether your plan will cover it.
   Every category must be covered — if not, add coverage.

3. Then create your final research plan with subagent assignments.

Important: 'Creative industries' is a broad category. Your final report
should cover ALL of: visual arts, music, writing/publishing, film and video,
game design, architecture, fashion, and any others you identify.
"""
```

## Recognizing and Escaping the Trap Mid-Run

Sometimes the trap is discovered after subtasks have already started. If the coordinator receives a synthesis result and realizes coverage is incomplete:

```python
coordinator_review_prompt = """
You have received research findings. Before synthesizing the final report,
review the coverage:

Original task: {original_task}

Research completed:
{summary_of_completed_research}

COVERAGE AUDIT:
- List the complete scope of the original task
- For each scope item, check whether the completed research covers it
- Identify any scope items with no coverage

If you find gaps:
- Spawn additional subagents to cover the missing areas
- Do not synthesize until all scope items have coverage
"""
```

This mid-run check catches scope gaps before they reach the user.

## Key Takeaways

1. **Coordinator trap = narrow decomposition of broad topic**
2. **Subagents executing correctly + incomplete output = coordinator's decomposition failure**
3. **Enumerate scope FIRST, decompose SECOND**
4. **Coverage check: every scope item must map to at least one subtask**
5. **Mid-run audits can catch gaps before synthesis**
6. **The exam always shows working subagents with incomplete aggregate output** — look at the coordinator
