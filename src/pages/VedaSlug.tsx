import { useParams } from "react-router-dom";
import { getVedaPost } from "../lib/veda";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";

export default function VedaSlug() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getVedaPost(slug) : undefined;

  if (!post) {
    return (
      <div className="container max-w-wrap py-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Vedic Entry Not Found</h1>
        <p className="text-slate-600 mb-6">The Vedic entry you're looking for doesn't exist.</p>
        <a href="/veda" className="btn-gradient text-white px-6 py-3 rounded-xl font-medium">
          Back to Vedic Studio
        </a>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} - Vedic Studio`}
        description={post.summary || `${post.title} - Ancient wisdom for modern teams`}
        type="article"
        publishedTime={post.date}
      />
      <article className="container max-w-prose py-12">
        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <a href="/veda" className="text-vedic hover:text-amber-700 font-medium">
                ← Back to Vedic Studio
              </a>
              {post.audio && (
                <div className="flex items-center gap-2 text-vedic">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
                  </svg>
                  <span className="text-sm">Audio Available</span>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-8">
              <h1 className="text-4xl font-bold sanskrit-font text-slate-900 mb-4">{post.sanskrit}</h1>
              <p className="text-xl text-slate-600 italic mb-2">{post.transliteration}</p>
              <p className="text-lg text-slate-700 font-medium">{post.translation}</p>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-vedic to-amber-600 bg-clip-text text-transparent mb-4">{post.title}</h2>
            
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
        
        <FadeIn>
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 mb-8">
              <p className="text-lg text-slate-700 leading-relaxed m-0">
                {post.summary}
              </p>
            </div>
            
            <div className="text-slate-700 leading-relaxed space-y-6">
              <p>This exploration delves into the practical applications of ancient Vedic wisdom in modern professional environments.</p>
              <p>The content bridges timeless Sanskrit teachings with contemporary challenges in leadership, team dynamics, and personal development.</p>
              <p>Discover how these principles can enhance productivity, well-being, and effectiveness in today's technology-driven workplace.</p>
            </div>
          </div>
        </FadeIn>
      </article>
    </>
  );
}