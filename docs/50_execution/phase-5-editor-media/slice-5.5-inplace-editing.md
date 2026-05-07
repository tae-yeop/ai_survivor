# Slice 5.5 — In-place Editing

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Phase: 5 — MDX Components & Rich Editor
Status: Ready (depends on 5.1; 5.2/5.3/5.4 권장 선행)
Spec: [`_design/2026-05-07-rich-editor-overhaul.md`](./_design/2026-05-07-rich-editor-overhaul.md) §3, §6.6

**Goal:** 공개 페이지 `/posts/[slug]` 에서 admin 세션이면 우상단 floating Edit 버튼이 보이고, 클릭 시 본문 자리가 그대로 RichEditor 로 바뀐다. Save 시 GitHub commit + revalidatePath. sha 충돌은 거부 후 reload 안내. Cmd/Ctrl+S 단축키, Esc Cancel, dirty beforeunload 가드.

**Architecture:** 기존 `<EditPostButton>` 자리에 `<EditOverlay>` 클라이언트 컴포넌트 마운트 — 서버에서 admin 세션 + post source + sha 를 받아 props로 내려준다. mode 토글로 본문 영역(SSR HTML)을 hide 하고 같은 자리에 RichEditor 마운트. `<MetadataPanel>` 은 `post-form.tsx` 의 메타 필드를 추출한 공용 컴포넌트. Save 는 server action `savePostInPlaceAction(slug, body, meta, baseSha)` — 현재 GitHub sha 와 baseSha 비교, 다르면 reject. env flag `INPLACE_EDIT_ENABLED` 로 전체 토글.

**Tech Stack:** Next.js 16 App Router, server actions, React 19, Tiptap.

---

## Files

**Create:**
- `apps/web/src/components/admin/EditOverlay.tsx`
- `apps/web/src/components/admin/MetadataPanel.tsx`
- `apps/web/app/(public)/posts/[slug]/save-action.ts`
- `apps/web/app/(public)/posts/[slug]/save-action.test.ts`
- `apps/web/src/lib/admin/inplace-flag.ts`
- `apps/web/src/lib/admin/inplace-flag.test.ts`

**Modify:**
- `apps/web/app/(public)/posts/[slug]/page.tsx` (admin session 분기 + EditOverlay 마운트)
- `apps/web/app/(admin)/admin/_components/post-form.tsx` (MetadataPanel 사용)
- `apps/web/src/lib/admin/github-content.ts` (sha 비교 로직 추가)
- `apps/web/src/lib/content/posts.ts` (필요 시 sha 노출, 또는 server action 에서 직접 GitHub 조회)
- `docs/70_ops/DEPLOYMENT.md` (INPLACE_EDIT_ENABLED env)

**Delete:**
- `apps/web/src/components/admin/EditPostButton.tsx` (EditOverlay 가 대체)

---

## Tasks

### Task 1: env flag helper

**Files:**
- Create: `apps/web/src/lib/admin/inplace-flag.ts`
- Create: `apps/web/src/lib/admin/inplace-flag.test.ts`

- [ ] **Step 1: helper 작성**

```ts
export function isInPlaceEditEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const v = (env.INPLACE_EDIT_ENABLED ?? "true").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
```

- [ ] **Step 2: 테스트**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { isInPlaceEditEnabled } from "./inplace-flag.ts";

test("default true when unset", () => {
  assert.equal(isInPlaceEditEnabled({}), true);
});
test("explicit false disables", () => {
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "false" }), false);
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "0" }), false);
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "no" }), false);
});
test("truthy variants enable", () => {
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "1" }), true);
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "TRUE" }), true);
});
```

- [ ] **Step 3: 실행 + package.json 추가**

```bash
cd apps/web && node --test src/lib/admin/inplace-flag.test.ts
```

Expected: `# pass 3`.

```json
"test": "... src/lib/admin/inplace-flag.test.ts"
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/lib/admin/inplace-flag.ts apps/web/src/lib/admin/inplace-flag.test.ts apps/web/package.json
git commit -m "feat(admin): INPLACE_EDIT_ENABLED env flag"
```

---

### Task 2: github-content 에 base sha 비교 가드

**Files:**
- Modify: `apps/web/src/lib/admin/github-content.ts`

`savePostSourceToGitHub` 는 매번 최신 sha 를 받아 PUT 한다 — 이 자리에 baseSha 를 받아 *변경된 sha 면 거부* 하는 함수를 따로 추가한다.

- [ ] **Step 1: `savePostSourceWithBaseShaGuard` 추가**

```ts
export class GitHubShaConflictError extends Error {
  constructor(
    public readonly currentSha: string,
    public readonly baseSha: string,
  ) {
    super(`GitHub sha changed since load (base=${baseSha}, current=${currentSha})`);
    this.name = "GitHubShaConflictError";
  }
}

export async function savePostSourceWithBaseShaGuard(
  config: AdminContentConfig,
  slug: string,
  source: string,
  message: string,
  baseSha: string,
): Promise<GitHubCommitResult> {
  const path = postContentPath(slug);
  const currentFile = await getGitHubContentFile(config, path);
  if (!currentFile) {
    // 신규 파일 — baseSha 가 빈 문자열일 때만 허용
    if (baseSha) throw new GitHubShaConflictError("none", baseSha);
    return putGitHubContentFile(config, path, source, message);
  }
  if (currentFile.sha !== baseSha) {
    throw new GitHubShaConflictError(currentFile.sha, baseSha);
  }
  return putGitHubContentFile(config, path, source, message, currentFile.sha);
}
```

- [ ] **Step 2: 테스트 추가 — `github-content.test.ts` 에 sha 가드 케이스**

기존 테스트 파일 끝에:
```ts
import { GitHubShaConflictError } from "./github-content.ts";

test("GitHubShaConflictError carries currentSha and baseSha", () => {
  const e = new GitHubShaConflictError("aaa", "bbb");
  assert.equal(e.currentSha, "aaa");
  assert.equal(e.baseSha, "bbb");
  assert.equal(e.name, "GitHubShaConflictError");
});
```

> **NOTE:** 실 API 호출은 mock 없이는 단위 테스트 어려움. e2e 단계로 이관. 본 task 는 클래스 contract 만 고정.

- [ ] **Step 3: 실행**

```bash
cd apps/web && npm test
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/lib/admin/github-content.ts apps/web/src/lib/admin/github-content.test.ts
git commit -m "feat(admin): sha conflict guard on GitHub commit"
```

---

### Task 3: `getPostBySlug` 가 sha 같이 노출

`/posts/[slug]/page.tsx` 가 baseSha 를 props 로 내려주려면 build-time post 데이터에 sha 도 포함되어야 한다.

> **간소화 결정**: build-time `getPostBySlug` 는 그대로 두고, `<EditOverlay>` 자체 server action 에서 *load 시점에 GitHub 에서 sha 를 직접 fetch* 한다. 이 방식이 build 의존을 늘리지 않아 더 깔끔.

- [ ] **Step 1: `<EditOverlay>` server action 으로 sha load 함수 작성**

`apps/web/app/(public)/posts/[slug]/save-action.ts`:
```ts
"use server";

import { revalidatePath } from "next/cache";
import {
  GitHubShaConflictError,
  getGitHubContentFile,
  postContentPath,
  savePostSourceWithBaseShaGuard,
} from "@/lib/admin/github-content";
import { getAdminContentConfigStatus, missingEnvMessage } from "@/lib/admin/env";
import { adminPostDraftFromFormData, parseAdminPostSource, serializeAdminPostDraft, type AdminPostDraft } from "@/lib/admin/mdx";
import { getAdminSession } from "@/lib/admin/session";
import { assertValidPostSlug } from "@/lib/admin/slug";

export type LoadResult =
  | { ok: true; draft: AdminPostDraft; sha: string }
  | { ok: false; error: string };

export async function loadInPlace(slug: string): Promise<LoadResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const safeSlug = assertValidPostSlug(slug);
  const status = getAdminContentConfigStatus();
  if (!status.configured) {
    return { ok: false, error: `Missing GitHub config: ${missingEnvMessage(status.missing)}` };
  }
  const file = await getGitHubContentFile(status.config, postContentPath(safeSlug));
  if (!file) return { ok: false, error: "Post not found in GitHub" };
  const draft = parseAdminPostSource(file.source, safeSlug);
  return { ok: true, draft, sha: file.sha };
}

export type SaveResult =
  | { ok: true; commitSha: string | null; commitUrl: string | null }
  | { ok: false; error: string; conflict?: boolean };

export async function savePostInPlaceAction(formData: FormData): Promise<SaveResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const status = getAdminContentConfigStatus();
  if (!status.configured) {
    return { ok: false, error: `Missing GitHub config: ${missingEnvMessage(status.missing)}` };
  }
  const baseSha = (formData.get("_baseSha") as string) || "";

  let post: AdminPostDraft;
  try {
    post = adminPostDraftFromFormData(formData);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid form" };
  }

  const source = serializeAdminPostDraft(post);
  try {
    const result = await savePostSourceWithBaseShaGuard(
      status.config,
      post.slug,
      source,
      `content: in-place edit ${post.slug} via /posts (${session.login})`,
      baseSha,
    );
    revalidatePath(`/posts/${post.slug}`);
    revalidatePath("/posts");
    revalidatePath(`/categories/${post.category}`);
    for (const tag of post.tags) revalidatePath(`/tags/${tag}`);
    return { ok: true, commitSha: result.commitSha, commitUrl: result.commitUrl };
  } catch (error) {
    if (error instanceof GitHubShaConflictError) {
      return {
        ok: false,
        error: "다른 곳에서 수정되었습니다. reload 후 다시 시도하세요.",
        conflict: true,
      };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Save failed" };
  }
}
```

- [ ] **Step 2: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/app/\(public\)/posts/\[slug\]/save-action.ts
git commit -m "feat(admin): savePostInPlaceAction with sha guard"
```

---

### Task 4: `<MetadataPanel>` 추출

**Files:**
- Create: `apps/web/src/components/admin/MetadataPanel.tsx`
- Modify: `apps/web/app/(admin)/admin/_components/post-form.tsx`

- [ ] **Step 1: 메타 필드 묶음을 별도 컴포넌트로 분리**

`MetadataPanel.tsx`:
```tsx
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
          <span>📝 Metadata · {summary}</span>
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
            <input className={inputClass} type="date" name="publishedAt" required defaultValue={post.publishedAt} />
          </Field>
          <Field label="Updated date">
            <input className={inputClass} type="date" name="updatedAt" required defaultValue={post.updatedAt} />
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
            <input className={inputClass} name="tags" required defaultValue={post.tags.join(", ")} />
          </Field>
          <Field label="Tools (comma separated)">
            <input className={inputClass} name="tools" required defaultValue={post.tools.join(", ")} />
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
```

- [ ] **Step 2: post-form.tsx 에서 MetadataPanel 사용으로 교체**

```tsx
import { MetadataPanel } from "@/components/admin/MetadataPanel";

// 기존 메타 섹션 통째 삭제, 그 자리에:
<MetadataPanel post={post} defaultOpen collapsible={false} />
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck && npm run build
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/admin/MetadataPanel.tsx apps/web/app/\(admin\)/admin/_components/post-form.tsx
git commit -m "feat(admin): extract MetadataPanel for reuse"
```

---

### Task 5: `<EditOverlay>` 컴포넌트

**Files:**
- Create: `apps/web/src/components/admin/EditOverlay.tsx`

- [ ] **Step 1: 클라이언트 overlay 작성**

```tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { AdminPostDraft } from "@/lib/admin/mdx";
import { MetadataPanel } from "./MetadataPanel";
import { loadInPlace, savePostInPlaceAction, type SaveResult } from "@/app/(public)/posts/[slug]/save-action";

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

  // Cmd/Ctrl+S, Esc, beforeunload
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
    // hide SSR body
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
      // 갱신을 보장하려고 일단 reload (revalidatePath 후 새 데이터 가져옴)
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
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="container-prose space-y-6 py-8"
      >
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
          <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
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
```

- [ ] **Step 2: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/admin/EditOverlay.tsx
git commit -m "feat(admin): EditOverlay client component for in-place editing"
```

---

### Task 6: posts/[slug]/page.tsx 가 EditOverlay 마운트

**Files:**
- Modify: `apps/web/app/(public)/posts/[slug]/page.tsx`

- [ ] **Step 1: admin 세션 + env flag 분기 + EditPostButton → EditOverlay 교체**

```tsx
import { getAdminSession } from "@/lib/admin/session";
import { isInPlaceEditEnabled } from "@/lib/admin/inplace-flag";
import { EditOverlay } from "@/components/admin/EditOverlay";
// ...

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const session = isInPlaceEditEnabled() ? await getAdminSession() : null;
  const isAdmin = !!session;

  return (
    <article className="container-prose py-16 sm:py-20">
      <ArticleJsonLd post={post} />
      <div className="mb-8 flex items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400">
          <Link href="/posts" className="hover:text-accent">Posts</Link>{" "}
          <span aria-hidden="true">/</span> {categoryLabel(post.category)}
        </nav>
        {/* 자리는 비워두고 EditOverlay 가 fixed/sticky로 자기 위치를 잡음 */}
      </div>
      <header>{/* 동일 */}</header>
      <div className="prose mt-12 drop-cap">
        <MDXRemote source={post.body} components={mdxComponents} />
      </div>
      <footer className="mt-12 border-t border-paper-rule pt-6">{/* 동일 */}</footer>
      {isAdmin && <EditOverlay slug={post.slug} />}
    </article>
  );
}
```

- [ ] **Step 2: EditPostButton import 제거**

상단 `import { EditPostButton } from ...` 라인 삭제. 사용처 제거.

- [ ] **Step 3: EditPostButton 파일 삭제**

```bash
cd apps/web && grep -r "EditPostButton" src app | cat
```

Expected: 결과 없음.

```bash
git rm apps/web/src/components/admin/EditPostButton.tsx
```

- [ ] **Step 4: 빌드 검증**

```bash
cd apps/web && npm run typecheck && npm run build
```

Expected: 성공.

- [ ] **Step 5: 커밋**

```bash
git add apps/web/app/\(public\)/posts/\[slug\]/page.tsx
git commit -m "feat(public): mount EditOverlay for admins, remove EditPostButton"
```

---

### Task 7: draft 글 admin 접근 정책 — 명시화

`getPostBySlug` 가 draft 도 반환하는지 확인 후 명시화.

- [ ] **Step 1: posts.ts 의 `getPostBySlug` 동작 확인**

```bash
cd apps/web && grep -n "getPostBySlug\|publishedPosts" src/lib/content/posts.ts | cat
```

만약 `getPostBySlug` 가 published 만 반환하면, admin 인 경우 draft/scheduled 도 보일 수 있도록 분기 추가.

- [ ] **Step 2: page.tsx 에서 admin 분기**

```tsx
const post = isAdmin ? getPostBySlug(slug, { includeDrafts: true }) : getPostBySlug(slug);
```

(만약 `getPostBySlug` 가 옵션 인자를 안 받으면 `getPostBySlugIncludingDrafts` 같은 별도 함수를 추가하거나, 직접 `allPosts.find` 패턴으로 대체. 본 task 의 범위는 정책 명시이며, posts.ts API 형태에 맞춰 한 줄 추가.)

posts.ts 측 변경 패턴 (필요 시):
```ts
export function getPostBySlug(slug: string, opts?: { includeDrafts?: boolean }) {
  const list = opts?.includeDrafts ? allPosts : publishedPosts;
  return list.find((p) => p.slug === slug) ?? null;
}
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck && npm run build
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/lib/content/posts.ts apps/web/app/\(public\)/posts/\[slug\]/page.tsx
git commit -m "feat(public): admins can view+edit draft posts in place"
```

---

### Task 8: DEPLOYMENT.md 갱신

**Files:**
- Modify: `docs/70_ops/DEPLOYMENT.md`

- [ ] **Step 1: env 섹션에 INPLACE_EDIT_ENABLED 추가**

```markdown
### Admin in-place editing

`INPLACE_EDIT_ENABLED` — `true` (기본) / `false` 로 설정. `false` 면 공개 페이지에서 admin EditOverlay가 마운트되지 않음. 비상 시 빠른 토글용.
```

- [ ] **Step 2: 커밋**

```bash
git add docs/70_ops/DEPLOYMENT.md
git commit -m "docs(ops): document INPLACE_EDIT_ENABLED"
```

---

### Task 9: 통합 수동 검증

- [ ] **Step 1: dev 서버**

```bash
cd apps/web && npm run dev
```

- [ ] **Step 2: 체크리스트**

`/posts/<slug>` (공개 글) 진입:

비-admin (시크릿 창):
1. 우상단 / 우하단 어디에도 Edit 버튼 보이지 않음
2. DOM 에 `EditOverlay` 관련 markup 0
3. Performance: Lighthouse First-Load JS 가 이전 대비 회귀 없음 (admin chunk 가 미로드)

admin (로그인):
4. 우상단(데스크탑) / 우하단(모바일) Edit 버튼 보임
5. 클릭 → loading → 본문 자리에 RichEditor + Metadata 패널
6. 본문 수정 → Cmd/Ctrl+S → Save 진행 → 페이지 reload → 변경사항 반영
7. 다른 탭에서 같은 글을 `/admin/posts/<slug>` 로 열어 수정·Save 한 뒤, 원 탭에서 Save 시도 → "다른 곳에서 수정되었습니다" 에러 표시 (sha 충돌 가드)
8. Esc → dirty 시 confirm → 닫기
9. 본문 수정 후 다른 페이지로 이동 시도 → beforeunload 경고
10. `INPLACE_EDIT_ENABLED=false` 로 재시작 → admin 도 Edit 버튼 안 보임

- [ ] **Step 3: 결과를 PR 본문에 첨부 (스크린샷 1-2장 + 충돌 케이스)**

---

## Acceptance

- [ ] `npm test` 통과 (inplace-flag 3 + sha conflict 1 케이스 추가)
- [ ] 비-admin: Edit 관련 DOM/JS 0 (LCP 회귀 없음)
- [ ] admin: 공개 글에서 Edit → in-place 편집 → Save → revalidate 후 view 모드 복귀
- [ ] sha 충돌 케이스가 안전하게 거부됨 (커밋 안 됨)
- [ ] Cmd/Ctrl+S, Esc, beforeunload 동작
- [ ] `INPLACE_EDIT_ENABLED=false` 로 즉시 비활성화 가능
- [ ] draft / scheduled 글도 admin 이면 공개 라우트에서 in-place 편집 가능

## Notes

- **하단 FAB vs 상단 sticky**: CSS 미디어 쿼리로 분기 (`sm:` 브레이크포인트). 본 슬라이스의 EditOverlay 는 모바일에선 fixed bottom-right, 데스크탑에선 sticky top-right. 디자인 변경 원하면 5.6 폴리싱에서.
- **Save 후 reload**: revalidatePath 가 cache 를 무효화해도 client component state 와 SSR 본문이 어긋날 수 있어 `window.location.reload()` 로 단순화. 더 부드러운 변환은 5.6 에서.
- **충돌 시 자동 머지 안 함**: 사용자에게 reload 강제. 자동 3-way merge 는 본 슬라이스 스코프 밖.
- **server action 위치**: 통상 `actions.ts` 패턴이지만 in-place 편집은 공개 페이지 폴더 안 (`(public)/posts/[slug]/save-action.ts`) 에 두어 라우트 응집도 우선.
