import { useParams, Link } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { useMemo } from "react";
import { fmt } from "../lib/signals";
import { calculateReadingTime, formatReadingTime } from "../lib/readingTime";
import type { MDXModule } from "../lib/mdxTypes";

const modules = import.meta.glob("../../content/signals/*.mdx", { eager: true }) as Record<string, MDXModule>;

export default function SignalPost() {
  const { slug } = useParams();
  const key = `../../content/signals/${slug}.mdx`;
  const module = modules[key];
  
  if (!module) {
    return (
      <div className="container max-w-wrap py-12 min-h-screen">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary mb-4">
            Post Not Found
          </h1>
          <p className="text-secondary mb-6 text-lg">
            The signal post you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signals" 
              className="btn-gradient inline-flex items-center justify-center gap-2"
            >
              View All Signals
            </Link>
            <Link 
              to="/" 
              className="btn-soft inline-flex items-center justify-center gap-2"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Post = module.default;
  const meta = module.frontmatter;

  // Calculate reading time from summary and content
  const readingTime = useMemo(() => {
    const content = meta.summary || '';
    return formatReadingTime(calculateReadingTime(content));
  }, [meta.summary]);

  return (
    <article className="container max-w-wrap py-12">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted mb-4">
        <span>{fmt(meta.date)}</span>
        {meta.tag && (
          <>
            <span aria-hidden="true">·</span>
            <span>{meta.tag}</span>
          </>
        )}
        {readingTime && (
          <>
            <span aria-hidden="true">·</span>
            <span>{readingTime}</span>
          </>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary mb-4">{meta.title}</h1>
      {meta.summary && <p className="mt-2 text-secondary max-w-prose text-lg mb-8">{meta.summary}</p>}
      <div className="mt-8 prose prose-invert max-w-none">
        <MDXProvider><Post /></MDXProvider>
      </div>
    </article>
  );
}