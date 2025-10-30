import { PostMetaSchema, type PostMeta } from './schema';

export type SignalMeta = PostMeta & { 
  slug: string; 
  needs_review?: boolean;
  legacy_primary?: string;
};

const modules = import.meta.glob('../../content/signals/*.mdx', { eager: true }) as Record<string, any>

function toISO(d?: string) {
  if (!d) return ''
  const isoLike = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d
  const t = Date.parse(isoLike)
  return Number.isFinite(t) ? new Date(t).toISOString() : ''
}

function mapLegacyPrimary(primary: string): string {
  const mapping: Record<string, string> = {
    'Tech': 'AI-ML',
    'AI-in-SAP': 'AI-ML', 
    'AI/ML': 'AI-ML',
    'Vedic': 'Dharma',
    'SAP-Architecture': 'SAP'
  };
  return mapping[primary] || primary;
}

export const signals: SignalMeta[] = Object.keys(modules).map((k) => {
  const m = modules[k]
  const slug = k.split('/').pop()!.replace('.mdx', '')

  try {
    const rawMeta = m.frontmatter ?? m.meta ?? {}
    const mappedPrimary = mapLegacyPrimary(rawMeta.primary)
    
    const validated = PostMetaSchema.parse({
      ...rawMeta,
      primary: mappedPrimary
    })
    
    return {
      ...validated,
      slug,
      date: toISO(validated.date),
      legacy_primary: rawMeta.primary !== mappedPrimary ? rawMeta.primary : undefined
    }
  } catch (error) {
    console.warn(`Invalid frontmatter in ${slug}.mdx: ${error}`)
    const rawMeta = m.frontmatter ?? m.meta ?? {}
    return {
      title: rawMeta.title || slug,
      date: toISO(rawMeta.date) || new Date().toISOString(),
      primary: 'Uncategorized',
      secondary: Array.isArray(rawMeta.secondary) ? rawMeta.secondary : [],
      summary: rawMeta.summary || 'No summary available',
      slug,
      needs_review: true
    }
  }
}).sort((a, b) => (a.date < b.date ? 1 : -1))

export function fmt(d: string) {
  return d ? new Date(d).toLocaleDateString() : ''
}