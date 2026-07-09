import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Articles — the only numbered, typed content. Every article is reachable at
 * `/article/<articleId>` regardless of type. Internal collection key stays
 * `posts` (dir `src/content/posts/`) for now; the public model is "article".
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      focusEffect: z.literal('scroll-dark').optional(),
      /** Site-wide unique article number → canonical URL `/article/<articleId>`. */
      articleId: z.number().int().positive(),
      /** Article kind. COD = content-on-demand (VOD/AOD/snippet/dataset/module/asset). */
      articleType: z.enum(['news', 'COD', 'notice', 'research']).default('news'),
      /** Leaf category id from the config category tree. */
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
      /** Optional project membership (project slug). Projects do not nest. */
      project: z.string().optional(),
      /** Optional series membership — a free-text label shared by every article in the series. */
      series: z.string().optional(),
      /** Position within `series` (ascending). Falls back to `pubDate` order when omitted. */
      seriesOrder: z.number().int().positive().optional(),
      /** Author ids (author profile pages are NOT counted as articles). */
      authors: z.array(z.string()).default([]),
      /** Minimal COD descriptor; full origin/CDN management lands in hidmf (meta-task 3). */
      cod: z
        .object({
          kind: z.enum(['vod', 'aod', 'snippet', 'dataset', 'module', 'asset']),
          origin: z.string().optional(),
          note: z.string().optional(),
        })
        .optional(),
      homeFeatured: z.boolean().default(false),
      homeHeroOrder: z.number().int().positive().optional(),
      homeOrder: z.number().int().positive().optional(),
      draft: z.boolean().default(false),
    }),
});

/** Projects — non-nesting groupings with a dedicated banner. Not articles. */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      banner: z.optional(image()),
      accent: z.string().optional(),
      order: z.number().int().positive().optional(),
      draft: z.boolean().default(false),
    }),
});

/** Author profiles. Not articles (excluded from the article count). */
const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      bio: z.string().optional(),
      avatar: z.optional(image()),
      links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    }),
});

export const collections = { posts, projects, authors };
