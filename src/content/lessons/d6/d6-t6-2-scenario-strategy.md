---
id: "d6-t6-2-scenario-strategy"
title: "Exam Strategy — How to Approach the CCA Exam"
domain: "d6"
taskRef: "T6.6"
order: 12
xp: 50
tag: "⚡ EXAM CRITICAL"
duration: "12 min"
analogy: "A surgeon walking into the operating room. They've done the preparation. They know the procedure. They've reviewed the specific case. Now it's not about learning — it's about execution: read carefully, apply what you know, trust your preparation, don't second-guess."
examTrap: "Changing answers based on second-guessing. The exam is designed so your first well-reasoned answer is usually correct. Changing answers based on uncertainty (not new insight) is statistically worse."
keyPoints:
  - "Format: 60 questions, 120 minutes, 4 scenarios randomly selected from 6, passing = 720/1000."
  - "Time management: 2 minutes per question maximum. Flag and move on if stuck. Return to flagged questions."
  - "Question strategy: read the scenario setup, identify which domain(s) are being tested, apply the principle."
  - "Two-right-answers: identify the signal word, match to principle, select the architecturally superior option."
  - "Anti-patterns: longest answer is not always right. Most complex is not always right. 'It depends' is not a CCA answer."
  - "Exam day preparation: the night before — review the 10 most-tested concepts, not new material."
antiPatterns:
  - "Spending 10 minutes on one question — ruins time management for the remaining 59"
  - "Learning new material the night before — consolidate what you know, don't add more"
  - "Second-guessing first answers without new information"
  - "Not reading the scenario context carefully — the setup determines which principle applies"
tbChallenge: "Walk me through your approach to a question you're not sure about. What's your 60-second decision process for a question where you can eliminate 2 options but can't decide between the remaining 2?"
---

## Exam Structure

```
Total:        60 questions
Time:         120 minutes
Per question: 2 minutes average
Passing:      720/1000 (72%)
Format:       Multiple choice, 4 options each
Scenarios:    4 of 6 randomly selected

Questions per scenario: ~15 per scenario × 4 scenarios = 60
(some scenarios may get more or fewer questions)
```

## The 2-Minute Question Process

```
Step 1: Read the scenario setup (15 seconds)
  What is being built? (customer support, code review, extraction?)
  What is the problem? (reliability, compliance, performance?)

Step 2: Identify the domain(s) being tested (15 seconds)
  Compliance enforcement → D1 hooks
  Tool selection → D2 descriptions
  CI/CD → D3
  Structured output → D4
  Error handling → D5
  
Step 3: Read all 4 options (20 seconds)
  Don't stop at the first plausible option

Step 4: Eliminate clearly wrong options (20 seconds)
  Usually 2 options are obviously wrong

Step 5: Apply the principle to the remaining 2 (30 seconds)
  What does the scenario signal? ("must always" → determinism)
  Which option embodies the correct principle?

Step 6: Answer and flag if uncertain (5 seconds)
  If confident: answer and move on
  If uncertain: guess best option, flag for review, move on
```

## The 10 Most-Tested Concepts — Know These Cold

```
1. stop_reason drives loop control — never text parsing
2. Programmatic enforcement (hooks) vs prompt guidance
3. tool_choice: auto vs any vs forced — and when each applies
4. Minimal footprint — request only necessary permissions
5. Hub-and-spoke — coordinator is the only communication hub
6. CLAUDE.md hierarchy — user (not git) vs project (git) vs directory
7. -p flag required for CI/CD headless execution
8. JSON schema eliminates syntax errors, not semantic errors
9. Multi-instance review — independent instance, no shared context
10. Batch API — 50% cost, up to 24h, never for latency-sensitive work
```

## 60-Second Process for Uncertain Questions

```
You've eliminated 2 options. Two remain. You're not sure.

Step 1 (15 sec): Re-read the scenario for signal words
  "must always" → determinism → enforcement
  "compliance" → programmatic
  "independent" → parallelize
  "performance" → parallel execution
  "files changed" → fresh session

Step 2 (15 sec): Apply the signal word to the two options
  Which option embodies the signaled principle?

Step 3 (15 sec): Trust your first instinct
  Your prepared knowledge is more reliable than exam-pressure reasoning
  If no signal word helped: go with your gut and move on

Step 4 (15 sec): Flag and move
  Mark for review. Time-box at 2 minutes. Move to the next question.
  You can return to flagged questions if time permits.
```

## Night Before — What to Review

```
DO review:
- The 10 most-tested concepts above (5 minutes each)
- The six scenario domain maps
- The two-right-answers pattern library

DO NOT:
- Read new material
- Try to learn anything you don't already understand
- Practice more questions after 9pm

DO:
- Sleep adequately — cognitive performance matters more than cramming
- Eat well before the exam
- Arrive/log in 15 minutes early
```

## Passing Score Reality

```
720/1000 = 72% = 43-44 of 60 questions correct

You can get 16-17 questions WRONG and still pass.

This is not a perfection test. It's a mastery test.
If you've studied all 6 domains thoroughly, you know enough to pass.
```

## Key Takeaways

1. **2 minutes per question maximum** — flag and move on if stuck
2. **Signal words → principles → answers** — don't analyze, pattern-match
3. **Know the 10 most-tested concepts cold** — review the night before
4. **720/1000 passing** — you can miss 16-17 questions and still pass
5. **Sleep** — cognitive performance matters more than last-minute cramming
