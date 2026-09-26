import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng, type OgCard } from '../../lib/og';

export const getStaticPaths = (async () => {
  const [products, blog, guides, categories, brands] = await Promise.all([
    getCollection('products', ({ data }) => data.status === 'active'),
    getCollection('blog'),
    getCollection('guides'),
    getCollection('categories'),
    getCollection('brands'),
  ]);
  const cards: { slug: string; card: OgCard }[] = [
    { slug: 'default', card: { eyebrow: 'Home spa & hot tub guides', title: 'Find the right hot tub — and keep the water perfect.' } },
    ...products.map((p) => ({
      slug: `products/${p.slug}`,
      card: { eyebrow: 'Buyer’s guide & specs', title: p.data.title, score: p.data.editorScore.overall },
    })),
    ...blog.map((b) => ({
      slug: `blog/${b.slug}`,
      card: { eyebrow: b.data.category.replace(/-/g, ' '), title: b.data.title },
    })),
    ...guides.map((g) => ({ slug: `guides/${g.slug}`, card: { eyebrow: `Guide · ${g.data.topic}`, title: g.data.title } })),
    ...categories.map((c) => ({ slug: `category/${c.slug}`, card: { eyebrow: 'Category', title: `The best ${c.data.name.toLowerCase()}, compared` } })),
    ...brands.map((b) => ({ slug: `brand/${b.slug}`, card: { eyebrow: 'Brand guide', title: `${b.data.name}: models, strengths & trade-offs` } })),
  ];
  return cards.map(({ slug, card }) => ({ params: { slug }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgPng((props as { card: OgCard }).card);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
