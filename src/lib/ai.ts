// AI content loader
export interface AIPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  difficulty?: string;
  summary?: string;
  content: string;
}

// Simulated AI posts - in production, these would be loaded from MDX files
export const aiPosts: AIPost[] = [
  {
    slug: "sap-joule-integration-patterns",
    title: "SAP Joule: Enterprise AI Assistant Integration Patterns",
    date: "2024-12-22",
    category: "SAP AI",
    tags: ["Joule", "SAP AI", "Conversational AI", "Enterprise Assistant"],
    difficulty: "Intermediate",
    summary: "Complete guide to integrating SAP Joule with practical patterns and implementation strategies.",
    content: "SAP Joule represents a significant evolution in enterprise AI assistants..."
  },
  {
    slug: "sap-cx-ai-toolkit",
    title: "SAP CX AI Toolkit: Practical Implementation Guide", 
    date: "2024-12-20",
    category: "SAP AI",
    tags: ["CX AI Toolkit", "Sales Cloud", "Service Cloud", "AI Implementation"],
    difficulty: "Advanced",
    summary: "Comprehensive guide to implementing SAP CX AI Toolkit with real-world examples.",
    content: "The SAP CX AI Toolkit provides pre-built AI capabilities..."
  },
  {
    slug: "genai-enterprise-patterns",
    title: "Generative AI in Enterprise: Patterns Beyond the Hype",
    date: "2024-12-25", 
    category: "GenAI",
    tags: ["Generative AI", "LLM", "Enterprise AI", "RAG", "Fine-tuning"],
    difficulty: "Advanced",
    summary: "Production-ready GenAI patterns for enterprise environments with governance and security.",
    content: "Generative AI represents a paradigm shift in enterprise software..."
  }
];

export const getAIPost = (slug: string): AIPost | undefined => {
  return aiPosts.find(post => post.slug === slug);
};

export const getAIPostsByCategory = (category: string): AIPost[] => {
  return aiPosts.filter(post => post.category === category);
};

export const getAIPostsByTag = (tag: string): AIPost[] => {
  return aiPosts.filter(post => post.tags.includes(tag));
};