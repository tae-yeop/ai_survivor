import Link from "next/link";
import { HeroHeadline } from "@/components/layout/hero-headline";
import { HeroMarquee } from "@/components/layout/hero-marquee";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { categoryBuckets, publishedPosts, tagBuckets } from "@/lib/content/posts";
import {
  SITE_DESCRIPTION,
  SITE_HERO_HEADLINE,
  SITE_HERO_LEDE,
  SITE_NAME,
} from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const categories = categoryBuckets();
  const tags = tagBuckets();
  const latestPosts = publishedPosts.slice(0, 3);
  const lead = latestPosts[0];
  const runnersUp = latestPosts.slice(1);

  const indexColumns = [
    { label: "categories", href: "/categories", items: categories.slice(0, 6) },
    { label: "tags", href: "/tags", items: tags.slice(0, 6) },
  ];

  const showIndex = categories.length > 0 || tags.length > 0;

  return (
    <>
      <section className="container-hero pt-16 sm:pt-20 pb-8">
        <p className="kicker kicker-accent">AI 시대 생존기</p>
        <HeroHeadline text={SITE_HERO_HEADLINE} />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500 text-pretty">
          {SITE_HERO_LEDE}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/posts">최신 글 보기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">블로그 소개</Link>
          </Button>
        </div>
      </section>

      <HeroMarquee />

      <section className="container-mast py-12">
        <header className="section-marker mb-8">
          <p className="kicker tabular-nums">01 / 02</p>
          <div className="min-w-0">
            <p className="kicker">latest dispatches</p>
            <h2 className="mt-2 font-display text-display text-ink-900">최신 기록</h2>
          </div>
          <Link
            href="/posts"
            className="ml-auto hidden font-mono text-xs uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-accent sm:block"
          >
            모두 보기 →
          </Link>
        </header>

        {lead ? (
          <div className="grid gap-x-12 lg:grid-cols-[1.35fr_1fr]">
            <div className="lg:border-r lg:border-paper-rule lg:pr-12">
              <p className="kicker mb-4">feature / 이번 호 대표</p>
              <PostCard post={lead} variant="feature" />
            </div>
            <ol className="mt-10 list-none lg:mt-0">
              <li className="kicker mb-3 block">runners up</li>
              {runnersUp.map((post, index) => (
                <li key={post.slug}>
                  <PostCard post={post} index={index + 1} />
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="border-y border-paper-rule py-16 text-center font-mono text-sm uppercase tracking-wider text-ink-500">
            아직 공개된 기록이 없습니다.
          </p>
        )}
      </section>

      {showIndex ? (
        <section className="border-y border-paper-rule bg-paper-deep">
          <div className="container-mast py-16">
            <header className="section-marker mb-10">
              <p className="kicker tabular-nums">02 / 02</p>
              <div>
                <p className="kicker">index</p>
                <h2 className="mt-2 font-display text-display text-ink-900">기록소 가는 길</h2>
              </div>
            </header>

            <div className="grid gap-10 lg:grid-cols-2">
              {indexColumns.map((column) => (
                <section key={column.label} className="min-w-0">
                  <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-ink-900 pb-3">
                    <p className="kicker kicker-accent">{column.label}</p>
                    <Link
                      href={column.href}
                      className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-500 hover:text-accent"
                    >
                      전체 →
                    </Link>
                  </div>
                  {column.items.length === 0 ? (
                    <p className="font-mono text-xs text-ink-400">아직 없습니다.</p>
                  ) : (
                    <ol className="list-none divide-y divide-paper-rule">
                      {column.items.map((item, index) => (
                        <li key={item.slug}>
                          <Link
                            href={`${column.href}/${item.slug}`}
                            className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-3 py-3 text-ink-700 transition-colors hover:text-accent"
                          >
                            <span className="font-mono text-[0.7rem] text-accent tabular-nums">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0 break-words">{item.label}</span>
                            <span className="font-mono text-[0.7rem] text-ink-400 tabular-nums">
                              {item.count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
