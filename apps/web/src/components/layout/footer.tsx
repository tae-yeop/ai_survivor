import Link from "next/link";
import { NAV_FOOTER, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 bg-bg-primary">
      <div className="container-mast">
        <div className="rule-thick" />
      </div>
      <div className="container-mast pt-12 pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="kicker kicker-accent">end of dispatch</p>
            <p className="mt-3 font-display text-3xl font-bold leading-[1.2] tracking-[-0.022em] text-ink-800 text-balance sm:text-[2rem]">
              기록되지 않은 실험은 <span className="text-accent">사라진다.</span>
            </p>
            <p className="mt-5 max-w-md leading-relaxed text-ink-500">{SITE_TAGLINE}</p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/rss.xml"
                className="inline-flex items-center gap-2 border border-ink-800 px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-800 transition-colors hover:bg-ink-800 hover:text-paper"
              >
                RSS 구독
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-accent"
              >
                정정 / 제안 <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <p className="kicker">§ 01 — 글</p>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink-600">
                <li>
                  <Link href="/posts" className="transition-colors hover:text-accent">
                    전체 글
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="transition-colors hover:text-accent">
                    카테고리
                  </Link>
                </li>
                <li>
                  <Link href="/series" className="transition-colors hover:text-accent">
                    시리즈
                  </Link>
                </li>
                <li>
                  <Link href="/tags" className="transition-colors hover:text-accent">
                    태그
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="transition-colors hover:text-accent">
                    도구별
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="kicker">§ 02 — 정보</p>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink-600">
                {NAV_FOOTER.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-paper-rule pt-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-baseline">
            <p className="font-mono text-xs leading-relaxed text-ink-400">
              <span className="text-ink-700">
                © {year} {SITE_NAME}.
              </span>{" "}
              Set in <span className="font-medium text-ink-700">Pretendard</span>,{" "}
              <span className="font-serif italic text-ink-700">Fraunces</span> &amp; JetBrains Mono.
              All rights reserved.
            </p>
            <a
              href="#main"
              className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-accent"
            >
              맨 위로
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
