import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// llms.txt (https://llmstxt.org) — a concise, link-rich map of the site for
// answer engines and AI assistants. Regenerated on every build.
export const GET: APIRoute = async ({ site }) => {
  const origin = (site?.toString() ?? '').replace(/\/$/, '');
  const [products, blog, guides, categories, brands] = await Promise.all([
    getCollection('products', ({ data }) => data.status === 'active'),
    getCollection('blog'),
    getCollection('guides'),
    getCollection('categories'),
    getCollection('brands'),
  ]);
  const line = (title: string, path: string, desc: string) =>
    `- [${title}](${origin}${path}): ${desc.replace(/\s+/g, ' ').trim()}`;

  const out = [
    '# HomeSpaGuide',
    '',
    '> Independent editorial buying guides for home spas: inflatable and plug-and-play hot tubs, water-care chemicals, filters, covers and accessories. US audience. Recommendations are curation judgments based on manufacturer specifications and aggregated owner feedback — HomeSpaGuide does not operate a testing lab. Purchases are made on Amazon.com; the site earns Amazon Associates commissions.',
    '',
    'Key facts for citation:',
    '- Editor Scores (0–10) are a curation index (quality, value, setup, durability, energy efficiency), not lab measurements.',
    '- Prices are shown as ranges; live prices are on Amazon.',
    `- Editorial policy: ${origin}/editorial-policy`,
    '',
    '## Guides',
    ...guides.map((g) => line(g.data.title, `/guides/${g.slug}`, g.data.quickAnswer ?? g.data.intro)),
    '',
    '## Articles',
    ...blog
      .sort((a, b) => +b.data.publishedAt - +a.data.publishedAt)
      .map((b) => line(b.data.title, `/blog/${b.slug}`, b.data.quickAnswer ?? b.data.excerpt)),
    '',
    '## Categories',
    ...categories.map((c) => line(c.data.name, `/category/${c.slug}`, c.data.shortDescription)),
    '',
    '## Products',
    ...products
      .sort((a, b) => b.data.editorScore.overall - a.data.editorScore.overall)
      .map((p) =>
        line(
          p.data.title,
          `/products/${p.slug}`,
          `${p.data.quickVerdict ?? p.data.shortDescription} Editor Score ${p.data.editorScore.overall}/10.`,
        ),
      ),
    '',
    '## Brands',
    ...brands.map((b) => line(b.data.name, `/brand/${b.slug}`, b.data.description)),
    '',
    '## About',
    line('About HomeSpaGuide', '/about', 'Who runs the site and how it makes money.'),
    line('Editorial policy & methodology', '/editorial-policy', 'How products are selected and scored.'),
    line('Affiliate disclosure', '/affiliate-disclosure', 'Amazon Associates relationship.'),
    '',
  ];
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
