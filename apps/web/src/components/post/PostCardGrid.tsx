import Link from "next/link";
import { PostCoverImage } from "./PostCoverImage";
import type { Post } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { slugifyTaxonomy } from "@/lib/content/slugify";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
  className?: string;
};

export function PostCardGrid({ posts, className }: Props) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center font-mono text-sm text-ink-400">
        공개된 기록이 없습니다.
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {posts.map((post) => (
        <PostGridCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

function PostGridCard({ post }: { post: Post }) {
  const catSlug = slugifyTaxonomy(post.category);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[6px] border border-line bg-bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong"
    >
      <PostCoverImage
        src={post.coverImage}
        alt={post.title}
        categorySlug={catSlug}
        className="h-40 w-full flex-shrink-0 rounded-none"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent">
            {categoryLabel(post.category)}
          </span>
          <time dateTime={post.publishedAt} className="font-mono text-[10px] text-ink-300">
            {post.publishedAt}
          </time>
        </div>
        <h2 className="line-clamp-2 text-sm font-bold leading-snug tracking-[-0.01em] text-ink-900">
          {post.title}
        </h2>
        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-ink-400">
          {post.description}
        </p>
        <div className="mt-2 font-mono text-[10px] text-ink-300">
          ty-kim · {post.readingTimeMinutes}분 읽기
        </div>
      </div>
    </Link>
  );
}
