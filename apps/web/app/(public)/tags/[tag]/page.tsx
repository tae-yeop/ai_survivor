import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { getPostsByTag, tagBuckets } from "@/lib/content/posts";
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
  const buckets = tagBuckets();
  const bucket = buckets.find((b) => b.slug === tag);
  const label = bucket?.label ?? tag;
  return pageMetadata({
    title: `#${label}`,
    description: `${label} 태그 글 목록입니다.`,
    path: `/tags/${tag}`,
  });
}

export default async function TagDetailPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const buckets = tagBuckets();
  const bucket = buckets.find((b) => b.slug === tag);
  if (!bucket) notFound();

  const posts = getPostsByTag(tag);

  return (
    <>
      <PageHeader
        kicker={`tag · ${posts.length} published`}
        title={`#${bucket.label}`}
        description="이 태그가 붙은 발행 글입니다."
      />
      <PostList posts={posts} emptyText="이 태그가 붙은 글이 아직 없습니다." />
    </>
  );
}
