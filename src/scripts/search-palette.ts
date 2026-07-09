import { withBase } from '../utils/paths';

/**
 * Cmd+K palette search. Two sources, unified into one result list:
 * - **local**: the small `#search-palette-data` JSON payload (title/description/
 *   category only) — used for the empty-query "browse" state and as the dev-mode /
 *   offline fallback, since Pagefind's index only exists after a production build.
 * - **Pagefind**: the same full-text index `/search` uses (`data-pagefind-body`),
 *   loaded lazily and used to upgrade results once the user types a query. This is
 *   what makes the palette a real full-text search instead of a title/description
 *   substring match — searching article *body* content, not just its summary.
 */

type LocalItem = { title: string; description: string; category: string; href: string };
type RenderItem = { title: string; meta: string; snippetHtml: string; href: string };

const MAX_RESULTS = 6;
const PAGEFIND_DEBOUNCE_MS = 150;
let paletteApi: { open: () => void; close: () => void } | null = null;

function normalize(value: string) {
  return value.toLocaleLowerCase().trim();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[char];
  });
}

function getLocalItems(): LocalItem[] {
  const data = document.getElementById('search-palette-data');
  if (!data?.textContent) return [];

  try {
    const parsed = JSON.parse(data.textContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function scoreLocalItem(item: LocalItem, query: string) {
  if (!query) return 1;
  const title = normalize(item.title);
  const category = normalize(item.category);
  const description = normalize(item.description);
  const haystack = `${title} ${category} ${description}`;

  if (title === query) return 100;
  if (title.startsWith(query)) return 80;
  if (title.includes(query)) return 60;
  if (category.includes(query)) return 40;
  if (description.includes(query)) return 20;
  if (query.split(/\s+/).every((part) => haystack.includes(part))) return 10;
  return 0;
}

function searchLocally(items: LocalItem[], query: string): RenderItem[] {
  return items
    .map((item) => ({ item, score: scoreLocalItem(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({ item }) => ({
      title: item.title,
      meta: item.category,
      snippetHtml: escapeHtml(item.description),
      href: item.href,
    }));
}

// ---- Pagefind (production only — its index is a build output) ----

type PagefindResultData = { url: string; excerpt: string; meta: Record<string, string> };
type PagefindResult = { data: () => Promise<PagefindResultData> };
type PagefindApi = { search: (query: string) => Promise<{ results: PagefindResult[] }> };

let pagefindLoad: Promise<PagefindApi | null> | null = null;

function loadPagefind(): Promise<PagefindApi | null> {
  pagefindLoad ??= (async () => {
    if (!import.meta.env.PROD) return null;
    try {
      const mod: PagefindApi & { init?: () => Promise<void> } = await import(
        /* @vite-ignore */ withBase('/pagefind/pagefind.js')
      );
      await mod.init?.();
      return mod;
    } catch {
      return null;
    }
  })();
  return pagefindLoad;
}

async function searchWithPagefind(query: string): Promise<RenderItem[] | null> {
  const pagefind = await loadPagefind();
  if (!pagefind) return null;

  const { results } = await pagefind.search(query);
  const top = await Promise.all(results.slice(0, MAX_RESULTS).map((result) => result.data()));

  return top.map((entry) => ({
    title: entry.meta.title ?? entry.url,
    meta: entry.meta.category ?? '',
    snippetHtml: entry.excerpt,
    href: entry.url,
  }));
}

export function mountSearchPalette(root: ParentNode = document) {
  const dialog = root.querySelector('[data-search-palette]');
  if (!(dialog instanceof HTMLDialogElement)) return;
  if (dialog.dataset.ready === 'true') return;
  dialog.dataset.ready = 'true';

  const input = dialog.querySelector('[data-search-palette-input]');
  const results = dialog.querySelector('[data-search-palette-results]');
  const closeButton = dialog.querySelector('[data-search-palette-close]');
  if (!(input instanceof HTMLInputElement) || !(results instanceof HTMLElement)) return;

  const localItems = getLocalItems();
  let activeIndex = 0;
  let renderedItems: RenderItem[] = [];
  let requestId = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const syncActiveItem = () => {
    results.querySelectorAll<HTMLElement>('[data-search-palette-item]').forEach((item) => {
      item.classList.toggle('is-active', Number(item.dataset.index || 0) === activeIndex);
    });
  };

  const paint = () => {
    activeIndex = Math.min(activeIndex, Math.max(renderedItems.length - 1, 0));

    if (renderedItems.length === 0) {
      const emptyLabel = dialog.dataset.emptyLabel || 'No matching posts.';
      results.innerHTML = `<p class="search-palette-empty">${escapeHtml(emptyLabel)}</p>`;
      return;
    }

    results.innerHTML = renderedItems
      .map(
        (item, index) => `
          <a
            class="search-palette-item${index === activeIndex ? ' is-active' : ''}"
            href="${escapeHtml(item.href)}"
            data-search-palette-item
            data-index="${index}"
          >
            <span class="search-palette-item-main">
              <span class="search-palette-item-title">${escapeHtml(item.title)}</span>
              <span class="search-palette-item-desc">${item.snippetHtml}</span>
            </span>
            ${item.meta ? `<span class="search-palette-item-meta">${escapeHtml(item.meta)}</span>` : ''}
          </a>
        `
      )
      .join('');
  };

  const upgradeWithPagefind = async (query: string) => {
    const myRequest = ++requestId;
    const upgraded = await searchWithPagefind(query);
    // Drop stale responses: a newer query started, or the query changed while awaiting.
    if (myRequest !== requestId || normalize(input.value) !== query) return;
    if (upgraded) {
      renderedItems = upgraded;
      paint();
    }
  };

  const render = () => {
    const query = normalize(input.value);
    // Instant local results first (browse state when empty, cheap substring match
    // otherwise) so the palette never sits blank while Pagefind's index loads.
    renderedItems = searchLocally(localItems, query);
    paint();

    if (debounceTimer) clearTimeout(debounceTimer);
    if (!query) return;
    debounceTimer = setTimeout(() => void upgradeWithPagefind(query), PAGEFIND_DEBOUNCE_MS);
  };

  const open = () => {
    if (dialog.open) {
      requestAnimationFrame(() => input.focus());
      return;
    }

    dialog.showModal();
    input.value = '';
    activeIndex = 0;
    render();
    requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isEditable =
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    if (!dialog.open || (isEditable && target !== input)) return;

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, renderedItems.length - 1);
      paint();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      paint();
      return;
    }

    if (event.key === 'Enter' && renderedItems[activeIndex]) {
      event.preventDefault();
      window.location.href = renderedItems[activeIndex].href;
    }
  });

  input.addEventListener('input', () => {
    activeIndex = 0;
    render();
  });

  closeButton?.addEventListener('click', () => {
    close();
  });

  results.addEventListener('mouseover', (event) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[data-search-palette-item]');
    if (!item) return;
    activeIndex = Number(item.dataset.index || 0);
    syncActiveItem();
  });

  dialog.addEventListener('cancel', () => {
    close();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  // The dialog carries `transition:persist`, so its open/modal state would
  // otherwise survive a client-side navigation started by clicking one of its
  // own result links (View Transitions swaps the rest of the page but never
  // touches <dialog> state on its own) — close it as soon as a transition
  // starts, before the swap, so it never lands open on the destination page.
  document.addEventListener('astro:before-preparation', () => {
    close();
  });

  paletteApi = { open, close };
}

export function openSearchPalette() {
  paletteApi?.open();
}
