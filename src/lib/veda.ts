// Vedic content loader
export interface VedaPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  audio?: string;
  tags: string[];
  summary?: string;
  content: string;
}

// Simulated Veda posts - in production, these would be loaded from MDX files
export const vedaPosts: VedaPost[] = [
  {
    slug: "ahimsa-psychological-safety",
    title: "Ahiṃsā: The Foundation of Psychological Safety",
    date: "2024-12-20",
    category: "Vedic Principles",
    sanskrit: "अहिंसा परमो धर्मः",
    transliteration: "ahiṃsā paramo dharmaḥ",
    translation: "Non-violence is the highest virtue",
    audio: "/audio/ahimsa.mp3",
    tags: ["Ahimsa", "Team Dynamics", "Leadership", "Psychological Safety"],
    summary: "How ancient Sanskrit principles create psychological safety and honest telemetry in modern SAP implementations.",
    content: "In modern organizational contexts, ahiṃsā extends far beyond physical non-violence..."
  },
  {
    slug: "transcendental-meditation-focus",
    title: "Transcendental Meditation for Technical Focus",
    date: "2024-12-18",
    category: "Meditation Practice", 
    sanskrit: "ध्यानं निर्विषयं मनः",
    transliteration: "dhyānaṃ nirviṣayaṃ manaḥ",
    translation: "Meditation is the mind without objects",
    audio: "/audio/dhyana.mp3",
    tags: ["Meditation", "Focus", "Productivity", "Mental Clarity"],
    summary: "15 years of TM practice insights for sustained technical focus and decision-making clarity.",
    content: "After 15 years of practicing Transcendental Meditation (TM), I've observed profound impacts..."
  },
  {
    slug: "ayurveda-developer-health",
    title: "Ayurvedic Principles for Developer Health & Productivity",
    date: "2024-12-15",
    category: "Ayurveda",
    sanskrit: "स्वस्थस्य स्वास्थ्य रक्षणम्",
    transliteration: "svasthasya svāsthya rakṣaṇam", 
    translation: "Preservation of health in the healthy",
    audio: "/audio/swasthya.mp3",
    tags: ["Ayurveda", "Health", "Productivity", "Work-Life Balance"],
    summary: "Ayurvedic principles for managing the cognitive demands of SAP development while maintaining health.",
    content: "The sedentary, screen-intensive nature of SAP development creates specific health challenges..."
  }
];

export const getVedaPost = (slug: string): VedaPost | undefined => {
  return vedaPosts.find(post => post.slug === slug);
};

export const getVedaPostsByCategory = (category: string): VedaPost[] => {
  return vedaPosts.filter(post => post.category === category);
};

export const getVedaPostsByTag = (tag: string): VedaPost[] => {
  return vedaPosts.filter(post => post.tags.includes(tag));
};