import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { getPostsByTool, toolBuckets } from "@/lib/content/posts";
import { labelFromSlug } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return toolBuckets().map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool } = await params;
  return pageMetadata({
    title: labelFromSlug(tool),
    description: `${labelFromSlug(tool)} 관련 글 목록입니다.`,
    path: `/tools/${tool}`,
  });
}

export default async function ToolDetailPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const posts = getPostsByTool(tool);
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHeader
        kicker="tool"
        title={labelFromSlug(tool)}
        description="이 도구가 사용된 실험 기록입니다."
      />
      <PostList posts={posts} />
    </>
  );
}
