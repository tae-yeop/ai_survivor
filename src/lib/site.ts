// TypeScript-friendly re-export of site config (see site.config.mjs).
// Astro components import from here; astro.config.mjs imports from the .mjs.
export {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_LANG,
  DEFAULT_OG_IMAGE,
  RSS_TITLE,
  RSS_DESCRIPTION,
  NAV_PRIMARY,
  NAV_FOOTER,
  ADS_ENABLED,
  ADSENSE_CLIENT,
} from './site.config.mjs';
