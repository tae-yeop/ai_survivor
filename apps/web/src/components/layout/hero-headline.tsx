import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Page-headline rendered as per-character spans so global.css's
 * `.char-mast .char` keyframe (blur+slide-in stagger) animates each
 * letter on load. Optional `href` wraps the spans in a Link so the
 * heading can be the primary click target on the home lead post.
 *
 * Server component — no client JS.
 */
export function HeroHeadline({
  text,
  href,
  className,
}: {
  text: string;
  href?: string;
  className?: string;
}) {
  const chars = Array.from(text);
  const inner = chars.map((ch, i) => (
    <span
      key={i}
      className="char"
      style={{ "--ci": i } as CSSProperties}
      aria-hidden="true"
    >
      {ch === " " ? " " : ch}
    </span>
  ));
  return (
    <h1
      className={cn(
        "char-mast font-display text-mast text-ink-900 text-balance leading-[1.05]",
        className,
      )}
      aria-label={text}
    >
      {href ? (
        <Link
          href={href}
          className="transition-colors hover:text-accent focus-visible:text-accent"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </h1>
  );
}
