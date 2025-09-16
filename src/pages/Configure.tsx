import { useMemo, useState } from "react";
import { OPTIONS, matchPattern, PATTERNS, type Selections } from "../config/configurator";
import ToggleGroup from "../components/ToggleGroup";
import Diagram from "../blocks/Diagram";
import { FadeIn } from "../components/FadeIn";

const DEFAULT: Selections = {
  industry: "SaaS", scale: "Mid", channels: "Both",
  latency: "Near-real-time", compliance: "Moderate", ai: "Pragmatic"
};

export default function Configure() {
  const [s, set] = useState<Selections>(DEFAULT);
  const pid = useMemo(() => matchPattern(s), [s]);
  const pattern = PATTERNS[pid];

  return (
    <section className="container max-w-wrap py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Outcome Configurator</h1>
      <p className="mt-2 text-slate-600 max-w-prose">
        Set constraints. See a target architecture, a 90-day plan, and KPIs. Change any toggle and the plan adapts.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <ToggleGroup label="Industry" value={s.industry} options={OPTIONS.industry} onChange={k => set({ ...s, industry: k as any })} />
        <ToggleGroup label="Scale" value={s.scale} options={OPTIONS.scale} onChange={k => set({ ...s, scale: k as any })} />
        <ToggleGroup label="Channels" value={s.channels} options={OPTIONS.channels} onChange={k => set({ ...s, channels: k as any })} />
        <ToggleGroup label="Data latency" value={s.latency} options={OPTIONS.latency} onChange={k => set({ ...s, latency: k as any })} />
        <ToggleGroup label="Compliance" value={s.compliance} options={OPTIONS.compliance} onChange={k => set({ ...s, compliance: k as any })} />
        <ToggleGroup label="AI appetite" value={s.ai} options={OPTIONS.ai} onChange={k => set({ ...s, ai: k as any })} />
      </div>

      <FadeIn className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">{pattern.title}</h2>
        <ul className="mt-3 grid gap-2 text-slate-700 list-disc pl-5">
          {pattern.summary.map((t, i) => (<li key={i}>{t}</li>))}
        </ul>
      </FadeIn>

      <FadeIn className="mt-6">
        <Diagram {...pattern.diagram} />
      </FadeIn>

      <FadeIn className="mt-8 grid gap-6 md:grid-cols-3">
        {pattern.plan90.map((p, i) => (
          <div key={i} className="rounded-2xl bg-white border border-black/10 p-6 shadow-soft">
            <div className="text-xs text-slate-500">{p.phase}</div>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
              {p.items.map((it, j) => (<li key={j}>{it}</li>))}
            </ul>
          </div>
        ))}
      </FadeIn>

      <FadeIn className="mt-6">
        <h3 className="text-lg font-semibold tracking-tight">KPIs</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {pattern.kpis.map((k, i) => (
            <div key={i} className="rounded-xl bg-white border border-black/10 p-4">
              <div className="text-xs text-slate-500">{k.name}</div>
              <div className="text-xl font-semibold text-slate-900">{k.target}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      <div className="mt-10 flex gap-2">
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify({ selections: s, recommendation: pattern }, null, 2))}
          className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5">
          Copy recommendation JSON
        </button>
        <a href="/work" className="btn-accent px-4 py-2 rounded-lg shadow-soft">See related case studies</a>
      </div>
    </section>
  );
}