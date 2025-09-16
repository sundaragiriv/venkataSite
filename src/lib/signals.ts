import { PostMetaSchema, type PostMeta } from './schema';

export type SignalMeta = PostMeta & { slug: string };

const modules = import.meta.glob('../../content/signals/*.mdx', { eager: true }) as Record<string, any>

function toISO(d?: string) {
  if (!d) return ''
  const isoLike = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d
  const t = Date.parse(isoLike)
  return Number.isFinite(t) ? new Date(t).toISOString() : ''
}

export const signals: SignalMeta[] = Object.keys(modules).map((k) => {
  const m = modules[k]
  const slug = k.split('/').pop()!.replace('.mdx', '')

  try {
    const validated = PostMetaSchema.parse(m.frontmatter ?? m.meta ?? {})
    return {
      ...validated,
      slug,
      date: toISO(validated.date),
    }
  } catch (error) {
    throw new Error(`Invalid frontmatter in ${slug}.mdx: ${error}`)
  }
}).sort((a, b) => (a.date < b.date ? 1 : -1))

export function fmt(d: string) {
  return d ? new Date(d).toLocaleDateString() : ''
}