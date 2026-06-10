import { getCollection, type CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

/**
 * A post is publicly visible when it is not a draft and its pubDate is not in
 * the future. This is the single source of truth for listing/visibility so
 * scheduled (future-dated) posts stay hidden until their time.
 */
export function isVisible(post: Post, now: number = Date.now()): boolean {
  return !post.data.draft && post.data.pubDate.valueOf() <= now;
}

/** All visible posts, newest first. */
export async function getVisiblePosts(): Promise<Post[]> {
  const now = Date.now();
  return (await getCollection('posts'))
    .filter((post) => isVisible(post, now))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
