---
id: "d5-t5-3-handoff-design"
title: "Human Handoff Design — Structured Summaries for Effective Review"
domain: "d5"
taskRef: "T5.5"
order: 15
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A clinical handoff between a departing nurse and an incoming nurse. Not 'see the chart' — but a structured, verbal SBAR: Situation (what's happening), Background (relevant history), Assessment (current status), Recommendation (what to do next). Structured handoffs prevent errors. Unstructured 'read everything' handoffs cause them."
examTrap: "Handoff = dump the conversation history on the reviewer. Wrong. A good handoff is a structured summary specifically designed to enable fast, accurate human decisions — not a data dump."
keyPoints:
  - "Structured handoff format: situation, relevant context, what's uncertain, recommended action, options with consequences."
  - "Reviewer should be able to make a decision in under 2 minutes — if they can't, the handoff is poorly designed."
  - "Include the source document for verification — not just the extracted data."
  - "Recommended action: agent's best guess based on available information, clearly labeled as a recommendation."
  - "Decision record: capture reviewer's decision, reasoning, and timestamp for audit and calibration."
antiPatterns:
  - "Handoff = raw conversation history dump"
  - "No source document — reviewer can't verify the extraction"
  - "No recommended action — reviewer must reconstruct agent's reasoning from scratch"
  - "Vague decision options — 'approve or deny' without explaining consequences"
tbChallenge: "Design the handoff summary for a $750 refund request that exceeded the $500 auto-limit. What does the human reviewer see, what are their options, and what happens after they decide?"
---

## The SBAR Handoff Template

```python
def build_handoff_summary(situation: dict) -> dict:
    """
    Structured handoff using SBAR framework.
    Reviewer should be able to decide in < 2 minutes.
    """
    return {
        # SITUATION: What's happening right now
        "situation": {
            "summary":        situation["one_line_summary"],
            "escalated_by":   "Automated refund agent",
            "escalated_at":   utcnow(),
            "escalation_reason": situation["trigger"],
        },
        
        # BACKGROUND: What the agent knows
        "background": {
            "customer": {
                "id":   situation["customer_id"],
                "name": situation["customer_name"],
                "tier": situation["customer_tier"],
                "history_summary": situation["customer_history_summary"],  # 2 sentences max
            },
            "order": {
                "id":        situation["order_id"],
                "amount":    situation["order_amount"],
                "status":    situation["order_status"],
                "date":      situation["order_date"],
            },
            "request": {
                "requested_amount": situation["refund_requested"],
                "reason":           situation["refund_reason"],
                "policy_limit":     500.00,
                "amount_over_limit": situation["refund_requested"] - 500.00
            }
        },
        
        # ASSESSMENT: Agent's analysis
        "assessment": {
            "confidence":     situation["confidence"],
            "policy_status":  "EXCEEDS_AUTO_LIMIT",
            "customer_notes": situation.get("customer_notes"),
            "agent_reasoning": situation["why_escalated"]
        },
        
        # RECOMMENDATION: Agent's best guess
        "recommendation": {
            "suggested_action": "approve_exception",
            "reasoning": (
                f"Customer is {situation['customer_tier']} tier with "
                f"{situation['tenure_years']} years of account history. "
                f"Amount is ${situation['refund_requested'] - 500:.2f} over limit. "
                f"Prior refund history: {situation['prior_refunds']}."
            ),
            "confidence_in_recommendation": "medium"
        },
        
        # OPTIONS: Clear choices with consequences
        "decision_options": [
            {
                "option":       "approve_full",
                "label":        f"Approve full ${situation['refund_requested']:.2f}",
                "consequence":  "Refund processed immediately. Audit log entry created.",
                "requires":     "manager_authorization"
            },
            {
                "option":       "approve_partial",
                "label":        "Approve up to $500 (policy limit)",
                "consequence":  "Partial refund processed. Customer informed of remaining balance.",
                "requires":     "standard_authorization"
            },
            {
                "option":       "deny",
                "label":        "Deny refund",
                "consequence":  "Customer notified with policy explanation. Agent closes case.",
                "requires":     "standard_authorization"
            }
        ],
        
        # VERIFICATION: Source material for reviewer
        "source_documents": [
            situation.get("order_record_url"),
            situation.get("original_request_transcript")
        ]
    }
```

## Decision Recording

```python
def record_review_decision(
    handoff_id: str,
    reviewer_id: str,
    decision: str,
    reasoning: str,
    correction: dict = None
) -> dict:
    """
    Capture reviewer decision for:
    1. Audit trail
    2. Calibration feedback
    3. Agent continuation
    """
    record = {
        "handoff_id":    handoff_id,
        "reviewer_id":   reviewer_id,
        "decision":      decision,
        "reasoning":     reasoning,
        "decided_at":    utcnow(),
        "correction":    correction,  # If reviewer modified agent's data
        "agent_was_right": decision == "approve_full"  # For calibration
    }
    
    # Feed to calibration system
    calibration_system.record_outcome(
        confidence_tier=handoffs[handoff_id]["assessment"]["confidence"],
        agent_recommendation=handoffs[handoff_id]["recommendation"]["suggested_action"],
        reviewer_decision=decision,
        agent_was_right=record["agent_was_right"]
    )
    
    # Resume agent with decision
    return resume_agent(handoff_id, record)
```

## Key Takeaways

1. **SBAR structure**: Situation, Background, Assessment, Recommendation
2. **< 2 minute decision time** — if it takes longer, the handoff is too complex
3. **Source document included** — reviewer verifies, not just reads extracted data
4. **Recommendation from agent** — reviewer confirms or overrides, not starts from scratch
5. **Decision recording** feeds calibration — handoffs improve the system over time
