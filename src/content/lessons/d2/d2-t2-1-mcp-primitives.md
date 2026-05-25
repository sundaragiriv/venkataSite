---
id: "d2-t2-1-mcp-primitives"
title: "MCP Three Primitives — Tools, Resources, and Prompts"
domain: "d2"
taskRef: "T2.2"
order: 4
xp: 40
tag: "⚡ Exam Tested"
duration: "10 min"
analogy: "A contractor's toolkit. Tools are the power tools — they do work and can change things (drill, saw). Resources are the reference materials — they provide information without changing it (blueprints, building codes). Prompts are the workflow templates — pre-written instructions for how to approach standard jobs (standard operating procedures). Each has a distinct role and you wouldn't use one where another belongs."
examTrap: "Using Tools when Resources are the right primitive. If you're exposing read-only data access, a Resource is architecturally correct — it signals to Claude that this is data to read, not an action to take. Using a Tool for read-only data access works but is semantically wrong and misguides Claude's reasoning."
keyPoints:
  - "Tools are callable functions that Claude invokes to take actions or retrieve dynamic data — they can have side effects."
  - "Resources are data sources that Claude can read — they are read-only, have URIs, and represent persistent data."
  - "Prompts are reusable prompt templates that users or clients can invoke — they structure how Claude approaches specific tasks."
  - "The distinction matters architecturally: Tools signal action, Resources signal data access, Prompts signal workflow."
  - "MCP servers expose all three primitives — clients (Claude) discover what's available and use them appropriately."
antiPatterns:
  - "Using Tools for read-only data access when Resources are the correct primitive"
  - "Confusing MCP Prompts with Claude's system prompts — they're different concepts"
  - "Exposing mutable operations as Resources — Resources should be read-only"
  - "Not understanding what primitive to use results in incorrect exam answers about MCP architecture"
tbChallenge: "I'm building an MCP server that exposes a company's knowledge base. Users can search it, read articles, and submit feedback on articles. Map each operation to the correct MCP primitive and explain why."
---

## The Three Primitives

### Primitive 1: Tools

Tools are functions Claude can call that **do things** — they take actions, retrieve dynamic data, or interact with external systems.

```python
# MCP Server — exposing Tools
@server.tool("search_knowledge_base")
async def search_knowledge_base(query: str, max_results: int = 10) -> list[dict]:
    """
    Searches the knowledge base for relevant articles.
    Dynamic — results depend on the query at call time.
    """
    return await kb_client.search(query, limit=max_results)

@server.tool("submit_article_feedback")
async def submit_article_feedback(article_id: str, rating: int, comment: str) -> dict:
    """
    Submits user feedback on a knowledge base article.
    Has a side effect — writes to the database.
    """
    return await feedback_client.submit(article_id, rating, comment)
```

**Characteristics of Tools:**
- Called by Claude when it decides to take an action
- Can have side effects (writes, sends, creates, deletes)
- Return structured data
- Have input schemas Claude uses to construct calls

### Primitive 2: Resources

Resources are **data sources** — read-only, addressable by URI, representing persistent data.

```python
# MCP Server — exposing Resources
@server.resource("knowledge://articles/{article_id}")
async def get_article(article_id: str) -> Resource:
    """
    Provides read access to a specific knowledge base article.
    Read-only — doesn't change anything.
    """
    article = await kb_client.get_article(article_id)
    return Resource(
        uri=f"knowledge://articles/{article_id}",
        name=article.title,
        description=f"Knowledge base article: {article.title}",
        mimeType="text/markdown",
        text=article.content
    )

@server.resource("knowledge://categories")
async def list_categories() -> Resource:
    """
    Provides the list of all article categories.
    """
    categories = await kb_client.get_categories()
    return Resource(
        uri="knowledge://categories",
        name="Article Categories",
        mimeType="application/json",
        text=json.dumps(categories)
    )
```

**Characteristics of Resources:**
- Addressed by URI (like web URLs)
- Read-only — no side effects
- Represent data that exists independently of the request
- Claude reads them like files or documents

**When Resource is correct vs Tool:**

| Scenario | Primitive |
|---|---|
| Get the content of a specific article | Resource |
| Search for articles matching a query | Tool (dynamic) |
| Read configuration settings | Resource |
| Update configuration settings | Tool (has side effects) |
| List available categories (static) | Resource |
| Generate a personalized recommendation | Tool (dynamic/computed) |

### Primitive 3: Prompts

Prompts are **reusable templates** that structure how Claude approaches specific tasks. They're invoked by users or client applications, not by Claude itself.

```python
# MCP Server — exposing Prompts
@server.prompt("troubleshoot_issue")
async def troubleshoot_issue_prompt(
    issue_description: str,
    product: str
) -> list[PromptMessage]:
    """
    Provides a structured workflow for troubleshooting a product issue.
    """
    return [
        PromptMessage(
            role="user",
            content=f"""Help me troubleshoot this {product} issue:

{issue_description}

Please:
1. First, ask me the 3 most important diagnostic questions
2. Based on my answers, identify the most likely root cause
3. Provide step-by-step resolution instructions
4. If you cannot resolve it, tell me what information to escalate to support"""
        )
    ]

@server.prompt("monthly_report")
async def monthly_report_prompt(month: str, year: str) -> list[PromptMessage]:
    """
    Template for generating monthly performance reports.
    """
    return [
        PromptMessage(
            role="user",
            content=f"Generate a monthly performance report for {month} {year}. "
                   f"Use the get_metrics tool to retrieve data, then structure "
                   f"the report with: executive summary, key metrics, trend analysis, "
                   f"and recommended actions."
        )
    ]
```

**Characteristics of Prompts:**
- Pre-written instructions for specific workflows
- Parameterized (can take inputs that get embedded in the prompt)
- Invoked by users/clients, not by Claude
- Structure Claude's approach to a task without requiring the user to know how to prompt effectively

## MCP vs Direct Claude API Tools

A common exam question: what's the difference between defining a tool directly in the Claude API tools array vs exposing a tool through MCP?

| Aspect | Direct API Tool | MCP Tool |
|---|---|---|
| Where defined | In your API call | In an MCP server |
| Discovery | Static — you define what Claude gets | Dynamic — Claude/client discovers what's available |
| Reusability | One application | Any MCP-compatible client |
| Transport | In-process | Separate process (stdio, SSE) |
| Best for | Application-specific operations | Shared enterprise tools |

## Key Takeaways

1. **Tools**: callable functions that do things — can have side effects
2. **Resources**: read-only data sources with URIs — represent persistent data
3. **Prompts**: reusable workflow templates — invoked by users, not Claude
4. **Use the right primitive**: read-only data → Resource, action/dynamic → Tool, workflow → Prompt
5. **All three are exposed by MCP servers** and discovered by MCP clients
