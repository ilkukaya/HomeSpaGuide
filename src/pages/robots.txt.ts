import type { APIRoute } from 'astro';

// Search engines AND answer engines are welcome: being quotable by ChatGPT,
// Perplexity, Claude, Gemini and Copilot is a traffic channel (GEO), so the
// AI crawlers are explicitly allowed rather than left to defaults.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'DuckAssistBot',
  'Amazonbot',
  'meta-externalagent',
  'MistralAI-User',
  'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.toString() ?? '').replace(/\/$/, '');
  const disallow = ['/admin/', '/wishlist', '/compare', '/search?', '/pagefind/'];
  const lines = [
    'User-agent: *',
    'Allow: /',
    ...disallow.map((d) => `Disallow: ${d}`),
    '',
    ...AI_AGENTS.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', ...disallow.map((d) => `Disallow: ${d}`), '']),
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
    `# LLM-readable site summary: ${origin}/llms.txt`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
