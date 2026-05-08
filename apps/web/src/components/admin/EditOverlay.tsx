"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AdminPostDraft } from "@/lib/admin/mdx";
import { adminInputClass, MetadataPanel } from "./MetadataPanel";
import {
  loadInPlace,
  savePostInPlaceAction,
  type SaveResult,
} from "../../../app/(public)/posts/[slug]/save-action";

const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor").then((module) => ({ default: module.RichEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[480px] animate-pulse rounded-md border border-paper-rule bg-paper" />
    ),
  },
);

type Mode = "view" | "loading" | "editing";

export function EditOverlay({ slug, children }: { slug: string; children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mode, setMode] = useState<Mode>("view");
  const [draft, setDraft] = useState<AdminPostDraft | null>(null);
  const [sha, setSha] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    fetch("/api/admin/me", { cache: "no-store", credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as { admin?: boolean };
        if (data.admin) setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== "editing") return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
    // cancel is intentionally not a dependency; it reads current dirty state for the active edit session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, dirty]);

  async function startEditing() {
    setMode("loading");
    setError(null);
    const result = await loadInPlace(slug);
    if (!result.ok) {
      setError(result.error);
      setMode("view");
      return;
    }
    setDraft(result.draft);
    setSha(result.sha);
    setBody(result.draft.body);
    setDirty(false);
    setMode("editing");
  }

  function cancel() {
    if (dirty && !window.confirm("저장하지 않은 변경이 있습니다. 편집을 취소할까요?")) return;
    setMode("view");
    setDraft(null);
    setError(null);
    setDirty(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;
    setSaving(true);
    setError(null);
    const formData = new FormData(formRef.current);
    formData.set("body", body);
    formData.set("_baseSha", sha);
    const result: SaveResult = await savePostInPlaceAction(formData);
    setSaving(false);
    if (result.ok) {
      setDirty(false);
      window.location.reload();
      return;
    }
    setError(result.error);
  }

  if (mode === "view" || mode === "loading") {
    return (
      <>
        {children}
        {isAdmin && (
          <button
            type="button"
            onClick={mode === "view" ? startEditing : undefined}
            disabled={mode === "loading"}
            aria-label="이 페이지 직접 편집"
            className="fixed right-4 top-[3.75rem] z-30 border border-border bg-bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 shadow-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {mode === "loading" ? "로딩 중…" : "편집"}
          </button>
        )}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </>
    );
  }

  if (!draft) return null;

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between gap-2 border-b border-paper-rule bg-paper/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400">
          Direct editing this page
        </span>
        <div className="flex items-center gap-2">
          {error ? (
            <span role="alert" className="max-w-xs text-xs text-red-600">
              {error}
            </span>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-ink-900 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-paper hover:bg-accent disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={cancel}
            className="rounded-md border border-paper-rule bg-paper px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-ink-700 hover:border-accent"
          >
            Cancel
          </button>
        </div>
      </div>

      <input type="hidden" name="_mode" value="update" />
      <input type="hidden" name="_originalSlug" value={slug} />
      <input type="hidden" name="body" value={body} />
      <input type="hidden" name="_baseSha" value={sha} />

      <header className="rounded-3xl border border-dashed border-accent/40 bg-paper/80 p-5 shadow-sm md:p-7">
        <p className="kicker kicker-accent">Editing visible page</p>
        <label className="mt-4 block">
          <span className="sr-only">Title</span>
          <input
            className={`${adminInputClass} border-0 bg-transparent px-0 py-2 font-display text-4xl font-semibold leading-tight shadow-none focus:ring-0 md:text-6xl`}
            name="title"
            required
            defaultValue={draft.title}
            onChange={() => setDirty(true)}
          />
        </label>
        <label className="mt-5 block">
          <span className="sr-only">Description</span>
          <textarea
            className={`${adminInputClass} min-h-24 border-0 bg-transparent px-0 text-lg leading-relaxed text-ink-500 shadow-none focus:ring-0`}
            name="description"
            required
            defaultValue={draft.description}
            onChange={() => setDirty(true)}
          />
        </label>
        <div className="mt-6 grid gap-4 border-y border-paper-rule py-4 md:grid-cols-[1fr_11rem_11rem]">
          <label className="block space-y-2">
            <span className="dateline">Slug</span>
            <input
              className={`${adminInputClass} bg-paper-deep text-ink-500`}
              name="slug"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              readOnly
              defaultValue={draft.slug}
            />
          </label>
          <label className="block space-y-2">
            <span className="dateline">Published</span>
            <input
              className={adminInputClass}
              type="date"
              name="publishedAt"
              required
              defaultValue={draft.publishedAt}
              onChange={() => setDirty(true)}
            />
          </label>
          <label className="block space-y-2">
            <span className="dateline">Updated</span>
            <input
              className={adminInputClass}
              type="date"
              name="updatedAt"
              required
              defaultValue={draft.updatedAt}
              onChange={() => setDirty(true)}
            />
          </label>
        </div>
      </header>

      <RichEditor
        slug={slug}
        initialContent={draft.body}
        onChange={(markdown) => {
          setBody(markdown);
          setDirty(true);
        }}
        onMediaError={(message) => setError(message)}
      />

      <MetadataPanel post={draft} defaultOpen={false} collapsible showPrimaryFields={false} />

      <div className="flex justify-end">
        <Link
          href={`/admin/posts/${slug}`}
          className="text-sm text-ink-500 underline decoration-paper-rule underline-offset-4 hover:text-accent"
        >
          Advanced admin editor
        </Link>
      </div>
    </form>
  );
}
