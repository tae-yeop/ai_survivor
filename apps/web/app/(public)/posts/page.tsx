import { PageHeader } from "@/components/layout/page-header";
import { PostSearch } from "@/components/post/post-search";
import { publishedPosts } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Posts",
  description: "AI Vibe Lab의 모든 공개 글을 최신순으로 탐색합니다.",
  path: "/posts",
});

export default function PostsPage() {
  return (
    <>
      <PageHeader
        kicker="posts"
        title="전체 기록"
        description="직접 실험한 AI 도구, 바이브코딩, 업무 자동화 기록을 최신순으로 모았습니다."
      />
      <PostSearch posts={publishedPosts} />
    </>
  );
}
