import { useParams } from "react-router-dom";
import { getVedaPost } from "../lib/veda";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";

export default function VedaSlug() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getVedaPost(slug) : undefined;

  if (!post) {
    return (
      <div className="container max-w-wrap py-12 text-center bg-black min-h-screen">
        <h1 className="text-3xl font-bold text-primary mb-4 font-sans">Vedic Entry Not Found</h1>
        <p className="text-secondary mb-6">The Vedic entry you're looking for doesn't exist.</p>
        <a href="/veda" className="btn-gradient">
          Back to Vedic Wisdom
        </a>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} - Dharmic Wisdom`}
        description={post.summary || `${post.title} - Ancient wisdom for modern teams`}
        type="article"
        publishedTime={post.date}
      />
      <article className="container max-w-wrap py-12 bg-black min-h-screen">
        <FadeIn>
          <div className="mb-6">
            <a href="/veda" className="text-accent hover:text-primary text-sm font-medium">
              ← Back to Vedic Wisdom
            </a>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <header className="mb-8">
                {/* Sanskrit Section */}
                <div className="p-6 bg-accent/10 border border-accent/20 rounded-lg mb-6">
                  <h1 className="text-2xl font-bold sanskrit-font text-accent mb-2">{post.sanskrit}</h1>
                  <p className="text-lg text-secondary italic mb-1">{post.transliteration}</p>
                  <p className="text-base text-primary font-medium">"{post.translation}"</p>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary mb-4 font-sans">
                  {post.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                  {post.audio && (
                    <>
                      <span>•</span>
                      <span className="text-accent">🎵 Audio Available</span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {post.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-accent px-2 py-1 bg-accent/10 rounded-full border border-accent/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              {/* Veda Content */}
              <div className="prose prose-invert max-w-none">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8">
                  <p className="text-lg text-secondary leading-relaxed m-0">
                    {post.summary}
                  </p>
                </div>
                
                <div className="text-secondary leading-relaxed space-y-6">
                  <p>This exploration delves into the practical applications of ancient Vedic wisdom in modern professional environments.</p>
                  <p>The content bridges timeless Sanskrit teachings with contemporary challenges in leadership, team dynamics, and personal development.</p>
                  <p>Discover how these principles can enhance productivity, well-being, and effectiveness in today's technology-driven workplace.</p>
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
                    <div className="text-sm font-medium text-secondary mb-1">Sanskrit:</div>
                    <div className="text-sm text-accent sanskrit-font">{post.sanskrit}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Translation:</div>
                    <div className="text-sm text-muted italic">"{post.translation}"</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Category:</div>
                    <div className="text-sm text-muted">{post.category}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Published:</div>
                    <div className="text-sm text-muted">{post.date}</div>
                  </div>

                  {post.audio && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-secondary mb-1">Audio:</div>
                      <div className="text-sm text-accent">🎵 Chanting Available</div>
                    </div>
                  )}

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

                {/* About Vedic Wisdom */}
                <div className="p-6 rounded-lg border border-dark-tertiary bg-dark-card">
                  <h3 className="font-semibold text-primary mb-2 font-sans">About This Practice</h3>
                  <p className="text-sm text-secondary mb-4">
                    Ancient Sanskrit wisdom applied to modern leadership and conscious business practices.
                  </p>
                  <a href="/about" className="btn-soft w-full text-center">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </article>
    </>
  );
}