import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { blueprints, fmt } from "../lib/blueprints";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";

const PRIMARY_CATEGORIES = ["All", "AI-ML", "SAP", "Dharma"] as const;

const SECONDARY_TAGS = {
  "SAP": ["CX", "S4HANA", "FSM", "CPQ", "Integration"],
  "AI-ML": ["Joule", "MLOps", "Recommendations", "Analytics"],
  "Dharma": ["Veda", "Practice", "Reflections", "Rituals"]
} as const;

export default function Blueprints() {
  const [selectedPrimary, setSelectedPrimary] = useState<(typeof PRIMARY_CATEGORIES)[number]>("All");
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([]);
  
  const list = useMemo(() => {
    if (selectedPrimary === "All") return blueprints;
    
    let filtered = blueprints.filter(p => p.primary === selectedPrimary);
    
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
    <>
      <SEO 
        title="Blueprints - SAP & AI Implementation Guides"
        description="One-page blueprints for SAP integrations, AI implementations, and digital transformation. Downloadable PDFs with architecture diagrams and measured ROI."
      />
      <section className="container max-w-wrap py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Blueprints</h1>
        <p className="mt-2 text-slate-600 max-w-prose">
          One-page architecture blueprints with measurable outcomes. Each blueprint includes implementation guides, 
          technical diagrams, and downloadable PDFs for your reference.
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
              <MotionCard className="p-0 h-full">
                <div className="flex flex-col h-full p-6">
                  <div className="text-xs text-slate-500">{fmt(p.date)}</div>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 leading-tight">{p.title}</h3>
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
                  <div className="flex-1 mt-2">
                    {p.excerpt && <p className="text-sm text-slate-600 line-clamp-3">{p.excerpt}</p>}
                  </div>
                  
                  {/* Impact KPIs */}
                  {p.impact && p.impact.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-slate-500 mb-1">Key Impact:</div>
                      <div className="space-y-1">
                        {p.impact.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs text-accent-turmeric font-medium">
                            • {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link 
                      to={`/blueprints/${p.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 text-sm text-brand hover:text-brand-light font-medium"
                    >
                      View Details
                    </Link>
                    <a 
                      href={p.pdf}
                      className="flex-1 inline-flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-light transition-colors"
                      data-analytics={`download:${p.slug}`}
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </MotionCard>
            </FadeIn>
          ))}
        </div>
        
        {list.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No blueprints found for the selected filters.</p>
          </div>
        )}
      </section>
    </>
  );
}