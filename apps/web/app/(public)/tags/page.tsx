import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { tagBuckets } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Tags",
  description: "AI Vibe Lab 글의 세부 태그를 탐색합니다.",
  path: "/tags",
});

export default function TagsPage() {
  return (
    <>
      <PageHeader kicker="tags" title="태그" description="글의 세부 키워드를 가볍게 탐색합니다." />
      <section className="container-wide flex flex-wrap gap-3 py-12">
        {tagBuckets().map((tag) => (
          <Link key={tag.slug} href={`/tags/${tag.slug}`} className="label-chip">
            #{tag.slug} ({tag.count})
          </Link>
        ))}
      </section>
    </>
  );
}
