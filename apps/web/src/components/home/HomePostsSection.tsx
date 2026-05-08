"use client";

import { useState } from "react";
import { CategoryFilterPills } from "./CategoryFilterPills";
import { PostCardGrid } from "@/components/post/PostCardGrid";
import type { Post } from "@/lib/content/posts";
import { slugifyTaxonomy } from "@/lib/content/slugify";

type Pill = { slug: string; label: string };

type Props = {
  posts: Post[];
  categoryPills: Pill[];
  hasMore: boolean;
};

const CARDS_PER_PAGE = 6;

export function HomePostsSection({ posts, categoryPills, hasMore }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const filtered =
    selected === null
      ? posts.slice(0, CARDS_PER_PAGE)
      : posts
          .filter((p) => slugifyTaxonomy(p.category) === selected)
          .slice(0, CARDS_PER_PAGE);

  return (
    <section className="mt-8 space-y-5">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
          최신 기록
        </p>
        {hasMore && selected === null ? (
          <a
            href="/posts"
            className="font-mono text-[10px] text-ink-400 transition-colors hover:text-accent"
          >
            모두 보기 →
          </a>
        ) : null}
      </div>
      <CategoryFilterPills pills={categoryPills} selected={selected} onSelect={setSelected} />
      <PostCardGrid posts={filtered} />
    </section>
  );
}
