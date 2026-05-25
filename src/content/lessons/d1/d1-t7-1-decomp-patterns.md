---
id: "d1-t7-1-decomp-patterns"
title: "Task Decomposition — Fixed Pipeline vs Dynamic Adaptive"
domain: "d1"
taskRef: "T1.7"
order: 16
xp: 30
tag: "Core"
duration: "8 min"
analogy: "Following a recipe vs cooking by feel. A recipe (fixed pipeline) tells you exactly what to do in what order — great for consistency. Cooking by feel (dynamic decomposition) means you taste as you go and adjust — great for complex dishes where you can't know every detail in advance."
examTrap: "Applying fixed pipeline decomposition to open-ended tasks where you don't know what you'll find. If your pipeline assumes Step 3 will always produce X, but the actual data doesn't match that assumption, the pipeline breaks silently."
keyPoints:
  - "Fixed pipeline: predefined sequence of steps with known inputs and outputs. Use when the task structure is fully known in advance."
  - "Dynamic decomposition: coordinator discovers what needs to be done and creates a plan based on findings. Use when the right approach depends on what's found."
  - "The coordinator trap: decomposing a broad topic into subtasks that are too narrow — missing entire domains of relevant content."
  - "Granularity decisions: subtasks should be large enough to be meaningful but small enough to fit in a subagent context window."
  - "Dependency analysis: identify which subtasks can start immediately and which must wait for prior results."
antiPatterns:
  - "Using fixed pipelines for open-ended research where findings determine the next step"
  - "Dynamic decomposition for well-understood repeatable workflows (adds unnecessary complexity)"
  - "Coordinator trap: decomposing 'creative industries' into only visual arts subtasks"
  - "Subtasks too granular: 'analyze this one line of code' — subagent overhead exceeds value"
  - "Subtasks too broad: 'analyze the entire codebase' — context overflow"
tbChallenge: "Give me an example of a task where fixed pipeline is clearly the right choice, an example where dynamic decomposition is clearly right, and an example that's genuinely ambiguous. For the ambiguous one, explain how you'd decide."
---

## Fixed Pipeline Decomposition

Use when you know the exact steps before you start.

**Characteristics:**
- Same steps in the same order every time
- Each step's output type is predictable
- The task is well-understood and repeatable
- Reliability and consistency are priorities

**Example: Customer Support Resolution Pipeline**

```python
# Fixed pipeline — always these steps, always this order
SUPPORT_PIPELINE = [
    {"step": "verify_identity",    "tool": "get_customer",     "required": True},
    {"step": "get_context",        "tool": "get_order_history", "required": True},
    {"step": "check_policy",       "tool": "get_policy",       "required": True},
    {"step": "determine_action",   "tool": None,                "required": True},  # Claude decides
    {"step": "execute_resolution", "tool": "process_refund",   "required": False}, # Optional
    {"step": "send_confirmation",  "tool": "send_email",       "required": True},
]
```

Every customer support interaction follows this pipeline. The structure never changes even though the data does.

## Dynamic Adaptive Decomposition

Use when you need to discover what to do before you can plan how to do it.

**Characteristics:**
- Coordinator first explores the problem space
- Subtasks are created based on what's found
- Different runs produce different execution graphs
- Adaptability to unexpected findings is required

**Example: Legacy Codebase Test Coverage**

```python
# Dynamic — coordinator decides structure based on exploration
coordinator_prompt = """
Your task: Add comprehensive test coverage to this legacy codebase.

Phase 1 (do this first):
- Explore the codebase structure
- Identify which modules have zero or minimal test coverage
- Assess which untested modules have the highest business impact
- Identify dependencies and test infrastructure

Based on Phase 1 findings, create a prioritized test implementation plan.
The number and type of subagents you spawn in Phase 2 should match
what Phase 1 reveals — not a fixed structure decided in advance.
"""
```

The coordinator might discover 3 high-impact modules needing tests, or 15. It adapts based on what it finds.

## The Coordinator Trap (Exam Tested)

The coordinator trap is a specific type of decomposition failure: subtasks that are internally coherent but miss entire categories of the original scope.

**The scenario:**

Task: "Analyze the impact of AI on creative industries"

**Trapped decomposition:**
- "AI in digital art creation"
- "AI in graphic design tools"
- "AI in photography editing"
- "AI in illustration"

**Result:** A comprehensive report on AI in visual arts. Music, writing, film, game design, architecture — all missing.

**Why it happens:** The coordinator recognized a coherent category (visual arts) and stayed within it, missing that "creative industries" is a much broader scope.

**Prevention:**

```python
coordinator_prompt = """
Task: Analyze the impact of AI on creative industries.

SCOPE CHECK: Before creating your decomposition plan, explicitly list ALL 
categories that fall under 'creative industries.' Your subtask plan must 
cover every category you identify. If you identify music, literature, film,
visual arts, architecture, and game design — all six need coverage.

Do not create a plan that addresses only a subset of the categories you identify.
"""
```

## Granularity Decisions

**Too fine-grained:**
- Subagent overhead (spawning, context setup) exceeds the value of the task
- Example: "Analyze this one function's complexity" — a subagent for one function is wasteful

**Too coarse-grained:**
- Subtask is too large to fit in the subagent's context window
- Example: "Analyze the entire authentication system" — might be 50 files

**Right granularity:**
- Meaningful unit of work (logical module, document section, related group of files)
- Fits comfortably within context window with room for reasoning
- Produces a result that stands alone (can be understood without the full context)

```python
# Example: Code review with right granularity
# Bad: one subagent for all 200 files
# Bad: one subagent per file (200 subagents for 200 files — overhead)
# Right: group related files by module (8-12 subagents for a 200-file codebase)

def group_files_by_module(files: list) -> dict:
    """Group files into cohesive modules for subagent assignment."""
    modules = {}
    for file in files:
        module = detect_module(file.path)  # auth, payments, orders, etc.
        modules.setdefault(module, []).append(file)

    # If a module is very large, split it
    result = {}
    for module, module_files in modules.items():
        if len(module_files) > 20:
            # Split large modules into chunks
            for i, chunk in enumerate(chunks(module_files, 15)):
                result[f"{module}_part{i}"] = chunk
        else:
            result[module] = module_files

    return result
```

## Key Takeaways

1. **Fixed pipeline** for known, repeatable, well-understood workflows
2. **Dynamic decomposition** for open-ended investigation
3. **Coordinator trap**: always verify your decomposition covers the full scope
4. **Granularity**: meaningful unit, fits in context, produces standalone result
5. **Discovery first**: for dynamic tasks, Phase 1 explores, Phase 2 acts on findings
