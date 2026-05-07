const ITEMS = [
  "직접 따라 해본 튜토리얼",
  "ChatGPT",
  "Claude Code",
  "Cursor",
  "ElevenLabs",
  "Vercel",
  "Supabase",
  "Kimi",
  "GitHub Actions",
  "비용 정리",
  "에러 노트",
  "약관 주의",
  "결과물 공개",
  "복붙 가능한 세팅",
];

/**
 * Editorial ticker tape. Pure-CSS marquee: track is duplicated so
 * `translateX(-50%)` produces a seamless loop. Pauses on hover.
 * `prefers-reduced-motion` kills the animation in global.css.
 */
export function HeroMarquee() {
  const looped = [...ITEMS, ...ITEMS];
  return (
    <aside className="hero-marquee" aria-hidden="true">
      <ul className="hero-marquee-track">
        {looped.map((item, i) => (
          <li key={i} className="hero-marquee-item">
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
