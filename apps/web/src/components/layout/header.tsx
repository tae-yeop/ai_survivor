import Link from "next/link";
import { categoryBuckets } from "@/lib/content/posts";
import { NAV_PRIMARY } from "@/lib/site";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { PostsNavDropdown } from "@/components/layout/PostsNavDropdown";

export function Header() {
  const categories = categoryBuckets();

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 border-b border-border bg-bg-surface/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 font-display text-[15px] font-bold tracking-[-0.02em] text-ink-900"
        >
          AI 시대 <span className="text-accent">생존기</span>
        </Link>

        {/* Center nav */}
        <nav
          id="site-nav"
          aria-label="Primary"
          className="flex flex-1 justify-center"
        >
          <ul className="flex items-center gap-0.5">
            {NAV_PRIMARY.map((item) =>
              item.href === "/posts" ? (
                <li key={item.href}>
                  <PostsNavDropdown categories={categories} />
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink-500 transition-colors hover:text-ink-900"
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
      </div>
    </header>
  );
}
