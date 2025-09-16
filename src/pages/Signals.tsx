import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { signals } from "../lib/signals";

const TAGS = ["All", "Tech", "AI-in-SAP", "Vedic"] as const;

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

      <div className="mt-6 flex gap-2">
        {TAGS.map(t => (
          <button key={t}
            onClick={() => setTag(t)}
            className={`px-3 py-1.5 rounded-lg text-sm border ${t === tag ? "bg-brand text-white border-brand" : "border-black/10 text-slate-700 hover:bg-black/5"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map(p => (
          <Link key={p.slug} to={`/signals/${p.slug}`} className="group rounded-2xl bg-white border border-black/10 p-6 shadow-soft hover:shadow-lg transition">
            <div className="text-xs text-slate-500">{new Date(p.date).toLocaleDateString()}</div>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{p.title}</h3>
            <div className="mt-1 text-xs font-medium text-brand">{p.tag}</div>
            {p.summary && <p className="mt-2 text-sm text-slate-600">{p.summary}</p>}
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand">Read →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}