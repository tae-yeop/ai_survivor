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

export const adminInputClass =
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
  showPrimaryFields = true,
}: {
  post: AdminPostDraft;
  defaultOpen?: boolean;
  collapsible?: boolean;
  showPrimaryFields?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const summary = `status:${post.status} · category:${post.category} · ${post.tags.length} tags`;

  return (
    <section className="rounded-2xl border border-paper-rule bg-paper/80 p-5 shadow-sm">
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-4 text-left text-sm font-medium text-ink-700"
          aria-expanded={open}
        >
          <span>설정 · {summary}</span>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400" aria-hidden>
            {open ? "close" : "open"}
          </span>
        </button>
      )}
      {open && (
        <div className={`grid gap-4 md:grid-cols-2 ${collapsible ? "mt-4" : ""}`}>
          {showPrimaryFields && (
            <>
              <Field label="Title">
                <input
                  className={adminInputClass}
                  name="title"
                  required
                  defaultValue={post.title}
                />
              </Field>
              <Field label="Slug">
                <input
                  className={adminInputClass}
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
                    className={`${adminInputClass} min-h-24`}
                    name="description"
                    required
                    defaultValue={post.description}
                  />
                </Field>
              </div>
            </>
          )}
          <Field label="Published date">
            <input
              className={adminInputClass}
              type="date"
              name="publishedAt"
              required
              defaultValue={post.publishedAt}
            />
          </Field>
          <Field label="Updated date">
            <input
              className={adminInputClass}
              type="date"
              name="updatedAt"
              required
              defaultValue={post.updatedAt}
            />
          </Field>
          <Field label="Status">
            <select className={adminInputClass} name="status" required defaultValue={post.status}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              className={adminInputClass}
              name="category"
              required
              defaultValue={post.category}
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Difficulty">
            <select
              className={adminInputClass}
              name="difficulty"
              required
              defaultValue={post.difficulty}
            >
              {DIFFICULTY_OPTIONS.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <input
              className={adminInputClass}
              name="tags"
              required
              defaultValue={post.tags.join(", ")}
            />
          </Field>
          <Field label="Tools (comma separated)">
            <input
              className={adminInputClass}
              name="tools"
              required
              defaultValue={post.tools.join(", ")}
            />
          </Field>
          <Field label="Series">
            <input className={adminInputClass} name="series" defaultValue={post.series ?? ""} />
          </Field>
          <Field label="Series order">
            <input
              className={adminInputClass}
              type="number"
              min="1"
              name="seriesOrder"
              defaultValue={post.seriesOrder ?? ""}
            />
          </Field>
          <Field label="Cover image path">
            <input
              className={adminInputClass}
              name="coverImage"
              placeholder="/media/posts/slug/cover.webp"
              defaultValue={post.coverImage ?? ""}
            />
          </Field>
          <Field label="Cover alt text">
            <input className={adminInputClass} name="coverAlt" defaultValue={post.coverAlt ?? ""} />
          </Field>
        </div>
      )}
    </section>
  );
}
