"use client";

import { useMemo, useState } from "react";
import type { Post } from "@/lib/content/posts";
import { PostList } from "@/components/post/post-list";

function searchableText(post: Post) {
  return [post.title, post.description, post.category, post.difficulty, ...post.tags, ...post.tools]
    .join(" ")
    .toLowerCase();
}

export function PostSearch({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return posts;
    return posts.filter((post) => searchableText(post).includes(normalizedQuery));
  }, [normalizedQuery, posts]);

  return (
    <>
      <section
        className="container-wide mt-10 border-y border-paper-rule py-5"
        aria-labelledby="archive-search-heading"
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p id="archive-search-heading" className="kicker kicker-accent">
              archive search
            </p>
            <label
              htmlFor="post-search"
              className="mt-2 block font-display text-2xl tracking-tight text-ink-800"
            >
              필요한 실험 기록 찾기
            </label>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400 tabular-nums">
            {filteredPosts.length} / {posts.length} records
          </p>
        </div>
        <input
          id="post-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: Cursor, AdSense, SEO, 자동화"
          className="mt-5 w-full border border-paper-rule bg-paper-elevated px-4 py-3 font-mono text-sm text-ink-800 placeholder:text-ink-300 focus:border-accent focus:outline-none"
        />
      </section>
      <PostList
        posts={filteredPosts}
        emptyText="검색 결과가 없습니다. 도구 이름, 카테고리, 태그를 조금 짧게 입력해보세요."
      />
    </>
  );
}
