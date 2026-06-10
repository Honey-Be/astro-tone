import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_LANG, SITE_TITLE } from '../consts';
import { withBase } from '../utils/paths';
import { getVisibleArticles, articleHref } from '../utils/articles';

export async function GET(context) {
  const posts = await getVisibleArticles();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: new URL(withBase('/'), context.site),
    customData: `<language>${SITE_LANG}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(articleHref(post)),
    })),
  });
}
