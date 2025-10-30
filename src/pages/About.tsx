import { useState } from "react";
import { Link } from "react-router-dom";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";

const VIEWS = ["Resume", "Exec", "Architect", "Practitioner"] as const;

export default function About() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Resume");

  const stats = [
    { k: "Programs led", v: "40+" },
    { k: "Cycle time ↓", v: "60%" },
    { k: "Integrations shipped", v: "100+" },
    { k: "Revenue impact", v: "$50M+" },
    { k: "Team members guided", v: "200+" },
    { k: "Fortune 500 clients", v: "15+" },
    { k: "Years experience", v: "22+" },
    { k: "AI models deployed", v: "25+" }
  ];

  const expertiseTiles = [
    { title: "SAP S/4HANA (Cloud & On-Prem)", description: "Program architecture, Selective Data Transition, and greenfield/brownfield delivery.", isHighlight: true },
    { title: "Sales & Service Cloud (V2)", description: "Modern sales/service processes with persona-driven journeys and SLA automation." },
    { title: "SAP CPQ & Quote-to-Cash", description: "End-to-end quoting, pricing engine integration, and 60% faster quote throughput.", isHighlight: true },
    { title: "Field Service Management (FSM)", description: "Predictive dispatch, appointment optimization, and first-time-fix improvements." },
    { title: "Commerce Cloud & CDC/CDP", description: "Personalization pipelines, customer data unification, and commerce personalization." },
    { title: "SAP BTP & Integration (CPI)", description: "Hybrid architectures, secure event streams and middleware patterns for scale." },
    { title: "AI in CX (Joule | Inference Patterns)", description: "Real-time recommendations, Joule adapters, and ML operationalization for CX.", isHighlight: true },
    { title: "Machine Learning & MLOps", description: "Production ML pipelines, model monitoring, and reproducible experiments." },
    { title: "CX Analytics & Insights", description: "Behavioral analytics, KPI dashboards, and outcome-driven experimentation." },
    { title: "SAP Commerce / Experience Optimization", description: "A/B experiments, offers engine, and conversion lift playbooks." },
    { title: "Enterprise Architecture & Cloud Strategy", description: "Multi-cloud resiliency, cost optimization and long-term roadmaps." },
    { title: "Integration & Automation (RPA / API)", description: "Event-driven design, process automation and low-latency integrations." },
    { title: "Vedic Leadership & Team Practices", description: "Conscious leadership routines, team coherence practices, and sustainable performance." },
    { title: "Delivery & Governance", description: "Program P&L, stakeholder governance, release management and quality gates." }
  ];

  const timeline = [
    { t: "2025—Now", h: "SAP CX + AI Architect", d: "Argano · Sales/Service V2, CPQ, FSM, CPI/BTP, AI patterns" },
    { t: "2019—2022", h: "Director · SAP CX", d: "TA Digital · led practice, multi-cloud integrations" },
    { t: "Prior", h: "Solution/Integration Roles", d: "ERP, S/4HANA (LE/SD/MM), CX suite, MACH, data" }
  ];

  return (
    <section className="container max-w-wrap py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">About Me</h1>
      <p className="mt-2 text-slate-600 max-w-prose">
        22+ years delivering large-scale SAP and AI transformations across Utilities, High Tech, Manufacturing, CPG and Retail. 
        I design outcome-driven architectures that fuse S/4HANA core processes with next-gen CX and AI.
      </p>

      {/* View Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {VIEWS.map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              v === view 
                ? "bg-blue-600 text-white shadow-md" 
                : "border border-black/10 text-slate-700 hover:bg-yellow-50 hover:border-yellow-300"
            }`}>
            {v}
          </button>
        ))}
      </div>

      {/* Resume View */}
      {view === "Resume" && (
        <div className="mt-8">
          <FadeIn>
            <MotionCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Professional Resume</h3>
                <a href="/contact" 
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Request Resume
                </a>
              </div>
              <div className="space-y-4 text-slate-700">
                <p><strong>SAP Senior Consultant & CX Architect</strong> with 23+ years of extensive leadership across global SAP implementations and transformations.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Core Expertise</h4>
                    <ul className="text-sm space-y-1">
                      <li>• SAP CX Cloud (Sales & Service V2, C4C)</li>
                      <li>• SAP S/4HANA (OTC, SD, MM, Service)</li>
                      <li>• SAP CPQ & Field Service Management</li>
                      <li>• Commerce Cloud & Customer Data Platform</li>
                      <li>• SAP Emarsys & Marketing Automation</li>
                      <li>• BTP Integration & CPI Architecture</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Achievements</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Unified 18M customer records (42% duplicate reduction)</li>
                      <li>• 55% increase in personalized campaign revenue</li>
                      <li>• Led teams of 40+ consultants across 270-member org</li>
                      <li>• $2M cost / $8M revenue P&L management</li>
                      <li>• Fortune 500 clients: Apple, Puma, Weyerhaeuser</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Current Role</h4>
                  <p className="text-sm"><strong>Sr. SAP Emarsys Consultant / CX Solution Architect</strong> at Argano (Jan 2025—Present)<br/>
                  Leading PUMA's digital engagement transformation with Emarsys + CDP integration, AI-driven personalization, and omnichannel automation.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Leadership Experience</h4>
                  <p className="text-sm"><strong>Director - SAP Practice</strong> at TA Digital (2019-2022)<br/>
                  Led SAP Practice with P&L accountability, delivered CX transformations for Fortune 500 clients including Apple, ACN, Bose. Built teams of 40+ consultants within 270-member delivery organization.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Notable Clients</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span>• PUMA North America</span>
                    <span>• Apple Inc.</span>
                    <span>• Weyerhaeuser Inc.</span>
                    <span>• LB Foster Company</span>
                    <span>• Lenovo Group</span>
                    <span>• Honeywell International</span>
                    <span>• Carestream Health</span>
                    <span>• Pearson Education</span>
                  </div>
                </div>
              </div>
            </MotionCard>
          </FadeIn>
        </div>
      )}

      {/* Exec View */}
      {view === "Exec" && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <FadeIn key={idx}>
              <MotionCard className="p-6 text-center hover:bg-yellow-50 hover:border-yellow-300 transition-all">
                <div className="text-xl font-bold text-blue-600">{stat.v}</div>
                <div className="text-xs text-slate-600 font-medium">{stat.k}</div>
              </MotionCard>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Architect View */}
      {view === "Architect" && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expertiseTiles.map((tile, idx) => (
            <FadeIn key={idx}>
              <MotionCard className={`p-6 h-full ${
                tile.isHighlight 
                  ? 'border-l-4 border-l-yellow-500 bg-yellow-50' 
                  : 'hover:bg-yellow-50 hover:border-yellow-300'
              } transition-all`}>
                <h3 className="font-medium text-slate-900 mb-2">{tile.title}</h3>
                <p className="text-sm text-slate-600">{tile.description}</p>
                {tile.isHighlight && (
                  <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Top Expertise
                  </span>
                )}
              </MotionCard>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Practitioner View */}
      {view === "Practitioner" && (
        <div className="mt-8 space-y-6">
          <FadeIn>
            <MotionCard className="p-6">
              <h3 className="text-lg font-bold mb-4">Principles</h3>
              <ul className="space-y-3 text-slate-700">
                <li><strong>Ahimsa:</strong> psychological safety enables honest telemetry and better systems.</li>
                <li><strong>Samyama:</strong> focused attention → clearer diagnostics → cleaner designs.</li>
                <li><strong>Ritam:</strong> alignment with reality; measure what matters and adjust.</li>
              </ul>
            </MotionCard>
          </FadeIn>
          
          <FadeIn>
            <MotionCard className="p-6 bg-yellow-50 border-yellow-200">
              <p>Explore <Link to="/veda" className="text-yellow-700 font-semibold underline hover:text-yellow-800">Vedic Wisdom</Link> for Shruti (verse+audio) and Vichāra (essay) entries.</p>
            </MotionCard>
          </FadeIn>


        </div>
      )}

      {/* Contact CTA */}
      <FadeIn>
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Enterprise?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Let's discuss how SAP architecture and AI can accelerate your digital transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:venkatagirivasan@gmail.com?subject=Strategy Call Request" 
               className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Schedule Strategy Call
            </a>
            <a href="https://www.linkedin.com/in/sundaragiri" target="_blank" rel="noopener noreferrer"
               className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}