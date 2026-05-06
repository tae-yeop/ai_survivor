import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { getPostsByTag, tagBuckets } from "@/lib/content/posts";
import { labelFromSlug } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return tagBuckets().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return pageMetadata({
    title: `#${tag}`,
    description: `${labelFromSlug(tag)} 태그 글 목록입니다.`,
    path: `/tags/${tag}`,
  });
}

export default async function TagDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHeader kicker="tag" title={`#${tag}`} description="이 태그가 붙은 발행 글입니다." />
      <PostList posts={posts} />
    </>
  );
}
