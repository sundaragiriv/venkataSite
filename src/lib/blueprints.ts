import { z } from "zod";

const BlueprintMetaSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  primary: z.enum(["AI/ML", "SAP", "Dharma"]),
  secondary: z.array(z.enum([
    // SAP secondary tags
    "CX", "S4HANA", "FSM", "CPQ", "Integration",
    // AI/ML secondary tags  
    "Joule", "MLOps", "Recommendations", "Analytics",
    // Dharma secondary tags
    "Veda", "Practice", "Reflections", "Rituals"
  ])).max(3).optional(),
  excerpt: z.string(),
  impact: z.array(z.string()),
  authors: z.array(z.string()),
  pdf: z.string(),
  og_image: z.string().optional(),
  related_signals: z.array(z.string()).optional(),
});

export type BlueprintMeta = z.infer<typeof BlueprintMetaSchema> & { slug: string };

const modules = import.meta.glob('../../content/blueprints/*.mdx', { eager: true }) as Record<string, any>

function toISO(d?: string) {
  if (!d) return ''
  const isoLike = /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d
  const t = Date.parse(isoLike)
  return Number.isFinite(t) ? new Date(t).toISOString() : ''
}

export const blueprints: BlueprintMeta[] = Object.keys(modules).map((k) => {
  const m = modules[k]
  const slug = k.split('/').pop()!.replace('.mdx', '')

  try {
    const validated = BlueprintMetaSchema.parse(m.frontmatter ?? m.meta ?? {})
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