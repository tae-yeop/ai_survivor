import Link from "next/link";
import { HeroHeadline } from "@/components/layout/hero-headline";
import { PostCard } from "@/components/post/post-card";
import { categoryBuckets, publishedPosts, tagBuckets } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const categories = categoryBuckets();
  const tags = tagBuckets();
  const latestPosts = publishedPosts.slice(0, 5);
  const lead = latestPosts[0];
  const runnersUp = latestPosts.slice(1, 4);

  const indexColumns = [
    { label: "categories", href: "/categories", items: categories.slice(0, 6) },
    { label: "tags", href: "/tags", items: tags.slice(0, 6) },
  ];

  const showIndex = categories.length > 0 || tags.length > 0;

  return (
    <>
      <section className="container-mast pt-10 sm:pt-14 pb-16">
        {lead ? (
          <>
            <article className="border-y border-paper-rule py-10 sm:py-14">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <Link
                  href={`/categories/${lead.category}`}
                  className="kicker kicker-accent hover:underline underline-offset-4"
                >
                  {categoryLabel(lead.category)}
                </Link>
                <span className="kicker text-ink-400">{lead.difficulty}</span>
                <time dateTime={lead.publishedAt} className="dateline ml-auto">
                  {lead.publishedAt}
                </time>
              </div>

              <HeroHeadline
                text={lead.title}
                href={`/posts/${lead.slug}`}
                className="mt-6 max-w-5xl"
              />

              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-ink-600 text-pretty sm:text-xl">
                {lead.description}
              </p>

              <div className="mt-9 flex flex-wrap items-baseline justify-between gap-4 border-t border-paper-rule pt-5">
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  <span className="dateline">{lead.readingTimeMinutes}분 읽기</span>
                  {lead.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="font-mono text-[0.7rem] text-ink-400 transition-colors hover:text-accent"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/posts/${lead.slug}`}
                  className="kicker kicker-accent whitespace-nowrap hover:underline underline-offset-4"
                >
                  Read →
                </Link>
              </div>
            </article>

            {runnersUp.length > 0 ? (
              <div className="mt-14">
                <header className="section-marker mb-6">
                  <div>
                    <p className="kicker">runners up</p>
                  </div>
                  <Link
                    href="/posts"
                    className="ml-auto font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-accent"
                  >
                    모두 보기 →
                  </Link>
                </header>
                <ol className="grid list-none gap-x-12 sm:grid-cols-2">
                  {runnersUp.map((post, index) => (
                    <li key={post.slug}>
                      <PostCard post={post} index={index + 1} />
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </>
        ) : (
          <div className="border-y border-paper-rule py-20 text-center">
            <p className="kicker">latest dispatch</p>
            <p className="mt-4 font-mono text-sm text-ink-500">
              아직 공개된 기록이 없습니다.
            </p>
          </div>
        )}
      </section>

      {showIndex ? (
        <section className="border-y border-paper-rule bg-paper-deep">
          <div className="container-mast py-16">
            <header className="section-marker mb-10">
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
