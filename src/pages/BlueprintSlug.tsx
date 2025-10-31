import { useParams, Link } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { blueprints, fmt } from "../lib/blueprints";
import SEO from "../components/SEO";
import { FadeIn } from "../components/FadeIn";

const modules = import.meta.glob("../../content/blueprints/*.mdx", { eager: true }) as Record<string, any>;

export default function BlueprintSlug() {
  const { slug } = useParams();
  const blueprint = blueprints.find(p => p.slug === slug);
  
  const key = `../../content/blueprints/${slug}.mdx`;
  const module = modules[key];
  const BlueprintContent = module?.default;

  if (!blueprint) {
    return (
      <div className="container max-w-wrap py-12 text-center bg-black min-h-screen">
        <h1 className="text-2xl font-semibold text-primary font-sans">Blueprint Not Found</h1>
        <p className="mt-2 text-secondary">The blueprint you're looking for doesn't exist.</p>
        <Link to="/blueprints" className="mt-4 inline-block text-accent hover:text-primary">
          ← Back to Blueprints
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${blueprint.title} - Blueprint`}
        description={blueprint.excerpt}
        image={blueprint.og_image}
      />
      <link rel="canonical" href={`https://venkata.info/blueprints/${blueprint.slug}`} />
      
      <article className="container max-w-wrap py-12 bg-black min-h-screen">
        <FadeIn>
          <div className="mb-6">
            <Link to="/blueprints" className="text-accent hover:text-primary text-sm font-medium">
              ← Back to Blueprints
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary mb-4 font-sans">
                  {blueprint.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <span>{fmt(blueprint.date)}</span>
                  <span>•</span>
                  <span>By {blueprint.authors.join(", ")}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-medium text-accent px-2 py-1 bg-accent/10 rounded-full border border-accent/20">
                    {blueprint.primary}
                  </span>
                  {blueprint.secondary && blueprint.secondary.length > 0 && (
                    <>
                      <span className="text-muted">•</span>
                      <span className="text-accent">
                        {blueprint.secondary.join(", ")}
                      </span>
                    </>
                  )}
                </div>
              </header>

              {/* Blueprint Content */}
              <div className="prose prose-invert max-w-none">
                {BlueprintContent ? (
                  <MDXProvider>
                    <BlueprintContent />
                  </MDXProvider>
                ) : (
                  <div className="bg-dark-card p-6 rounded-lg border border-dark-tertiary">
                    <p className="text-secondary mb-0">
                      <em>Blueprint content not found.</em>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Quick Facts */}
                <div className="p-6 rounded-lg border border-dark-tertiary bg-dark-card">
                  <h3 className="font-semibold text-primary mb-4 font-sans">Quick Facts</h3>
                  
                  {/* Impact Metrics */}
                  {blueprint.impact && blueprint.impact.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-secondary mb-2">Key Impact:</div>
                      <ul className="space-y-1">
                        {blueprint.impact.map((item, idx) => (
                          <li key={idx} className="text-sm text-accent font-medium">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Authors */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Authors:</div>
                    <div className="text-sm text-muted">{blueprint.authors.join(", ")}</div>
                  </div>

                  {/* Date */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-secondary mb-1">Published:</div>
                    <div className="text-sm text-muted">{fmt(blueprint.date)}</div>
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="text-sm font-medium text-secondary mb-2">Categories:</div>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                        {blueprint.primary}
                      </span>
                      {blueprint.secondary?.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Download CTA */}
                <div className="p-6 rounded-lg border border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                  <h3 className="font-semibold text-primary mb-2 font-sans">Download Blueprint</h3>
                  <p className="text-sm text-secondary mb-4">
                    Get the complete one-page PDF with architecture diagrams and implementation checklist.
                  </p>
                  <a 
                    href={blueprint.pdf}
                    className="btn-gradient w-full text-center"
                    data-analytics={`download:${blueprint.slug}`}
                  >
                    Download PDF
                  </a>
                </div>

                {/* Contact CTA */}
                <div className="p-6 rounded-lg border border-dark-tertiary bg-dark-card">
                  <h3 className="font-semibold text-primary mb-2 font-sans">Need Help?</h3>
                  <p className="text-sm text-secondary mb-4">
                    Schedule a 30-minute call to discuss your specific requirements and implementation timeline.
                  </p>
                  <Link 
                    to="/contact"
                    className="btn-soft w-full text-center"
                  >
                    Book Strategy Call
                  </Link>
                </div>

                {/* Social Share */}
                <div className="p-6 rounded-lg border border-dark-tertiary bg-dark-card">
                  <h3 className="font-semibold text-primary mb-3 font-sans">Share This Blueprint</h3>
                  <div className="flex gap-2">
                    <a 
                      href={`https://linkedin.com/sharing/share-offsite/?url=https://venkata.info/blueprints/${blueprint.slug}`}
                      className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium text-center hover:bg-blue-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blueprint.title)}&url=https://venkata.info/blueprints/${blueprint.slug}`}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium text-center hover:bg-gray-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </article>
    </>
  );
}