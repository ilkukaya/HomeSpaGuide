// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://homespaguide.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/admin'),
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
    inlineStylesheets: 'auto',
  },
});
