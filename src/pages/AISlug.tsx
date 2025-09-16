import { useParams } from "react-router-dom";

// Mock data - in real app, load from MDX files
const mockPost = {
  title: "RASP: Retrieval-Augmented SAP Processes",
  summary: "Bring enterprise context to AI decisions inside SAP flows.",
  tags: ["AI", "SAP", "RAG", "FSM", "Service"],
  pattern: {
    problem: "Agents hallucinate without context.",
    solution: "Inject governed SAP context via retrieval...",
    antiPatterns: ["Letting LLM call S/4 APIs directly without guardrails"]
  },
  code: {
    language: "pseudo",
    snippet: "policy: resolve-email → CDC → CDP → route → Service V2..."
  },
  content: `**Why it works.** Guardrails + retrieval tame variance while preserving the creative power of LLMs for complex business scenarios.

**Implementation.** Use SAP's Change Data Capture (CDC) to maintain fresh context in vector stores, then retrieve relevant business rules before LLM processing.

**Anti-pattern.** Direct API access without governance leads to data leaks and unpredictable system behavior.

**Example.** Service ticket routing that considers customer history, product configuration, and technician availability through retrieved SAP context.`
};

export default function AISlug() {
  const { slug } = useParams();

  return (
    <div className="container max-w-wrap py-8">
      <div className="max-w-prose mx-auto">
        <h1 className="text-3xl font-bold text-brand-ink mb-4">{mockPost.title}</h1>
        <p className="text-lg text-slate-600 mb-6">{mockPost.summary}</p>
        
        <div className="flex gap-2 mb-8">
          {mockPost.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-brand/10 text-brand rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Pattern Section */}
        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-brand-ink mb-4">Pattern</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-red-600">Problem:</span> {mockPost.pattern.problem}
            </div>
            <div>
              <span className="font-medium text-green-600">Solution:</span> {mockPost.pattern.solution}
            </div>
            <div>
              <span className="font-medium text-orange-600">Anti-patterns:</span>
              <ul className="list-disc list-inside mt-1">
                {mockPost.pattern.antiPatterns.map((ap, i) => (
                  <li key={i} className="text-slate-600">{ap}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Code Section */}
        <div className="bg-slate-900 text-slate-100 rounded-lg p-4 mb-8">
          <div className="text-xs text-slate-400 mb-2">{mockPost.code.language}</div>
          <code className="text-sm">{mockPost.code.snippet}</code>
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