import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { toolBuckets } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Tools",
  description: "AI Vibe Lab에서 다룬 도구별 글을 탐색합니다.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        kicker="tools"
        title="도구별 글"
        description="Cursor, Astro, Google Search Console 등 실험에 사용한 도구별로 글을 묶습니다."
      />
      <section className="container-wide flex flex-wrap gap-3 py-12">
        {toolBuckets().map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="label-chip">
            {tool.label} ({tool.count})
          </Link>
        ))}
      </section>
    </>
  );
}
