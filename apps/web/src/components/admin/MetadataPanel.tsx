"use client";

import { useState } from "react";
import type { AdminPostDraft } from "@/lib/admin/mdx";

const STATUS_OPTIONS = ["draft", "published", "scheduled", "archived"] as const;
const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"] as const;
const CATEGORY_OPTIONS = [
  "vibe-coding-lab",
  "ai-tool-review",
  "ai-workflow-automation",
  "ai-productivity",
  "domain-ai",
] as const;

const inputClass =
  "w-full rounded-md border border-paper-rule bg-paper px-3 py-2 text-sm text-ink-900 shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-ink-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function MetadataPanel({
  post,
  defaultOpen = true,
  collapsible = false,
}: {
  post: AdminPostDraft;
  defaultOpen?: boolean;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const summary = `status:${post.status} · category:${post.category} · ${post.tags.length} tags`;

  return (
    <section className="rounded-2xl border border-paper-rule bg-paper/80 p-5 shadow-sm">
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-medium text-ink-700"
          aria-expanded={open}
        >
          <span>Metadata · {summary}</span>
          <span aria-hidden>{open ? "▲" : "▼"}</span>
        </button>
      )}
      {open && (
        <div className={`grid gap-4 md:grid-cols-2 ${collapsible ? "mt-4" : ""}`}>
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
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select className={inputClass} name="category" required defaultValue={post.category}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Difficulty">
            <select className={inputClass} name="difficulty" required defaultValue={post.difficulty}>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <input
              className={inputClass}
              name="tags"
              required
              defaultValue={post.tags.join(", ")}
            />
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
        </div>
      )}
    </section>
  );
}
