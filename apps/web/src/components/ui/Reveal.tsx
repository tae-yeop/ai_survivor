"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export interface RevealProps {
  as?: ElementType;
  delay?: number;
  y?: number;
  duration?: number;
  /**
   * When provided (even 0), each direct child is observed individually.
   * Value = stagger delay between children in ms.
   * Use stagger={0} for long lists where items reveal independently on scroll.
   */
  stagger?: number;
  once?: boolean;
  className?: string;
  children: ReactNode;
}

export function Reveal({
  as: Tag = "div",
  delay = 0,
  y = 32,
  duration = 700,
  stagger,
  once = true,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const perItem = stagger !== undefined;
    const staggerMs = stagger ?? 0;
    const targets: HTMLElement[] = perItem
      ? (Array.from(container.children) as HTMLElement[])
      : [container];

    // Hide before first paint (useLayoutEffect runs before browser paints)
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = `translateY(${y}px)`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const hitting = entries.filter((e) => e.isIntersecting);
        if (hitting.length === 0) return;

        // Write phase 1: set transition on all intersecting elements
        hitting.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const idx = targets.indexOf(el);
          const d = delay + idx * staggerMs;
          el.style.willChange = "transform, opacity";
          el.style.transition = `opacity ${duration}ms ${EASING} ${d}ms, transform ${duration}ms ${EASING} ${d}ms`;
        });

        // Single reflow to commit start state before transitions fire
        void container.getBoundingClientRect();

        // Write phase 2: apply final state — browser transitions from start → end
        hitting.forEach((entry) => {
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";

          // Clean up inline styles after animation so CSS classes take over again
          const onEnd = (e: Event) => {
            if ((e as TransitionEvent).propertyName !== "opacity") return;
            el.style.willChange = "";
            el.style.transition = "";
            el.style.opacity = "";
            el.style.transform = "";
            el.removeEventListener("transitionend", onEnd);
          };
          el.addEventListener("transitionend", onEnd);

          if (once) observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [delay, y, duration, stagger, once]);

  const TagEl = Tag as ElementType;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TagEl ref={ref as any} className={className}>
      {children}
    </TagEl>
  );
}
