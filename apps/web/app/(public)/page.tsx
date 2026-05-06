import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { Button } from "@/components/ui/button";
import { categoryBuckets, publishedPosts, seriesBuckets, toolBuckets } from "@/lib/content/posts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const categories = categoryBuckets();
  const series = seriesBuckets();
  const tools = toolBuckets();

  return (
    <>
      <PageHeader
        kicker="AI Vibe Lab"
        title="AI 도구와 바이브코딩을 직접 실험하고 기록하는 독립 블로그"
        description="문서화, 실험, 실패 회고를 바탕으로 AI 시대의 개발·업무 자동화 워크플로우를 검증합니다."
      />

      <section className="container-hero py-10">
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/posts">최신 글 보기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">블로그 소개</Link>
          </Button>
        </div>
      </section>

      <section className="container-hero py-8">
        <div className="section-marker">
          <div>
            <p className="kicker">latest dispatches</p>
            <h2 className="mt-2 font-display text-display text-ink-900">최신 글 3개</h2>
          </div>
        </div>
      </section>
      <PostList posts={publishedPosts.slice(0, 3)} />

      <section className="container-wide grid gap-5 py-10 md:grid-cols-3">
        <div className="card-elevated p-6">
          <p className="kicker kicker-accent">categories</p>
          <ul className="mt-5 space-y-3">
            {categories.map((category) => (
              <li
                key={category.slug}
                className="flex items-baseline justify-between gap-3 border-b border-paper-rule pb-2"
              >
                <Link href={`/categories/${category.slug}`} className="hover:text-accent">
                  {category.label}
                </Link>
                <span className="dateline">{category.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-elevated p-6">
          <p className="kicker kicker-accent">series</p>
          <ul className="mt-5 space-y-3">
            {series.map((item) => (
              <li
                key={item.slug}
                className="flex items-baseline justify-between gap-3 border-b border-paper-rule pb-2"
              >
                <Link href={`/series/${item.slug}`} className="hover:text-accent">
                  {item.label}
                </Link>
                <span className="dateline">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-elevated p-6">
          <p className="kicker kicker-accent">tools</p>
          <ul className="mt-5 space-y-3">
            {tools.slice(0, 5).map((item) => (
              <li
                key={item.slug}
                className="flex items-baseline justify-between gap-3 border-b border-paper-rule pb-2"
              >
                <Link href={`/tools/${item.slug}`} className="hover:text-accent">
                  {item.label}
                </Link>
                <span className="dateline">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
