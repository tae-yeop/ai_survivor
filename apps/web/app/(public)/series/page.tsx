import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { seriesBuckets } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Series",
  description: "연재 글을 순서대로 탐색합니다.",
  path: "/series",
});

export default function SeriesPage() {
  const series = seriesBuckets();
  return (
    <>
      <PageHeader
        kicker="series"
        title="시리즈"
        description="연재 글은 발행 순서와 맥락을 함께 제공합니다."
      />
      <section className="container-wide grid gap-5 py-12 md:grid-cols-2">
        {series.map((item) => (
          <Link
            key={item.slug}
            href={`/series/${item.slug}`}
            className="card-elevated block p-6 transition-colors hover:border-ink-900"
          >
            <p className="kicker kicker-accent">{item.count} posts</p>
            <h2 className="mt-3 font-display text-2xl text-ink-900">{item.label}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              블로그를 만들고 운영하며 얻은 결정과 실패를 순서대로 정리합니다.
            </p>
          </Link>
        ))}
      </section>
    </>
  );
}
