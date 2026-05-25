---
id: "d2-t2-3-transport-config"
title: "MCP Transport Mechanisms — stdio vs SSE"
domain: "d2"
taskRef: "T2.2"
order: 6
xp: 25
tag: "Core"
duration: "6 min"
analogy: "Phone call vs text message. A phone call (stdio) is direct, synchronous, and the connection stays open for the whole conversation. A text message (SSE) is asynchronous, event-based, and works across network boundaries. Different communication patterns for different contexts."
examTrap: "Assuming stdio transport is always local. stdio is a process communication mechanism — it requires the MCP server to be running on the same machine as the client. SSE (Server-Sent Events) is used for remote MCP servers accessible over HTTP."
keyPoints:
  - "stdio transport: MCP server runs as a subprocess of the client — communication via stdin/stdout. Local only. Simple. Used for local tools."
  - "SSE (Server-Sent Events) transport: MCP server runs as a remote HTTP server — communication over HTTP. Used for shared enterprise tools."
  - "stdio is simpler to implement and more secure (no network exposure). SSE enables shared access across teams and systems."
  - "The transport choice affects security model, deployment architecture, and latency characteristics."
  - "Most Claude Code integrations use stdio. Enterprise shared tools use SSE."
antiPatterns:
  - "Using stdio for tools that need to be shared across multiple clients or teams"
  - "Using SSE without authentication for enterprise tools with sensitive data access"
  - "Not considering latency when choosing SSE for high-frequency tool calls"
tbChallenge: "Your team wants to share an MCP server giving Claude access to your company's internal databases. Two developers on different laptops need to use it. Which transport do you use and why?"
---

## stdio Transport

```
Your Application
  └── spawns subprocess: python knowledge_base_mcp.py
        ↕ stdin/stdout communication
       MCP Server (local process)
          └── connects to internal database
```

```python
# Client connects to stdio server
from mcp import ClientSession, StdioServerParameters

params = StdioServerParameters(
    command=["python", "knowledge_base_mcp.py"],
    env={"DB_CONNECTION": "postgresql://localhost/kb"}
)

async with ClientSession.connect_stdio(params) as session:
    tools = await session.list_tools()
    result = await session.call_tool("search_articles", {"query": "refund policy"})
```

**When to use stdio:**
- Local development and testing
- Tools only used by one application instance
- Maximum security (no network exposure)
- Lowest latency (no HTTP overhead)

## SSE Transport

```
Developer A's App ─────────┐
                           ├──► Remote MCP Server (HTTP/SSE) ──► Shared Database
Developer B's App ─────────┘
```

```python
# Client connects to remote SSE server
from mcp import ClientSession

async with ClientSession.connect_sse(
    url="https://internal-mcp.company.com/sse",
    headers={"Authorization": f"Bearer {api_key}"}
) as session:
    tools = await session.list_tools()
    result = await session.call_tool("query_crm", {"customer_id": "C-123456"})
```

**When to use SSE:**
- Tools shared across multiple team members or applications
- MCP server needs to access resources not available locally
- Centralized access control and logging
- Tools that benefit from shared caching

## Authentication for SSE

SSE servers exposed to multiple clients need authentication:

```python
# SSE server with API key authentication
from mcp import Server
from fastapi import HTTPException, Header

server = Server("shared-tools")

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key not in VALID_API_KEYS:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

@server.tool("query_crm")
async def query_crm(customer_id: str, api_key: str = Depends(verify_api_key)) -> dict:
    return await crm_client.get_customer(customer_id)
```

## Key Takeaways

1. **stdio** = local subprocess, simple, no network, maximum security
2. **SSE** = remote HTTP, enables sharing, requires authentication
3. **stdio for single-app tools**, SSE for shared enterprise tools
4. **SSE requires auth** for production deployments
5. **Latency**: stdio is lower, SSE adds HTTP overhead
