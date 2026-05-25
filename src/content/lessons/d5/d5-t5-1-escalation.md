---
id: "d5-t5-1-escalation"
title: "Human Review Escalation — When and How to Involve Humans"
domain: "d5"
taskRef: "T5.5"
order: 13
xp: 30
tag: "Core"
duration: "7 min"
analogy: "A bank's fraud detection escalation. Automated systems handle 95% of transactions. Unusual patterns escalate to a specialist. The specialist's decision feeds back to improve the automated system. The escalation path is designed in advance — not improvised when something goes wrong."
examTrap: "Designing escalation triggers that are too broad (escalate everything) or too narrow (never escalate). The exam tests that you can identify valid escalation triggers vs invalid ones — confidence thresholds, scope changes, and ambiguous instructions are valid; routine decisions are not."
keyPoints:
  - "Valid escalation triggers: low confidence on critical fields, scope exceeds original instructions, ambiguous instructions, irreversible high-blast-radius actions."
  - "Invalid escalation triggers: routine decisions within defined scope, recoverable errors, choices between equally valid options."
  - "Escalation handoff quality: human reviewer receives enough context to make an informed decision quickly."
  - "Escalation SLA: define maximum wait time before auto-escalating further up the chain."
  - "Escalation feedback loop: reviewer decisions improve future automated routing."
antiPatterns:
  - "Escalating every low-confidence finding — queue overflow, human fatigue"
  - "Escalating without context — reviewer can't make informed decision quickly"
  - "No escalation SLA — items wait indefinitely in queue"
  - "Escalation as final stop — should have a path to further escalation"
tbChallenge: "Your refund processing agent encounters: (1) a $600 refund (over $500 auto limit), (2) a customer asking for a refund on a product from 3 years ago, (3) a validation error on the order ID. Which escalate to humans and which don't?"
---

## Valid vs Invalid Escalation Triggers

```python
class EscalationDecider:
    """Determines when to involve a human reviewer."""
    
    VALID_TRIGGERS = {
        "low_confidence_critical_field": {
            "description": "Confidence < high on amount, ID, or name fields",
            "escalation_type": "review",
            "priority": "high"
        },
        "scope_exceeded": {
            "description": "Action would exceed defined agent scope",
            "escalation_type": "authorization",
            "priority": "high"
        },
        "irreversible_high_blast": {
            "description": "Irreversible action affecting >100 entities",
            "escalation_type": "confirmation",
            "priority": "critical"
        },
        "business_rule_breach": {
            "description": "Requested action violates policy (e.g., refund > $500)",
            "escalation_type": "exception_approval",
            "priority": "standard"
        },
        "ambiguous_instructions": {
            "description": "Multiple valid interpretations of user intent",
            "escalation_type": "clarification",
            "priority": "standard"
        }
    }
    
    INVALID_TRIGGERS = {
        "validation_error": "Fix the input, don't escalate",
        "recoverable_error": "Retry, don't escalate",
        "routine_within_scope": "Auto-process, don't involve humans",
        "equally_valid_options": "Agent chooses based on policy, no escalation"
    }
    
    def should_escalate(self, situation: dict) -> dict:
        for trigger_name, trigger_config in self.VALID_TRIGGERS.items():
            if self._matches_trigger(situation, trigger_name):
                return {
                    "escalate": True,
                    "trigger":  trigger_name,
                    "type":     trigger_config["escalation_type"],
                    "priority": trigger_config["priority"]
                }
        return {"escalate": False}
```

## Teach-Back Answers

```python
# Scenario 1: $600 refund (over $500 auto limit)
# → ESCALATE: business_rule_breach, exception_approval
#   Policy defines $500 as auto limit. $600 requires human exception approval.

# Scenario 2: 3-year-old refund request
# → ESCALATE: ambiguous_instructions
#   Refund policy for 3-year-old purchases is likely not defined — need clarification.
#   Or business_rule_breach if policy says 30-day return window.

# Scenario 3: validation error on order ID
# → DO NOT ESCALATE: validation_error
#   The order ID format is invalid. Fix: ask the customer to provide the correct order ID.
#   This is a recoverable input error, not a decision requiring human judgment.
```

## Escalation Handoff Quality

```python
def build_escalation_request(situation: dict, trigger: str) -> dict:
    """Build a context-rich escalation request for the human reviewer."""
    return {
        "escalation_type": trigger,
        "priority":        situation.get("priority", "standard"),
        "sla_hours":       situation.get("sla", 4),
        
        # What the reviewer needs to make a quick, informed decision
        "summary": f"Agent needs authorization for: {situation['requested_action']}",
        "context": {
            "customer":         situation.get("customer_summary"),
            "requested_action": situation["requested_action"],
            "why_escalated":    situation["escalation_reason"],
            "relevant_policy":  situation.get("applicable_policy"),
            "recommendation":   situation.get("agent_recommendation"),
        },
        "decision_options": [
            {"option": "approve",  "consequence": situation["approve_consequence"]},
            {"option": "deny",     "consequence": situation["deny_consequence"]},
            {"option": "modify",   "consequence": "Reviewer specifies modified parameters"},
        ],
        "source_documents": situation.get("relevant_documents", [])
    }
```

## Key Takeaways

1. **Valid triggers**: confidence, scope, irreversibility, policy breach, ambiguity
2. **Invalid triggers**: validation errors, recoverable errors, routine decisions
3. **Handoff quality**: reviewer gets context to decide quickly, not just an alert
4. **SLA per trigger type** — high-priority escalations have shorter SLA
5. **Feedback loop** — reviewer decisions improve future escalation thresholds
