// Site-wide constants. Imported from astro.config.mjs and src/lib/site.ts so
// the Astro config and runtime code share a single source of truth.
//
// Update SITE_URL to the production domain before deploying.

export const SITE_URL = 'https://example.com';
export const SITE_NAME = 'AI 시대 생존기';
export const SITE_TAGLINE = 'AI 도구, 바이브코딩, 업무 자동화 실험 노트';
export const SITE_DESCRIPTION =
  '개발자, 연구자, 직장인이 실제로 써먹을 수 있는 AI 도구와 바이브코딩, 업무 자동화 워크플로우를 직접 실험하고 검증한 기록.';
export const SITE_LOCALE = 'ko_KR';
export const SITE_LANG = 'ko';
export const DEFAULT_OG_IMAGE = '/images/og/default.png';
export const RSS_TITLE = SITE_NAME;
export const RSS_DESCRIPTION = SITE_DESCRIPTION;

export const NAV_PRIMARY = [
  { href: '/', label: 'Home' },
  { href: '/posts/', label: 'Posts' },
  { href: '/series/', label: 'Series' },
  { href: '/tools/', label: 'Tools' },
  { href: '/about/', label: 'About' },
];

export const NAV_FOOTER = [
  { href: '/privacy/', label: 'Privacy' },
  { href: '/contact/', label: 'Contact' },
  { href: '/rss.xml', label: 'RSS' },
];

// Toggle to true only after AdSense approval. When false, AdSlot renders a
// disabled placeholder (or nothing in production) and never injects the
// AdSense script. See docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md.
export const ADS_ENABLED = false;
export const ADSENSE_CLIENT = ''; // e.g. 'ca-pub-0000000000000000'
