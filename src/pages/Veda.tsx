import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";

// Safe content loading with fallback data
const fmt = (date: string) => new Date(date).toLocaleDateString();

const vedaPosts = [
    {
      slug: "ahimsa-psychological-safety",
      title: "Ahimsa and Psychological Safety",
      transliteration: "ahimsa paramo dharmaḥ",
      translation: "Non-violence is the highest dharma",
      date: "2024-12-20",
      tags: ["Ahimsa", "Leadership", "Team Culture"],
      summary: "How the ancient principle of ahimsa creates psychological safety in modern teams.",
      audioUrl: "/audio/ahimsa-chant.mp3"
    },
    {
      slug: "dharma-in-technology",
      title: "Dharma in Technology Leadership",
      transliteration: "dharmo rakṣati rakṣitaḥ",
      translation: "Dharma protects those who protect dharma",
      date: "2024-12-15",
      tags: ["Dharma", "Ethics", "Technology"],
      summary: "Applying dharmic principles to ethical technology leadership and decision-making."
    }
  ];

const ALL_TAGS = ["All", "Ahimsa", "Dharma", "Leadership", "Ethics", "Practice", "Team Culture"] as const;

export default function Veda() {
  const [selectedTag, setSelectedTag] = useState<(typeof ALL_TAGS)[number]>("All");

  const filteredPosts = useMemo(() => {
    if (selectedTag === "All") return vedaPosts;
    return vedaPosts.filter(post => 
      post.tags && post.tags.includes(selectedTag)
    );
  }, [selectedTag]);

  return (
    <section className="container max-w-wrap py-12 bg-black min-h-screen">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary font-sans">Vedic Wisdom</h1>
      <p className="mt-2 text-secondary max-w-prose font-medium">
        Ancient Sanskrit wisdom applied to modern technology leadership, team building, and conscious business practices.
      </p>

      {/* Tag Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {ALL_TAGS.map(tag => (
          <button key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tag === selectedTag 
                ? "bg-accent text-black font-semibold shadow-md" 
                : "border border-dark-tertiary text-secondary hover:bg-dark-card hover:border-accent hover:text-accent"
            }`}>
            {tag} ({tag === "All" ? vedaPosts.length : vedaPosts.filter(p => p.tags && p.tags.includes(tag)).length})
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <FadeIn key={post.slug}>
            <MotionCard className="p-0 h-full card-glow hover-lift border-l-4 border-l-accent">
              <Link to={`/veda/${post.slug}`} className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-muted">{fmt(post.date)}</div>
                  {post.audioUrl && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full border border-accent/30">
                      🎵 Audio
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-primary leading-tight mb-3 font-sans">{post.title}</h3>
                
                {/* Sanskrit & Translation */}
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg mb-3">
                  <p className="text-base font-serif italic text-accent mb-1 sanskrit-font">
                    {post.transliteration}
                  </p>
                  <p className="text-sm text-secondary font-medium">
                    "{post.translation}"
                  </p>
                </div>

                <div className="flex-1">
                  {post.summary && <p className="text-sm text-secondary line-clamp-2">{post.summary}</p>}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <span className="inline-flex items-center gap-1 text-sm text-accent">Read Wisdom →</span>
              </Link>
            </MotionCard>
          </FadeIn>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="mt-12 text-center py-12">
          <div className="text-4xl mb-4">🕉️</div>
          <h3 className="text-xl font-semibold mb-2 text-primary font-sans">No wisdom found</h3>
          <p className="text-secondary mb-4">No posts match your current filter.</p>
          <button
            onClick={() => setSelectedTag("All")}
            className="btn-gradient"
          >
            Show All
          </button>
        </div>
      )}

      {/* About Section */}
      <FadeIn>
        <div className="mt-16 p-8 card-glow border border-accent/20">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary font-sans">About This Practice</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-secondary mb-4">
              The Vedas are ancient Sanskrit texts containing profound wisdom about life, consciousness, and dharma. 
              These timeless principles offer guidance for modern technology leaders seeking to build conscious, 
              ethical, and sustainable organizations.
            </p>
            <p className="text-secondary mb-6">
              Each post explores how ancient wisdom can be practically applied to contemporary challenges in 
              technology leadership, team building, and business ethics.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-accent font-semibold hover:text-primary transition">
              Learn About My Practice →
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}