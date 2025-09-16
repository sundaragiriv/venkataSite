export type SignalMeta = {
  slug: string
  title: string
  date: string
  tag: 'Tech' | 'AI-in-SAP' | 'Vedic'
  summary?: string
  cover?: string
}

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

  const fm = (m.frontmatter ?? m.meta ?? {}) as Partial<SignalMeta>
  return {
    slug,
    title: fm.title ?? slug,
    date: toISO(fm.date),
    tag: (fm.tag as any) ?? 'Tech',
    summary: fm.summary ?? '',
    cover: fm.cover ?? ''
  }
}).sort((a, b) => (a.date < b.date ? 1 : -1))

export function fmt(d: string) {
  return d ? new Date(d).toLocaleDateString() : ''
}