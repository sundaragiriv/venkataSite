---
id: "d0-t0-2-how-claude-works"
title: "How Claude Actually Works — The Honest Explanation"
domain: "d0"
order: 2
xp: 20
tag: "Foundations"
duration: "8 min"
analogy: "Claude works like a very sophisticated autocomplete. When you start typing 'I feel like having...' your phone might suggest 'pizza' or 'a nap.' Claude does this too, but at a scale that produces coherent essays, detailed plans, and nuanced answers. It's predicting what words should come next, based on everything it has ever read."
examTrap: "Claude does not 'look things up' when you ask a question. It generates answers from patterns in its training. This is why it can be confidently wrong — it patterns-matches, not fact-checks. Always verify facts that matter."
keyPoints:
  - "Claude was trained on a massive amount of text — it learned patterns of language, facts, and reasoning from that text."
  - "When you ask Claude something, it generates a response word by word, predicting what should come next based on its training."
  - "Claude has a 'knowledge cutoff' — it doesn't know about events that happened after its training ended."
  - "Claude cannot search the internet by default — it works from what it already knows."
  - "Claude has a context window — it can only remember what's in your current conversation. It forgets everything when you start a new chat."
antiPatterns:
  - "Asking Claude about yesterday's news and trusting the answer — it doesn't know recent events"
  - "Starting a new chat and expecting Claude to remember what you discussed yesterday — it has no memory across conversations"
  - "Believing everything Claude says about facts without checking — it can be wrong"
tbChallenge: "A friend says 'I asked Claude who won last night's game and it gave me a confident answer — but it was completely wrong.' Explain why this happened using what you learned about how Claude works."
---

## The honest explanation of what's happening

When you type a message to Claude and hit send, here is what actually happens:

1. Your message goes to Anthropic's computers
2. Claude reads your message as a sequence of words (called "tokens")
3. Claude generates a response by predicting, word by word, what would be the most useful thing to say
4. That response comes back to your screen

At every step, Claude is doing sophisticated pattern matching — drawing on everything it learned during training. It's not "thinking" the way you do. It's doing something closer to very advanced autocomplete.

## The three things Claude genuinely doesn't know

**1. Recent events**
Claude has a training cutoff date. Everything after that date is unknown to it. If you ask about news from last week, Claude either doesn't know or — more dangerously — makes something up that sounds plausible.

*What to do:* For current events, use a news website or ask Claude to acknowledge it may be outdated on recent topics.

**2. The internet (unless specifically given access)**
Unless you're using a version of Claude with web search enabled, Claude cannot look things up. It knows only what was in its training data. This is very different from a search engine.

*What to do:* Think of Claude as a brilliant expert working from memory, not a search engine. Use it for reasoning, writing, and explaining — not for finding today's stock prices.

**3. You personally (unless you tell it)**
Every conversation starts fresh. Claude has no memory of previous chats. If you talked yesterday, today it knows nothing about you.

*What to do:* At the start of important conversations, briefly tell Claude who you are and what context matters. "I'm a middle school teacher, I have 28 students, I teach science" — that context dramatically improves every response.

## Why Claude sometimes makes things up (and what to do about it)

This is called **hallucination** — and it's one of the most important things to understand. Claude can generate confident-sounding responses that are completely fabricated. It does this because it's pattern-matching, not fact-checking.

Signs Claude might be hallucinating:
- Very specific numbers, dates, or statistics you can't verify
- Detailed claims about specific people, places, or events
- Anything where being wrong has real consequences

What to do: For anything important — medical, legal, financial, factual — verify with an authoritative source. Use Claude for drafting, brainstorming, explaining, and writing. Not as your sole source of truth.

## What Claude is genuinely remarkable at

Despite these limitations, Claude excels at things most people struggle with:

- **Writing:** Drafting emails, letters, reports, stories — Claude writes clearly and quickly
- **Explaining:** Making complex topics understandable at any level
- **Brainstorming:** Generating ideas, options, and possibilities you hadn't considered
- **Summarizing:** Turning long documents into concise summaries
- **Editing:** Improving your writing while preserving your voice
- **Coding:** Writing and explaining computer code (relevant for D1–D6 of this course)
- **Planning:** Breaking big goals into step-by-step actions

These are the tasks where Claude's pattern-matching is most powerful — and where the limitations above matter least.

## The single mindset shift that changes everything

Stop thinking of Claude as a search engine or a fact database.

Start thinking of Claude as a **highly capable collaborator** who works from broad knowledge, needs context from you, and should be checked on anything that truly matters.

With that mindset, you'll get 10x more value from every conversation.
