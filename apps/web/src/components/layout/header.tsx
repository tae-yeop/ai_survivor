import Link from "next/link";
import { categoryBuckets } from "@/lib/content/posts";
import { NAV_PRIMARY, SITE_NAME } from "@/lib/site";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ThemeToggle } from "@/components/layout/theme-toggle";

function currentIssue() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const week = Math.ceil(((now.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7);
  return `VOL. ${String(year).slice(-2)} · ISSUE ${String(week).padStart(2, "0")}`;
}

export function Header() {
  const categories = categoryBuckets();

  return (
    <header id="site-header" className="relative z-30 bg-bg-primary">
      <div className="container-mast pt-6 pb-4 sm:pt-8">
        <div className="flex items-end justify-between gap-6">
          <Link href="/" className="group flex items-baseline gap-3 leading-none">
            <span className="font-display text-2xl font-bold leading-none tracking-[-0.025em] text-ink-800 sm:text-[1.75rem]">
              AI <span className="text-accent">Vibe</span> Lab
            </span>
            <span
              className="hidden h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent sm:inline-block"
              aria-hidden="true"
            />
            <span className="kicker hidden sm:inline-block">
              {SITE_NAME === "AI Vibe Lab" ? "실험 기록 저널" : SITE_NAME}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex">
              <AdminStatusBadge />
            </span>
            <span className="kicker hidden tabular-nums md:inline">{currentIssue()}</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container-mast">
        <div className="rule-thick" />
      </div>

      <div className="container-mast flex items-center justify-between gap-3 border-b border-paper-rule py-2 sm:hidden">
        <span className="kicker">실험 기록 저널</span>
        <span className="kicker tabular-nums">{currentIssue()}</span>
      </div>

      <nav
        id="site-nav"
        aria-label="Primary"
        className="sticky top-0 z-30 bg-bg-primary/92 backdrop-blur-md"
      >
        <div className="container-mast flex flex-wrap items-center justify-between gap-4 py-2.5 rule-hair">
          <ul className="flex flex-wrap items-center gap-1">
            {NAV_PRIMARY.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative flex items-center gap-1 px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-ink-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
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
