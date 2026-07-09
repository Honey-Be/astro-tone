import config from '../../astro-theme-config';
import { withBase } from '../utils/paths';

export function GET() {
  const manifest = {
    name: config.site.title,
    short_name: config.site.logoLabel,
    description: config.site.description,
    lang: config.site.lang,
    start_url: withBase('/'),
    scope: withBase('/'),
    display: 'standalone',
    background_color: '#f7fbfd',
    theme_color: '#f7fbfd',
    icons: [
      { src: withBase('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: withBase('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
}
