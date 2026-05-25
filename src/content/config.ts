import { defineCollection, z } from 'astro:content';

const lessons = defineCollection({
  type: 'content',
  schema: z.object({
    id:          z.string(),
    title:       z.string(),
    domain:      z.string(),
    taskRef:     z.string().optional(),
    order:       z.number(),
    xp:          z.number(),
    tag:         z.string(),
    duration:    z.string(),
    analogy:     z.string(),
    examTrap:    z.string().optional(),
    keyPoints:   z.array(z.string()),
    antiPatterns:z.array(z.string()).optional(),
    tbChallenge: z.string().optional(),
  }),
});

const questions = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    id:           z.string(),
    scenario:     z.string(),
    scenarioName: z.string(),
    domain:       z.string(),
    difficulty:   z.enum(['Easy', 'Medium', 'Hard']),
    taskRef:      z.string(),
    question:     z.string(),
    options:      z.array(z.string()).length(4),
    correct:      z.number().min(0).max(3),
    xp:           z.number(),
    explanation:  z.string(),
    whyWrong:     z.array(z.string()).length(4),
  })),
});

const flashcards = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    id:     z.string(),
    domain: z.string(),
    front:  z.string(),
    back:   z.string(),
    tag:    z.enum(['Fact', 'Decision Rule', 'Anti-Pattern', 'Exam Trap']),
  })),
});

export const collections = { lessons, questions, flashcards };
