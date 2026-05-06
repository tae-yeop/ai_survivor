"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AdminPostDraft } from "@/lib/admin/mdx";
import { savePostAction } from "../actions";

const NovelBodyEditor = dynamic(
  () => import("@/components/admin/NovelBodyEditor").then((m) => ({ default: m.NovelBodyEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[520px] animate-pulse rounded-md border border-paper-rule bg-paper" />
    ),
  },
);

const STATUS_OPTIONS = ["draft", "published", "scheduled", "archived"] as const;
const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"] as const;
const CATEGORY_OPTIONS = [
  "vibe-coding-lab",
  "ai-tool-review",
  "ai-workflow-automation",
  "ai-productivity",
  "domain-ai",
] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-ink-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-paper-rule bg-paper px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

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

      <section className="grid gap-4 rounded-2xl border border-paper-rule bg-paper/80 p-5 shadow-sm md:grid-cols-2">
        <Field label="Title">
          <input className={inputClass} name="title" required defaultValue={post.title} />
        </Field>
        <Field label="Slug">
          <input
            className={inputClass}
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="kebab-case-slug"
            required
            defaultValue={post.slug}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description">
            <textarea
              className={`${inputClass} min-h-24`}
              name="description"
              required
              defaultValue={post.description}
            />
          </Field>
        </div>
        <Field label="Published date">
          <input
            className={inputClass}
            type="date"
            name="publishedAt"
            required
            defaultValue={post.publishedAt}
          />
        </Field>
        <Field label="Updated date">
          <input
            className={inputClass}
            type="date"
            name="updatedAt"
            required
            defaultValue={post.updatedAt}
          />
        </Field>
        <Field label="Status">
          <select className={inputClass} name="status" required defaultValue={post.status}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select className={inputClass} name="category" required defaultValue={post.category}>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Difficulty">
          <select className={inputClass} name="difficulty" required defaultValue={post.difficulty}>
            {DIFFICULTY_OPTIONS.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tags (comma separated)">
          <input className={inputClass} name="tags" required defaultValue={post.tags.join(", ")} />
        </Field>
        <Field label="Tools (comma separated)">
          <input
            className={inputClass}
            name="tools"
            required
            defaultValue={post.tools.join(", ")}
          />
        </Field>
        <Field label="Series">
          <input className={inputClass} name="series" defaultValue={post.series ?? ""} />
        </Field>
        <Field label="Series order">
          <input
            className={inputClass}
            type="number"
            min="1"
            name="seriesOrder"
            defaultValue={post.seriesOrder ?? ""}
          />
        </Field>
        <Field label="Cover image path">
          <input
            className={inputClass}
            name="coverImage"
            placeholder="/media/posts/slug/cover.webp"
            defaultValue={post.coverImage ?? ""}
          />
        </Field>
        <Field label="Cover alt text">
          <input className={inputClass} name="coverAlt" defaultValue={post.coverAlt ?? ""} />
        </Field>
      </section>

      <section className="rounded-2xl border border-paper-rule bg-paper/80 p-5 shadow-sm">
        <div className="mb-3 text-sm font-medium text-ink-700">
          Body
          <span className="ml-2 text-xs font-normal text-ink-400">
            / 로 블록 삽입 · 텍스트 선택 시 서식 메뉴
          </span>
        </div>
        <NovelBodyEditor slug={post.slug} initialContent={post.body} onChange={setBodyMarkdown} />
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
