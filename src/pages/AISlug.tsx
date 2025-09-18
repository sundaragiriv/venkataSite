import { useParams } from "react-router-dom";
import { getAIPost } from "../lib/ai";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";

export default function AISlug() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getAIPost(slug) : undefined;

  if (!post) {
    return (
      <div className="container max-w-wrap py-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">AI Pattern Not Found</h1>
        <p className="text-slate-600 mb-6">The AI pattern you're looking for doesn't exist.</p>
        <a href="/ai" className="btn-gradient text-white px-6 py-3 rounded-xl font-medium">
          Back to AI Lab
        </a>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} - AI Lab`}
        description={post.summary || `${post.title} - AI patterns for SAP environments`}
        type="article"
        publishedTime={post.date}
      />
      <article className="container max-w-prose py-12">
        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <a href="/ai" className="text-purple-600 hover:text-purple-700 font-medium">
                ← Back to AI Lab
              </a>
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
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.category}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
        
        <FadeIn>
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-8">
              <p className="text-lg text-slate-700 leading-relaxed m-0">
                {post.summary}
              </p>
            </div>
            
            <div className="text-slate-700 leading-relaxed space-y-6">
              <p>This comprehensive guide covers practical implementation patterns for {post.title.toLowerCase()} in enterprise SAP environments.</p>
              <p>Key topics include architecture design, security considerations, performance optimization, and real-world use cases with code examples.</p>
              <p>The content provides both theoretical foundations and hands-on implementation guidance for SAP architects and developers.</p>
            </div>
          </div>
        </FadeIn>
      </article>
    </>
  );
}