import type { Post } from "@/lib/content/posts";
import { PostCard } from "@/components/post/post-card";

export function PostList({
  posts,
  emptyText = "아직 공개된 글이 없습니다.",
}: {
  posts: Post[];
  emptyText?: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="container-wide py-12">
        <div className="border border-dashed border-paper-rule p-8 text-center text-sm leading-relaxed text-ink-500">
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <ol className="container-wide list-none py-12">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <PostCard post={post} index={index} />
        </li>
      ))}
    </ol>
  );
}
