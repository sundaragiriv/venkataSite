import { useState, useEffect } from "react";
import FadeIn from "../components/FadeIn";
import SoftGradient from "../components/SoftGradient";
import ResumeRequestModal from "../components/ResumeRequestModal";
import SEO from "../components/SEO";

const VIEWS = ["Exec","Architect","Practitioner"] as const;

export default function About() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Exec");
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Enable download if previously approved
    if (localStorage.getItem('resume-ok')) {
      const dl = document.getElementById("resume-direct-link");
      if (dl) dl.removeAttribute("aria-disabled");
    }
  }, []);

  return (
    <>
      <SEO 
        title="About Venkata - SAP Architect & AI Pioneer"
        description="22+ years architecting SAP solutions and AI-powered customer experiences. Executive summary, expertise, and Vedic principles."
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Venkata Sundaragiri",
          "jobTitle": "SAP CX + AI Architect",
          "worksFor": {
            "@type": "Organization",
            "name": "Argano"
          },
          "url": "https://sundaragiriv.github.io/venkataSite",
          "sameAs": [
            "https://linkedin.com/in/venkata-girivasan"
          ]
        })}
      </script>
      <section className="relative container max-w-wrap py-12">
        <SoftGradient />

      <FadeIn>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">About Venkata</h1>
          <div className="text-lg text-brand font-medium mb-6">
            SAP Architect • AI Pioneer • Joule Integrator
          </div>
          <p className="max-w-4xl mx-auto text-slate-600 leading-relaxed">
            22+ years delivering large-scale SAP and AI transformations across Utilities, High Tech, Manufacturing, CPG and Retail. I design outcome-driven architectures that fuse S/4HANA core processes with next-gen CX and AI — from Quote-to-Cash and Field Service to real-time personalization and predictive maintenance. My work focuses on measurable business outcomes: faster time-to-value, higher automation, fewer exceptions, and resilient, cloud-ready platforms that scale.
          </p>
        </div>
        
        {/* Credibility Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-4 rounded-lg bg-slate-50">
            <div className="font-semibold text-brand-600">23+ Years</div>
            <div className="text-sm text-slate-600">Enterprise SAP & CX leadership</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50">
            <div className="font-semibold text-brand-600">35+ Projects</div>
            <div className="text-sm text-slate-600">Global programs & integrations</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50">
            <div className="font-semibold text-brand-600">6+ Global Rollouts</div>
            <div className="text-sm text-slate-600">Zero major downtime</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50">
            <div className="font-semibold text-brand-600">40+ Clients</div>
            <div className="text-sm text-slate-600">Measurable improvements</div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold">Core Expertise</h2>
          <div className="flex gap-2">
            {VIEWS.map(v => (
              <button key={v} onClick={()=>setView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm border ${v===view ? "bg-brand text-white border-brand" : "border-black/10 text-slate-700 hover:bg-black/5"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* EXEC VIEW — metrics + narrative */}
      {view==="Exec" && (
        <>
          <FadeIn><Stats /></FadeIn>
          <FadeIn>
            <Section title="Executive Summary">
              <ul className="grid gap-3 text-slate-700">
                <li>Enterprise CX programs across Sales Cloud V2, Service Cloud V2, CPQ, FSM, CDC/CDP.</li>
                <li>Governed data + telemetry: KPIs wired from day one, not slideware.</li>
                <li>AI responsibly: retrieval over hallucination, policy guards, and eval loops.</li>
              </ul>
            </Section>
          </FadeIn>
        </>
      )}

      {/* ARCHITECT VIEW — detailed expertise tiles */}
      {view==="Architect" && (
        <>
          <FadeIn>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ExpertiseTile 
                title="SAP S/4HANA (Cloud & On-Prem)" 
                description="Program architecture, Selective Data Transition, and greenfield/brownfield delivery."
                isHighlight={true}
              />
              <ExpertiseTile 
                title="Sales & Service Cloud (V2)" 
                description="Modern sales/service processes with persona-driven journeys and SLA automation."
              />
              <ExpertiseTile 
                title="SAP CPQ & Quote-to-Cash" 
                description="End-to-end quoting, pricing engine integration, and 60% faster quote throughput."
                isHighlight={true}
              />
              <ExpertiseTile 
                title="Field Service Management (FSM)" 
                description="Predictive dispatch, appointment optimization, and first-time-fix improvements."
              />
              <ExpertiseTile 
                title="Commerce Cloud & CDC/CDP" 
                description="Personalization pipelines, customer data unification, and commerce personalization."
              />
              <ExpertiseTile 
                title="SAP BTP & Integration (CPI)" 
                description="Hybrid architectures, secure event streams and middleware patterns for scale."
              />
              <ExpertiseTile 
                title="AI in CX (Joule | Inference Patterns)" 
                description="Real-time recommendations, Joule adapters, and ML operationalization for CX."
                isHighlight={true}
              />
              <ExpertiseTile 
                title="Machine Learning & MLOps" 
                description="Production ML pipelines, model monitoring, and reproducible experiments."
              />
              <ExpertiseTile 
                title="CX Analytics & Insights" 
                description="Behavioral analytics, KPI dashboards, and outcome-driven experimentation."
              />
              <ExpertiseTile 
                title="SAP Commerce / Experience Optimization" 
                description="A/B experiments, offers engine, and conversion lift playbooks."
              />
              <ExpertiseTile 
                title="Enterprise Architecture & Cloud Strategy" 
                description="Multi-cloud resiliency, cost optimization and long-term roadmaps."
              />
              <ExpertiseTile 
                title="Integration & Automation (RPA / API)" 
                description="Event-driven design, process automation and low-latency integrations."
              />
              <ExpertiseTile 
                title="Vedic Leadership & Team Practices" 
                description="Conscious leadership routines, team coherence practices, and sustainable performance."
              />
              <ExpertiseTile 
                title="Delivery & Governance" 
                description="Program P&L, stakeholder governance, release management and quality gates."
              />
            </div>
            
            {/* Selected Impact */}
            <div className="mt-8 p-6 rounded-2xl border border-black/10 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="font-semibold text-slate-900 mb-2">Selected Impact</h3>
              <p className="text-slate-700">
                Led an S/4HANA + CPQ integration that cut quote-to-order time by 60%, reduced configuration errors by 90%, and accelerated sales onboarding by 3 weeks.
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href="/assets/blueprints/venkata-blueprint.pdf" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand-light transition-colors"
                title="One-page blueprint: architecture, integrations, and quick wins."
                data-analytics="download:venkata-blueprint"
              >
                Download one-page Blueprint (PDF)
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-brand text-brand font-medium hover:bg-brand/5 transition-colors"
                title="30 minutes: technical roadmap, timeline, and measurable KPIs."
              >
                Book a 30-min Strategy Call
              </a>
            </div>
          </FadeIn>
          <FadeIn>
            <Section title="Career Snapshot">
              <Timeline />
            </Section>
          </FadeIn>
        </>
      )}

      {/* PRACTITIONER VIEW — values + link to Vedic Studio */}
      {view==="Practitioner" && (
        <>
          <FadeIn>
            <Section title="Principles">
              <ul className="grid gap-3 text-slate-700">
                <li><strong>Ahimsa:</strong> psychological safety enables honest telemetry and better systems.</li>
                <li><strong>Samyama:</strong> focused attention → clearer diagnostics → cleaner designs.</li>
                <li><strong>Ritam:</strong> alignment with reality; measure what matters and adjust.</li>
              </ul>
            </Section>
          </FadeIn>
          <FadeIn>
            <div className="rounded-2xl border border-black/10 p-6 bg-white shadow-soft">
              Explore <a href="/veda" className="link-accent underline">Dharmic Wisdom</a> for Shruti (verse+audio) and Vichāra (essay) entries.
            </div>
          </FadeIn>
        </>
      )}

      {/* CTA row */}
      <FadeIn>
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-black/10 pt-6">
          <button onClick={()=>setOpen(true)} className="btn-gradient text-white px-6 py-3 rounded-xl font-medium">
            Request résumé & download
          </button>
          <a id="resume-direct-link" aria-disabled className="btn-soft px-6 py-3 rounded-xl font-medium text-slate-700"
             href="/assets/resume.pdf" download>
            Download PDF
          </a>
          <span className="text-slate-500 text-sm">Contact: <a href="/contact" className="link-accent underline">Let's talk</a></span>
        </div>
      </FadeIn>

      <ResumeRequestModal
        open={open}
        onClose={()=>setOpen(false)}
        resumeHref="/assets/resume.pdf"
        emailTo="venkatagirivasan@gmail.com"
      />
      </section>
    </>
  );
}

/* --- Small building blocks --- */

function ExpertiseTile({ title, description, isHighlight = false }: { 
  title: string; 
  description: string; 
  isHighlight?: boolean;
}) {
  return (
    <div 
      className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer group ${
        isHighlight 
          ? 'border-l-4 border-l-accent-turmeric bg-white' 
          : 'border-black/10 bg-slate-50 hover:bg-white'
      }`}
      role="button"
      aria-label={`${title} — ${description}`}
      title={description}
    >
      <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        {description}
      </p>
      {isHighlight && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-turmeric/10 text-accent-turmeric">
            Top Expertise
          </span>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }:{ title:string; children:React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Pill({ children }:{children:React.ReactNode}) {
  return <span className="inline-block rounded-full bg-brand/10 text-brand px-3 py-1 text-sm">{children}</span>;
}

function Stats() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Stat k="Programs led" v="40+" />
      <Stat k="Cycle time ↓" v="60%" />
      <Stat k="Integrations shipped" v="100+" />
      <Stat k="Revenue impact" v="$50M+" />
      <Stat k="Team members guided" v="200+" />
      <Stat k="Fortune 500 clients" v="15+" />
      <Stat k="Years experience" v="22+" />
      <Stat k="AI models deployed" v="25+" />
    </div>
  );
}

function Stat({k,v}:{k:string;v:string}) {
  return (
    <div className="rounded-2xl bg-white border border-black/10 p-6 shadow-soft">
      <div className="text-xs text-slate-500">{k}</div>
      <div className="text-2xl font-semibold text-slate-900">{v}</div>
    </div>
  );
}

function Timeline() {
  const items = [
    { t:"2025—Now", h:"SAP CX + AI Architect", d:"Argano · Sales/Service V2, CPQ, FSM, CPI/BTP, AI patterns" },
    { t:"2019—2022", h:"Director · SAP CX", d:"TA Digital · led practice, multi-cloud integrations" },
    { t:"Prior", h:"Solution/Integration Roles", d:"ERP, S/4HANA (LE/SD/MM), CX suite, MACH, data" }
  ];
  return (
    <ol className="relative border-s border-black/10 pl-6">
      {items.map((it,i)=>(
        <li key={i} className="mb-6">
          <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-brand" />
          <div className="text-sm text-slate-500">{it.t}</div>
          <div className="font-medium text-slate-900">{it.h}</div>
          <div className="text-slate-700">{it.d}</div>
        </li>
      ))}
    </ol>
  );
}