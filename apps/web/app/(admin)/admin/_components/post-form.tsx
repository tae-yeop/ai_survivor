"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AdminPostDraft } from "@/lib/admin/mdx";
import { MetadataPanel } from "@/components/admin/MetadataPanel";
import { savePostAction } from "../actions";

const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor").then((m) => ({ default: m.RichEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[520px] animate-pulse rounded-md border border-paper-rule bg-paper" />
    ),
  },
);

export function AdminPostForm({
  post,
  mode,
  error,
}: {
  post: AdminPostDraft;
  mode: "new" | "edit";
  error?: string;
}) {
  const [bodyMarkdown, setBodyMarkdown] = useState(post.body);

  return (
    <form action={savePostAction} className="space-y-8">
      <input type="hidden" name="_mode" value={mode} />
      <input type="hidden" name="_originalSlug" value={post.slug} />
      <input type="hidden" name="body" value={bodyMarkdown} />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <MetadataPanel post={post} defaultOpen collapsible={false} />

      <section className="rounded-2xl border border-paper-rule bg-paper/80 p-5 shadow-sm">
        <div className="mb-3 text-sm font-medium text-ink-700">
          Body
          <span className="ml-2 text-xs font-normal text-ink-400">
            / 로 블록 삽입 · 텍스트 선택 시 서식 메뉴
          </span>
        </div>
        <RichEditor
          slug={post.slug}
          initialContent={post.body}
          onChange={setBodyMarkdown}
          onMediaError={(msg) => alert(msg)}
        />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-md bg-ink-900 px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-paper transition hover:bg-accent">
          Save to GitHub
        </button>
        <a
          className="text-sm text-ink-500 underline decoration-paper-rule underline-offset-4 hover:text-accent"
          href="/admin"
        >
          Back to admin
        </a>
      </div>
    </form>
  );
}
