import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORY_SLUGS = [
  'ai-tool-review',
  'vibe-coding-lab',
  'ai-workflow-automation',
  'ai-productivity',
  'domain-ai',
] as const;

const DIFFICULTY_VALUES = ['beginner', 'intermediate', 'advanced'] as const;

// Frontmatter contract — see docs/10_content/CONTENT_MODEL.md.
// Update this file together with that doc whenever a field is added or removed.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'slug must be lowercase ascii with hyphens',
      }),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      draft: z.boolean().default(false),
      category: z.enum(CATEGORY_SLUGS),
      tags: z.array(z.string().min(1)).min(1).max(10),
      series: z.string().nullable().optional(),
      seriesOrder: z.number().int().nonnegative().nullable().optional(),
      author: z.string().min(1).default('owner'),
      difficulty: z.enum(DIFFICULTY_VALUES),
      tools: z.array(z.string().min(1)).optional(),
      coverImage: image().or(z.string()).nullable().optional(),
      coverAlt: z.string().nullable().optional(),
      canonical: z.string().url().nullable().optional(),
      ogImage: z.string().nullable().optional(),
    }),
});

export const collections = { posts };

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
export type Difficulty = (typeof DIFFICULTY_VALUES)[number];
export const CATEGORIES = CATEGORY_SLUGS;
