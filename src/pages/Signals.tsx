import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import AdBanner from "../components/AdBanner";
import { gridPatterns, spacing, typography, interactive } from "../lib/responsive";

const PRIMARY_CATEGORIES = ["All", "AI/ML", "SAP", "Dharma"] as const;

const SECONDARY_TAGS = {
  "SAP": ["CX", "S4HANA", "FSM", "CPQ", "Integration"],
  "AI/ML": ["Joule", "MLOps", "Recommendations", "Analytics"],
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
    <section className={`container max-w-wrap ${spacing.container} ${spacing.sectionY}`}>
      <h1 className={typography.h1}>Signals</h1>
      <p className={`mt-3 sm:mt-4 ${typography.body} max-w-prose`}>
        Short, timely micro-updates and insights: quick wins, results from experiments, project "mini-findings," and pointers to new long-form assets.
      </p>

      {/* Primary Category Filters */}
      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
        {PRIMARY_CATEGORIES.map(primary => (
          <button key={primary}
            onClick={() => handlePrimarySelect(primary)}
            className={`${interactive.button.medium} rounded-xl font-medium transition-all ${
              primary === selectedPrimary 
                ? "bg-gradient-to-r from-brand to-brand-light text-white shadow-md" 
                : "border border-black/10 text-slate-700 hover:bg-slate-50 hover:border-brand/30"
            }`}>
            {primary}
          </button>
        ))}
      </div>

      {/* Secondary Tag Filters (show when primary category is selected) */}
      {selectedPrimary !== "All" && SECONDARY_TAGS[selectedPrimary] && (
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
          {SECONDARY_TAGS[selectedPrimary].map(tag => (
            <button key={tag}
              onClick={() => handleSecondaryToggle(tag)}
              className={`${interactive.button.small} rounded-lg font-medium transition-all ${
                selectedSecondary.includes(tag)
                  ? "bg-gradient-to-r from-accent-turmeric/20 to-accent-turmeric/30 text-accent-turmeric border border-accent-turmeric/30"
                  : "border border-black/5 text-slate-600 hover:bg-slate-50"
              }`}>
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Top Content Ad */}
      <div className="mt-6 sm:mt-8">
        <AdBanner 
          slot="2345678901" 
          style={{ display: 'block', width: '100%', height: '120px' }}
        />
      </div>
      
      <div className={`mt-8 sm:mt-12 ${gridPatterns.signals}`}>
        {list.map(p => (
          <FadeIn key={p.slug}>
            <MotionCard className="p-0 h-full group">
              <Link to={`/signals/${p.slug}`} className={`flex flex-col h-full ${spacing.cardPadding} hover:bg-slate-50 transition-colors`}>
                <div className={typography.caption}>{fmt(p.date)}</div>
                <h3 className={`mt-2 sm:mt-3 ${typography.h4} text-slate-900 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2`}>{p.title}</h3>
                <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className="font-medium text-brand px-2 py-1 bg-brand/10 rounded-full">
                    {p.primary}
                  </span>
                  {p.secondary && p.secondary.length > 0 && (
                    <span className="text-accent-turmeric px-2 py-1 bg-accent-turmeric/10 rounded-full">
                      {p.secondary.slice(0, 2).join(", ")}{p.secondary.length > 2 ? "..." : ""}
                    </span>
                  )}
                </div>
                <div className="flex-1 mt-3 sm:mt-4">
                  {p.summary && <p className={`${typography.small} line-clamp-2 sm:line-clamp-3`}>{p.summary}</p>}
                </div>
                <span className={`mt-4 inline-flex items-center gap-1 ${typography.small} text-brand font-medium group-hover:gap-2 transition-all`}>Read →</span>
              </Link>
            </MotionCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}