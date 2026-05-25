---
id: "d5-t1-2-lost-middle"
title: "Lost-in-the-Middle — Designing Around Attention Degradation"
domain: "d5"
taskRef: "T5.1"
order: 2
xp: 35
tag: "⚡ Exam Tested"
duration: "8 min"
analogy: "A book where the first and last chapters are always memorable but the middle chapters blur together. If you put the most important plot point in chapter 15 of 30, readers miss it. Structure your context like a good author — critical information at the start or the end, never buried in the middle."
examTrap: "Putting key facts or constraints in the middle of a long context and assuming Claude will apply them consistently. The exam tests that you know WHERE to place critical information for reliable attention."
keyPoints:
  - "Claude's attention peaks at the START (system prompt, first user message) and END (most recent message) of the context."
  - "The middle of a long context receives the lowest attention — critical rules placed there are applied inconsistently."
  - "Mitigation: place constraints in system prompt (start), repeat key facts near the current request (end)."
  - "Persistent case facts block: a structured summary of key facts appended to every turn for long-running agents."
  - "Progressive summarization risk: summarizing too aggressively loses precision — keep structured facts, summarize narrative."
antiPatterns:
  - "Placing compliance rules only in the middle of a long conversation history"
  - "Relying on facts established 50 turns ago without refreshing them near the current turn"
  - "Summarizing structured data (numbers, names, IDs) into prose — precision is lost"
  - "No persistent facts block in long-running agents"
tbChallenge: "Design the context structure for a multi-hour customer support agent session. Where do compliance rules go? Where do customer facts go? How do you prevent critical information from drowning in the middle?"
---

## The Attention Distribution Problem

In a 100k token context, Claude processes all tokens but does not attend equally:

```
Context position vs attention (empirical finding):

Token 0-5k:     HIGH attention    ← System prompt, initial rules
Token 5k-15k:   Medium attention
Token 15k-80k:  LOW attention     ← Where history accumulates
Token 80k-95k:  Medium attention
Token 95k-100k: HIGH attention    ← Recent message, current task
```

The practical implication: instructions given once in the system prompt are reliably followed. The same instructions buried at turn 30 of a long conversation are applied inconsistently.

## The Persistent Case Facts Block

For long-running agents, maintain a structured facts block that stays near the end of every turn:

```python
class PersistentFactsManager:
    """
    Maintains a structured block of key facts that travels with every turn.
    Placed AFTER conversation history, BEFORE the current request.
    Ensures critical information is always in high-attention end position.
    """
    
    def __init__(self):
        self.facts = {}
    
    def update(self, key: str, value: any):
        self.facts[key] = value
    
    def as_context_block(self) -> str:
        return f"""
=== PERSISTENT CASE FACTS (always current) ===
Customer ID:       {self.facts.get('customer_id', 'not yet verified')}
Customer Name:     {self.facts.get('customer_name', 'unknown')}
Verified:          {self.facts.get('verified', False)}
Account Tier:      {self.facts.get('tier', 'unknown')}
Active Issue:      {self.facts.get('active_issue', 'none')}
Refund Eligible:   {self.facts.get('refund_eligible', 'not checked')}
Session Start:     {self.facts.get('session_start', 'unknown')}
Decisions Made:    {', '.join(self.facts.get('decisions', []))}
=== END FACTS ===
"""

    def build_messages(self, history: list, current_request: str) -> list:
        """Inject facts block before current request — always in end position."""
        return history + [
            {
                "role": "user",
                "content": self.as_context_block() + "\n\n" + current_request
            }
        ]
```

## Placement Strategy

```python
# System prompt: permanent constraints (high attention — always)
system_prompt = """
You are a customer support agent for FinCo.

COMPLIANCE RULES (always apply):
- Never process refunds without identity verification
- Maximum automated refund: $500
- All refund decisions logged to audit system
"""

# Middle of context: conversation history (low attention — expected)
conversation_history = [...]  # turns 1-30, verbose tool results

# End of context: persistent facts + current request (high attention — always)
current_message = facts_manager.as_context_block() + "\n\nCustomer says: I want a refund for order #12345"
```

## Progressive Summarization — What to Summarize vs Keep

```python
# SUMMARIZE these (narrative, not precision-dependent):
narrative_content = """
Previous context summary:
- Customer called about a delayed shipment on order #12345
- We verified identity (confirmed: Jane Smith, Premium tier)
- Checked order status: shipped Nov 20, delayed at Cincinnati hub
- Customer expressed frustration about missing holiday deadline
"""

# KEEP STRUCTURED (precision-dependent, never summarize):
structured_facts = {
    "customer_id": "C-123456",      # exact
    "order_id": "ORD-98765432",     # exact  
    "refund_amount": 4999,          # exact cents
    "verification_status": True,    # boolean
    "tier": "premium"               # enum
}
```

Narratives can be summarized. Numbers, IDs, and boolean states must stay exact.

## Key Takeaways

1. **Start + End = high attention**, Middle = low attention
2. **System prompt** for permanent constraints — always in high-attention position
3. **Persistent facts block** near the current request — keeps key data in end position
4. **Summarize narrative**, preserve structured data exactly
5. **Refresh critical facts** with every turn — don't rely on turn 3 facts at turn 30
