import { getCollection, type CollectionEntry } from 'astro:content';

/** Internal collection key stays `posts`; the public model is "article". */
export type Article = CollectionEntry<'posts'>;

/** Visible = not a draft and not future-dated (scheduled posts stay hidden). */
export function isVisible(article: Article, now: number = Date.now()): boolean {
  return !article.data.draft && article.data.pubDate.valueOf() <= now;
}

/**
 * All visible articles, newest first. Also enforces site-wide uniqueness of
 * `articleId` at build time (the number is the canonical `/article/<id>` route).
 */
export async function getVisibleArticles(): Promise<Article[]> {
  const now = Date.now();
  const all = await getCollection('posts');

  const seen = new Map<number, string>();
  for (const article of all) {
    const id = article.data.articleId;
    const prev = seen.get(id);
    if (prev) {
      throw new Error(`Duplicate articleId ${id} in "${article.id}" and "${prev}".`);
    }
    seen.set(id, article.id);
  }

  return all
    .filter((article) => isVisible(article, now))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Canonical base-relative URL for an article. The ONLY route an article has. */
export function articleHref(article: Article): string {
  return `/article/${article.data.articleId}/`;
}

export type SeriesNav = { prev?: Article; next?: Article };

function seriesSortKey(article: Article): [number, number] {
  return [article.data.seriesOrder ?? Number.POSITIVE_INFINITY, article.data.pubDate.valueOf()];
}

/**
 * Prev/next siblings within the same `series` (ordered by `seriesOrder`, falling back to
 * `pubDate`). Returns `{}` when the article isn't in a series or has no neighbors.
 */
export function seriesNavFor(article: Article, all: Article[]): SeriesNav {
  if (!article.data.series) return {};

  const siblings = all
    .filter((candidate) => candidate.data.series === article.data.series)
    .sort((a, b) => {
      const [aOrder, aDate] = seriesSortKey(a);
      const [bOrder, bDate] = seriesSortKey(b);
      return aOrder - bOrder || aDate - bDate;
    });

  const index = siblings.findIndex((candidate) => candidate.id === article.id);
  if (index === -1) return {};

  return { prev: siblings[index - 1], next: siblings[index + 1] };
}
