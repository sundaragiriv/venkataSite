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
          "name": "Venkata Girivasan",
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
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">About Venkata</h1>
          <div className="flex gap-2">
            {VIEWS.map(v => (
              <button key={v} onClick={()=>setView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm border ${v===view ? "bg-brand text-white border-brand" : "border-black/10 text-slate-700 hover:bg-black/5"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 max-w-prose text-slate-600">
          22+ years architecting SAP solutions and AI-powered customer experiences. I design
          <strong> clear blueprints</strong>, lead <strong>measurable programs</strong>, and translate <strong>Vedic wisdom</strong> into modern team practice.
        </p>
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

      {/* ARCHITECT VIEW — expertise grid + timeline */}
      {view==="Architect" && (
        <>
          <FadeIn>
            <Section title="Expertise">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-slate-700">
                <Pill>Sales/Service Cloud V2</Pill>
                <Pill>CPQ · pricing governance</Pill>
                <Pill>FSM · mobile & scheduling</Pill>
                <Pill>CPI/BTP integrations</Pill>
                <Pill>CDC/CDP identity & segmentation</Pill>
                <Pill>AI patterns: RAG, policy guards</Pill>
                <Pill>Telemetry & A/B for CX</Pill>
                <Pill>Event-driven architectures</Pill>
              </div>
            </Section>
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
              Explore <a href="/veda" className="link-accent underline">Vedic Studio</a> for Shruti (verse+audio) and Vichāra (essay) entries.
            </div>
          </FadeIn>
        </>
      )}

      {/* CTA row */}
      <FadeIn>
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-black/10 pt-6">
          <button onClick={()=>setOpen(true)} className="btn-accent px-4 py-2 rounded-lg shadow-soft hover:brightness-110">
            Request résumé & download
          </button>
          <a id="resume-direct-link" aria-disabled className="px-4 py-2 rounded-lg border border-black/10 text-slate-700 hover:bg-black/5"
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
    <div className="mt-6 grid gap-6 md:grid-cols-3">
      <Stat k="Programs led" v="40+" />
      <Stat k="Cycle time ↓" v="60%" />
      <Stat k="Integrations shipped" v="100+" />
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