import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts, postUrl } from '../lib/posts';
import {
  RSS_TITLE,
  RSS_DESCRIPTION,
  SITE_URL,
  SITE_LANG,
} from '../lib/site';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  return rss({
    title: RSS_TITLE,
    description: RSS_DESCRIPTION,
    site: context.site ?? SITE_URL,
    customData: `<language>${SITE_LANG}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: postUrl(post),
      categories: [post.data.category, ...post.data.tags],
    })),
  });
}
