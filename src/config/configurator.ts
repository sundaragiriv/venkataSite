export type Choice<T extends string> = { key: T; label: string };
export type Selections = {
  industry: "Retail" | "Manufacturing" | "SaaS";
  scale: "Startup" | "Mid" | "Enterprise";
  channels: "Sales" | "Service" | "Both";
  latency: "Batch" | "Near-real-time";
  compliance: "Low" | "Moderate" | "Strict";
  ai: "Conservative" | "Pragmatic" | "Aggressive";
};

// Option lists for the UI
export const OPTIONS = {
  industry: [
    { key: "Retail", label: "Retail" },
    { key: "Manufacturing", label: "Manufacturing" },
    { key: "SaaS", label: "SaaS" },
  ] as Choice<Selections["industry"]>[],
  scale: [
    { key: "Startup", label: "Startup" },
    { key: "Mid", label: "Mid" },
    { key: "Enterprise", label: "Enterprise" },
  ] as Choice<Selections["scale"]>[],
  channels: [
    { key: "Sales", label: "Sales" },
    { key: "Service", label: "Service" },
    { key: "Both", label: "Both" },
  ] as Choice<Selections["channels"]>[],
  latency: [
    { key: "Batch", label: "Batch" },
    { key: "Near-real-time", label: "Near-real-time" },
  ] as Choice<Selections["latency"]>[],
  compliance: [
    { key: "Low", label: "Low" },
    { key: "Moderate", label: "Moderate" },
    { key: "Strict", label: "Strict" },
  ] as Choice<Selections["compliance"]>[],
  ai: [
    { key: "Conservative", label: "Conservative" },
    { key: "Pragmatic", label: "Pragmatic" },
    { key: "Aggressive", label: "Aggressive" },
  ] as Choice<Selections["ai"]>[],
};

export type Pattern = {
  id: string;
  title: string;
  summary: string[];
  diagram: { nodes: any[]; edges: any[] };
  plan90: { phase: string; items: string[] }[];
  kpis: { name: string; target: string }[];
};

export function matchPattern(s: Selections): string {
  if (s.channels === "Both" && s.latency === "Near-real-time" && s.ai !== "Conservative")
    return "cx_rasp_enterprise";
  if (s.channels === "Service" && s.scale !== "Startup") return "service_v2_modernization";
  if (s.channels === "Sales" && s.scale === "Startup") return "sales_v2_starter";
  return "cx_baseline";
}

export const PATTERNS: Record<string, Pattern> = {
  cx_rasp_enterprise: {
    id: "cx_rasp_enterprise",
    title: "RASP: Retrieval-Augmented SAP Processes (Enterprise)",
    summary: [
      "Inject governed SAP context into AI decisions across Sales/Service flows.",
      "Policy guards for actions (route, prioritize, propose) with eval & drift monitoring.",
    ],
    diagram: {
      nodes: [
        { id: "sap", position: { x: 50, y: 160 }, data: { label: "SAP Cloud (Sales/Service V2)" }, type: "input" },
        { id: "cdc", position: { x: 320, y: 40 }, data: { label: "CDC / Identity" } },
        { id: "cdp", position: { x: 320, y: 160 }, data: { label: "CDP / Segments" } },
        { id: "rag", position: { x: 320, y: 280 }, data: { label: "Retrieval Layer (Policies + Index)" } },
        { id: "agent", position: { x: 560, y: 160 }, data: { label: "AI Orchestrator (guarded)" }, type: "output" },
      ],
      edges: [
        { id: "e1", source: "sap", target: "cdc" },
        { id: "e2", source: "sap", target: "cdp" },
        { id: "e3", source: "sap", target: "rag" },
        { id: "e4", source: "rag", target: "agent" },
        { id: "e5", source: "cdc", target: "agent" },
        { id: "e6", source: "cdp", target: "agent" },
      ],
    },
    plan90: [
      { phase: "Weeks 0–2", items: ["KPI contracts", "Event catalog", "Golden paths (Sales/Service)"] },
      { phase: "Weeks 2–6", items: ["Policy schema + retrieval index", "Guardrails & eval harness"] },
      { phase: "Weeks 6–12", items: ["Pilot flows (2–3)", "Drift alerts + dashboards"] },
    ],
    kpis: [
      { name: "Case first-contact resolution", target: "+10–15%" },
      { name: "Quote cycle time", target: "−30–50%" },
      { name: "Model override rate", target: "< 5%" },
    ],
  },

  service_v2_modernization: {
    id: "service_v2_modernization",
    title: "Service Cloud V2 Modernization",
    summary: [
      "Action Profiles → modern flows with events & policies.",
      "Telemetry from SLAs; insights wired into backlogs.",
    ],
    diagram: {
      nodes: [
        { id: "legacy", position: { x: 50, y: 100 }, data: { label: "Legacy Service" }, type: "input" },
        { id: "v2", position: { x: 300, y: 100 }, data: { label: "Service Cloud V2" } },
        { id: "events", position: { x: 550, y: 50 }, data: { label: "Event Hub" } },
        { id: "sla", position: { x: 550, y: 150 }, data: { label: "SLA Monitor" }, type: "output" },
      ],
      edges: [
        { id: "e1", source: "legacy", target: "v2" },
        { id: "e2", source: "v2", target: "events" },
        { id: "e3", source: "v2", target: "sla" },
      ],
    },
    plan90: [
      { phase: "Weeks 0–2", items: ["SLA telemetry baseline", "Flow inventory"] },
      { phase: "Weeks 2–6", items: ["Event mapping", "Queue design & routing"] },
      { phase: "Weeks 6–12", items: ["Agent assist", "KPI review cadence"] },
    ],
    kpis: [
      { name: "SLA breach rate", target: "−25%" },
      { name: "Time to resolution", target: "−20–30%" },
    ],
  },

  sales_v2_starter: {
    id: "sales_v2_starter",
    title: "Sales Cloud V2 Starter (Lean)",
    summary: ["Stage-gated pipeline", "Email/calendar sync", "Governed pricing hooks for later"],
    diagram: {
      nodes: [
        { id: "leads", position: { x: 50, y: 100 }, data: { label: "Leads" }, type: "input" },
        { id: "sales", position: { x: 250, y: 100 }, data: { label: "Sales Cloud V2" } },
        { id: "pipeline", position: { x: 450, y: 50 }, data: { label: "Pipeline" } },
        { id: "quotes", position: { x: 450, y: 150 }, data: { label: "Quotes" }, type: "output" },
      ],
      edges: [
        { id: "e1", source: "leads", target: "sales" },
        { id: "e2", source: "sales", target: "pipeline" },
        { id: "e3", source: "sales", target: "quotes" },
      ],
    },
    plan90: [
      { phase: "Weeks 0–2", items: ["Stages & fields", "Integrations—light"] },
      { phase: "Weeks 2–6", items: ["Reporting", "Handoffs"] },
      { phase: "Weeks 6–12", items: ["Pilot CPQ hooks"] },
    ],
    kpis: [
      { name: "Time to first quote", target: "−30%" },
      { name: "Pipeline hygiene", target: "+20%" },
    ],
  },

  cx_baseline: {
    id: "cx_baseline",
    title: "CX Baseline Architecture",
    summary: ["Solid Sales or Service foundations", "Telemetry-first mindset"],
    diagram: {
      nodes: [
        { id: "crm", position: { x: 100, y: 100 }, data: { label: "CRM Core" }, type: "input" },
        { id: "data", position: { x: 300, y: 100 }, data: { label: "Data Layer" } },
        { id: "insights", position: { x: 500, y: 100 }, data: { label: "Insights" }, type: "output" },
      ],
      edges: [
        { id: "e1", source: "crm", target: "data" },
        { id: "e2", source: "data", target: "insights" },
      ],
    },
    plan90: [
      { phase: "Weeks 0–2", items: ["Discovery", "KPI contracts"] },
      { phase: "Weeks 2–6", items: ["MVP flows", "Data contracts"] },
      { phase: "Weeks 6–12", items: ["Harden", "Handover"] },
    ],
    kpis: [
      { name: "Adoption (DAU/WAU)", target: "↑ steady" },
      { name: "Cycle time", target: "↓ steady" },
    ],
  },
};