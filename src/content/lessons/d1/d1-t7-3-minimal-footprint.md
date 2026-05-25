---
id: "d1-t7-3-minimal-footprint"
title: "Minimal Footprint — The Safety Principle for Agentic Systems"
domain: "d1"
taskRef: "T1.7"
order: 18
xp: 35
tag: "Core"
duration: "8 min"
analogy: "A surgeon following the principle of 'do no harm beyond what's necessary.' Don't make a 10cm incision when a 2cm incision does the job. Don't remove a healthy organ while you're in there. Only touch what you need to, only access what you need, only change what you must."
examTrap: "Confusing minimal footprint with minimal capability. Minimal footprint doesn't mean limiting what agents can do — it means limiting what they ACTUALLY DO to what's necessary for the task. A powerful agent following minimal footprint is safer than a limited agent that ignores the principle."
keyPoints:
  - "Minimal footprint: request only necessary permissions, prefer reversible over irreversible actions, do less and confirm when uncertain about scope."
  - "Irreversible actions (deleted files, sent emails, processed payments) require extra caution — prefer reversible alternatives when available."
  - "When uncertain about scope, pause and ask rather than proceeding with a broader interpretation."
  - "Minimal footprint applies to tool access (don't request tools you won't use), data access (don't fetch data you won't need), and side effects (don't modify what you don't need to modify)."
  - "Human-in-the-loop checkpoints are the mechanism for minimal footprint in agentic systems — pause at decision points where proceeding might exceed the intended scope."
antiPatterns:
  - "Requesting write access 'just in case' when read access is sufficient for the current task"
  - "Deleting files immediately rather than moving them to a staging area first"
  - "Processing all available data when only a subset is needed"
  - "Proceeding with irreversible actions under ambiguous instructions without confirming intent"
  - "Not pausing before actions with large blast radius (mass emails, bulk database updates)"
tbChallenge: "An agent is tasked with 'clean up old test files in the repository.' It finds 847 files matching the pattern. What does minimal footprint tell it to do before proceeding?"
---

## What Minimal Footprint Means in Practice

Minimal footprint is a principle that applies at multiple levels:

### 1. Permission Scope
Only request the permissions you need for the current task — not what you might need.

```python
# ❌ Requesting write access "just in case"
agent_config = {
    "allowed_tools": ["file_read", "file_write", "file_delete",
                      "database_read", "database_write", "send_email"]
    # Why does a code analysis agent need send_email?
}

# ✅ Request only what the current task requires
code_analysis_tools = ["file_read", "grep", "glob"]
# If the agent later needs to write a report, that's a separate step
# with its own permission scope
```

### 2. Data Footprint
Only fetch the data you'll actually use.

```python
# ❌ Fetching all customer data when you only need one field
customers = database.query("SELECT * FROM customers")  # Fetches everything

# ✅ Fetch only what's needed
customer_emails = database.query(
    "SELECT email FROM customers WHERE opted_in = true AND region = 'APAC'"
)
```

### 3. Action Irreversibility
Prefer reversible actions over irreversible ones.

```python
# ❌ Irreversible — can't undo a deleted file
def cleanup_old_files(files_to_remove):
    for file in files_to_remove:
        os.remove(file.path)  # Permanent

# ✅ Reversible — move to staging, confirm, then delete
def cleanup_old_files(files_to_remove):
    staging_dir = "/tmp/cleanup_staging"
    staged = []
    for file in files_to_remove:
        dest = os.path.join(staging_dir, os.path.basename(file.path))
        shutil.move(file.path, dest)
        staged.append({"original": file.path, "staged": dest})

    # Return staged list for confirmation before permanent deletion
    return {
        "staged_count": len(staged),
        "staged_files": staged,
        "action_required": "Review staged files and confirm deletion, or restore from staging"
    }
```

## Human-in-the-Loop Checkpoints

Minimal footprint often requires pausing before high-impact or irreversible actions:

```python
# Agent reaches a decision point
def should_pause_for_confirmation(action: dict) -> bool:
    """
    Determines whether this action requires human confirmation
    before proceeding.
    """
    HIGH_RISK_ACTIONS = {
        "bulk_delete",      # Irreversible, high blast radius
        "mass_email",       # Irreversible, visible to external users
        "payment_process",  # Financial, irreversible
        "schema_migration", # Can break production
        "permission_change" # Security impact
    }

    if action["type"] in HIGH_RISK_ACTIONS:
        return True

    # Check blast radius
    if action.get("affected_count", 0) > 100:
        return True

    # Check if reversible
    if not action.get("reversible", True):
        return True

    return False

# In the agent loop
if should_pause_for_confirmation(planned_action):
    return {
        "status": "awaiting_confirmation",
        "planned_action": planned_action,
        "impact_summary": describe_impact(planned_action),
        "question": f"This action will affect {planned_action['affected_count']} items "
                    f"and cannot be easily undone. Please confirm to proceed."
    }
```

## Scope Clarification Before Irreversible Action

When instructions are ambiguous and the action is irreversible, minimal footprint says: ask before acting.

```python
# Agent receives: "clean up old test files in the repository"
# This is ambiguous — which files? How old? All test directories?

async def cleanup_test_files(repo_path: str) -> dict:
    # First: discover scope without taking action
    potential_files = discover_candidate_files(repo_path, patterns=["*.test.*", "test_*"])

    # Summarize what was found
    summary = {
        "total_files": len(potential_files),
        "total_size_mb": sum(f.size for f in potential_files) / 1024 / 1024,
        "oldest_file_date": min(f.modified_date for f in potential_files),
        "by_directory": count_by_directory(potential_files),
        "sample_files": [f.path for f in potential_files[:10]]
    }

    # Pause — don't delete yet
    return {
        "status": "scope_confirmation_required",
        "discovery": summary,
        "question": (
            f"Found {summary['total_files']} files matching test file patterns "
            f"({summary['total_size_mb']:.1f} MB). "
            f"The oldest was last modified {summary['oldest_file_date']}. "
            f"Should I proceed with all {summary['total_files']} files, "
            f"or would you like to narrow the scope?"
        )
    }
```

## Minimal Footprint in Multi-Agent Systems

In multi-agent systems, minimal footprint applies at the coordinator level:

```python
coordinator_prompt = """
When planning subagent tasks, follow minimal footprint principles:

1. Each subagent should only have access to tools relevant to its specific task
2. Subagents should not read data they don't need for their assigned scope
3. Subagents should not take irreversible actions without explicit instruction
4. If a subagent encounters something outside its defined scope, it should
   report back rather than expanding its own scope autonomously

Never grant a subagent broader access than its task requires.
"""
```

## The Blast Radius Calculation

Before any agent action, assess:
- **What is affected?** (files, records, users, external systems)
- **How many entities are affected?**
- **Is it reversible?**
- **What's the recovery path if something goes wrong?**

High blast radius + irreversible = mandatory human checkpoint.

## Key Takeaways

1. **Minimal footprint = only access/modify what's necessary**
2. **Prefer reversible over irreversible actions**
3. **When scope is ambiguous + action is irreversible → ask before acting**
4. **Human-in-the-loop checkpoints** are the mechanism for high-risk actions
5. **Permission scope, data scope, and action scope** all fall under minimal footprint
6. **In multi-agent systems**, apply minimal footprint at the coordinator level for tool assignment
