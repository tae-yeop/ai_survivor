import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { EditOverlay } from "@/components/admin/EditOverlay";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { getAdminSession } from "@/lib/admin/session";
import { isInPlaceEditEnabled } from "@/lib/admin/inplace-flag";
import { getPostBySlug, publishedPosts } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { pageMetadata } from "@/lib/seo/metadata";

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

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = isInPlaceEditEnabled() ? await getAdminSession() : null;
  const isAdmin = !!session;
  const post = isAdmin ? getPostBySlug(slug, { includeDrafts: true }) : getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-prose py-16 sm:py-20">
      <ArticleJsonLd post={post} />
      <div className="mb-8 flex items-center justify-between gap-4">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400"
        >
          <Link href="/posts" className="hover:text-accent">
            Posts
          </Link>{" "}
          <span aria-hidden="true">/</span> {categoryLabel(post.category)}
        </nav>
      </div>
      <header>
        <p className="kicker kicker-accent">{categoryLabel(post.category)}</p>
        <h1 className="mt-4 font-display text-mast text-ink-900 text-balance">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-500">{post.description}</p>
        <div className="mt-6 flex flex-wrap gap-3 border-y border-paper-rule py-4">
          <time dateTime={post.publishedAt} className="dateline">
            Published {post.publishedAt}
          </time>
          <span className="dateline">Updated {post.updatedAt}</span>
          <span className="dateline">{post.difficulty}</span>
        </div>
      </header>
      <div className="prose mt-12 drop-cap">
        <MDXRemote source={post.body} components={mdxComponents} />
      </div>
      <footer className="mt-12 border-t border-paper-rule pt-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="label-chip">
              #{tag}
            </Link>
          ))}
        </div>
      </footer>
      {isAdmin && <EditOverlay slug={post.slug} />}
    </article>
  );
}
