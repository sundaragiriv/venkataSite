import { aiPosts } from "../lib/ai";
import { FadeIn } from "../components/FadeIn";
import MotionCard from "../components/MotionCard";
import SEO from "../components/SEO";

export default function AI() {
  const categories = [...new Set(aiPosts.map(post => post.category))];
  
  return (
    <>
      <SEO 
        title="AI Lab - SAP AI Patterns & Implementation Guides"
        description="Comprehensive AI patterns for SAP environments. Joule integration, CX AI Toolkit, GenAI enterprise patterns, and practical implementation guides."
      />
      <div className="container max-w-wrap py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              AI Lab
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              AI patterns for SAP environments. Principles, anti-patterns, and hands-on experiments with enterprise context.
            </p>
          </div>
        </FadeIn>

        {categories.map(category => (
          <FadeIn key={category}>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {aiPosts
                  .filter(post => post.category === category)
                  .map(post => (
                    <MotionCard key={post.slug} className="card-glow group">
                      <a href={`/ai/${post.slug}`} className="block p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm text-slate-500">{post.date}</div>
                          {post.difficulty && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              post.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' :
                              post.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {post.difficulty}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </h3>
                        {post.summary && (
                          <p className="text-slate-600 mb-4 line-clamp-2">{post.summary}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-slate-500">+{post.tags.length - 3} more</span>
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