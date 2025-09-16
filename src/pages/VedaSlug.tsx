import { useParams } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";

// Mock data - in real app, load from MDX files
const mockPost = {
  title: "अहिंसा प्रथमा धर्मः",
  transliteration: "ahiṁsā prathamā dharmaḥ",
  translation: "Non-violence is the first duty.",
  audioUrl: "/audio/ahimsa.mp3",
  tags: ["Dharma", "Ethics"],
  content: `**Reflection.** In modern teams, अहिंसा shows up as psychological safety—creating environments where people can express ideas without fear of judgment or retaliation.

**Application.** When architecting systems, we practice अहिंसा by designing for graceful degradation rather than catastrophic failure, ensuring our technical decisions don't harm user experience or business continuity.

**Wisdom.** True strength in leadership comes not from force, but from creating conditions where everyone can contribute their best work.`
};

export default function VedaSlug() {
  const { slug } = useParams();

  return (
    <div className="container max-w-wrap py-8">
      <div className="max-w-prose mx-auto">
        <h1 className="text-3xl font-bold text-brand-ink mb-4">{mockPost.title}</h1>
        <p className="text-lg text-slate-600 italic mb-2">{mockPost.transliteration}</p>
        <p className="text-lg text-slate-700 mb-6">{mockPost.translation}</p>
        
        <AudioPlayer src={mockPost.audioUrl} />
        
        <div className="flex gap-2 mb-8">
          {mockPost.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-brand/10 text-brand rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="prose prose-slate max-w-none">
          {mockPost.content.split('\n\n').map((paragraph, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </div>
      </div>
    </div>
  );
}