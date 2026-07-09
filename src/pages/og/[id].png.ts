import type { APIRoute } from 'astro';
import config from '../../../astro-theme-config';
import { getVisibleArticles } from '../../utils/articles';
import { getCategory } from '../../utils/categories';
import { renderOgImagePng } from '../../utils/og-image';

export async function getStaticPaths() {
  const articles = await getVisibleArticles();

  return articles.map((article) => ({
    params: { id: String(article.data.articleId) },
    props: { article },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { article } = props as { article: Awaited<ReturnType<typeof getVisibleArticles>>[number] };
  const category = article.data.category ? getCategory(article.data.category) : undefined;
  const date = new Intl.DateTimeFormat(config.site.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(article.data.pubDate);

  const png = await renderOgImagePng({
    kicker: category?.label ?? config.site.title,
    title: article.data.title,
    meta: `${config.site.title} · ${date}`,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
