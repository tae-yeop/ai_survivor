import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import { publishedPosts } from "@/lib/content/posts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

const VISIBLE = 7;

export default function HomePage() {
  const posts = publishedPosts.slice(0, VISIBLE);
  const hasMore = publishedPosts.length > posts.length;

  return (
    <section className="container-mast pt-12 sm:pt-16 pb-20">
      <h1 className="sr-only">{SITE_NAME} — 최신 기록</h1>

      <div className="mb-6 flex items-baseline justify-between border-b border-ink-900 pb-3">
        <p className="kicker">최신</p>
        {hasMore ? (
          <Link
            href="/posts"
            className="kicker transition-colors hover:text-accent"
          >
            모두 보기 →
          </Link>
        ) : null}
      </div>

      {posts.length === 0 ? (
        <p className="border-y border-paper-rule py-20 text-center font-mono text-sm text-ink-500">
          아직 공개된 기록이 없습니다.
        </p>
      ) : (
        <ol className="list-none">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <PostCard post={post} index={index} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
