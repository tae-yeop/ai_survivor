import type { APIContext } from 'astro';
import { SITE_URL } from '../lib/site';

export async function GET(context: APIContext) {
  const base = (context.site?.toString() ?? SITE_URL).replace(/\/+$/, '');
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
