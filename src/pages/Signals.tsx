import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import AdBanner from "../components/AdBanner";
import Pagination from "../components/Pagination";

const PRIMARY_CATEGORIES = ["All", "AI/ML", "SAP", "Dharma"] as const;

const SECONDARY_TAGS = {
  "SAP": ["CX", "S4HANA", "FSM", "CPQ", "Integration"],
  "AI/ML": ["Joule", "MLOps", "Recommendations", "Analytics"],
  "Dharma": ["Veda", "Practice", "Reflections", "Rituals"]
} as const;

const ITEMS_PER_PAGE = 12;

export default function Signals() {
  const [selectedPrimary, setSelectedPrimary] = useState<(typeof PRIMARY_CATEGORIES)[number]>("All");
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredList = useMemo(() => {
    let list = signals;
    
    if (selectedPrimary !== "All") {
      list = list.filter(p => p.primary === selectedPrimary);
    }
    
    if (selectedSecondary.length > 0) {
      list = list.filter(p => 
        p.secondary && p.secondary.some(tag => selectedSecondary.includes(tag))
      );
    }
    
    return list;
  }, [selectedPrimary, selectedSecondary]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
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
    <section className="container max-w-wrap py-12 bg-black min-h-screen">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary font-sans">Signals</h1>
      <p className="mt-3 sm:mt-4 text-secondary max-w-prose font-medium">
        Short, timely micro-updates and insights: quick wins, results from experiments, project "mini-findings," and pointers to new long-form assets.
      </p>

      {/* Primary Category Filters */}
      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
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
        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
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

      <div className="mt-8 sm:mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedList.map((p) => (
            <FadeIn key={p.slug}>
              <MotionCard className="p-0 h-full card-glow hover-lift group">
                <Link to={`/signals/${p.slug}`} className="flex flex-col h-full p-6">
                  <div className="text-xs text-muted">{fmt(p.date)}</div>
                  <h3 className="mt-2 sm:mt-3 text-lg font-semibold text-primary leading-tight group-hover:text-accent transition-colors line-clamp-2 font-sans">{p.title}</h3>
                  <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className="font-medium text-accent px-2 py-1 bg-accent/10 rounded-full border border-accent/20">
                      {p.primary}
                    </span>
                    {p.secondary && p.secondary.length > 0 && (
                      <span className="text-accent px-2 py-1 bg-accent/5 rounded-full border border-accent/10">
                        {p.secondary.slice(0, 2).join(", ")}{p.secondary.length > 2 ? "..." : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 mt-3 sm:mt-4">
                    {p.summary && <p className="text-sm text-secondary line-clamp-2 sm:line-clamp-3">{p.summary}</p>}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent font-medium group-hover:gap-2 transition-all">Read &rarr;</span>
                </Link>
              </MotionCard>
            </FadeIn>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Bottom Content Ad */}
      {filteredList.length > 0 && (
        <div className="mt-12">
          <AdBanner 
            slot="8642097531" 
            style={{ display: 'block', width: '100%', height: '120px' }}
          />
        </div>
      )}
    </section>
  );
}