import { useParams } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";

const modules = import.meta.glob("../../content/signals/*.mdx", { eager: true }) as Record<string, any>;

export default function SignalPost() {
  const { slug } = useParams();
  const key = `../../content/signals/${slug}.mdx`;
  const module = modules[key];
  
  if (!module) return <div className="container max-w-wrap py-12">Post not found.</div>;

  const Post = module.default;
  const meta = module.frontmatter;

  return (
    <article className="container max-w-wrap py-12">
      <p className="text-sm text-slate-500">{new Date(meta.date).toLocaleDateString()} · {meta.tag}</p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{meta.title}</h1>
      {meta.summary && <p className="mt-2 text-slate-600 max-w-prose">{meta.summary}</p>}
      <div className="mt-8 prose prose-slate max-w-none">
        <MDXProvider><Post /></MDXProvider>
      </div>
    </article>
  );
}