// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Canonical origin. Explicit PUBLIC_SITE_URL wins; otherwise Netlify's `URL`
// (the site's primary domain — switches automatically once a custom domain is
// attached); otherwise the production domain.
const SITE_URL = (
  process.env.PUBLIC_SITE_URL ||
  (process.env.CONTEXT === 'production' ? process.env.URL : undefined) ||
  'https://homespaguide.com'
).replace(/\/$/, '');

// Map each content URL to its `updatedAt` so the sitemap carries honest
// per-page lastmod values instead of "build time" on every URL.
function contentLastmods() {
  const map = new Map();
  const routes = { products: 'products', blog: 'blog', guides: 'guides' };
  for (const [dir, base] of Object.entries(routes)) {
    const abs = join(process.cwd(), 'src/content', dir);
    let files = [];
    try { files = readdirSync(abs).filter((f) => f.endsWith('.md') || f.endsWith('.mdx')); } catch { continue; }
    for (const f of files) {
      const src = readFileSync(join(abs, f), 'utf8');
      const slug = src.match(/^slug:\s*(.+)$/m)?.[1]?.trim() ?? f.replace(/\.mdx?$/, '');
      const date = src.match(/^updatedAt:\s*(.+)$/m)?.[1] ?? src.match(/^publishedAt:\s*(.+)$/m)?.[1];
      if (date) map.set(`/${base}/${slug}`, new Date(date.trim().replace(/['"]/g, '')));
    }
  }
  return map;
}
const lastmods = contentLastmods();

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !/\/(admin|wishlist|compare|search|thanks|404)(\/|$)/.test(page),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '');
        const lm = lastmods.get(path);
        if (lm && !Number.isNaN(+lm)) item.lastmod = lm.toISOString();
        if (path === '') item.priority = 1.0;
        else if (/^\/(guides|blog)\//.test(path)) item.priority = 0.8;
        else if (/^\/(products|category)\//.test(path)) item.priority = 0.7;
        else item.priority = 0.5;
        return item;
      },
    }),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
  build: {
    // /about.html is served at /about on Netlify — no trailing-slash redirects,
    // and URLs match canonicals + sitemap exactly.
    format: 'file',
    inlineStylesheets: 'auto',
  },
});
