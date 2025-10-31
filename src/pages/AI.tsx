import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";

// Safe content loading with fallback data
const fmt = (date: string) => new Date(date).toLocaleDateString();

const aiPosts = [
    {
      slug: "sap-joule-integration-patterns",
      title: "SAP Joule: Enterprise AI Assistant Integration Patterns",
      date: "2024-12-22",
      primary: "Joule",
      secondary: ["Integration", "Conversational AI"],
      summary: "Practical integration patterns and implementation strategies for SAP Joule enterprise AI assistant.",
      difficulty: "Intermediate",
      tags: ["Joule", "SAP AI", "Conversational AI", "Enterprise Assistant"]
    },
    {
      slug: "genai-enterprise-patterns",
      title: "GenAI Enterprise Patterns",
      date: "2024-12-15",
      primary: "GenAI",
      secondary: ["LLM", "RAG"],
      summary: "Proven patterns for implementing generative AI in enterprise environments with governance and security.",
      difficulty: "Advanced",
      tags: ["GenAI", "Enterprise", "Governance", "Security"]
    },
    {
      slug: "mlops-sap-deployment",
      title: "MLOps for SAP: Model Deployment Strategies",
      date: "2024-12-10",
      primary: "MLOps",
      secondary: ["Model Deployment", "Monitoring"],
      summary: "Best practices for deploying and monitoring ML models in SAP environments with automated pipelines.",
      difficulty: "Advanced",
      tags: ["MLOps", "SAP", "Deployment", "Monitoring"]
    },
    {
      slug: "real-time-analytics-patterns",
      title: "Real-time Analytics in SAP CX",
      date: "2024-12-05",
      primary: "Analytics",
      secondary: ["Real-time", "Dashboards"],
      summary: "Implementation patterns for real-time customer analytics and dynamic dashboards in SAP CX environments.",
      difficulty: "Intermediate",
      tags: ["Analytics", "Real-time", "CX", "Dashboards"]
    }
  ];

const PRIMARY_CATEGORIES = ["All", "GenAI", "Joule", "MLOps", "Analytics"] as const;
const SECONDARY_TAGS = {
  "GenAI": ["LLM", "Prompt Engineering", "RAG", "Fine-tuning"],
  "Joule": ["Integration", "Conversational AI", "Enterprise Assistant", "Workflows"],
  "MLOps": ["Model Deployment", "Monitoring", "Pipelines", "Governance"],
  "Analytics": ["Predictive", "Real-time", "Dashboards", "KPIs"]
} as const;

export default function AI() {
  const [selectedPrimary, setSelectedPrimary] = useState<(typeof PRIMARY_CATEGORIES)[number]>("All");
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    let filtered = aiPosts;
    
    if (selectedPrimary !== "All") {
      filtered = filtered.filter(post => post.primary === selectedPrimary);
    }
    
    if (selectedSecondary.length > 0) {
      filtered = filtered.filter(post => 
        post.secondary && post.secondary.some(tag => selectedSecondary.includes(tag))
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
    <section className="container max-w-wrap py-12 bg-black min-h-screen">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">AI Insights</h1>
      <p className="mt-2 text-secondary max-w-prose font-medium">
        Deep dives into enterprise AI, machine learning patterns, and practical implementation strategies for SAP landscapes.
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

      {/* Secondary Tag Filters (show when primary category is selected) */}
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

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <FadeIn key={post.slug}>
            <MotionCard className="p-0 h-full card-glow hover-lift">
              <Link to={`/ai/${post.slug}`} className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted">{fmt(post.date)}</div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-accent/20 text-accent border border-accent/30">
                    {post.primary}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-primary leading-tight mb-2">{post.title}</h3>
                
                {post.secondary && post.secondary.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.secondary.map(tag => (
                      <span key={tag} className="text-xs text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex-1">
                  {post.summary && <p className="text-sm text-secondary line-clamp-3">{post.summary}</p>}
                </div>
                
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-accent">Read Article →</span>
              </Link>
            </MotionCard>
          </FadeIn>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="mt-12 text-center py-12">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2 text-primary">No AI content found</h3>
          <p className="text-secondary mb-4">No articles match your current filters.</p>
          <button
            onClick={() => {
              setSelectedPrimary("All");
              setSelectedSecondary([]);
            }}
            className="btn-gradient"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
}