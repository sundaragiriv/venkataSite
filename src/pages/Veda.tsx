import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";

// Safe content loading
let vedaPosts = [];
let fmt = (date) => new Date(date).toLocaleDateString();

try {
  const vedaModule = require('../lib/veda');
  vedaPosts = vedaModule.vedaPosts || [];
  fmt = vedaModule.fmt || fmt;
} catch (error) {
  console.warn('Could not load Veda posts:', error);
  vedaPosts = [
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
}

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
    <section className="container max-w-wrap py-12">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Vedic Wisdom</h1>
      <p className="mt-2 text-slate-600 max-w-prose">
        Ancient Sanskrit wisdom applied to modern technology leadership, team building, and conscious business practices.
      </p>

      {/* Tag Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {ALL_TAGS.map(tag => (
          <button key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tag === selectedTag 
                ? "bg-yellow-500 text-white shadow-md" 
                : "border border-black/10 text-slate-700 hover:bg-yellow-50 hover:border-yellow-300"
            }`}>
            {tag} ({tag === "All" ? vedaPosts.length : vedaPosts.filter(p => p.tags && p.tags.includes(tag)).length})
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <FadeIn key={post.slug}>
            <MotionCard className="p-0 h-full border-l-4 border-l-yellow-500">
              <Link to={`/veda/${post.slug}`} className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-slate-500">{fmt(post.date)}</div>
                  {post.audioUrl && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      🎵 Audio
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 leading-tight mb-3">{post.title}</h3>
                
                {/* Sanskrit & Translation */}
                <div className="p-4 bg-yellow-50 rounded-lg mb-3">
                  <p className="text-base font-serif italic text-yellow-800 mb-1">
                    {post.transliteration}
                  </p>
                  <p className="text-sm text-yellow-700 font-medium">
                    "{post.translation}"
                  </p>
                </div>

                <div className="flex-1">
                  {post.summary && <p className="text-sm text-slate-600 line-clamp-2">{post.summary}</p>}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <span className="inline-flex items-center gap-1 text-sm text-yellow-700">Read Wisdom →</span>
              </Link>
            </MotionCard>
          </FadeIn>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="mt-12 text-center py-12">
          <div className="text-4xl mb-4">🕉️</div>
          <h3 className="text-xl font-semibold mb-2">No wisdom found</h3>
          <p className="text-slate-500 mb-4">No posts match your current filter.</p>
          <button
            onClick={() => setSelectedTag("All")}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Show All
          </button>
        </div>
      )}

      {/* About Section */}
      <FadeIn>
        <div className="mt-16 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <h2 className="text-2xl font-bold text-center mb-6">About This Practice</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-slate-700 mb-4">
              The Vedas are ancient Sanskrit texts containing profound wisdom about life, consciousness, and dharma. 
              These timeless principles offer guidance for modern technology leaders seeking to build conscious, 
              ethical, and sustainable organizations.
            </p>
            <p className="text-slate-700 mb-6">
              Each post explores how ancient wisdom can be practically applied to contemporary challenges in 
              technology leadership, team building, and business ethics.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-yellow-700 font-semibold hover:text-yellow-800">
              Learn About My Practice →
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}