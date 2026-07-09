import config from '../../astro-theme-config';

export type CategoryNode = {
  id: string;
  label: string;
  parent?: string;
};

const nodes = config.content.categories as CategoryNode[];
const byId = new Map(nodes.map((node) => [node.id, node]));

/** All category nodes in declared (sibling) order. */
export function allCategories(): CategoryNode[] {
  return nodes;
}

export function getCategory(id: string): CategoryNode | undefined {
  return byId.get(id);
}

/** Ancestor chain from root → this node (inclusive). Drives breadcrumbs + URL. */
export function ancestorsOf(id: string): CategoryNode[] {
  const chain: CategoryNode[] = [];
  let current = byId.get(id);
  const guard = new Set<string>();
  while (current && !guard.has(current.id)) {
    chain.unshift(current);
    guard.add(current.id);
    current = current.parent ? byId.get(current.parent) : undefined;
  }
  return chain;
}

/** URL path segments for a category (chain of ids). */
export function categoryPath(id: string): string[] {
  return ancestorsOf(id).map((node) => node.id);
}

/** Base-relative href for a category archive page. */
export function categoryHref(id: string): string {
  return `/categories/${categoryPath(id).join('/')}/`;
}

/** `id`'s own subtree, including itself — used to roll articles up to parents. */
export function descendantIds(id: string): string[] {
  const result = new Set<string>([id]);
  let added = true;
  while (added) {
    added = false;
    for (const node of nodes) {
      if (node.parent && result.has(node.parent) && !result.has(node.id)) {
        result.add(node.id);
        added = true;
      }
    }
  }
  return [...result];
}

/** Does `categoryId` belong to the subtree rooted at `rootId`? */
export function isInSubtree(categoryId: string | undefined, rootId: string): boolean {
  if (!categoryId) return false;
  return descendantIds(rootId).includes(categoryId);
}

export type CategoryTreeEntry = { node: CategoryNode; depth: number };

/** Depth-first tree order (each node followed by its descendants) — drives the `/categories` index. */
export function categoryTree(): CategoryTreeEntry[] {
  const result: CategoryTreeEntry[] = [];
  const childrenOf = (parentId: string | undefined) => nodes.filter((node) => node.parent === parentId);
  const walk = (parentId: string | undefined, depth: number) => {
    for (const node of childrenOf(parentId)) {
      result.push({ node, depth });
      walk(node.id, depth + 1);
    }
  };
  walk(undefined, 0);
  return result;
}
