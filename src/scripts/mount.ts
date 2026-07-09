export function onReady(fn: () => void) {
  document.addEventListener('astro:page-load', fn);
}
