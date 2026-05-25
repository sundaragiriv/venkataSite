---
id: "d2-t2-2-server-client"
title: "MCP Server and Client Architecture"
domain: "d2"
taskRef: "T2.2"
order: 5
xp: 30
tag: "Core"
duration: "8 min"
analogy: "A restaurant and a customer. The MCP server is the kitchen — it has the tools, resources, and recipes. The MCP client is the waiter who carries requests from the dining room (Claude) to the kitchen and brings results back. Claude is the diner who decides what to order."
examTrap: "Thinking Claude IS the MCP client. Claude is the AI that uses tools. The MCP client is the software layer that manages the MCP protocol connection between Claude and the MCP server. These are distinct components."
keyPoints:
  - "MCP server: exposes tools, resources, and prompts — implemented by you, runs as a separate process."
  - "MCP client: manages the connection protocol between Claude and MCP servers — part of your application layer."
  - "Claude: the AI model that uses what MCP servers expose — it doesn't know about MCP directly."
  - "One application can connect to multiple MCP servers simultaneously — Claude sees all available tools from all connected servers."
  - "MCP servers should be stateless where possible — state management belongs in your application layer, not the server."
antiPatterns:
  - "Building stateful MCP servers when the state could live in the client application"
  - "One massive MCP server exposing hundreds of tools — split by domain"
  - "MCP server doing too much business logic — it should be a thin adapter to your existing services"
  - "Not considering authentication between MCP client and server in production deployments"
tbChallenge: "Draw the component diagram for an enterprise system where Claude needs access to: Salesforce CRM, internal knowledge base, and a ticket system. Show where MCP servers live, what the client layer looks like, and how Claude interacts with all three."
---

## The Architecture

```
┌─────────────────────────────────────────────────┐
│                  Your Application               │
│                                                 │
│  ┌─────────────┐    ┌──────────────────────┐    │
│  │    Claude   │◄──►│    MCP Client Layer  │    │
│  │  (via API)  │    │  (connection mgmt)   │    │
│  └─────────────┘    └──────────┬───────────┘    │
│                                │                │
└────────────────────────────────┼────────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │   Salesforce    │  │  Knowledge Base │  │  Ticket System  │
  │   MCP Server    │  │   MCP Server    │  │   MCP Server    │
  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
           │                    │                     │
           ▼                    ▼                     ▼
     Salesforce API       Internal DB           Jira/ServiceNow
```

## The MCP Server

The server is a separate process that exposes your tools, resources, and prompts via the MCP protocol.

```python
# Python MCP server implementation
from mcp import Server, Tool, Resource

server = Server("salesforce-mcp")

@server.tool("get_opportunity")
async def get_opportunity(opportunity_id: str) -> dict:
    """Retrieves a Salesforce opportunity by ID."""
    return await salesforce_client.get_opportunity(opportunity_id)

@server.tool("update_opportunity_stage")
async def update_opportunity_stage(opportunity_id: str, stage: str) -> dict:
    """Updates the stage of a Salesforce opportunity."""
    valid_stages = ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
    if stage not in valid_stages:
        raise ValueError(f"Invalid stage. Must be one of: {valid_stages}")
    return await salesforce_client.update_stage(opportunity_id, stage)

@server.resource("salesforce://pipeline-summary")
async def get_pipeline_summary() -> Resource:
    """Read-only summary of current pipeline state."""
    summary = await salesforce_client.get_pipeline_summary()
    return Resource(
        uri="salesforce://pipeline-summary",
        mimeType="application/json",
        text=json.dumps(summary)
    )

# Run the server
if __name__ == "__main__":
    import asyncio
    asyncio.run(server.run_stdio())  # stdio transport
```

## The MCP Client Layer

The client layer in your application manages connections to multiple MCP servers:

```python
from mcp import ClientSession, StdioServerParameters

class MCPClientManager:
    def __init__(self):
        self.sessions = {}

    async def connect_server(self, name: str, command: list[str], env: dict = None):
        """Connect to an MCP server via stdio transport."""
        params = StdioServerParameters(command=command, env=env)
        session = await ClientSession.connect_stdio(params)
        self.sessions[name] = session

        # Discover available tools from this server
        tools = await session.list_tools()
        resources = await session.list_resources()
        prompts = await session.list_prompts()

        return {"tools": tools, "resources": resources, "prompts": prompts}

    async def call_tool(self, server_name: str, tool_name: str, arguments: dict) -> any:
        """Call a tool on a specific server."""
        session = self.sessions[server_name]
        return await session.call_tool(tool_name, arguments)

    async def get_all_tools(self) -> list:
        """Aggregate tools from all connected servers for Claude."""
        all_tools = []
        for name, session in self.sessions.items():
            server_tools = await session.list_tools()
            all_tools.extend(server_tools)
        return all_tools

# Setup
manager = MCPClientManager()
await manager.connect_server("salesforce", ["python", "salesforce_mcp.py"])
await manager.connect_server("knowledge-base", ["python", "kb_mcp.py"])
await manager.connect_server("tickets", ["node", "ticket_mcp.js"])

# Claude gets aggregated tools from all servers
all_tools = await manager.get_all_tools()
```

## Stateless Server Design

MCP servers should be thin adapters — business logic and state belong in your application:

```python
# ❌ Stateful server — problematic
class StatefulMCPServer:
    def __init__(self):
        self.current_customer = None  # State in server!
        self.cart = []

    @tool("add_to_cart")
    def add_to_cart(self, item_id: str):
        self.cart.append(item_id)  # Server state

# ✅ Stateless server — passes state in each call
class StatelessMCPServer:
    @tool("add_to_cart")
    async def add_to_cart(self, session_id: str, item_id: str) -> dict:
        # State lives in the calling application, passed in each call
        cart = await cart_service.get_cart(session_id)
        cart.add(item_id)
        await cart_service.save_cart(session_id, cart)
        return {"cart_size": len(cart)}
```

## Key Takeaways

1. **Three components**: MCP server (exposes tools), MCP client (manages connections), Claude (uses tools)
2. **Claude is NOT the MCP client** — the client is your application layer
3. **Multiple servers** can be connected simultaneously — Claude sees aggregated tools
4. **Servers should be stateless** — thin adapters to existing services
5. **Split servers by domain** — one per capability area, not one massive server
