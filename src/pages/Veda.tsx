import { vedaPosts } from "../lib/veda";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";
import SEO from "../components/SEO";

export default function Veda() {
  const categories = [...new Set(vedaPosts.map(post => post.category))];
  
  return (
    <>
      <SEO 
        title="Dharmic Wisdom - Ancient Wisdom for Modern Teams"
        description="Sanskrit verses with transliteration, audio, and practical applications for leadership, meditation, and team dynamics in modern technology environments."
      />
      <div className="container max-w-wrap py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-vedic to-amber-600 bg-clip-text text-transparent mb-4">
              Dharmic Wisdom
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Deep essays and resources that translate Vedic wisdom into leadership, practice, and team tools. Long-form, evergreen, learning-focused.
            </p>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ancient wisdom for modern teams. Sanskrit verses with transliteration, audio, and practical applications for leadership and technology.
            </p>
          </div>
        </FadeIn>

        {categories.map(category => (
          <FadeIn key={category}>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">{category}</h2>
              <div className="grid gap-6">
                {vedaPosts
                  .filter(post => post.category === category)
                  .map(post => (
                    <MotionCard key={post.slug} className="card-glow group">
                      <a href={`/veda/${post.slug}`} className="block p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-slate-500">{post.date}</div>
                          {post.audio && (
                            <div className="flex items-center gap-2 text-vedic">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
                              </svg>
                              <span className="text-xs">Audio</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-2xl font-semibold text-slate-900 mb-2 group-hover:text-vedic transition-colors sanskrit-font">
                            {post.sanskrit}
                          </h3>
                          <p className="text-lg text-slate-600 italic mb-1">{post.transliteration}</p>
                          <p className="text-slate-700 font-medium">{post.translation}</p>
                        </div>
                        
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">{post.title}</h4>
                        
                        {post.summary && (
                          <p className="text-slate-600 mb-4 line-clamp-2">{post.summary}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 4 && (
                            <span className="text-xs text-slate-500">+{post.tags.length - 4} more</span>
                          )}
                        </div>
                      </a>
                    </MotionCard>
                  ))
                }
              </div>
            </section>
          </FadeIn>
        ))}
      </div>
    </>
  );
}