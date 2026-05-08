"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Bucket } from "@/lib/content/posts";
import { NAV_PRIMARY } from "@/lib/site";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { PostsNavDropdown } from "@/components/layout/PostsNavDropdown";

const SCROLL_THRESHOLD = 8;

export function FloatingNav({ categories }: { categories: Bucket[] }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function check() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(check);
    }
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <header id="site-header" data-scrolled={scrolled} className="floating-nav">
      {/* Logo */}
      <Link
        href="/"
        className="flex-shrink-0 font-display text-[14px] font-bold tracking-[-0.02em] text-ink-900 sm:text-[15px]"
      >
        AI 시대 <span className="text-accent">생존기</span>
      </Link>

      {/* Center nav */}
      <nav aria-label="Primary" className="flex flex-1 justify-center">
        <ul className="flex items-center">
          {NAV_PRIMARY.map((item) =>
            item.href === "/posts" ? (
              <li key={item.href}>
                <PostsNavDropdown categories={categories} />
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-500 transition-colors hover:text-ink-900 aria-[current=page]:text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      {/* Right: admin */}
      <div className="flex-shrink-0">
        <AdminStatusBadge />
      </div>
    </header>
  );
}
