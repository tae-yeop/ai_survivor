import { FOOTER_SIGNATURE, HERO_LEDE, SITE_HERO_COPY } from "./brand-copy.ts";

type SiteUrlEnv = Record<string, string | undefined> & {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
};

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function withHttps(hostOrUrl: string) {
  if (/^https?:\/\//.test(hostOrUrl)) {
    return hostOrUrl;
  }

  return `https://${hostOrUrl}`;
}

export function resolveSiteUrl(env: SiteUrlEnv = process.env) {
  if (env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(env.NEXT_PUBLIC_SITE_URL);
  }

  if (env.VERCEL_PROJECT_PRODUCTION_URL) {
    return normalizeSiteUrl(withHttps(env.VERCEL_PROJECT_PRODUCTION_URL));
  }

  if (env.VERCEL_URL) {
    return normalizeSiteUrl(withHttps(env.VERCEL_URL));
  }

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "AI 시대 생존기";
export const SITE_NAME_EN = "aisurvivor";
export const SITE_SUBTITLE = "컴퓨터쟁이의 기록소";
export const SITE_TAGLINE = "AI 시대 살아남기 위한 생존러의 기록소";
export const SITE_DESCRIPTION =
  "AI 시대를 살아남기 위해 부딪히며 배운 도구, 에러, 비용, 결과물을 정리하는 1인 생존 기록소.";
export const SITE_HERO_HEADLINE = SITE_HERO_COPY;
export const SITE_HERO_LEDE = HERO_LEDE;
export const SITE_FOOTER_SIGNATURE = FOOTER_SIGNATURE;
export const SITE_LOCALE = "ko_KR";
export const SITE_LANG = "ko";
export const DEFAULT_OG_IMAGE = "/images/og/default.svg";
export const RSS_TITLE = SITE_NAME;
export const RSS_DESCRIPTION = SITE_DESCRIPTION;

export const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
] as const;

export const NAV_FOOTER = [
  { href: "/resources", label: "Resources" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
  { href: "/rss.xml", label: "RSS" },
] as const;

export const ADS_ENABLED = process.env.ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT || "";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
