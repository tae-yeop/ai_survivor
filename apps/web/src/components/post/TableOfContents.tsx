"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: 2 | 3 };

function extractHeadings(): Heading[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]"),
  ).map((el) => ({
    id: el.id,
    text: el.textContent?.replace(/^#+\s*/, "").trim() ?? "",
    level: el.tagName === "H2" ? 2 : 3,
  }));
}

type Props = { className?: string };

export function TableOfContents({ className }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const hs = extractHeadings();
    setHeadings(hs);
    if (hs.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        const active = hs.find((h) => visible.has(h.id));
        if (active) setActiveId(active.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    observerRef.current = observer;

    for (const h of hs) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="목차" className={cn("sticky top-24 w-[180px]", className)}>
      <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-300">
        목차
      </p>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(h.id);
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                  target.setAttribute("tabindex", "-1");
                  target.focus({ preventScroll: true });
                }
              }}
              className={cn(
                "block border-l-2 py-1 text-[11px] leading-snug transition-all",
                h.level === 3 ? "pl-[18px]" : "pl-2.5",
                activeId === h.id
                  ? "border-ink-900 font-semibold text-ink-900"
                  : "border-line text-ink-300 hover:border-ink-400 hover:text-ink-500",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
