import type { CSSProperties } from "react";

/**
 * Renders the hero headline as per-character spans so global.css's
 * `.char-mast .char` keyframe (blur+slide-in stagger) can animate each
 * letter on page load. Server component — no client JS needed.
 */
export function HeroHeadline({ text }: { text: string }) {
  const chars = Array.from(text);
  return (
    <h1
      className="char-mast mt-4 max-w-4xl font-display text-mast text-ink-900 text-balance leading-[1.05]"
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          className="char"
          style={{ "--ci": i } as CSSProperties}
          aria-hidden="true"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </h1>
  );
}
