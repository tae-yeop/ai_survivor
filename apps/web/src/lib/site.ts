export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aivibelab.com";
export const SITE_NAME = "AI Vibe Lab";
export const SITE_TAGLINE = "AI 도구, 바이브코딩, 업무 자동화 실험 노트";
export const SITE_DESCRIPTION =
  "개발자, 연구자, 직장인이 실제로 써먹을 수 있는 AI 도구와 바이브코딩, 업무 자동화 워크플로우를 직접 실험하고 검증한 기록.";
export const SITE_LOCALE = "ko_KR";
export const SITE_LANG = "ko";
export const DEFAULT_OG_IMAGE = "/images/og/default.svg";
export const RSS_TITLE = SITE_NAME;
export const RSS_DESCRIPTION = SITE_DESCRIPTION;

export const NAV_PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/series", label: "Series" },
  { href: "/tools", label: "Tools" },
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
