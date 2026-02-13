import { useParams, Link } from "react-router-dom";
import { getAIPost } from "../lib/ai";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";

export default function AISlug() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getAIPost(slug) : undefined;

  if (!post) {
    return (
      <div className="container max-w-wrap py-12 text-center bg-black min-h-screen">
        <h1 className="text-3xl font-bold text-primary mb-4 font-sans">AI Pattern Not Found</h1>
        <p className="text-secondary mb-6">The AI pattern you're looking for doesn't exist.</p>
        <Link to="/ai" className="btn-gradient">
          Back to AI Lab
        </Link>
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
      <article className="container max-w-wrap py-12 bg-black min-h-screen">
        <FadeIn>
          <div className="mb-6">
            <Link to="/ai" className="text-accent hover:text-primary text-sm font-medium">
              &larr; Back to AI Lab
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary mb-4 font-sans">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {post.difficulty && (
                    <span className="font-medium text-accent px-2 py-1 bg-accent/10 rounded-full border border-accent/20">
                      {post.difficulty}
                    </span>
                  )}
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-accent px-2 py-1 bg-accent/5 rounded-full border border-accent/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              {/* AI Content */}
              <div className="prose prose-invert max-w-none">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8">
                  <p className="text-lg text-secondary leading-relaxed m-0">
                    {post.summary}
                  </p>
                </div>
                
                <div className="text-secondary leading-relaxed space-y-6">
                  <p>This comprehensive guide covers practical implementation patterns for {post.title.toLowerCase()} in enterprise SAP environments.</p>
                  <p>Key topics include architecture design, security considerations, performance optimization, and real-world use cases with code examples.</p>
                  <p>The content provides both theoretical foundations and hands-on implementation guidance for SAP architects and developers.</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Quick Facts */}
                <div className="p-6 rounded-lg border border-dark-tertiary bg-dark-card">
                  <h3 className="font-semibold text-primary mb-4 font-sans">Quick Facts</h3>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Difficulty:</div>
                    <div className="text-sm text-accent">{post.difficulty || 'Intermediate'}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Category:</div>
                    <div className="text-sm text-muted">{post.category}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Published:</div>
                    <div className="text-sm text-muted">{post.date}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-secondary mb-2">Tags:</div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="p-6 rounded-lg border border-dark-tertiary bg-dark-card">
                  <h3 className="font-semibold text-primary mb-2 font-sans">Need Help?</h3>
                  <p className="text-sm text-secondary mb-4">
                    Schedule a 30-minute call to discuss AI implementation in your SAP environment.
                  </p>
                  <Link to="/contact" className="btn-soft w-full text-center inline-block">
                    Book Strategy Call
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </article>
    </>
  );
}