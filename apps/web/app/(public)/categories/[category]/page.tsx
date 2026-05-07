import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { categoryBuckets, getPostsByCategory } from "@/lib/content/posts";
import { CATEGORY_DESCRIPTIONS, categoryLabel } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return categoryBuckets().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const label = categoryLabel(category);
  return pageMetadata({
    title: label,
    description: CATEGORY_DESCRIPTIONS[category] ?? `${label} 카테고리 글 목록입니다.`,
    path: `/categories/${category}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const buckets = categoryBuckets();
  const bucket = buckets.find((b) => b.slug === category);
  if (!bucket) notFound();

  const posts = getPostsByCategory(category);

  return (
    <>
      <PageHeader
        kicker={`category · ${posts.length} published`}
        title={bucket.label}
        description={CATEGORY_DESCRIPTIONS[category] ?? "이 카테고리의 발행된 글입니다."}
      />
      <PostList posts={posts} emptyText="아직 발행된 글이 없습니다." />
    </>
  );
}
