export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aivibelab.com";
export const SITE_NAME = "AI 시대 생존기";
export const SITE_NAME_EN = "aisurvivor";
export const SITE_SUBTITLE = "컴퓨터쟁이의 기록소";
export const SITE_TAGLINE = "AI 시대 살아남기 위한 컴퓨터쟁이의 기록소";
export const SITE_DESCRIPTION =
  "AI 시대를 살아남기 위해 직접 따라 해본 튜토리얼, 막힌 부분, 비용, 결과물까지 정리하는 1인 기록소.";
export const SITE_HERO_HEADLINE = "AI 튜토리얼, 제가 먼저 끝까지 해봅니다.";
export const SITE_HERO_LEDE = "설치부터 에러, 비용, 결과물까지 — 살아남은 것만 정리합니다.";
export const SITE_FOOTER_SIGNATURE = "안 해본 튜토리얼은 검증되지 않는다";
export const SITE_LOCALE = "ko_KR";
export const SITE_LANG = "ko";
export const DEFAULT_OG_IMAGE = "/images/og/default.svg";
export const RSS_TITLE = SITE_NAME;
export const RSS_DESCRIPTION = SITE_DESCRIPTION;

export const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
] as const;

export const NAV_FOOTER = [
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
  { href: "/rss.xml", label: "RSS" },
] as const;

export const ADS_ENABLED = process.env.ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT || "";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
