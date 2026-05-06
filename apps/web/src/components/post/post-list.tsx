import type { Post } from "@/lib/content/posts";
import { PostCard } from "@/components/post/post-card";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="container-wide py-12">
        <div className="card-elevated p-8 text-center text-ink-500">아직 공개된 글이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container-wide grid gap-5 py-12 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}
    </div>
  );
}
