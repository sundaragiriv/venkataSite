import { useState } from "react";

const VIEWS = ["Exec", "Architect", "Practitioner"] as const;

export default function About() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Exec");

  return (
    <section className="container max-w-wrap py-12">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">About Venkata</h1>
        <div className="flex gap-2">
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${v === view ? "bg-brand text-white border-brand" : "border-black/10 text-slate-700 hover:bg-black/5"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Exec view: outcomes */}
      {view === "Exec" && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Stat k="Programs led" v="40+" />
          <Stat k="Cycle time ↓" v="60%" />
          <Stat k="Integrations shipped" v="100+" />
        </div>
      )}

      {/* Architect view: skills map snapshot */}
      {view === "Architect" && (
        <ul className="mt-6 grid gap-3 md:grid-cols-2 text-slate-700">
          <li>Sales/Service Cloud V2 · CPQ · FSM · CDC/CDP</li>
          <li>S/4HANA integration (CPI/BTP) · Events & APIs</li>
          <li>AI patterns: RAG, policy guards, eval & drift</li>
          <li>Data: segmentation, telemetry, KPI contracts</li>
        </ul>
      )}

      {/* Practitioner view: values + Vedic link */}
      {view === "Practitioner" && (
        <div className="mt-6 max-w-prose text-slate-700">
          <p>I practice and teach principles from Maharishi Ayurveda and Vedic literature, applying ancient wisdom to modern technology challenges and team dynamics.</p>
          <p className="mt-3">Read <a href="/veda" className="text-brand underline">Vedic Studio</a> for Shruti & Vichāra articles.</p>
        </div>
      )}

      <div className="mt-10 border-t border-black/10 pt-6 text-slate-600">
        <p>Download résumé (<a href="/assets/resume.pdf" className="text-brand underline">PDF</a>) · Contact: <a href="/contact" className="text-brand underline">Let's talk</a></p>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-white border border-black/10 p-6 shadow-soft">
      <div className="text-xs text-slate-500">{k}</div>
      <div className="text-2xl font-semibold text-slate-900">{v}</div>
    </div>
  );
}