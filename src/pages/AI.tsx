export default function AI() {
  const posts = [
    {
      slug: "principle-rasp",
      title: "RASP: Retrieval-Augmented SAP Processes",
      summary: "Bring enterprise context to AI decisions inside SAP flows.",
      tags: ["AI", "SAP", "RAG", "FSM", "Service"]
    }
  ];

  return (
    <div className="container max-w-wrap py-8">
      <h1 className="text-3xl font-bold text-brand-ink mb-8">AI Lab</h1>
      <p className="text-lg text-slate-600 mb-8">
        AI patterns for SAP environments. Principles, anti-patterns, and hands-on experiments with enterprise context.
      </p>
      
      <div className="space-y-6">
        {posts.map(post => (
          <a key={post.slug} href={`/ai/${post.slug}`} 
             className="block bg-white rounded-lg p-6 shadow-soft border border-black/5 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-brand-ink mb-2">{post.title}</h3>
            <p className="text-slate-600 mb-3">{post.summary}</p>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-brand/10 text-brand rounded">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}