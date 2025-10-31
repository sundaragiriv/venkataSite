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
      <div className="container max-w-wrap py-12 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Blueprint Not Found</h1>
        <p className="mt-2 text-slate-600">The blueprint you're looking for doesn't exist.</p>
        <Link to="/blueprints" className="mt-4 inline-block text-brand hover:text-brand-light">
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
        ogImage={blueprint.og_image}
      />
      <link rel="canonical" href={`https://venkata.info/blueprints/${blueprint.slug}`} />
      
      <article className="container max-w-wrap py-12">
        <FadeIn>
          <div className="mb-6">
            <Link to="/blueprints" className="text-brand hover:text-brand-light text-sm font-medium">
              ← Back to Blueprints
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
                  {blueprint.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{fmt(blueprint.date)}</span>
                  <span>•</span>
                  <span>By {blueprint.authors.join(", ")}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-medium text-brand">
                    {blueprint.primary}
                  </span>
                  {blueprint.secondary && blueprint.secondary.length > 0 && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-accent-turmeric">
                        {blueprint.secondary.join(", ")}
                      </span>
                    </>
                  )}
                </div>
              </header>

              {/* Blueprint Content */}
              <div className="prose prose-slate max-w-none">
                {BlueprintContent ? (
                  <MDXProvider>
                    <BlueprintContent />
                  </MDXProvider>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <p className="text-slate-600 mb-0">
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
                <div className="p-6 rounded-lg border border-black/10 bg-white">
                  <h3 className="font-semibold text-slate-900 mb-4">Quick Facts</h3>
                  
                  {/* Impact Metrics */}
                  {blueprint.impact && blueprint.impact.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-slate-700 mb-2">Key Impact:</div>
                      <ul className="space-y-1">
                        {blueprint.impact.map((item, idx) => (
                          <li key={idx} className="text-sm text-accent-turmeric font-medium">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Authors */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-700 mb-1">Authors:</div>
                    <div className="text-sm text-slate-600">{blueprint.authors.join(", ")}</div>
                  </div>

                  {/* Date */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-700 mb-1">Published:</div>
                    <div className="text-sm text-slate-600">{fmt(blueprint.date)}</div>
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="text-sm font-medium text-slate-700 mb-2">Categories:</div>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand">
                        {blueprint.primary}
                      </span>
                      {blueprint.secondary?.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-turmeric/10 text-accent-turmeric">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Download CTA */}
                <div className="p-6 rounded-lg border border-black/10 bg-gradient-to-br from-brand/5 to-brand/10">
                  <h3 className="font-semibold text-slate-900 mb-2">Download Blueprint</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Get the complete one-page PDF with architecture diagrams and implementation checklist.
                  </p>
                  <a 
                    href={blueprint.pdf}
                    className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-light transition-colors"
                    data-analytics={`download:${blueprint.slug}`}
                  >
                    Download PDF
                  </a>
                </div>

                {/* Contact CTA */}
                <div className="p-6 rounded-lg border border-black/10 bg-white">
                  <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Schedule a 30-minute call to discuss your specific requirements and implementation timeline.
                  </p>
                  <Link 
                    to="/contact"
                    className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg border border-brand text-brand font-medium hover:bg-brand/5 transition-colors"
                  >
                    Book Strategy Call
                  </Link>
                </div>

                {/* Social Share */}
                <div className="p-6 rounded-lg border border-black/10 bg-white">
                  <h3 className="font-semibold text-slate-900 mb-3">Share This Blueprint</h3>
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
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium text-center hover:bg-slate-900 transition-colors"
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