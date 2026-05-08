"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Bucket } from "@/lib/content/posts";

const TOP_N = 8;
const HOVER_GRACE_MS = 200;

export function PostsNavDropdown({ categories }: { categories: Bucket[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const pathname = usePathname();

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_GRACE_MS);
  }, [cancelClose]);

  useEffect(() => {
    // Close dropdown when the route changes — responding to external router state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (categories.length === 0) {
    return (
      <Link
        href="/posts"
        className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-800"
      >
        Posts
      </Link>
    );
  }

  const top = categories.slice(0, TOP_N);

  return (
    <div
      className="relative flex items-center"
      onPointerEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) scheduleClose();
      }}
    >
      <Link
        ref={triggerRef}
        href="/posts"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onFocus={() => {
          cancelClose();
          setOpen(true);
        }}
        onClick={(e) => {
          if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === "touch") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-800"
      >
        Posts <span aria-hidden="true">▾</span>
      </Link>

      {open ? (
        <ul
          ref={panelRef}
          id={menuId}
          role="menu"
          className="absolute left-0 top-full mt-1 min-w-[16rem] border border-paper-rule bg-paper-elevated shadow-sm"
        >
          <li role="none">
            <Link
              role="menuitem"
              href="/posts"
              className="flex min-h-[44px] items-center justify-between gap-3 border-b border-paper-rule px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-700 transition-colors hover:bg-paper-deep hover:text-ink-900 sm:min-h-[36px]"
            >
              <span>전체 글</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
          {top.map((cat) => (
            <li key={cat.slug} role="none">
              <Link
                role="menuitem"
                href={`/categories/${cat.slug}`}
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-paper-rule px-4 py-2 font-mono text-[0.72rem] tracking-[0.06em] text-ink-700 transition-colors hover:bg-paper-deep hover:text-ink-900 sm:min-h-[36px]"
              >
                <span className="truncate">{cat.label}</span>
                <span className="tabular-nums text-ink-400">{cat.count}</span>
              </Link>
            </li>
          ))}
          <li role="none">
            <Link
              role="menuitem"
              href="/categories"
              className="flex min-h-[44px] items-center justify-between gap-3 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-accent transition-colors hover:bg-paper-deep sm:min-h-[36px]"
            >
              <span>+ 카테고리 모두 보기</span>
            </Link>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
