import Link from "next/link";
import { categoryBuckets } from "@/lib/content/posts";
import { NAV_PRIMARY, SITE_SUBTITLE } from "@/lib/site";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PostsNavDropdown } from "@/components/layout/PostsNavDropdown";

export function Header() {
  const categories = categoryBuckets();

  return (
    <header id="site-header" className="relative z-30 bg-bg-primary">
      <div className="container-mast pt-6 pb-4 sm:pt-8">
        <div className="flex items-end justify-between gap-6">
          <Link href="/" className="group flex items-baseline gap-3 leading-none">
            <span className="font-display text-2xl font-bold leading-none tracking-[-0.025em] text-ink-800 sm:text-[1.75rem]">
              AI 시대 <span className="text-accent">생존기</span>
            </span>
            <span
              className="hidden h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent sm:inline-block"
              aria-hidden="true"
            />
            <span className="kicker hidden sm:inline-block">{SITE_SUBTITLE}</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex">
              <AdminStatusBadge />
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container-mast">
        <div className="rule-thick" />
      </div>

      <div className="container-mast flex items-center justify-between gap-3 border-b border-paper-rule py-2 sm:hidden">
        <span className="kicker">{SITE_SUBTITLE}</span>
      </div>

      <nav
        id="site-nav"
        aria-label="Primary"
        className="sticky top-0 z-30 bg-bg-primary/92 backdrop-blur-md"
      >
        <div className="container-mast flex flex-wrap items-center justify-between gap-4 py-2.5 rule-hair">
          <ul className="flex flex-wrap items-center gap-1">
            {NAV_PRIMARY.map((item) =>
              item.href === "/posts" ? (
                <li key={item.href}>
                  <PostsNavDropdown categories={categories} />
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="hidden items-center gap-2 md:flex">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="label-chip"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
