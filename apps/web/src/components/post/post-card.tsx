import Link from "next/link";
import type { Post } from "@/lib/content/posts";
import { categoryLabel } from "@/lib/labels";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PostCard({ post, index }: { post: Post; index?: number }) {
  return (
    <Card className="group transition-colors hover:border-ink-900">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <span className="kicker kicker-accent">{categoryLabel(post.category)}</span>
          {typeof index === "number" && (
            <span className="font-mono text-xs tabular-nums text-ink-400">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
        <CardTitle>
          <Link href={`/posts/${post.slug}`} className="transition-colors group-hover:text-accent">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-500">{post.description}</p>
      </CardContent>
      <CardFooter className="justify-between gap-4 border-t border-paper-rule pt-4">
        <time dateTime={post.publishedAt} className="dateline">
          {post.publishedAt}
        </time>
        <Link
          href={`/posts/${post.slug}`}
          className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-500 transition-colors hover:text-accent"
        >
          읽기 →
        </Link>
      </CardFooter>
    </Card>
  );
}
