"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AdminPostDraft } from "@/lib/admin/mdx";
import { shouldOpenMetadataPanel } from "@/lib/admin/form-state";
import { adminInputClass, MetadataPanel } from "@/components/admin/MetadataPanel";
import { savePostAction } from "../actions";

const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor").then((module) => ({ default: module.RichEditor })),
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
  returnTo,
}: {
  post: AdminPostDraft;
  mode: "new" | "edit";
  error?: string;
  returnTo?: string;
}) {
  const [bodyMarkdown, setBodyMarkdown] = useState(post.body);
  const metadataDefaultOpen = shouldOpenMetadataPanel(post, mode);
  const fallbackPath =
    returnTo ?? (mode === "new" ? "/admin/posts/new" : `/admin/posts/${post.slug}`);

  return (
    <form action={savePostAction} className="space-y-6">
      <input type="hidden" name="_mode" value={mode} />
      <input type="hidden" name="_originalSlug" value={post.slug} />
      <input type="hidden" name="_returnTo" value={fallbackPath} />
      <input type="hidden" name="body" value={bodyMarkdown} />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-paper-rule bg-paper/90 p-5 shadow-sm md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Blog editor</p>
            <p className="mt-1 text-sm text-ink-500">
              제목과 본문을 먼저 쓰고, 발행 설정은 아래 설정 패널에서 조정하세요.
            </p>
          </div>
          <span className="rounded-full border border-paper-rule px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-400">
            saves as MDX
          </span>
        </div>

        <div className="grid gap-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink-700">Title</span>
            <input
              className={`${adminInputClass} border-0 bg-transparent px-0 py-2 text-3xl font-semibold leading-tight shadow-none focus:ring-0 md:text-5xl`}
              name="title"
              required
              placeholder="글 제목을 입력하세요"
              defaultValue={post.title}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink-700">Description</span>
              <textarea
                className={`${adminInputClass} min-h-24`}
                name="description"
                required
                placeholder="검색 결과와 목록에 보일 짧은 요약"
                defaultValue={post.description}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink-700">Slug</span>
              <input
                className={adminInputClass}
                name="slug"
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="kebab-case-slug"
                required
                defaultValue={post.slug}
              />
              <span className="block text-xs text-ink-400">
                저장 위치: content/posts/&lt;slug&gt;/index.mdx
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-paper-rule bg-paper/80 p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-ink-700">Body</h2>
            <p className="mt-1 text-xs text-ink-400">
              네이버 블로그처럼 붙여넣고 편집하세요. 저장하면 본문이 MDX로 변환됩니다.
            </p>
          </div>
          <p className="text-xs text-ink-400">Tip: / 를 입력하면 블록 메뉴가 열립니다.</p>
        </div>
        <RichEditor
          slug={post.slug}
          initialContent={post.body}
          onChange={setBodyMarkdown}
          onMediaError={(message) => alert(message)}
        />
        <details className="mt-4 rounded-lg border border-paper-rule bg-paper/70 p-3">
          <summary className="cursor-pointer text-sm font-medium text-ink-600">
            생성될 MDX 본문 미리보기
          </summary>
          <textarea
            className="mt-3 min-h-56 w-full resize-y rounded-md border border-paper-rule bg-paper-deep p-3 font-mono text-xs text-ink-700 outline-none"
            readOnly
            value={bodyMarkdown}
          />
        </details>
      </section>

      <MetadataPanel
        post={post}
        defaultOpen={metadataDefaultOpen}
        collapsible
        showPrimaryFields={false}
      />

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
