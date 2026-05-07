import Link from "next/link";
import type { Post } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";

type PostCardVariant = "list" | "feature";

export function PostCard({
  post,
  index,
  variant = "list",
  hideCategory = false,
}: {
  post: Post;
  index?: number;
  variant?: PostCardVariant;
  hideCategory?: boolean;
}) {
  const isFeature = variant === "feature";

  return (
    <article
      className={[
        "group relative grid gap-y-3 overflow-hidden border-b border-paper-rule transition-colors",
        isFeature
          ? "py-10 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-10"
          : "py-7 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-8",
      ].join(" ")}
    >
      <div className="relative z-10 flex items-baseline gap-3 text-ink-500 sm:flex-col sm:items-start sm:gap-1">
        {typeof index === "number" && (
          <span className="font-mono text-[0.7rem] tracking-[0.08em] text-accent tabular-nums">
            № {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <time
          dateTime={post.publishedAt}
          className="font-mono text-[0.72rem] tracking-[0.04em] tabular-nums"
        >
          {post.publishedAt}
        </time>
        <span className="hidden font-mono text-[0.7rem] text-ink-400 tabular-nums sm:block">
          {post.readingTimeMinutes}분 읽기
        </span>
      </div>

      <div className="min-w-0">
        <div className="relative z-10 mb-2.5 flex flex-wrap items-center gap-3">
          {!hideCategory && (
            <Link
              href={`/categories/${post.category}`}
              className="kicker kicker-accent hover:underline underline-offset-4"
            >
              {categoryLabel(post.category)}
            </Link>
          )}
          <span className="kicker text-ink-400">{post.difficulty}</span>
        </div>

        <h2
          className={[
            "font-display leading-[1.1] tracking-tightest text-ink-800 text-balance break-words",
            isFeature ? "text-3xl sm:text-5xl" : "text-2xl sm:text-[1.75rem]",
          ].join(" ")}
        >
          <Link
            href={`/posts/${post.slug}`}
            className="relative bg-[length:0_1.5px] bg-bottom bg-no-repeat transition-[background-size] duration-300 [background-image:linear-gradient(theme(colors.accent.DEFAULT),theme(colors.accent.DEFAULT))] after:absolute after:inset-0 after:-top-7 after:bottom-[-1.75rem] after:left-0 after:right-0 after:content-[''] hover:bg-[length:100%_1.5px] xl:after:left-[-100vw] xl:after:right-[-100vw]"
          >
            {post.title}
          </Link>
        </h2>

        <p className="relative z-10 mt-3 max-w-prose text-sm leading-relaxed text-ink-500 line-clamp-3 sm:text-base">
          {post.description}
        </p>

        {post.tags.length > 0 && (
          <ul className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {post.tags.slice(0, 5).map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tags/${tag}`}
                  className="font-mono text-[0.7rem] text-ink-400 transition-colors hover:text-accent"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="relative z-10 mt-4 font-mono text-[0.7rem] text-ink-400 tabular-nums sm:hidden">
          {post.readingTimeMinutes}분 읽기
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 right-0 hidden items-center gap-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:flex"
      >
        읽기 <span>→</span>
      </span>
    </article>
  );
}
