# Slice 5.6 — Callout + Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Phase: 5 — MDX Components & Rich Editor
Status: Ready (depends on 5.1-5.5)
Spec: [`_design/2026-05-07-rich-editor-overhaul.md`](./_design/2026-05-07-rich-editor-overhaul.md) §6.7, §7

**Goal:** `<Callout>` (info/warn/tip/danger) 추가, 키보드 단축키 모달, 토스트 통일, 다크모드 토큰 매칭, 접근성 라벨, 회귀 테스트 보강. 마지막 폴리싱.

**Architecture:** Callout 은 `block content` Tiptap Node — children 을 받는 첫 컴포넌트. NodeView 는 색상 wrapper. `?` 키 시 단축키 모달 (`<KeyboardHelp>`). 에러는 단순 `alert` 대신 `<Toast>` 컨테이너로 일원화. 다크모드는 기존 design token (`bg-paper-deep`, `text-ink-*`, `border-paper-rule`) 을 색상 컴포넌트마다 점검.

**Tech Stack:** Tiptap 2.27 (NodeView with content), React Context (Toast).

---

## Files

**Create:**
- `apps/web/src/components/admin/RichEditor/nodes/callout-node.ts`
- `apps/web/src/components/admin/RichEditor/nodes/callout-view.tsx`
- `apps/web/src/components/admin/RichEditor/keyboard-help.tsx`
- `apps/web/src/components/admin/RichEditor/toast.tsx`
- `apps/web/src/components/admin/RichEditor/callout-serialize.test.ts`
- `apps/web/src/components/mdx/Callout.tsx`

**Modify:**
- `apps/web/src/components/admin/RichEditor/extensions.ts`
- `apps/web/src/components/admin/RichEditor/commands.ts`
- `apps/web/src/components/admin/RichEditor/serialize.ts`
- `apps/web/src/components/admin/RichEditor/index.tsx`
- `apps/web/src/components/mdx/mdx-components.tsx`

---

## Tasks

### Task 1: `<Callout>` 공개 페이지 렌더 컴포넌트

**Files:**
- Create: `apps/web/src/components/mdx/Callout.tsx`

- [ ] **Step 1: 컴포넌트**

```tsx
import type { ReactNode } from "react";

export type CalloutType = "info" | "warn" | "tip" | "danger";

const STYLES: Record<CalloutType, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  warn: "border-yellow-200 bg-yellow-50 text-yellow-900",
  tip: "border-green-200 bg-green-50 text-green-900",
  danger: "border-red-200 bg-red-50 text-red-900",
};

const ICONS: Record<CalloutType, string> = {
  info: "ℹ️",
  warn: "⚠️",
  tip: "💡",
  danger: "🚫",
};

export function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  const safe = (["info", "warn", "tip", "danger"] as const).includes(type) ? type : "info";
  return (
    <aside className={`my-6 flex gap-3 rounded-md border px-4 py-3 ${STYLES[safe]}`}>
      <span aria-hidden className="select-none text-lg">{ICONS[safe]}</span>
      <div className="prose prose-sm max-w-none">{children}</div>
    </aside>
  );
}
```

- [ ] **Step 2: mdx-components 등록**

```tsx
import { Callout } from "./Callout";
export const mdxComponents = {
  Callout,
  // 나머지 동일
};
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/mdx/Callout.tsx apps/web/src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): Callout component (info/warn/tip/danger)"
```

---

### Task 2: Callout Tiptap Node + NodeView

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/nodes/callout-node.ts`
- Create: `apps/web/src/components/admin/RichEditor/nodes/callout-view.tsx`

- [ ] **Step 1: Node 정의 — block content (children 가짐)**

```ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CalloutNodeView } from "./callout-view";

export type CalloutType = "info" | "warn" | "tip" | "danger";
const TYPES: ReadonlyArray<CalloutType> = ["info", "warn", "tip", "danger"];

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      type: {
        default: "info" as CalloutType,
        parseHTML: (el) => {
          const t = el.getAttribute("data-callout-type") ?? "info";
          return (TYPES as readonly string[]).includes(t) ? t : "info";
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "aside[data-callout]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "aside",
      mergeAttributes(HTMLAttributes, {
        "data-callout": "true",
        "data-callout-type": (node.attrs.type as CalloutType) ?? "info",
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },
});
```

- [ ] **Step 2: NodeView**

`callout-view.tsx`:
```tsx
"use client";

import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import type { CalloutType } from "./callout-node";

const STYLES: Record<CalloutType, string> = {
  info: "border-blue-200 bg-blue-50",
  warn: "border-yellow-200 bg-yellow-50",
  tip: "border-green-200 bg-green-50",
  danger: "border-red-200 bg-red-50",
};

export function CalloutNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const type = (node.attrs.type as CalloutType) ?? "info";
  return (
    <NodeViewWrapper
      as="aside"
      data-callout="true"
      className={`my-6 rounded-md border px-4 py-3 ${STYLES[type]} ${selected ? "ring-2 ring-accent" : ""}`}
    >
      <div className="mb-2 flex items-center gap-2">
        {(["info", "warn", "tip", "danger"] as CalloutType[]).map((t) => (
          <button
            key={t}
            type="button"
            aria-label={`Set callout to ${t}`}
            aria-pressed={type === t}
            onClick={() => updateAttributes({ type: t })}
            className={`rounded px-2 py-0.5 text-xs uppercase tracking-wide ${type === t ? "bg-paper text-ink-800" : "text-ink-500 hover:bg-paper/50"}`}
          >
            {t}
          </button>
        ))}
        <button
          type="button"
          aria-label="Delete callout"
          onClick={() => deleteNode()}
          className="ml-auto rounded px-2 py-0.5 text-xs text-red-600 hover:bg-paper/50"
        >
          🗑
        </button>
      </div>
      <NodeViewContent className="prose prose-sm max-w-none" />
    </NodeViewWrapper>
  );
}
```

- [ ] **Step 3: extensions.ts 에 등록**

```ts
import { Callout } from "../nodes/callout-node";
// ...
return [
  // ...
  Callout,
];
```

- [ ] **Step 4: 슬래시 메뉴 항목 추가**

`commands.ts`:
```ts
export function buildCalloutSlashItems(): SlashItem[] {
  return [
    {
      title: "Callout",
      description: "정보 박스 (info/warn/tip/danger)",
      command: ({ editor, range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "callout",
            attrs: { type: "info" },
            content: [{ type: "paragraph" }],
          })
          .run(),
    },
  ];
}
```

`index.tsx`:
```tsx
const slashItems = useMemo<SlashItem[]>(
  () => [
    ...buildCoreSlashItems(),
    ...buildImageSlashItems(slug, onMediaError ?? (() => {})),
    ...buildVideoSlashItems(slug, onMediaError ?? (() => {})),
    ...buildEmbedSlashItems(onMediaError ?? (() => {})),
    ...buildCalloutSlashItems(),
    ...extraSlashItems,
  ],
  [slug, onMediaError, extraSlashItems],
);
```

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/nodes/callout-node.ts apps/web/src/components/admin/RichEditor/nodes/callout-view.tsx apps/web/src/components/admin/RichEditor/extensions.ts apps/web/src/components/admin/RichEditor/commands.ts apps/web/src/components/admin/RichEditor/index.tsx
git commit -m "feat(editor): Callout Tiptap node + slash command"
```

---

### Task 3: Callout MDX 직렬화

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/serialize.ts`
- Create: `apps/web/src/components/admin/RichEditor/callout-serialize.test.ts`

`<Callout>` 은 children 을 가지므로 자체닫기 형태가 아니다. 단일 `data-callout` HTML wrapper 가 뱉어지는데, 이를 `<Callout type="...">\n\n…\n\n</Callout>` 으로 변환.

- [ ] **Step 1: serialize.ts 에 추가**

```ts
export function htmlCalloutToMdx(markdown: string): string {
  const RE = /<aside[^>]*data-callout="true"[^>]*data-callout-type="([^"]*)"[^>]*>([\s\S]*?)<\/aside>/g;
  return markdown.replace(RE, (_match, type: string, inner: string) => {
    const safeType = ["info", "warn", "tip", "danger"].includes(type) ? type : "info";
    const trimmed = inner.trim();
    return `<Callout type="${safeType}">\n\n${trimmed}\n\n</Callout>`;
  });
}

export function postProcessMarkdown(md: string): string {
  return htmlCalloutToMdx(htmlEmbedToMdx(htmlVideoToMdx(htmlFigureToMdx(md))));
}
```

- [ ] **Step 2: 테스트**

`callout-serialize.test.ts`:
```ts
import assert from "node:assert/strict";
import test from "node:test";
import { htmlCalloutToMdx } from "./serialize.ts";

test("Callout HTML → MDX with type and trimmed children", () => {
  const html = `<aside data-callout="true" data-callout-type="warn"><p>Be careful.</p></aside>`;
  assert.equal(
    htmlCalloutToMdx(html),
    `<Callout type="warn">\n\n<p>Be careful.</p>\n\n</Callout>`,
  );
});

test("Callout HTML → MDX falls back to info on unknown type", () => {
  const html = `<aside data-callout="true" data-callout-type="malicious"><p>x</p></aside>`;
  assert.match(htmlCalloutToMdx(html), /<Callout type="info">/);
});

test("Callout HTML → MDX preserves multi-paragraph children", () => {
  const html = `<aside data-callout="true" data-callout-type="info"><p>One</p><p>Two</p></aside>`;
  assert.match(htmlCalloutToMdx(html), /<p>One<\/p><p>Two<\/p>/);
});
```

- [ ] **Step 3: 실행 + package.json 추가**

```bash
cd apps/web && node --test src/components/admin/RichEditor/callout-serialize.test.ts
```

Expected: `# pass 3`.

```json
"test": "... src/components/admin/RichEditor/callout-serialize.test.ts"
```

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/serialize.ts apps/web/src/components/admin/RichEditor/callout-serialize.test.ts apps/web/package.json
git commit -m "test(editor): Callout MDX roundtrip"
```

---

### Task 4: Toast 시스템

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/toast.tsx`

- [ ] **Step 1: 컨텍스트 + 컴포넌트**

```tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastKind = "info" | "error";
type Toast = { id: string; kind: ToastKind; message: string };

type ToastApi = {
  pushError: (message: string) => void;
  pushInfo: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((curr) => [...curr, { id, kind, message }]);
      window.setTimeout(() => remove(id), 6000);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      pushError: (m) => push("error", m),
      pushInfo: (m) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.kind === "error" ? "alert" : "status"}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow ${
              t.kind === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-paper-rule bg-paper text-ink-800"
            }`}
          >
            <span>{t.message}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => remove(t.id)}
              className="ml-2 text-xs text-ink-400 hover:text-ink-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 2: EditOverlay 와 RichEditor 가 ToastProvider 안에 들어가도록 wrap**

`EditOverlay.tsx` 의 editing 모드 wrapper 를 ToastProvider 로 감쌈:
```tsx
import { ToastProvider, useToast } from "@/components/admin/RichEditor/toast";

// 외부 컴포넌트
export function EditOverlay({ slug }: { slug: string }) {
  return (
    <ToastProvider>
      <EditOverlayInner slug={slug} />
    </ToastProvider>
  );
}

// 내부 — 기존 로직, 단 setError(msg) 대신 useToast().pushError(msg) 사용
function EditOverlayInner({ slug }: { slug: string }) {
  const { pushError } = useToast();
  // ... 기존 로직, setError → pushError
}
```

- [ ] **Step 3: post-form.tsx 도 ToastProvider 로 감쌈**

```tsx
import { ToastProvider } from "@/components/admin/RichEditor/toast";

export function AdminPostForm(...) {
  return (
    <ToastProvider>
      {/* 기존 form */}
    </ToastProvider>
  );
}
```

- [ ] **Step 4: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/toast.tsx apps/web/src/components/admin/EditOverlay.tsx apps/web/app/\(admin\)/admin/_components/post-form.tsx
git commit -m "feat(editor): unified Toast system replacing alert calls"
```

---

### Task 5: 키보드 단축키 모달

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/keyboard-help.tsx`

- [ ] **Step 1: 모달 컴포넌트**

```tsx
"use client";

import { useEffect, useState } from "react";

const SHORTCUTS: Array<[string, string]> = [
  ["Cmd/Ctrl + S", "저장 (in-place 편집)"],
  ["Esc", "Cancel (dirty 시 confirm)"],
  ["Cmd/Ctrl + B", "Bold"],
  ["Cmd/Ctrl + I", "Italic"],
  ["Cmd/Ctrl + U", "Underline"],
  ["Cmd/Ctrl + Shift + S", "Strikethrough"],
  ["Cmd/Ctrl + K", "Link"],
  ["/", "슬래시 메뉴 (블록 삽입)"],
  ["?", "이 단축키 모달 열기/닫기"],
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable = target?.isContentEditable || target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (e.key === "?" && !inEditable) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Keyboard shortcuts"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-md border border-paper-rule bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 font-mono text-sm uppercase tracking-[0.12em] text-ink-700">Keyboard shortcuts</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} className="contents">
              <dt className="font-mono text-ink-700">{key}</dt>
              <dd className="text-ink-500">{desc}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="mt-4 w-full rounded-md border border-paper-rule bg-paper-deep py-2 text-sm text-ink-700 hover:border-accent"
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: EditOverlay 와 post-form.tsx 에 마운트**

```tsx
import { KeyboardHelp } from "@/components/admin/RichEditor/keyboard-help";

// EditOverlay editing 모드 안:
<KeyboardHelp />
// post-form.tsx 안:
<KeyboardHelp />
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/keyboard-help.tsx apps/web/src/components/admin/EditOverlay.tsx apps/web/app/\(admin\)/admin/_components/post-form.tsx
git commit -m "feat(editor): keyboard shortcut help modal (?)"
```

---

### Task 6: 다크모드 / a11y 점검 스윕

자동화하지 않음 — manual checklist.

- [ ] **Step 1: 다크모드 토큰 점검**

새로 추가한 모든 컴포넌트가 `bg-paper / bg-paper-deep / text-ink-* / border-paper-rule / text-accent` 만 사용하는지 grep:

```bash
cd apps/web/src/components && grep -rn "text-blue-\|bg-blue-\|text-red-\|text-green-\|text-yellow-" mdx admin/RichEditor admin/EditOverlay.tsx
```

찾은 항목 검토 — `<Callout>` 의 의미적 색상은 OK, 그 외엔 design token 으로 교체.

- [ ] **Step 2: aria-* 누락 검수**

```bash
cd apps/web/src/components/admin/RichEditor && grep -L "aria-label" nodes/figure-view.tsx nodes/video-view.tsx nodes/callout-view.tsx embeds/embed-view.tsx
```

각 NodeView 의 인터랙션 버튼이 모두 `aria-label` 보유한지 확인. 누락된 곳 추가.

- [ ] **Step 3: 키보드 only 검증**

`/admin/posts/<slug>` 또는 in-place 편집 진입 후 마우스 사용 0:
1. Tab 으로 툴바 / 메타패널 / 에디터 본문 / 슬래시 메뉴 / Save / Cancel 모두 도달 가능
2. 슬래시 메뉴 화살표 ↑↓ 로 이동, Enter 선택, Esc 닫기
3. 이미지 NodeView 의 align/caption/delete 버튼 Tab 이동 + Enter 활성

- [ ] **Step 4: 발견 항목 수정 + 커밋**

```bash
git commit -am "fix(editor): a11y labels + dark-mode token sweep"
```

---

### Task 7: 통합 회귀 — 풀 글 round-trip dogfood

5.1-5.5 의 모든 컴포넌트가 한 글 안에서 작동하는지 종합 검증.

- [ ] **Step 1: 신규 더미 글 생성**

`/admin/posts/new` 진입 후 다음 본문을 생성:

```mdx
## 풀패키지 dogfood

본문에 다양한 블록을 집어넣는다.

<Figure src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cat_03.jpg/640px-Cat_03.jpg" alt="cat" width="60%" align="left" caption="외부 URL 이미지" />

| 항목 | 상태 |
| --- | --- |
| Phase | 5 |
| Slice | 1-6 |

<Callout type="tip">
이 글은 Phase 5 dogfood 입니다.
</Callout>

<YouTube id="dQw4w9WgXcQ" />

<Tweet id="20" author="jack" />

<Spotify type="track" id="3n3Ppam7vgaVa1iaRUc9Lp" />

<GitHubRepo owner="ty-kim" repo="ai_survivor" />

<Embed url="https://example.com" title="Example" description="Sample" siteName="Example" />
```

- [ ] **Step 2: Save → 공개 페이지 확인**

GitHub 커밋 → revalidate → 공개 페이지 새로고침 → 모든 블록이 다음을 만족:
- 다크 / 라이트 모드 양쪽 깨짐 없음
- iframe 컴포넌트는 `loading="lazy"` 부착
- 외부 이미지는 `referrerpolicy="no-referrer"`
- 외부 컴포넌트가 fetch 실패해도 카드 자체는 깨지지 않음 (폴백 표시)

- [ ] **Step 3: 동일 글을 in-place 편집으로 다시 열기**

각 블록을 클릭 → NodeView toolbar 동작 → 변경 → Save → 변경사항 반영.

- [ ] **Step 4: 결과 PR 본문 + 스크린샷**

---

### Task 8: 문서 동기화 (spec §8)

**Files:**
- Modify: `docs/60_decisions/ADR-004-github-backed-admin-editor.md`
- Modify: `docs/10_content/ARTICLE_TEMPLATE.md`
- Modify: `docs/20_features/media-library.md`
- Modify: `docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md`

- [ ] **Step 1: ADR-004 footer 에 Open Questions 답변 추가**

ADR-004 의 `## Open Questions` 섹션 끝에 다음 추가:

```markdown
### Resolved (Phase 5, 2026-05-07)

본 ADR 의 Open Questions 4개는 Phase 5 spec [phase-5-editor-media/_design/2026-05-07-rich-editor-overhaul.md](../50_execution/phase-5-editor-media/_design/2026-05-07-rich-editor-overhaul.md) 와 6개 slice (5.1-5.6) 로 답해졌다.

- 로그인 — GitHub OAuth (현행 유지)
- 브랜치 — master 직접 commit (보호가 필요해지면 별 ADR)
- 미디어 store — 이미지 = GitHub repo, 비디오 = Cloudflare R2
- 에디터 — Tiptap rich (NodeView + custom paste plugin)
```

- [ ] **Step 2: ARTICLE_TEMPLATE.md 에 새 컴포넌트 사용 예 추가**

기존 템플릿 끝에 다음 섹션 append:
```markdown
## Phase 5 컴포넌트 예 (선택)

\`\`\`mdx
<Figure src="..." alt="..." width="60%" align="left" caption="..." />
<Video src="https://pub-xxx.r2.dev/posts/<slug>/<file>.mp4" caption="데모" />
<YouTube id="..." />
<Tweet id="..." author="..." />
<Spotify type="track" id="..." />
<Notion pageId="..." title="..." />
<GitHubRepo owner="..." repo="..." />
<CodePen user="..." id="..." />
<Gist user="..." id="..." />
<Vimeo id="..." />
<Embed url="..." title="..." description="..." image="..." siteName="..." />
<Callout type="tip">팁 박스</Callout>
\`\`\`
```

- [ ] **Step 3: media-library.md (보류 문서) 한 줄 메모**

문서 상단 Status 줄 아래에:
```markdown
> Phase 5 (2026-05-07): 이미지 = GitHub repo (현행), 비디오 = Cloudflare R2. 풀 미디어 라이브러리 UI 는 본 문서 부활 시 재설계.
```

- [ ] **Step 4: SEO_ADSENSE_CHECKLIST.md 에 iframe 정책 한 줄**

```markdown
- 임베드 컴포넌트(YouTube/Vimeo/CodePen/Spotify/Notion/Gist/Tweet/Embed) iframe 은 모두 `loading="lazy"` + `sandbox` 부여. AdSense 승인에 영향 없음.
```

- [ ] **Step 5: 커밋**

```bash
git add docs/60_decisions/ADR-004-github-backed-admin-editor.md docs/10_content/ARTICLE_TEMPLATE.md docs/20_features/media-library.md docs/30_seo_monetization/SEO_ADSENSE_CHECKLIST.md
git commit -m "docs: Phase 5 sync — ADR-004 resolved + template + media + SEO"
```

---

### Task 9: 최종 회귀 — npm test, typecheck, build

- [ ] **Step 1: 모든 테스트**

```bash
cd apps/web && npm test
```

Expected: 모든 phase 5 슬라이스가 추가한 테스트 (~40+ 케이스) 포함 통과.

- [ ] **Step 2: 타입체크 + 빌드**

```bash
cd apps/web && npm run typecheck && npm run build
```

Expected: 0 errors, 빌드 성공.

- [ ] **Step 3: 비-admin 번들 사이즈 회귀 검증**

```bash
cd apps/web && npm run build 2>&1 | grep -E "First Load JS|/posts/\[slug\]"
```

`/posts/[slug]` 의 First Load JS 가 phase 시작 전 대비 크게 증가 안 했는지 (목표: <10% 증가). 회귀 발생 시 dynamic import 누락 의심.

- [ ] **Step 4: 커밋 (필요 시 sweep 수정)**

```bash
git commit -am "chore(editor): final test/typecheck/build pass"
```

---

## Acceptance

- [ ] `npm test` 통과 (Callout 3 케이스 포함, 누적 ~40+ 케이스)
- [ ] `npm run build` 성공, `/posts/[slug]` first-load JS 회귀 <10%
- [ ] Callout 4가지 타입 (info/warn/tip/danger) 모두 동작 + MDX round-trip
- [ ] `?` 키 → 단축키 모달
- [ ] 모든 에러가 토스트로 표출 (alert 호출 0)
- [ ] 키보드 only 로 모든 슬래시·NodeView 조작 가능
- [ ] 다크모드 깨지지 않음 — design token 만 사용

## Notes

- **Callout children**: tiptap-markdown 이 `<aside>` 내부 children 을 markdown 으로 직렬화한다. `htmlCalloutToMdx` 가 그 결과를 `<Callout>` 으로 감싸준다 — children 안에서 `<Figure>` 등 다른 컴포넌트도 정상 작동 (중첩 round-trip).
- **Toast vs alert**: 본 슬라이스에서 alert 호출을 모두 `pushError` 로 바꾼다. 그러나 *upload pre-flight reject* (예: 200MB 초과) 같은 즉시 결정은 alert 가 명료할 수도 — 자유 판단.
- **자동 e2e 부재**: 키보드/포커스/색상 회귀는 manual 체크. 1인 운영 환경의 트레이드오프.
