import { z } from "zod";

export const PostMetaSchema = z.object({
  title: z.string(),
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
  summary: z.string().optional(),
  cover: z.string().optional(),
});

export const StoryMetaSchema = z.object({
  title: z.string(),
  client: z.string().optional(),
  year: z.number().or(z.string()),
  role: z.string().optional(),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
  cover: z.string().optional(),
});

export type PostMeta = z.infer<typeof PostMetaSchema>;
export type StoryMeta = z.infer<typeof StoryMetaSchema>;