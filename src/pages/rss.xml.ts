import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'HomeSpaGuide Blog',
    description: 'Honest reviews, buying guides, and maintenance how-tos for home spas and hot tubs.',
    site: context.site ?? import.meta.env.PUBLIC_SITE_URL ?? 'https://homespaguide.com',
    items: posts
      .sort((a, b) => +b.data.publishedAt - +a.data.publishedAt)
      .map((p) => ({
        title: p.data.title,
        description: p.data.excerpt,
        pubDate: p.data.publishedAt,
        link: `/blog/${p.slug}/`,
      })),
    customData: '<language>en-us</language>',
  });
}
