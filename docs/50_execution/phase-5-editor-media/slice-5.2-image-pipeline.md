# Slice 5.2 — Image Pipeline (paste · D&D · resize · align)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Phase: 5 — MDX Components & Rich Editor
Status: Ready (depends on 5.1)
Spec: [`_design/2026-05-07-rich-editor-overhaul.md`](./_design/2026-05-07-rich-editor-overhaul.md) §3, §4.2-4.3, §5.1

**Goal:** 클립보드 붙여넣기 / 드래그&드롭 / 슬래시 명령 으로 이미지를 즉시 placeholder 로 박고 비동기로 GitHub 에 업로드, 완료 후 `<Figure>` MDX 컴포넌트로 교체. 코너 핸들 드래그로 width 5% 단위 스냅 조정, floating bar 로 좌/중/우/풀폭 정렬·캡션 편집 가능. 외부 URL 이미지 paste 도 동일 경로(GitHub 업로드 없이 외부 src 그대로) 처리.

**Architecture:** Tiptap 커스텀 Node `figure` (atom block) + ReactNodeView. ProseMirror plugin 으로 paste/drop event 가로채 File 또는 URL 분기. 업로드 도중에는 NodeView 가 placeholder 상태(`__uploading__` attribute) 로 progress 표시, 끝나면 attribute 갱신. 직렬화는 `<Figure src alt width align caption />` 자체닫기 형태. 공개 페이지는 `mdx/Figure.tsx` 가 렌더.

**Tech Stack:** Tiptap 2.27 (Node, ProseMirror Plugin), React 19, ProseMirror Decoration.

---

## Files

**Create:**
- `apps/web/src/components/admin/RichEditor/nodes/figure-node.ts`
- `apps/web/src/components/admin/RichEditor/nodes/figure-view.tsx`
- `apps/web/src/components/admin/RichEditor/plugins/media-paste.ts`
- `apps/web/src/components/admin/RichEditor/plugins/upload-image.ts`
- `apps/web/src/components/mdx/Figure.tsx`
- `apps/web/src/components/admin/RichEditor/figure-serialize.test.ts`

**Modify:**
- `apps/web/src/components/admin/RichEditor/extensions.ts` (figure node 등록 + media-paste plugin)
- `apps/web/src/components/admin/RichEditor/commands.ts` (`Image` 슬래시 항목 추가)
- `apps/web/src/components/admin/RichEditor/index.tsx` (slug prop 재도입, image upload context provider)
- `apps/web/src/components/mdx/mdx-components.tsx` (`Figure` 등록)
- `apps/web/app/(admin)/admin/_components/post-form.tsx` (`<RichEditor slug={…}>`)
- `apps/web/package.json` test 스크립트

---

## Tasks

### Task 1: `<Figure>` MDX 렌더 컴포넌트 (공개 페이지)

**Files:**
- Create: `apps/web/src/components/mdx/Figure.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
import type { CSSProperties } from "react";

export type FigureProps = {
  src: string;
  alt: string;
  width?: string;
  align?: "left" | "center" | "right" | "full";
  caption?: string;
};

const PCT = /^(\d{1,3})%$/;

function isPercent(value: string | undefined): value is string {
  if (!value) return false;
  const match = PCT.exec(value);
  if (!match) return false;
  const n = Number(match[1]);
  return Number.isFinite(n) && n > 0 && n <= 100;
}

function normalizeAlign(value: FigureProps["align"]): NonNullable<FigureProps["align"]> {
  if (value === "left" || value === "right" || value === "full") return value;
  return "center";
}

export function Figure({ src, alt, width, align, caption }: FigureProps) {
  if (!src) return null;
  const safeAlt = alt ?? "";
  const safeAlign = normalizeAlign(align);
  const safeWidth = isPercent(width) ? width : "100%";

  const figureClass =
    safeAlign === "left"
      ? "my-6 float-left mr-6 mb-3 max-w-full"
      : safeAlign === "right"
        ? "my-6 float-right ml-6 mb-3 max-w-full"
        : safeAlign === "full"
          ? "my-8 w-full"
          : "my-8 mx-auto max-w-full";

  const wrapperStyle: CSSProperties =
    safeAlign === "full" ? {} : { width: safeWidth };

  const isExternal = !src.startsWith("/") && !src.includes("raw.githubusercontent.com");

  return (
    <figure className={figureClass} style={wrapperStyle}>
      <img
        src={src}
        alt={safeAlt}
        loading="lazy"
        referrerPolicy={isExternal ? "no-referrer" : undefined}
        className="block w-full rounded-md border border-paper-rule"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-ink-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
```

- [ ] **Step 2: `mdx-components` 레지스트리에 등록**

`apps/web/src/components/mdx/mdx-components.tsx`:
```tsx
import type { ComponentProps } from "react";
import { Figure } from "./Figure";
import { YouTube } from "./YouTube";

function MdxImage({ src, alt = "", ...rest }: ComponentProps<"img">) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="my-6 max-w-full rounded-md border border-paper-rule"
      {...rest}
    />
  );
}

export const mdxComponents = {
  Figure,
  YouTube,
  img: MdxImage,
};
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/mdx/Figure.tsx apps/web/src/components/mdx/mdx-components.tsx
git commit -m "feat(mdx): Figure component for align/width/caption"
```

---

### Task 2: 업로드 컨텍스트 helper

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/plugins/upload-image.ts`

- [ ] **Step 1: 업로드 helper 작성**

```ts
"use client";

export type ImageUploadResult = { url: string };

export async function uploadImageForSlug(slug: string, file: File): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`/api/admin/upload/${encodeURIComponent(slug)}`, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });
  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as ImageUploadResult;
}

export const ALLOWED_IMAGE_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME.has(file.type)) return `Unsupported image type: ${file.type}`;
  if (file.size > MAX_IMAGE_BYTES) return "Image exceeds 4MB limit";
  return null;
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/plugins/upload-image.ts
git commit -m "feat(editor): image upload helper with validation"
```

---

### Task 3: Figure Tiptap Node 정의

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/nodes/figure-node.ts`

- [ ] **Step 1: Node 작성 — atom block, draggable, MDX 자체닫기 형태로 직렬화**

```ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FigureNodeView } from "./figure-view";

export type FigureAttrs = {
  src: string;
  alt: string;
  width: string; // "100%" 형태, 5단위 스냅
  align: "left" | "center" | "right" | "full";
  caption: string;
  uploading: boolean; // true면 placeholder 상태
};

const ALIGN_VALUES: ReadonlyArray<FigureAttrs["align"]> = ["left", "center", "right", "full"];

function clampWidth(value: string | null | undefined): string {
  if (!value) return "100%";
  const match = /^(\d{1,3})%$/.exec(value);
  if (!match) return "100%";
  const n = Math.min(100, Math.max(10, Math.round(Number(match[1]) / 5) * 5));
  return `${n}%`;
}

function clampAlign(value: string | null | undefined): FigureAttrs["align"] {
  if (value && (ALIGN_VALUES as readonly string[]).includes(value))
    return value as FigureAttrs["align"];
  return "center";
}

export const Figure = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
      width: {
        default: "100%",
        parseHTML: (el) => clampWidth(el.getAttribute("width")),
      },
      align: {
        default: "center",
        parseHTML: (el) => clampAlign(el.getAttribute("align")),
      },
      caption: { default: "" },
      uploading: { default: false, rendered: false },
    };
  },

  parseHTML() {
    // <figure data-figure src="..." alt="..." width="..." align="..." caption="..."> 형태
    return [{ tag: "figure[data-figure]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-figure": "true" }),
      ["img", { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureNodeView);
  },
});

export function clampFigureWidth(value: string | null | undefined): string {
  return clampWidth(value);
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/nodes/figure-node.ts
git commit -m "feat(editor): Figure Tiptap node definition"
```

---

### Task 4: Figure NodeView (resize handle, align bar, caption)

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/nodes/figure-view.tsx`

- [ ] **Step 1: ReactNodeView 작성**

```tsx
"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
import { clampFigureWidth } from "./figure-node";

type Align = "left" | "center" | "right" | "full";

export function FigureNodeView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const { src, alt, width, align, caption, uploading } = node.attrs as {
    src: string;
    alt: string;
    width: string;
    align: Align;
    caption: string;
    uploading: boolean;
  };
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isCaptionEditing, setCaptionEditing] = useState(false);

  const setWidth = useCallback(
    (next: string) => updateAttributes({ width: clampFigureWidth(next) }),
    [updateAttributes],
  );
  const setAlign = useCallback(
    (next: Align) => updateAttributes({ align: next }),
    [updateAttributes],
  );

  const onCornerDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const wrap = wrapperRef.current;
      if (!wrap) return;
      const startX = event.clientX;
      const startPx = wrap.getBoundingClientRect().width;
      const parentPx = wrap.parentElement?.getBoundingClientRect().width ?? startPx;
      const onMove = (e: PointerEvent) => {
        const deltaPct = ((e.clientX - startX) / parentPx) * 100;
        const startPct = (startPx / parentPx) * 100;
        setWidth(`${Math.round(startPct + deltaPct)}%`);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [setWidth],
  );

  const containerClass =
    align === "left"
      ? "float-left mr-6 mb-3"
      : align === "right"
        ? "float-right ml-6 mb-3"
        : align === "full"
          ? "w-full"
          : "mx-auto";

  return (
    <NodeViewWrapper
      as="figure"
      className={`relative my-6 ${containerClass}`}
      data-figure="true"
      style={align === "full" ? undefined : { width }}
    >
      <div
        ref={wrapperRef}
        className={`relative ${selected ? "ring-2 ring-accent" : ""}`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="block w-full rounded-md border border-paper-rule"
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-paper-rule bg-paper-deep text-sm text-ink-400">
            이미지 정보 없음
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-paper/70 text-sm text-ink-500">
            업로드 중…
          </div>
        )}
        {selected && (
          <button
            type="button"
            aria-label="Resize"
            className="absolute bottom-1 right-1 h-6 w-6 cursor-se-resize rounded-full border border-paper-rule bg-paper shadow"
            onPointerDown={onCornerDrag}
          />
        )}
        {selected && (
          <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-paper-rule bg-paper p-1 shadow">
            <button type="button" aria-label="Align left" onClick={() => setAlign("left")} aria-pressed={align === "left"} className="rounded px-2 py-1 text-sm hover:bg-paper-deep">◀</button>
            <button type="button" aria-label="Align center" onClick={() => setAlign("center")} aria-pressed={align === "center"} className="rounded px-2 py-1 text-sm hover:bg-paper-deep">◼</button>
            <button type="button" aria-label="Align right" onClick={() => setAlign("right")} aria-pressed={align === "right"} className="rounded px-2 py-1 text-sm hover:bg-paper-deep">▶</button>
            <button type="button" aria-label="Full width" onClick={() => setAlign("full")} aria-pressed={align === "full"} className="rounded px-2 py-1 text-sm hover:bg-paper-deep">─</button>
            <span className="mx-1 h-4 w-px bg-paper-rule" />
            <button type="button" aria-label="Edit caption" onClick={() => setCaptionEditing(true)} className="rounded px-2 py-1 text-sm hover:bg-paper-deep">✏</button>
            <button type="button" aria-label="Delete" onClick={() => deleteNode()} className="rounded px-2 py-1 text-sm text-red-600 hover:bg-paper-deep">🗑</button>
          </div>
        )}
      </div>
      {isCaptionEditing ? (
        <input
          autoFocus
          defaultValue={caption}
          onBlur={(e) => {
            updateAttributes({ caption: e.currentTarget.value });
            setCaptionEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
            if (e.key === "Escape") setCaptionEditing(false);
          }}
          className="mt-2 w-full rounded border border-paper-rule bg-paper px-2 py-1 text-center text-sm"
          placeholder="캡션 (선택)"
        />
      ) : caption ? (
        <figcaption className="mt-2 text-center text-sm text-ink-500">{caption}</figcaption>
      ) : null}
    </NodeViewWrapper>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/nodes/figure-view.tsx
git commit -m "feat(editor): Figure NodeView with resize/align/caption"
```

---

### Task 5: paste / drop / 외부 URL 분기 ProseMirror plugin

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/plugins/media-paste.ts`

- [ ] **Step 1: plugin 작성 — 이미지 File 가로채기 + 외부 URL 가로채기**

```ts
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import {
  ALLOWED_IMAGE_MIME,
  MAX_IMAGE_BYTES,
  uploadImageForSlug,
} from "./upload-image";

export type MediaPasteOptions = {
  slug: string;
  onError?: (message: string) => void;
};

const IMAGE_URL_PATTERN = /^https?:\/\/\S+\.(?:png|jpe?g|webp|gif|avif|svg)(?:\?\S*)?$/i;

function insertFigure(
  editor: import("@tiptap/core").Editor,
  attrs: Record<string, unknown>,
) {
  editor
    .chain()
    .focus()
    .insertContent({
      type: "figure",
      attrs: { width: "100%", align: "center", caption: "", alt: "", uploading: false, ...attrs },
    })
    .run();
}

async function handleImageFile(
  editor: import("@tiptap/core").Editor,
  file: File,
  slug: string,
  onError?: (message: string) => void,
) {
  if (!ALLOWED_IMAGE_MIME.has(file.type)) {
    onError?.(`Unsupported image type: ${file.type}`);
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    onError?.("Image exceeds 4MB limit");
    return;
  }
  const previewUrl = URL.createObjectURL(file);
  const placeholderId = `pl-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  insertFigure(editor, {
    src: previewUrl,
    alt: file.name,
    uploading: true,
    "data-placeholder-id": placeholderId,
  });

  try {
    const { url } = await uploadImageForSlug(slug, file);
    // placeholder 자리에 swap
    const { state } = editor;
    state.doc.descendants((node, pos) => {
      if (node.type.name === "figure" && node.attrs["data-placeholder-id"] === placeholderId) {
        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes("figure", {
            src: url,
            uploading: false,
            "data-placeholder-id": null,
          })
          .run();
        return false;
      }
      return true;
    });
  } catch (error) {
    onError?.(error instanceof Error ? error.message : "Image upload failed");
    // placeholder 그대로 두고 사용자가 삭제 가능 (uploading=true 그대로 → 빨간 retry는 추후 5.6 폴리싱)
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
}

export const MediaPaste = Extension.create<MediaPasteOptions>({
  name: "mediaPaste",

  addOptions() {
    return { slug: "", onError: undefined };
  },

  addProseMirrorPlugins() {
    const { slug, onError } = this.options;
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey("mediaPaste"),
        props: {
          handlePaste(view, event) {
            const items = event.clipboardData?.items ?? [];
            for (const item of items) {
              if (item.kind === "file") {
                const file = item.getAsFile();
                if (file && file.type.startsWith("image/")) {
                  event.preventDefault();
                  void handleImageFile(editor, file, slug, onError);
                  return true;
                }
              }
            }
            const text = event.clipboardData?.getData("text/plain")?.trim() ?? "";
            if (IMAGE_URL_PATTERN.test(text)) {
              event.preventDefault();
              insertFigure(editor, { src: text, alt: "" });
              return true;
            }
            return false;
          },
          handleDrop(view, event) {
            const files = event.dataTransfer?.files ?? null;
            if (!files || files.length === 0) return false;
            const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
            if (imageFiles.length === 0) return false;
            event.preventDefault();
            for (const file of imageFiles) {
              void handleImageFile(editor, file, slug, onError);
            }
            return true;
          },
        },
      }),
    ];
  },
});
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/plugins/media-paste.ts
git commit -m "feat(editor): media paste/drop plugin (image File + URL)"
```

---

### Task 6: extensions.ts 에 Figure 와 MediaPaste 등록

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/extensions.ts`

- [ ] **Step 1: `buildCoreExtensions` 시그니처 변경 — slug 인자 받음**

기존:
```ts
export function buildCoreExtensions() { ... }
```

변경:
```ts
import { Figure } from "../nodes/figure-node";
import { MediaPaste } from "../plugins/media-paste";

export function buildCoreExtensions(options: { slug: string; onMediaError?: (msg: string) => void }) {
  return [
    // ... 기존 항목 ...
    Figure,
    MediaPaste.configure({ slug: options.slug, onError: options.onMediaError }),
  ];
}
```

기존 `TiptapImage` (`novel` 의 image) 는 *여전히 등록* — `<img>` (markdown ![]()) 를 위한 폴백이며 새 `Figure` Node 와 공존. parseHTML 이 `figure[data-figure]` 만 매칭하므로 충돌 없음.

- [ ] **Step 2: index.tsx 시그니처 갱신**

```tsx
export type RichEditorProps = {
  slug: string;
  initialContent: string;
  onChange: (markdown: string) => void;
  extraSlashItems?: SlashItem[];
  onMediaError?: (message: string) => void;
};

export function RichEditor({
  slug,
  initialContent,
  onChange,
  extraSlashItems = [],
  onMediaError,
}: RichEditorProps) {
  // ...
  const extensions = useMemo(() => {
    const core = buildCoreExtensions({ slug, onMediaError });
    const slash = Command.configure({ /* 기존 동일 */ });
    return [...core, slash];
  }, [slug, onMediaError, slashItems]);
  // 나머지 동일
}
```

- [ ] **Step 3: post-form.tsx 에서 slug prop 전달**

```tsx
<RichEditor
  slug={post.slug}
  initialContent={post.body}
  onChange={setBodyMarkdown}
  onMediaError={(msg) => alert(msg)}
/>
```

- [ ] **Step 4: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/extensions.ts apps/web/src/components/admin/RichEditor/index.tsx apps/web/app/\(admin\)/admin/_components/post-form.tsx
git commit -m "feat(editor): wire Figure node + media paste plugin"
```

---

### Task 7: 슬래시 메뉴에 Image 항목 추가

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/commands.ts`

- [ ] **Step 1: 슬래시 항목 ImageBuilder 추가 — slug 의존이라 함수형으로**

```ts
import {
  uploadImageForSlug,
  validateImageFile,
} from "./plugins/upload-image";

function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

export function buildImageSlashItems(slug: string, onError: (m: string) => void): SlashItem[] {
  return [
    {
      title: "Image",
      description: "이미지 업로드",
      command: async ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const file = await pickFile("image/*");
        if (!file) return;
        const issue = validateImageFile(file);
        if (issue) {
          onError(issue);
          return;
        }
        try {
          const { url } = await uploadImageForSlug(slug, file);
          editor
            .chain()
            .focus()
            .insertContent({
              type: "figure",
              attrs: { src: url, alt: file.name, width: "100%", align: "center", caption: "" },
            })
            .run();
        } catch (e) {
          onError(e instanceof Error ? e.message : "Image upload failed");
        }
      },
    },
  ];
}
```

- [ ] **Step 2: index.tsx 에서 합치기**

```tsx
const slashItems = useMemo<SlashItem[]>(
  () => [
    ...buildCoreSlashItems(),
    ...buildImageSlashItems(slug, onMediaError ?? (() => {})),
    ...extraSlashItems,
  ],
  [slug, onMediaError, extraSlashItems],
);
```

- [ ] **Step 3: 빌드 검증**

```bash
cd apps/web && npm run typecheck && npm run build
```

Expected: 성공.

- [ ] **Step 4: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/commands.ts apps/web/src/components/admin/RichEditor/index.tsx
git commit -m "feat(editor): add Image slash command"
```

---

### Task 8: tiptap-markdown 직렬화 확장 — Figure → MDX 자체닫기

기본적으로 tiptap-markdown 은 `parseHTML` 결과 HTML 을 그대로 출력한다. `<figure data-figure>` 는 markdown 안에서 raw HTML 로 박힘. 이는 MDX 파서가 자체닫기 컴포넌트 형태로 보지 못하므로 직렬화 단계에서 변환해야 한다.

**Files:**
- Modify: `apps/web/src/components/admin/RichEditor/index.tsx`

- [ ] **Step 1: onUpdate 에서 figure HTML → `<Figure ... />` 후처리 추가**

기존 `handleUpdate` 의 markdown 출력 직후 변환을 끼움:

```ts
function htmlFigureToMdx(markdown: string): string {
  return markdown.replace(
    /<figure[^>]*data-figure="true"[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>[\s\S]*?<\/figure>/g,
    (_match, src: string, alt: string) => {
      return `<Figure src="${src}" alt="${alt}" />`;
    },
  );
}
```

> **NOTE:** width/align/caption 도 같이 유지하려면 figure HTML 안에 `data-width`, `data-align`, `data-caption` attribute 가 직렬화돼야 한다. Tiptap `Figure` Node 의 `renderHTML` 을 다음과 같이 보강:

`apps/web/src/components/admin/RichEditor/nodes/figure-node.ts` 의 `renderHTML`:
```ts
renderHTML({ HTMLAttributes, node }) {
  const { src, alt, width, align, caption } = node.attrs as FigureAttrs;
  const attrs = mergeAttributes(HTMLAttributes, {
    "data-figure": "true",
    "data-width": width,
    "data-align": align,
    "data-caption": caption,
  });
  return ["figure", attrs, ["img", { src, alt }]];
},
```

그리고 `htmlFigureToMdx` 를 풀 attribute 매칭으로 강화:

```ts
function htmlFigureToMdx(markdown: string): string {
  const FIGURE_RE = /<figure[^>]*data-figure="true"([^>]*)>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>[\s\S]*?<\/figure>/g;
  const ATTR = (raw: string, name: string) => {
    const m = new RegExp(`data-${name}="([^"]*)"`).exec(raw);
    return m?.[1] ?? "";
  };
  return markdown.replace(FIGURE_RE, (_match, attrsRaw: string, src: string, alt: string) => {
    const width = ATTR(attrsRaw, "width") || "100%";
    const align = ATTR(attrsRaw, "align") || "center";
    const caption = ATTR(attrsRaw, "caption");
    const captionAttr = caption ? ` caption="${caption.replace(/"/g, "&quot;")}"` : "";
    const widthAttr = width === "100%" ? "" : ` width="${width}"`;
    const alignAttr = align === "center" ? "" : ` align="${align}"`;
    return `<Figure src="${src}" alt="${alt}"${widthAttr}${alignAttr}${captionAttr} />`;
  });
}
```

`handleUpdate` 갱신:
```ts
const handleUpdate = useCallback(
  ({ editor }: { editor: EditorInstance }) => {
    const md = editor.storage.markdown?.getMarkdown() as string | undefined;
    if (md !== undefined) onChange(htmlFigureToMdx(md));
  },
  [onChange],
);
```

- [ ] **Step 2: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

- [ ] **Step 3: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/nodes/figure-node.ts apps/web/src/components/admin/RichEditor/index.tsx
git commit -m "feat(editor): serialize Figure node to MDX shortcode"
```

---

### Task 9: 직렬화 회귀 테스트

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/figure-serialize.test.ts`

- [ ] **Step 1: 직렬화 함수만 export 해서 단위 테스트**

`index.tsx` 에서 `htmlFigureToMdx` 를 export 하도록 변경:
```ts
export function htmlFigureToMdx(markdown: string): string { /* ... */ }
```

테스트 파일:
```ts
import assert from "node:assert/strict";
import test from "node:test";
import { htmlFigureToMdx } from "./index.tsx";

test("Figure HTML → MDX shortcode (defaults omitted)", () => {
  const html = `<figure data-figure="true" data-width="100%" data-align="center" data-caption=""><img src="https://x/y.png" alt="hello" /></figure>`;
  const mdx = htmlFigureToMdx(html);
  assert.equal(mdx, `<Figure src="https://x/y.png" alt="hello" />`);
});

test("Figure HTML → MDX shortcode (custom width/align/caption)", () => {
  const html = `<figure data-figure="true" data-width="60%" data-align="left" data-caption="툴바"><img src="https://x/y.png" alt="alt" /></figure>`;
  const mdx = htmlFigureToMdx(html);
  assert.equal(
    mdx,
    `<Figure src="https://x/y.png" alt="alt" width="60%" align="left" caption="툴바" />`,
  );
});

test("Figure HTML → MDX shortcode escapes quotes in caption", () => {
  const html = `<figure data-figure="true" data-width="100%" data-align="center" data-caption='He said &quot;hi&quot;'><img src="https://x/y.png" alt="x" /></figure>`;
  const mdx = htmlFigureToMdx(html);
  assert.match(mdx, /caption="He said &quot;hi&quot;"/);
});
```

> **NOTE:** `index.tsx` 가 React/Tiptap import 를 가지고 있어 node --test 가 직접 import 못 한다. 회피책: `htmlFigureToMdx` 를 별도 `serialize.ts` 로 분리.

새 파일 `apps/web/src/components/admin/RichEditor/serialize.ts`:
```ts
export function htmlFigureToMdx(markdown: string): string {
  const FIGURE_RE = /<figure[^>]*data-figure="true"([^>]*)>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>[\s\S]*?<\/figure>/g;
  const ATTR = (raw: string, name: string) => {
    const m = new RegExp(`data-${name}="([^"]*)"`).exec(raw);
    return m?.[1] ?? "";
  };
  return markdown.replace(FIGURE_RE, (_match, attrsRaw: string, src: string, alt: string) => {
    const width = ATTR(attrsRaw, "width") || "100%";
    const align = ATTR(attrsRaw, "align") || "center";
    const caption = ATTR(attrsRaw, "caption");
    const captionAttr = caption ? ` caption="${caption.replace(/"/g, "&quot;")}"` : "";
    const widthAttr = width === "100%" ? "" : ` width="${width}"`;
    const alignAttr = align === "center" ? "" : ` align="${align}"`;
    return `<Figure src="${src}" alt="${alt}"${widthAttr}${alignAttr}${captionAttr} />`;
  });
}
```

`index.tsx` 는 위 파일을 import:
```ts
import { htmlFigureToMdx } from "./serialize";
```

테스트 파일은 `serialize.ts` 만 import:
```ts
import { htmlFigureToMdx } from "./serialize.ts";
```

- [ ] **Step 2: 테스트 실행**

```bash
cd apps/web && node --test src/components/admin/RichEditor/figure-serialize.test.ts
```

Expected: `# pass 3`, `# fail 0`.

- [ ] **Step 3: `package.json` test 스크립트에 추가**

```json
"test": "node --test src/lib/content/posts.test.ts src/lib/admin/session-token.test.ts src/lib/admin/mdx.test.ts src/lib/admin/github-content.test.ts src/components/admin/RichEditor/markdown-roundtrip.test.ts src/components/admin/RichEditor/figure-serialize.test.ts"
```

- [ ] **Step 4: 전체 테스트**

```bash
cd apps/web && npm test
```

Expected: 모든 테스트 통과.

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/serialize.ts apps/web/src/components/admin/RichEditor/figure-serialize.test.ts apps/web/src/components/admin/RichEditor/index.tsx apps/web/package.json
git commit -m "test(editor): figure serialization roundtrip"
```

---

### Task 10: 기존 `![]()` 마크다운 → Figure 일관성

`tiptap-markdown` 은 `![alt](src)` 를 기본 image node 로 파싱한다. `Figure` 를 도입했지만 *기존 글의 마크다운 이미지는 그대로 보존* 되도록 양립 정책을 명시한다.

- [ ] **Step 1: post.body 에 이미 `<Figure>` 가 들어있는지 grep 으로 확인**

```bash
cd apps/web && grep -r "<Figure" content/posts | cat
```

Expected: 결과 없음 (기존 글은 모두 마크다운 `![]()`).

- [ ] **Step 2: 새 글부터 `<Figure>` 로 표기, 기존 `![]()` 글은 그대로 둔다 — 정책 메모**

`docs/10_content/CONTENT_MODEL.md` 끝에 한 줄 추가:
```
- 이미지: 기본 `![alt](url)`. 정렬·크기·캡션이 필요하면 `<Figure src alt width align caption />` (Phase 5 도입).
```

- [ ] **Step 3: 커밋**

```bash
git add docs/10_content/CONTENT_MODEL.md
git commit -m "docs(content): note Figure component for image align/width"
```

---

### Task 11: 통합 수동 검증 (Dogfood)

자동 e2e 가 없으므로 수동.

- [ ] **Step 1: dev 서버 기동**

```bash
cd apps/web && npm run dev
```

- [ ] **Step 2: 체크리스트**

브라우저 `/admin/posts/<기존 슬러그>` 진입 후:

1. PNG 스크린샷 클립보드 복사 → 본문 영역에 Cmd/Ctrl+V → "업로드 중…" placeholder 생김 → 1-3초 후 GitHub raw URL 로 swap 됨.
2. 이미지 클릭 → 우하단 코너 핸들 보임 → 드래그 → width 가 5% 단위로 줄어듦.
3. 이미지 클릭 → floating bar 의 ◀ / ◼ / ▶ / ─ 클릭 → 정렬 변경됨.
4. ✏ 클릭 → 캡션 입력 → 엔터 → figcaption 으로 박힘.
5. 외부 URL `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Cat_03.jpg/640px-Cat_03.jpg` 한 줄 paste → `<Figure>` 로 박힘 (업로드 없이).
6. 슬래시 `/Image` → 파일 피커 → 선택 → `<Figure>` 박힘.
7. Save → GitHub PR 미리보기에서 MDX 가 `<Figure src="..." alt="..." />` 또는 width/align/caption 추가형으로 직렬화된지 확인.
8. 공개 페이지 `/posts/<slug>` 새로고침 → align/width/caption 모두 동일 모양으로 렌더.

각 항목 OK 시 본 task 완료.

- [ ] **Step 3: 결과 메모를 PR 본문에 첨부 (스크린샷 1-2장)**

---

## Acceptance

- [ ] `npm test` 통과 (figure-serialize 3 케이스 포함)
- [ ] 클립보드 PNG paste → 즉시 placeholder → GitHub 커밋 후 raw URL swap
- [ ] 코너 드래그로 width 5% 단위 스냅, 좌/중/우/풀폭 정렬 동작
- [ ] 외부 URL 이미지 paste → `<Figure>` 로 박힘 (업로드 0)
- [ ] 슬래시 `/Image` → 파일 선택 → `<Figure>` 박힘
- [ ] 새로고침 후에도 동일 모양 (round-trip)
- [ ] 공개 페이지에서 `<Figure>` 가 외부 src 일 때 `referrerpolicy="no-referrer"` 부착 확인

## Notes

- **placeholder 가 commit 안 된 채로 글 저장**: 본 슬라이스에서는 사용자에게 alert 만. Slice 5.6 폴리싱에서 "업로드 중인 미디어 있음" 폼 가드 추가.
- **재시도 UX**: 본 슬라이스의 실패 케이스는 그냥 placeholder 가 그대로 남음. 5.6 에서 retry 버튼 추가.
- **alt 빈 문자열**: 저장 막진 않음. 5.6 에서 경고만 추가.
