export default function Veda() {
  const posts = [
    {
      slug: "example-shloka",
      title: "अहिंसा प्रथमा धर्मः",
      transliteration: "ahiṁsā prathamā dharmaḥ",
      translation: "Non-violence is the first duty.",
      tags: ["Dharma", "Ethics"]
    }
  ];

  return (
    <div className="container max-w-wrap py-8">
      <h1 className="text-3xl font-bold text-brand-ink mb-8">Vedic Studio</h1>
      <p className="text-lg text-slate-600 mb-8">
        Ancient wisdom for modern teams. Sanskrit verses with practical applications for leadership and technology.
      </p>
      
      <div className="space-y-6">
        {posts.map(post => (
          <a key={post.slug} href={`/veda/${post.slug}`} 
             className="block bg-white rounded-lg p-6 shadow-soft border border-black/5 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-brand-ink mb-2">{post.title}</h3>
            <p className="text-slate-600 italic mb-1">{post.transliteration}</p>
            <p className="text-slate-700 mb-3">{post.translation}</p>
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