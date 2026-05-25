---
id: "d5-t3-3-routing-design"
title: "Review Routing Design — Building the Human-in-the-Loop Pipeline"
domain: "d5"
taskRef: "T5.3"
order: 9
xp: 25
tag: "Core"
duration: "6 min"
analogy: "A hospital triage system designed as a process, not just a rule. Not just 'urgent patients go to emergency' — but a full pipeline: who does triage, what information they see, how long cases wait at each level, how escalation works, and how outcomes feed back to improve triage accuracy."
examTrap: "Designing routing rules without designing the full pipeline — who receives the human review queue, what information they see, what actions they take, and how their decisions feed back to improve routing."
keyPoints:
  - "Routing is a pipeline, not just a rule — includes queue management, reviewer interface, action options, and feedback loop."
  - "Reviewer information: provide extracted data + source document + specific uncertain fields + recommended action."
  - "SLA per tier: auto-process = immediate, spot-check = same day sample, human review = defined SLA."
  - "Feedback loop: reviewer decisions feed back to improve routing thresholds and confidence calibration."
  - "Escalation path: items stuck in queue past SLA escalate automatically."
antiPatterns:
  - "Routing rule with no queue management — items pile up with no visibility"
  - "Reviewer sees only extracted data without source document — can't verify"
  - "No SLA — human review queue grows indefinitely"
  - "No feedback loop — routing never improves"
tbChallenge: "Design the complete routing pipeline for invoice extraction: the three tiers, what reviewers see at each tier, the SLA for each, and how review outcomes feed back to improve the system."
---

## Complete Routing Pipeline

```python
class ExtractionRoutingPipeline:
    
    def __init__(self, reviewer_queue, sla_config):
        self.queue = reviewer_queue
        self.sla = sla_config  # {"auto": None, "spot_check": 24, "human_review": 4}
    
    async def process(self, extraction: dict, source_document: bytes) -> dict:
        route = self.determine_route(extraction)
        
        if route["tier"] == "auto_process":
            return await self.auto_process(extraction)
        
        elif route["tier"] == "spot_check":
            # Add to sampling queue — reviewer checks a percentage
            await self.queue.add_to_spot_check(
                extraction=extraction,
                source=source_document,
                uncertain_fields=route.get("check_fields", []),
                sla_hours=self.sla["spot_check"]
            )
            # Continue processing — don't wait for review
            return await self.auto_process(extraction, flagged_for_review=True)
        
        elif route["tier"] == "human_review":
            # Block processing until reviewed
            review_request = await self.queue.add_for_review(
                extraction=extraction,
                source=source_document,
                uncertain_fields=route.get("focus_fields", []),
                priority=route.get("priority", "standard"),
                sla_hours=self.sla["human_review"]
            )
            # Wait for review decision
            review_result = await review_request.wait_for_decision(
                timeout_hours=self.sla["human_review"] * 2
            )
            return self.apply_review_decision(extraction, review_result)
    
    def build_reviewer_interface(self, item: dict) -> dict:
        """What the human reviewer sees."""
        return {
            "extracted_data":    item["extraction"],
            "source_document":   item["source"],  # Original document for verification
            "uncertain_fields":  item["uncertain_fields"],
            "recommended_action": self.get_recommendation(item),
            "available_actions": [
                "approve_as_is",
                "approve_with_corrections",
                "reject_for_reprocessing",
                "escalate_to_manager"
            ],
            "correction_template": self.build_correction_template(item)
        }
    
    def record_review_outcome(self, item_id: str, outcome: dict):
        """Feed reviewer decisions back to calibration system."""
        self.calibration.record_result(
            confidence_tier=outcome["original_confidence"],
            was_correct=outcome["action"] == "approve_as_is"
        )
```

## SLA Management

```python
SLA_CONFIG = {
    "auto_process": {
        "max_wait_minutes": 0,
        "escalation":       None,
        "reviewer":         None
    },
    "spot_check": {
        "max_wait_hours":   24,
        "sample_rate":      0.10,  # Review 10% of spot-check queue
        "escalation":       "standard_human_review",
        "reviewer":         "quality_team"
    },
    "human_review": {
        "standard_sla_hours": 4,
        "high_priority_sla":  1,
        "escalation":         "manager_review",
        "reviewer":           "processing_team"
    }
}
```

## Key Takeaways

1. **Routing is a pipeline** — not just a rule, but a full queue-to-feedback system
2. **Reviewers need source document** — can't verify extraction without original
3. **SLA per tier** — prevents queue buildup and ensures timely processing
4. **Feedback loop** — reviewer outcomes calibrate future routing
5. **Escalation path** — SLA breaches auto-escalate to next tier
