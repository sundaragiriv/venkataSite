import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";

const PRIMARY_CATEGORIES = ["All", "AI-ML", "SAP", "Dharma"] as const;

const SECONDARY_TAGS = {
  "SAP": ["CX", "S4HANA", "FSM", "CPQ", "Integration"],
  "AI-ML": ["Joule", "MLOps", "Recommendations", "Analytics"],
  "Dharma": ["Veda", "Practice", "Reflections", "Rituals"]
} as const;

export default function Signals() {
  const [selectedPrimary, setSelectedPrimary] = useState<(typeof PRIMARY_CATEGORIES)[number]>("All");
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([]);
  
  const list = useMemo(() => {
    if (selectedPrimary === "All") return signals;
    
    let filtered = signals.filter(p => p.primary === selectedPrimary);
    
    if (selectedSecondary.length > 0) {
      filtered = filtered.filter(p => 
        p.secondary && p.secondary.some(tag => selectedSecondary.includes(tag))
      );
    }
    
    return filtered;
  }, [selectedPrimary, selectedSecondary]);

  const handlePrimarySelect = (primary: (typeof PRIMARY_CATEGORIES)[number]) => {
    setSelectedPrimary(primary);
    setSelectedSecondary([]); // Reset secondary when primary changes
  };

  const handleSecondaryToggle = (tag: string) => {
    setSelectedSecondary(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <section className="container max-w-wrap py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Signals</h1>
      <p className="mt-2 text-slate-600 max-w-prose">
        Short, timely micro-updates and insights: quick wins, results from experiments, project "mini-findings," and pointers to new long-form assets.
      </p>

      {/* Primary Category Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PRIMARY_CATEGORIES.map(primary => (
          <button key={primary}
            onClick={() => handlePrimarySelect(primary)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              primary === selectedPrimary 
                ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-md" 
                : "border border-black/10 text-slate-700 hover:bg-slate-50 hover:border-brand/30"
            }`}>
            {primary === "All" ? "All" :
             primary === "AI-ML" ? "AI/ML" :
             primary === "SAP" ? "SAP" :
             primary === "Dharma" ? "Dharma" : primary}
          </button>
        ))}
      </div>

      {/* Secondary Tag Filters (show when primary category is selected) */}
      {selectedPrimary !== "All" && SECONDARY_TAGS[selectedPrimary] && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SECONDARY_TAGS[selectedPrimary].map(tag => (
            <button key={tag}
              onClick={() => handleSecondaryToggle(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSecondary.includes(tag)
                  ? "bg-gradient-to-r from-accent-turmeric/20 to-accent-turmeric/30 text-accent-turmeric border border-accent-turmeric/30"
                  : "border border-black/5 text-slate-600 hover:bg-slate-50"
              }`}>
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map(p => (
          <FadeIn key={p.slug}>
            <MotionCard className="p-0">
              <Link to={`/signals/${p.slug}`} className="block p-6">
                <div className="text-xs text-slate-500">{fmt(p.date)}</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{p.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="font-medium text-brand">
                    {p.primary === "AI-ML" ? "AI/ML" :
                     p.primary === "SAP" ? "SAP" :
                     p.primary === "Dharma" ? "Dharma" : p.primary}
                  </span>
                  {p.secondary && p.secondary.length > 0 && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-accent-turmeric">
                        {p.secondary.join(", ")}
                      </span>
                    </>
                  )}
                </div>
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