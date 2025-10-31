import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { blueprints, fmt } from "../lib/blueprints";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

const PRIMARY_CATEGORIES = ["All", "AI/ML", "SAP", "Dharma"] as const;

const SECONDARY_TAGS = {
  "SAP": ["CX", "S4HANA", "FSM", "CPQ", "Integration"],
  "AI/ML": ["Joule", "MLOps", "Recommendations", "Analytics"],
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
    setSelectedSecondary([]);
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
      <section className="container max-w-wrap py-12 bg-black min-h-screen">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary font-sans">Blueprints</h1>
        <p className="mt-2 text-secondary max-w-prose font-medium">
          One-page architecture blueprints focused on <strong className="text-accent">SAP & AI/ML technical playbooks</strong> with measurable outcomes. 
          Each blueprint includes implementation guides, technical diagrams, and downloadable PDFs for your reference.
        </p>
        <p className="mt-2 text-sm text-muted">
          Note: Dharma team practice guides may be better suited for the <Link to="/veda" className="text-accent hover:text-primary transition">Vedic Wisdom</Link> section.
        </p>

        {/* Primary Category Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {PRIMARY_CATEGORIES.map(primary => (
            <button key={primary}
              onClick={() => handlePrimarySelect(primary)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                primary === selectedPrimary 
                  ? "bg-accent text-black font-semibold shadow-md" 
                  : "border border-dark-tertiary text-secondary hover:bg-dark-card hover:border-accent hover:text-accent"
              }`}>
              {primary}
            </button>
          ))}
        </div>

        {/* Secondary Tag Filters */}
        {selectedPrimary !== "All" && SECONDARY_TAGS[selectedPrimary] && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SECONDARY_TAGS[selectedPrimary].map(tag => (
              <button key={tag}
                onClick={() => handleSecondaryToggle(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSecondary.includes(tag)
                    ? "bg-accent text-black font-semibold border border-accent"
                    : "border border-dark-tertiary text-muted hover:bg-dark-card hover:text-accent"
                }`}>
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Top Content Ad */}
        <div className="mt-6">
          <AdBanner 
            slot="4567890123" 
            style={{ display: 'block', width: '100%', height: '120px' }}
          />
        </div>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p, index) => (
            <>
              {/* Insert ad after every 6 items */}
              {index > 0 && index % 6 === 0 && (
                <div className="md:col-span-2 lg:col-span-3 my-4">
                  <AdBanner 
                    slot="9876543210" 
                    style={{ display: 'block', width: '100%', height: '90px' }}
                  />
                </div>
              )}
              <FadeIn key={p.slug}>
                <MotionCard className="p-0 h-full card-glow hover-lift">
                  <div className="flex flex-col h-full p-6">
                    <div className="text-xs text-muted">{fmt(p.date)}</div>
                    <h3 className="mt-1 text-lg font-semibold text-primary leading-tight font-sans">{p.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span className="font-medium text-accent px-2 py-1 bg-accent/10 rounded-full border border-accent/20">
                        {p.primary}
                      </span>
                      {p.secondary && p.secondary.length > 0 && (
                        <>
                          <span className="text-muted">•</span>
                          <span className="text-accent">
                            {p.secondary.join(", ")}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex-1 mt-2">
                      {p.excerpt && <p className="text-sm text-secondary line-clamp-3">{p.excerpt}</p>}
                    </div>
                    
                    {/* Impact KPIs */}
                    {p.impact && p.impact.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-muted mb-1">Key Impact:</div>
                        <div className="space-y-1">
                          {p.impact.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-xs text-accent font-medium">
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Link 
                        to={`/blueprints/${p.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-sm text-accent hover:text-primary font-medium transition"
                      >
                        View Details
                      </Link>
                      <a 
                        href={p.pdf}
                        className="flex-1 btn-gradient text-xs inline-flex items-center justify-center gap-1"
                        data-analytics={`download:${p.slug}`}
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                </MotionCard>
              </FadeIn>
            </>
          ))}
        </div>
        
        {/* Bottom Content Ad */}
        {list.length > 0 && (
          <div className="mt-12">
            <AdBanner 
              slot="1357924680" 
              style={{ display: 'block', width: '100%', height: '120px' }}
            />
          </div>
        )}
        
        {list.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary">No blueprints found for the selected filters.</p>
          </div>
        )}
      </section>
    </>
  );
}