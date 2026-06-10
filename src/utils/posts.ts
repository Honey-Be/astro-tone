/**
 * posts.ts — backward-compatible shim. The article model lives in `articles.ts`.
 * `getVisiblePosts` is kept as an alias for callers not yet migrated.
 */
export { isVisible, getVisibleArticles, getVisibleArticles as getVisiblePosts, articleHref } from './articles';
export type { Article } from './articles';
