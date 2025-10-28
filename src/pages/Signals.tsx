import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";

const TAGS = ["All", "SAP-Architecture", "AI-in-SAP", "Vedic", "Tech"] as const;

export default function Signals() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("All");
  const list = useMemo(
    () => tag === "All" ? signals : signals.filter(p => p.tag === tag),
    [tag]
  );

  return (
    <section className="container max-w-wrap py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Signals</h1>
      <p className="mt-2 text-slate-600 max-w-prose">Short essays and field notes across Tech, AI-in-SAP, and Vedic wisdom.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {TAGS.map(t => (
          <button key={t}
            onClick={() => setTag(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              t === tag 
                ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-md" 
                : "border border-black/10 text-slate-700 hover:bg-slate-50 hover:border-brand/30"
            }`}>
            {t === "AI-in-SAP" ? "AI in SAP" : 
             t === "SAP-Architecture" ? "SAP Architecture" : 
             t}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map(p => (
          <FadeIn key={p.slug}>
            <MotionCard className="p-0">
              <Link to={`/signals/${p.slug}`} className="block p-6">
                <div className="text-xs text-slate-500">{fmt(p.date)}</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{p.title}</h3>
                <div className="mt-1 text-xs font-medium text-brand">{p.tag}</div>
                {p.summary && <p className="mt-2 text-sm text-slate-600">{p.summary}</p>}
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand">Read →</span>
              </Link>
            </MotionCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}