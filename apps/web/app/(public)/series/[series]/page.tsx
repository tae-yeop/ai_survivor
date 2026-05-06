import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PostList } from "@/components/post/post-list";
import { getPostsBySeries, seriesBuckets } from "@/lib/content/posts";
import { labelFromSlug } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return seriesBuckets().map((series) => ({ series: series.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series } = await params;
  return pageMetadata({
    title: labelFromSlug(series),
    description: `${labelFromSlug(series)} 시리즈 글 목록입니다.`,
    path: `/series/${series}`,
  });
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series } = await params;
  const posts = getPostsBySeries(series);
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHeader
        kicker="series"
        title={labelFromSlug(series)}
        description="연재 순서대로 읽을 수 있는 글 목록입니다."
      />
      <PostList posts={posts} />
    </>
  );
}
