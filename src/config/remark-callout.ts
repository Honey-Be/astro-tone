import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * `:::tip` / `:::warning` / `:::note` container directives (from `remark-directive`)
 * become `<div class="callout callout-{name}">…</div>` — the exact markup `prose.css`
 * already styles (§ "Usage: <div class="callout callout-tip">"). Works in plain
 * Markdown, not just MDX, since directives are parsed by remark before the
 * markdown/MDX split.
 */
const CALLOUT_NAMES = new Set(['note', 'tip', 'warning']);

export function remarkCallout() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective') return;
      const name = (node as { name?: string }).name;
      if (!name || !CALLOUT_NAMES.has(name)) return;

      const data = (node.data ??= {});
      data.hName = 'div';
      data.hProperties = { class: `callout callout-${name}` };
    });
  };
}
