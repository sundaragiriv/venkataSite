export type SignalMeta = {
  slug: string;
  title: string;
  date: string;
  tag: "Tech" | "AI-in-SAP" | "Vedic";
  summary?: string;
  cover?: string;
};

// Vite's eager glob for metadata + components:
const modules = import.meta.glob("../../content/signals/*.mdx", { eager: true }) as Record<string, any>;

export const signals = Object.keys(modules)
  .map((k) => {
    const slug = k.split("/").pop()!.replace(".mdx", "");
    return { slug, ...(modules[k].frontmatter || {}) } as SignalMeta;
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));