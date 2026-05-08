import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { EditOverlay } from "@/components/admin/EditOverlay";
import { PostCoverImage } from "@/components/post/PostCoverImage";
import { TableOfContents } from "@/components/post/TableOfContents";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { getPostBySlug, publishedPosts } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { slugifyTaxonomy } from "@/lib/content/slugify";
import { pageMetadata } from "@/lib/seo/metadata";
import { AUTHOR_DISPLAY_NAME } from "@/lib/brand-copy";

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/posts/${post.slug}`,
    type: "article",
  });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const catSlug = slugifyTaxonomy(post.category);

  return (
    <article className="bg-bg-surface">
      <ArticleJsonLd post={post} />

      {/* POST HEADER — centered 680px */}
      <div className="px-6 pt-12">
        <div className="mx-auto max-w-[680px]">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 font-mono text-[11px] text-ink-300"
          >
            <Link href="/posts" className="transition-colors hover:text-accent">
              블로그
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span>{categoryLabel(post.category)}</span>
          </nav>

          <p className="mb-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent">
            {categoryLabel(post.category)}
          </p>

          <h1
            className="font-display text-balance text-ink-900"
            style={{
              fontSize: "clamp(24px, 3.5vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "24px",
            }}
          >
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-3 border-b border-t py-3.5"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[11px] font-bold text-bg-surface">
                AI
              </div>
              <span className="text-[13px] font-semibold text-ink-700">
                {AUTHOR_DISPLAY_NAME}
              </span>
            </div>
            <span className="h-[3px] w-[3px] rounded-full bg-ink-200" aria-hidden="true" />
            <time dateTime={post.publishedAt} className="font-mono text-[11px] text-ink-300">
              {post.publishedAt}
            </time>
            <span className="h-[3px] w-[3px] rounded-full bg-ink-200" aria-hidden="true" />
            <span className="font-mono text-[11px] text-ink-300">
              {post.readingTimeMinutes}분 읽기
            </span>
          </div>
        </div>
      </div>

      {/* COVER IMAGE — max 760px */}
      <div className="mx-auto mt-7 max-w-[760px] px-6">
        <PostCoverImage
          src={post.coverImage}
          alt={post.title}
          categorySlug={catSlug}
          className="h-[220px] w-full"
        />
      </div>

      {/* BODY — 680px centered, floating TOC at ≥1100px viewport */}
      <div className="relative">
        <div
          className="absolute top-10 hidden min-[1100px]:block"
          style={{ left: "calc(50% + 360px)", width: "180px" }}
        >
          <TableOfContents />
        </div>

        <div className="mx-auto max-w-[680px] px-6 pb-16 pt-9">
          <EditOverlay slug={post.slug}>
            <div className="prose prose-post max-w-none">
              <MDXRemote source={post.body} components={mdxComponents} />
            </div>
          </EditOverlay>

          {/* Tags */}
          <div className="mt-9 flex flex-wrap gap-2 border-t border-line pt-5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${slugifyTaxonomy(tag)}`}
                className="rounded border border-line bg-bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-400 transition-colors hover:border-ink-400 hover:text-ink-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
