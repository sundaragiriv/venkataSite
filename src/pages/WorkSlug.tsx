import { useParams } from "react-router-dom";
import { Tabs } from "../components/Tabs";
import Diagram from "../components/Diagram";

// Mock data - in real app, load from MDX files
const mockProject = {
  title: "Sales Cloud V2 + CPQ Modernization",
  client: "Concentric",
  year: 2025,
  role: "Solution & Integration Architect",
  tags: ["SAP CX", "Sales Cloud V2", "CPQ", "CPI"],
  metrics: [
    { label: "Quote cycle time", before: "5d", after: "2d" },
    { label: "Pricing errors", before: "8.2%", after: "1.4%" }
  ],
  diagram: {
    kind: "reactflow",
    data: {
      nodes: [
        { id: '1', position: { x: 0, y: 0 }, data: { label: 'Sales Cloud V2' } },
        { id: '2', position: { x: 200, y: 0 }, data: { label: 'CPQ Engine' } },
        { id: '3', position: { x: 100, y: 100 }, data: { label: 'CPI Integration' } }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e1-3', source: '1', target: '3' }
      ]
    }
  },
  evidence: [
    { type: "image", src: "/assets/cpq-screenshot.png", caption: "Guided configuration" },
    { type: "doc", href: "https://example.com", label: "KPI baseline" }
  ],
  content: "Legacy CPQ rules slowed down quoting processes and introduced pricing errors..."
};

export default function WorkSlug() {
  const { slug } = useParams();

  const tabs = [
    {
      key: "story",
      label: "Story",
      node: (
        <div className="prose max-w-none">
          <h2>{mockProject.title}</h2>
          <div className="flex gap-4 text-sm text-slate-600 mb-4">
            <span>Client: {mockProject.client}</span>
            <span>Year: {mockProject.year}</span>
            <span>Role: {mockProject.role}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {mockProject.metrics.map((metric, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded">
                <div className="font-medium">{metric.label}</div>
                <div className="text-sm text-slate-600">
                  {metric.before} → <span className="text-brand font-medium">{metric.after}</span>
                </div>
              </div>
            ))}
          </div>
          <p>{mockProject.content}</p>
        </div>
      )
    },
    {
      key: "diagram",
      label: "Diagram",
      node: <Diagram data={mockProject.diagram.data} />
    },
    {
      key: "evidence",
      label: "Evidence",
      node: (
        <div className="space-y-4">
          {mockProject.evidence.map((item, i) => (
            <div key={i} className="border border-slate-200 rounded p-3">
              {item.type === "image" ? (
                <div>
                  <img src={item.src} alt={item.caption} className="w-full rounded" />
                  <p className="text-sm text-slate-600 mt-2">{item.caption}</p>
                </div>
              ) : (
                <a href={item.href} className="text-brand hover:text-brand-light">
                  {item.label} →
                </a>
              )}
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="container max-w-wrap py-8">
      <Tabs tabs={tabs} />
    </div>
  );
}