"use client";

import { useCallback, useEffect, useRef } from "react";

const DEFAULT_CHARS = "!<>-_\\/[]{}—=+*^?#______";

export interface ScrambleTextProps {
  text: string;
  revealDelay?: number;
  revealDuration?: number;
  chars?: string;
  trigger?: "inView" | "hover" | "both";
  once?: boolean;
  className?: string;
}

export function ScrambleText({
  text,
  revealDelay = 40,
  revealDuration = 300,
  chars = DEFAULT_CHARS,
  trigger = "both",
  once = false,
  className,
}: ScrambleTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const hasRunRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const run = useCallback(() => {
    if (reducedMotionRef.current) return;
    const el = displayRef.current;
    if (!el) return;

    cancelAnimationFrame(rafRef.current);

    const glyphs = Array.from(text); // handles multi-byte (Korean, emoji)
    const pool = Array.from(chars);
    const len = glyphs.length;
    // Per-character duration with slight variation so they don't all finish at once
    const durations = glyphs.map(() => revealDuration * (0.75 + Math.random() * 0.5));
    const start = performance.now();

    function frame(now: number) {
      if (!el) return;
      const elapsed = now - start;
      let allDone = true;

      const result = glyphs.map((orig, i) => {
        const charStart = i * revealDelay;
        const charEnd = charStart + durations[i]!;
        if (elapsed >= charEnd) return orig;
        allDone = false;
        if (elapsed < charStart) return pool[Math.floor(Math.random() * pool.length)]!;
        return pool[Math.floor(Math.random() * pool.length)]!;
      });

      el.textContent = result.join("");

      if (allDone) {
        el.textContent = text;
      } else {
        rafRef.current = requestAnimationFrame(frame);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }, [text, revealDelay, revealDuration, chars]);

  // IntersectionObserver trigger
  useEffect(() => {
    if (trigger !== "inView" && trigger !== "both") return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (once && hasRunRef.current) return;
        hasRunRef.current = true;
        run();
        if (once) observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, once, run]);

  // Cleanup RAF on unmount
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  function handleMouseEnter() {
    if (trigger !== "hover" && trigger !== "both") return;
    run();
  }

  return (
    <span ref={containerRef} onMouseEnter={handleMouseEnter} className={className}>
      {/* Screen readers always get the real text */}
      <span className="sr-only">{text}</span>
      {/* Visual layer — scrambled glyphs go here */}
      <span ref={displayRef} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
