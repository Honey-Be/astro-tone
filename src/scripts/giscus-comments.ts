import { onReady } from './mount';

const GISCUS_ORIGIN = 'https://giscus.app';
const GISCUS_CLIENT_SRC = `${GISCUS_ORIGIN}/client.js`;
const GISCUS_CUSTOM_THEME_HEIGHT_BUFFER = 40;
const GISCUS_LOAD_ROOT_MARGIN = '1600px 0px';
const GISCUS_IDLE_LOAD_DELAY = 0;
const GISCUS_IDLE_LOAD_TIMEOUT = 1800;
const GISCUS_REVEAL_MIN_HEIGHT = 500;
const GISCUS_REVEAL_STABILIZE_DELAY = 180;
const GISCUS_REVEAL_FALLBACK_DELAY = 3600;
const themeCache = new Map<string, string>();
let themeObserver: MutationObserver | null = null;
let resizeMessageListenerMounted = false;
let lastGiscusResizeHeight: number | null = null;
let giscusLoadObserver: IntersectionObserver | null = null;
let giscusRevealTimer: number | null = null;
let giscusRevealTimerKind: 'fallback' | 'measured' | null = null;

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const isDarkTheme = (): boolean => {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark') return true;
  if (attr === 'light') return false;

  const stored = safeGetItem('theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const resolveGiscusTheme = async (container: HTMLElement): Promise<string> => {
  if (container.dataset.themeMode !== 'custom') {
    return container.dataset.theme || 'preferred_color_scheme';
  }

  const isDark = isDarkTheme();
  const themePath = isDark ? container.dataset.darkThemePath : container.dataset.lightThemePath;
  if (!themePath) return container.dataset.theme || 'preferred_color_scheme';

  try {
    const themeUrl = new URL(themePath, window.location.href).toString();
    if (window.location.protocol === 'https:') return themeUrl;
    if (themeCache.has(themeUrl)) return themeCache.get(themeUrl)!;

    const response = await fetch(themeUrl);
    if (!response.ok) throw new Error(`Giscus theme fetch failed: ${response.status}`);
    const css = await response.text();
    const compactCss = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,>])\s*/g, '$1')
      .trim();
    const dataTheme = `data:text/css;charset=utf-8,${encodeURIComponent(compactCss)}`;
    themeCache.set(themeUrl, dataTheme);
    return dataTheme;
  } catch {
    return isDark ? 'noborder_dark' : 'noborder_light';
  }
};

const setDataAttribute = (
  script: HTMLScriptElement,
  name: string,
  value: string | undefined,
): void => {
  if (value) script.setAttribute(name, value);
};

const revealGiscus = (container: HTMLElement): void => {
  container.classList.add('is-ready');
  container.classList.remove('is-loading');
};

const scheduleGiscusReveal = (
  container: HTMLElement,
  delay: number,
  options: { kind?: 'fallback' | 'measured'; requireMeasuredHeight?: boolean } = {},
): void => {
  if (giscusRevealTimer !== null) window.clearTimeout(giscusRevealTimer);
  giscusRevealTimerKind = options.kind || 'measured';
  giscusRevealTimer = window.setTimeout(() => {
    giscusRevealTimer = null;
    giscusRevealTimerKind = null;
    if (container.dataset.giscusLoaded !== 'true') return;
    if (options.requireMeasuredHeight) {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (!iframe || iframe.getBoundingClientRect().height < GISCUS_REVEAL_MIN_HEIGHT) return;
    }
    revealGiscus(container);
  }, delay);
};

const scheduleIdleLoad = (load: () => void): void => {
  const idleCallback = window.requestIdleCallback;
  window.setTimeout(() => {
    if (idleCallback) {
      idleCallback(load, { timeout: GISCUS_IDLE_LOAD_TIMEOUT });
      return;
    }
    load();
  }, GISCUS_IDLE_LOAD_DELAY);
};

const appendGiscusClient = async (container: HTMLElement): Promise<void> => {
  const theme = await resolveGiscusTheme(container);
  if (giscusRevealTimer !== null) window.clearTimeout(giscusRevealTimer);
  giscusRevealTimer = null;
  container.classList.remove('is-ready', 'is-resized');
  container.classList.add('is-loading');
  container.innerHTML = '';

  const script = document.createElement('script');
  script.src = GISCUS_CLIENT_SRC;
  script.async = true;
  script.crossOrigin = 'anonymous';

  setDataAttribute(script, 'data-repo', container.dataset.repo);
  setDataAttribute(script, 'data-repo-id', container.dataset.repoId);
  setDataAttribute(script, 'data-category', container.dataset.category);
  setDataAttribute(script, 'data-category-id', container.dataset.categoryId);
  setDataAttribute(script, 'data-mapping', container.dataset.mapping);
  setDataAttribute(script, 'data-term', container.dataset.term);
  setDataAttribute(script, 'data-strict', container.dataset.strict);
  setDataAttribute(script, 'data-reactions-enabled', container.dataset.reactionsEnabled);
  setDataAttribute(script, 'data-emit-metadata', container.dataset.emitMetadata);
  setDataAttribute(script, 'data-input-position', container.dataset.inputPosition);
  setDataAttribute(script, 'data-lang', container.dataset.lang);
  setDataAttribute(script, 'data-loading', container.dataset.loading || 'eager');
  setDataAttribute(script, 'data-theme', theme);

  container.appendChild(script);

  scheduleGiscusReveal(container, GISCUS_REVEAL_FALLBACK_DELAY, { kind: 'fallback' });
};

const mountResizeMessageListener = (): void => {
  if (resizeMessageListenerMounted) return;
  resizeMessageListenerMounted = true;

  const applyMeasuredHeight = (resizeHeight: number): void => {
    const container = document.getElementById('giscus-container');
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!container || !iframe) return;

    container.classList.add('is-resized');

    if (container.dataset.themeMode !== 'custom') return;

    iframe.style.height = `${Math.ceil(resizeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;

    const hasMeasuredHeight = iframe.getBoundingClientRect().height >= GISCUS_REVEAL_MIN_HEIGHT;
    if (container.classList.contains('is-loading') && resizeHeight >= GISCUS_REVEAL_MIN_HEIGHT && hasMeasuredHeight) {
      scheduleGiscusReveal(container, GISCUS_REVEAL_STABILIZE_DELAY, {
        kind: 'measured',
        requireMeasuredHeight: true,
      });
    } else if (resizeHeight < GISCUS_REVEAL_MIN_HEIGHT && giscusRevealTimerKind === 'measured') {
      if (giscusRevealTimer !== null) window.clearTimeout(giscusRevealTimer);
      giscusRevealTimer = null;
      giscusRevealTimerKind = null;
    }
  };

  const scheduleMeasuredHeight = (resizeHeight: number): void => {
    window.requestAnimationFrame(() => applyMeasuredHeight(resizeHeight));
    [120, 500, 1200].forEach((delay) => {
      window.setTimeout(() => applyMeasuredHeight(resizeHeight), delay);
    });
  };

  window.addEventListener('message', (event) => {
    if (event.origin !== GISCUS_ORIGIN) return;

    const data = event.data as { giscus?: { resizeHeight?: unknown } } | null;
    const resizeHeight = data?.giscus?.resizeHeight;
    if (typeof resizeHeight !== 'number' || !Number.isFinite(resizeHeight)) return;

    lastGiscusResizeHeight = resizeHeight;
    const container = document.getElementById('giscus-container');
    if (container) {
      if (resizeHeight >= GISCUS_REVEAL_MIN_HEIGHT) {
        scheduleGiscusReveal(container, GISCUS_REVEAL_STABILIZE_DELAY, {
          kind: 'measured',
          requireMeasuredHeight: true,
        });
      } else if (giscusRevealTimerKind === 'measured' && giscusRevealTimer !== null) {
        window.clearTimeout(giscusRevealTimer);
        giscusRevealTimer = null;
        giscusRevealTimerKind = null;
      }
    }
    scheduleMeasuredHeight(resizeHeight);
  });
};

const isGiscusFrameReady = (iframe: HTMLIFrameElement): boolean => {
  if (!iframe.src.startsWith(GISCUS_ORIGIN)) return false;
  try {
    // While the iframe is still about:blank it is same-origin and target-origin postMessage logs
    // in Firefox/WebKit. Once giscus has loaded, reading location is blocked by cross-origin.
    void iframe.contentWindow?.location.href;
    return false;
  } catch {
    return true;
  }
};

const updateGiscusTheme = async (container: HTMLElement): Promise<void> => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  if (!iframe?.contentWindow) return;

  const theme = await resolveGiscusTheme(container);
  const postTheme = (attempt = 0) => {
    const giscusIframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!giscusIframe?.contentWindow) return;
    if (!isGiscusFrameReady(giscusIframe)) {
      if (attempt < 8) window.setTimeout(() => postTheme(attempt + 1), 250);
      return;
    }
    try {
      giscusIframe.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, GISCUS_ORIGIN);
    } catch {
      if (attempt < 3) window.setTimeout(() => postTheme(attempt + 1), 350);
    }
  };

  postTheme();

  if (lastGiscusResizeHeight !== null) {
    const resizeHeight = lastGiscusResizeHeight;
    window.setTimeout(() => {
      const giscusIframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (!giscusIframe || container.dataset.themeMode !== 'custom') return;
      giscusIframe.style.height = `${Math.ceil(resizeHeight + GISCUS_CUSTOM_THEME_HEIGHT_BUFFER)}px`;
    }, 250);
  }
};

export const mountGiscusComments = (): void => {
  onReady(() => {
    const container = document.getElementById('giscus-container');
    if (!container) return;
    if (container.dataset.giscusReady === 'true') return;
    container.dataset.giscusReady = 'true';

    mountResizeMessageListener();

    const load = () => {
      if (container.dataset.giscusLoaded === 'true') return;
      container.dataset.giscusLoaded = 'true';
      void appendGiscusClient(container);

      themeObserver?.disconnect();
      themeObserver = new MutationObserver(() => {
        void updateGiscusTheme(container);
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    };

    if ('IntersectionObserver' in window) {
      giscusLoadObserver?.disconnect();
      giscusLoadObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          giscusLoadObserver?.disconnect();
          giscusLoadObserver = null;
          load();
        },
        { rootMargin: GISCUS_LOAD_ROOT_MARGIN }
      );
      giscusLoadObserver.observe(container);
      scheduleIdleLoad(load);
      return;
    }

    setTimeout(load, 1200);
  });
};
