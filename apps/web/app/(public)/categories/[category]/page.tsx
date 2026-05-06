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
  return pageMetadata({
    title: categoryLabel(category),
    description:
      CATEGORY_DESCRIPTIONS[category] ?? `${categoryLabel(category)} 카테고리 글 목록입니다.`,
    path: `/categories/${category}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHeader
        kicker="category"
        title={categoryLabel(category)}
        description={CATEGORY_DESCRIPTIONS[category] ?? "발행된 글이 있는 카테고리입니다."}
      />
      <PostList posts={posts} />
    </>
  );
}
