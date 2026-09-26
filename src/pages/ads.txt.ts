import type { APIRoute } from 'astro';

// Authorised Digital Sellers. Populated automatically once the AdSense
// publisher ID (ca-pub-XXXX) is set in PUBLIC_ADSENSE_CLIENT.
export const GET: APIRoute = () => {
  const client = import.meta.env.PUBLIC_ADSENSE_CLIENT?.replace(/^ca-/, '');
  const body = client
    ? `google.com, ${client}, DIRECT, f08c47fec0942fa0\n`
    : '# No ad networks configured yet.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
