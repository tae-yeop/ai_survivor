"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AdminPostDraft } from "@/lib/admin/mdx";
import { MetadataPanel } from "./MetadataPanel";
import {
  loadInPlace,
  savePostInPlaceAction,
  type SaveResult,
} from "../../../app/(public)/posts/[slug]/save-action";

const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor").then((m) => ({ default: m.RichEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[480px] animate-pulse rounded-md border border-paper-rule bg-paper" />
    ),
  },
);

type Mode = "view" | "loading" | "editing";

export function EditOverlay({ slug }: { slug: string }) {
  const [mode, setMode] = useState<Mode>("view");
  const [draft, setDraft] = useState<AdminPostDraft | null>(null);
  const [sha, setSha] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (mode !== "editing") return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, dirty]);

  async function startEditing() {
    setMode("loading");
    setError(null);
    const res = await loadInPlace(slug);
    if (!res.ok) {
      setError(res.error);
      setMode("view");
      return;
    }
    setDraft(res.draft);
    setSha(res.sha);
    setBody(res.draft.body);
    setDirty(false);
    setMode("editing");
    document.querySelector("article .prose")?.classList.add("hidden");
  }

  function cancel() {
    if (dirty && !window.confirm("저장하지 않은 변경이 있습니다. 닫을까요?")) return;
    setMode("view");
    setDraft(null);
    setError(null);
    setDirty(false);
    document.querySelector("article .prose")?.classList.remove("hidden");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setSaving(true);
    setError(null);
    const formData = new FormData(formRef.current);
    formData.set("body", body);
    formData.set("_baseSha", sha);
    const res: SaveResult = await savePostInPlaceAction(formData);
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      setMode("view");
      document.querySelector("article .prose")?.classList.remove("hidden");
      window.location.reload();
    } else {
      setError(res.error);
    }
  }

  if (mode === "view") {
    return (
      <button
        type="button"
        onClick={startEditing}
        aria-label="Edit post in place"
        className="fixed bottom-6 right-6 z-30 rounded-full border border-paper-rule bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-700 shadow-lg hover:border-accent hover:text-accent sm:sticky sm:top-6 sm:bottom-auto sm:right-auto sm:ml-auto"
      >
        Edit
      </button>
    );
  }

  if (mode === "loading") {
    return (
      <div className="fixed bottom-6 right-6 z-30 rounded-full border border-paper-rule bg-paper px-4 py-2 font-mono text-[11px] text-ink-400 shadow-lg">
        Loading…
      </div>
    );
  }

  if (!draft) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-paper/95 backdrop-blur">
      <form ref={formRef} onSubmit={onSubmit} className="container-prose space-y-6 py-8">
        <div className="sticky top-0 z-10 flex items-center justify-end gap-2 bg-paper/95 py-2 backdrop-blur">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-ink-900 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-paper hover:bg-accent disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={cancel}
            className="rounded-md border border-paper-rule bg-paper px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-700 hover:border-accent"
          >
            Cancel
          </button>
          <Link
            href={`/admin/posts/${slug}`}
            className="rounded-md border border-paper-rule bg-paper px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-700 hover:border-accent"
          >
            Open in /admin
          </Link>
        </div>
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}
        <input type="hidden" name="_mode" value="update" />
        <input type="hidden" name="_originalSlug" value={slug} />
        <input type="hidden" name="body" value={body} />
        <input type="hidden" name="_baseSha" value={sha} />
        <MetadataPanel post={draft} defaultOpen={false} collapsible />
        <RichEditor
          slug={slug}
          initialContent={draft.body}
          onChange={(md) => {
            setBody(md);
            setDirty(true);
          }}
          onMediaError={(m) => setError(m)}
        />
      </form>
    </div>
  );
}
