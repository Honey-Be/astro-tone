/**
 * URL-safe slug for taxonomy terms (categories, tags).
 * Keeps Hangul so Korean terms stay readable in URLs; lowercases Latin,
 * collapses whitespace/slashes to hyphens, and trims stray hyphens.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9가-힣-]+/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}
