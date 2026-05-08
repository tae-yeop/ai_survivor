import Link from "next/link";
import type { Post } from "@/lib/content/posts";
import { Reveal } from "@/components/ui/Reveal";

type Props = { posts: Post[] };

export function PopularPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section>
      <Reveal>
        <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
          인기 글
        </p>
      </Reveal>
      <Reveal as="ol" stagger={70} className="space-y-0">
        {posts.map((post, i) => (
          <li
            key={post.slug}
            className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line pt-5 first:border-t-0 first:pt-0"
          >
            <span className="font-mono text-xs font-medium text-accent">
              № {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 pb-5">
              <time
                dateTime={post.publishedAt}
                className="mb-1 block font-mono text-[10px] text-ink-300"
              >
                {post.publishedAt}
              </time>
              <Link
                href={`/posts/${post.slug}`}
                className="block text-sm font-bold leading-snug tracking-[-0.01em] text-ink-900 transition-colors hover:text-accent"
              >
                {post.title}
              </Link>
              <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-ink-400">
                {post.description}
              </p>
            </div>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
