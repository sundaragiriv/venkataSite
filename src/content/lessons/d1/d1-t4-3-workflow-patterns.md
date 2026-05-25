---
id: "d1-t4-3-workflow-patterns"
title: "Agentic Workflow Patterns — Prompt Chaining, Parallelization, and Best-of-N"
domain: "d1"
taskRef: "T1.4"
order: 12
xp: 35
tag: "Core"
duration: "9 min"
analogy: "Manufacturing processes. Assembly lines (prompt chaining) handle known sequences. Parallel production lines (parallelization) handle independent components that later get assembled. Quality control (Best-of-N) runs the same process multiple times and picks the best output."
examTrap: "Thinking Best-of-N means running the same prompt three times and taking a majority vote. Best-of-N runs three complete agentic loops independently, then uses a separate evaluation step to select the best result — not a vote."
keyPoints:
  - "Prompt chaining passes output from one Claude call as input to the next — best for sequential tasks where each step builds on the previous."
  - "Parallelization runs multiple Claude calls concurrently — best for independent subtasks that can be processed simultaneously."
  - "Best-of-N generates N independent solutions and evaluates them to select the best — best for high-stakes outputs where quality matters more than speed."
  - "The evaluation in Best-of-N is itself a Claude call with specific scoring criteria — not a vote or random selection."
  - "Routing pattern: a classifier determines which specialized pipeline handles a request — avoids one-size-fits-all workflows."
antiPatterns:
  - "Using prompt chaining when steps are independent (should parallelize instead)"
  - "Using Best-of-N with N=3 and a majority vote — this selects the most popular answer, not the best"
  - "Not having explicit scoring criteria for the Best-of-N evaluator"
  - "Building one complex prompt when a routing pattern with specialized pipelines would be more reliable"
tbChallenge: "Explain Best-of-N to a colleague who says 'I just need to run the prompt 3 times and take the most common answer.' What's wrong with that and what does Best-of-N actually do?"
---

## The Four Core Workflow Patterns

### Pattern 1: Prompt Chaining (Sequential Pipeline)

Each step receives the output of the previous step as its input. Steps are sequential because each depends on the prior result.

```
User Query
    │
    ▼
Step 1: Research (web search + summarization)
    │ outputs: research_summary
    ▼
Step 2: Outline (structures research into document outline)
    │ outputs: document_outline
    ▼
Step 3: Draft (writes full draft following outline)
    │ outputs: full_draft
    ▼
Step 4: Review (identifies issues in draft)
    │ outputs: review_notes
    ▼
Step 5: Final (addresses review notes, produces final)
    │ outputs: final_document
    ▼
User receives final_document
```

**When to use**: Tasks where each step's quality depends on the prior step's output. Document creation, code generation with review, data extraction with validation.

```python
async def research_and_write_pipeline(topic: str) -> str:
    # Step 1: Research
    research = await call_claude(
        f"Research {topic} and produce a comprehensive summary of key facts and sources.",
        tools=[web_search_tool, summarize_tool]
    )

    # Step 2: Outline (receives research as context)
    outline = await call_claude(
        f"Based on this research:\n\n{research}\n\nCreate a structured outline for a 1500-word article.",
    )

    # Step 3: Draft (receives both research and outline)
    draft = await call_claude(
        f"Research:\n{research}\n\nOutline:\n{outline}\n\nWrite the full article following this outline.",
    )

    return draft
```

### Pattern 2: Parallelization

Independent subtasks run simultaneously. Results are aggregated after all complete.

```
User Query
    │
    ├─────────────────────────────────┐
    │                                 │
    ▼                                 ▼
Task A: Market Analysis          Task B: Competitor Analysis
    │                                 │
    └──────────────┬──────────────────┘
                   │
                   ▼
          Task C: Synthesis (requires A and B)
                   │
                   ▼
            Final Report
```

```python
async def market_research_parallel(topic: str) -> str:
    # Run independent tasks in parallel
    market_task, competitor_task, regulatory_task = await asyncio.gather(
        call_claude(f"Analyze the market landscape for {topic}", tools=[web_search_tool]),
        call_claude(f"Research competitors in {topic}", tools=[web_search_tool]),
        call_claude(f"Research regulatory environment for {topic}", tools=[web_search_tool]),
    )

    # Sequential synthesis step that requires all parallel results
    synthesis = await call_claude(
        f"""Synthesize these findings into a comprehensive report:

MARKET ANALYSIS:
{market_task}

COMPETITOR ANALYSIS:
{competitor_task}

REGULATORY LANDSCAPE:
{regulatory_task}

Produce a structured executive brief."""
    )

    return synthesis
```

### Pattern 3: Best-of-N (Quality Maximization)

Generate N independent solutions, then evaluate to select the best.

```
User Request
    │
    ├──────────────┬──────────────┐
    │              │              │
    ▼              ▼              ▼
Solution A     Solution B     Solution C
(independent)  (independent)  (independent)
    │              │              │
    └──────────────┼──────────────┘
                   │
                   ▼
          Evaluator (scores each solution)
                   │
                   ▼
          Best solution returned
```

```python
async def best_of_n_solution(problem: str, n: int = 3) -> str:
    """
    Generate N independent solutions and select the best.
    Each solution is a complete independent run — different random seeds,
    potentially different approaches.
    """
    # Generate N solutions in parallel (they're independent)
    solutions = await asyncio.gather(*[
        call_claude(
            f"Solve this problem: {problem}\n\nApproach it independently and thoroughly.",
            temperature=0.7  # Some variation between solutions
        )
        for _ in range(n)
    ])

    # Evaluate all solutions to select the best
    # The evaluator is ANOTHER Claude call with explicit scoring criteria
    evaluation_prompt = f"""
You are evaluating {n} solutions to this problem:
PROBLEM: {problem}

SOLUTIONS TO EVALUATE:
{chr(10).join(f"Solution {i+1}:{chr(10)}{sol}" for i, sol in enumerate(solutions))}

Score each solution on:
1. Correctness (0-10): Does it solve the problem accurately?
2. Completeness (0-10): Does it address all aspects?
3. Clarity (0-10): Is the solution clear and well-explained?
4. Edge cases (0-10): Does it handle edge cases?

Return JSON:
{{
  "scores": [
    {{"solution": 1, "correctness": X, "completeness": X, "clarity": X, "edge_cases": X, "total": X}},
    ...
  ],
  "best_solution": <number of best solution>,
  "reasoning": "Why this solution is best"
}}
"""

    evaluation = await call_claude(evaluation_prompt)
    eval_data = json.loads(evaluation)

    best_idx = eval_data["best_solution"] - 1
    return solutions[best_idx]
```

**When to use Best-of-N**: Code generation where bugs are costly, critical documents, complex reasoning tasks, any situation where the cost of review is worth the quality improvement.

### Pattern 4: Routing

A classifier determines which specialized pipeline handles the request.

```python
async def intelligent_support_router(user_message: str) -> str:
    # Step 1: Classify the request
    classification = await call_claude(
        f"""Classify this customer message into one of these categories:
        - billing_dispute: Issues with charges, refunds, billing errors
        - technical_issue: Product not working, bugs, access problems
        - account_management: Password, account settings, profile changes
        - general_inquiry: Questions about products, policies, features

        Message: {user_message}

        Return only the category name."""
    )

    # Step 2: Route to specialized handler
    handlers = {
        "billing_dispute":    handle_billing_dispute,
        "technical_issue":    handle_technical_issue,
        "account_management": handle_account_management,
        "general_inquiry":    handle_general_inquiry,
    }

    handler = handlers.get(classification.strip(), handle_general_inquiry)
    return await handler(user_message)
```

Each handler is optimized for its specific case — different tools, different prompts, different escalation paths.

## Combining Patterns

Real systems combine multiple patterns:

```
Customer Support System:
  Router → classifies request
    → Billing path: 
        Parallel (get_customer + get_order + get_payment_history)
        → Chain: verify_eligibility → calculate_refund → process_refund
    → Technical path:
        Chain: diagnose → research_fix → generate_resolution
    → Complex cases:
        Best-of-N: generate 3 resolution approaches → select best → present
```

## Key Takeaways

1. **Prompt chaining** — sequential, each step builds on the previous
2. **Parallelization** — concurrent, for independent tasks
3. **Best-of-N** — multiple solutions + evaluator selects best (not majority vote)
4. **Routing** — classifier sends requests to specialized pipelines
5. **Combine patterns** — real systems use multiple patterns at different stages
6. **Best-of-N evaluator uses explicit scoring criteria** — not random selection
