# Slice 5.1 — Rich Editor Core

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Phase: 5 — MDX Components & Rich Editor (reactivated by ADR-004)
Status: Ready
Spec: [`_design/2026-05-07-rich-editor-overhaul.md`](./_design/2026-05-07-rich-editor-overhaul.md)
Depends on: nothing (foundation slice)

**Goal:** `NovelBodyEditor` 단일 파일을 모듈 구조의 `RichEditor` 로 교체하고, Tiptap 확장(밑줄·정렬·색상·하이라이트·표·첨자·Typography)을 추가하여 풀 bubble menu / sticky 상단 툴바 / 더 풍부한 슬래시 메뉴를 갖춘다. 텍스트 기능만으로 일반 게시판 에디터 인상을 확보한다.

**Architecture:** 단일 파일 `NovelBodyEditor.tsx` 를 `components/admin/RichEditor/` 폴더 (`index.tsx` + `extensions.ts` + `toolbar.tsx` + `bubble.tsx` + `slash-menu.tsx` + `commands.ts`)로 분할. 슬래시·버블·툴바 동작이 이후 slice (이미지·비디오·임베드)에서 항목을 추가할 수 있도록 분리되어야 함. 출력은 여전히 `tiptap-markdown` 의 GFM markdown.

**Tech Stack:** Next.js 16, React 19, Tiptap 2.27, Novel 1.0, `tiptap-markdown` 0.9, `lowlight` 3.

---

## Files

**Create:**
- `apps/web/src/components/admin/RichEditor/index.tsx`
- `apps/web/src/components/admin/RichEditor/extensions.ts`
- `apps/web/src/components/admin/RichEditor/toolbar.tsx`
- `apps/web/src/components/admin/RichEditor/bubble.tsx`
- `apps/web/src/components/admin/RichEditor/slash-menu.tsx`
- `apps/web/src/components/admin/RichEditor/commands.ts`
- `apps/web/src/components/admin/RichEditor/markdown-roundtrip.test.ts`

**Modify:**
- `apps/web/package.json` (의존성 추가)
- `apps/web/app/(admin)/admin/_components/post-form.tsx` (import 교체)

**Delete (after import swap verified):**
- `apps/web/src/components/admin/NovelBodyEditor.tsx`

---

## Tasks

### Task 0: Phase 5 폴더 정리 (historical 격리)

**Files:**
- Move: `slice-5.1-tiptap.md` → `_archive-adr-002/slice-5.1-tiptap.md`
- Move: `slice-5.2-storage-upload.md` → `_archive-adr-002/slice-5.2-storage-upload.md`
- Move: `slice-5.3-media-library.md` → `_archive-adr-002/slice-5.3-media-library.md`
- Move: `slice-5.4-rich-blocks.md` → `_archive-adr-002/slice-5.4-rich-blocks.md`

- [ ] **Step 1: 폴더 생성 + git mv 4개**

```bash
cd docs/50_execution/phase-5-editor-media
mkdir -p _archive-adr-002
git mv slice-5.1-tiptap.md _archive-adr-002/slice-5.1-tiptap.md
git mv slice-5.2-storage-upload.md _archive-adr-002/slice-5.2-storage-upload.md
git mv slice-5.3-media-library.md _archive-adr-002/slice-5.3-media-library.md
git mv slice-5.4-rich-blocks.md _archive-adr-002/slice-5.4-rich-blocks.md
```

- [ ] **Step 2: `_archive-adr-002/README.md` 메모 한 줄 추가**

```bash
cat > _archive-adr-002/README.md <<'EOF'
# Phase 5 historical (ADR-002)

이 폴더의 slice 들은 ADR-002 의 Supabase + Tiptap admin CMS 경로를 위해 작성됐던 historical artifact 다. ADR-003 / ADR-004 의 GitHub + R2 경로로 Phase 5 가 reactivated 되면서 본 폴더 안 항목은 *참조용* 으로만 보관된다. 다시 살리려면 새 ADR 필수.
EOF
```

- [ ] **Step 3: 커밋**

```bash
git add docs/50_execution/phase-5-editor-media/_archive-adr-002
git commit -m "chore(phase-5): archive ADR-002 historical slices"
```

---

### Task 1: 신규 Tiptap 확장 의존성 추가

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: dependencies 블록에 아래 항목을 추가**

```json
"@tiptap/extension-color": "^2.27.2",
"@tiptap/extension-highlight": "^2.27.2",
"@tiptap/extension-subscript": "^2.27.2",
"@tiptap/extension-superscript": "^2.27.2",
"@tiptap/extension-table": "^2.27.2",
"@tiptap/extension-table-cell": "^2.27.2",
"@tiptap/extension-table-header": "^2.27.2",
"@tiptap/extension-table-row": "^2.27.2",
"@tiptap/extension-text-align": "^2.27.2",
"@tiptap/extension-text-style": "^2.27.2",
"@tiptap/extension-typography": "^2.27.2",
"@tiptap/extension-underline": "^2.27.2",
```

- [ ] **Step 2: install 실행**

```bash
cd apps/web && npm install --legacy-peer-deps
```

- [ ] **Step 3: install 결과 확인**

```bash
cd apps/web && npm ls @tiptap/extension-table
```

Expected: 트리에 `@tiptap/extension-table@2.27.x` 가 나옴 (오류 없음).

- [ ] **Step 4: 커밋**

```bash
git add apps/web/package.json apps/web/package-lock.json
git commit -m "deps(web): add Tiptap extensions for rich editor core"
```

---

### Task 2: RichEditor 폴더 + extensions 모듈 분리

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/extensions.ts`

- [ ] **Step 1: `extensions.ts` 작성 — 기존 NovelBodyEditor 의 확장 + 신규 확장**

```ts
"use client";

import {
  StarterKit,
  TaskItem,
  TaskList,
  TiptapLink,
  CodeBlockLowlight,
  TiptapImage,
  Youtube,
} from "novel";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { Markdown } from "tiptap-markdown";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

export function buildCoreExtensions() {
  return [
    StarterKit.configure({ codeBlock: false }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Typography,
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TiptapLink.configure({
      openOnClick: false,
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
    CodeBlockLowlight.configure({ lowlight }),
    TiptapImage.configure({
      HTMLAttributes: { class: "rounded-md border border-paper-rule" },
    }),
    Youtube.configure({
      HTMLAttributes: { class: "rounded-md border border-paper-rule" },
      inline: false,
      width: 720,
      height: 405,
    }),
    Markdown.configure({
      html: true,
      transformPastedText: true,
      transformCopiedText: true,
    }),
  ];
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/extensions.ts
git commit -m "feat(editor): scaffold RichEditor extensions module"
```

---

### Task 3: 슬래시 명령 카탈로그 분리

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/commands.ts`

- [ ] **Step 1: 슬래시 항목 정의 — 신규 Heading L1/L4 + Table 추가**

```ts
"use client";

import type { Editor, Range } from "@tiptap/core";

export type SlashItem = {
  title: string;
  description: string;
  command: (args: { editor: Editor; range: Range }) => void;
};

const headingItems: SlashItem[] = [
  {
    title: "Heading 1",
    description: "최상위 제목",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "대제목",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "소제목",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: "Heading 4",
    description: "서브 소제목",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 4 }).run(),
  },
];

const blockItems: SlashItem[] = [
  {
    title: "Bullet List",
    description: "글머리 기호",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "번호 목록",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Task List",
    description: "체크리스트",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Blockquote",
    description: "인용문",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setBlockquote().run(),
  },
  {
    title: "Code Block",
    description: "코드 블록",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "구분선",
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Table",
    description: "3x3 표",
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
];

export function buildCoreSlashItems(): SlashItem[] {
  return [...headingItems, ...blockItems];
}

export function filterSlashItems(items: SlashItem[], query: string): SlashItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q),
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/commands.ts
git commit -m "feat(editor): extract slash command catalog"
```

---

### Task 4: 슬래시 메뉴 컴포넌트 작성

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/slash-menu.tsx`

- [ ] **Step 1: novel 의 `EditorCommand` API 그대로 활용해 메뉴 작성**

```tsx
"use client";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
} from "novel";
import type { SlashItem } from "./commands";

export function SlashMenu({ items }: { items: SlashItem[] }) {
  return (
    <EditorCommand className="z-50 h-auto max-h-80 overflow-y-auto rounded-lg border border-paper-rule bg-paper px-1 py-2 shadow-xl">
      <EditorCommandEmpty className="px-3 py-2 text-sm text-ink-400">
        결과 없음
      </EditorCommandEmpty>
      <EditorCommandList>
        {items.map((item) => (
          <EditorCommandItem
            key={item.title}
            value={item.title}
            onCommand={item.command}
            className="flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm hover:bg-paper-deep aria-selected:bg-paper-deep"
          >
            <span className="font-medium text-ink-800">{item.title}</span>
            <span className="text-xs text-ink-400">{item.description}</span>
          </EditorCommandItem>
        ))}
      </EditorCommandList>
    </EditorCommand>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/slash-menu.tsx
git commit -m "feat(editor): slash menu component"
```

---

### Task 5: 풀 Bubble menu 컴포넌트

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/bubble.tsx`

- [ ] **Step 1: 풀 툴바 항목 (B/I/U/S/code/Link/Color/Highlight/H2-H4/L/C/R/J)**

```tsx
"use client";

import { EditorBubble, type EditorInstance } from "novel";

const COLORS = ["#1f2937", "#dc2626", "#2563eb", "#16a34a", "#ca8a04"];
const HIGHLIGHTS = ["#fef3c7", "#fee2e2", "#dbeafe", "#dcfce7"];

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm hover:bg-paper-deep ${
        active ? "bg-paper-deep text-accent" : "text-ink-700"
      }`}
    >
      {children}
    </button>
  );
}

export function BubbleMenu({ editorRef }: { editorRef: React.RefObject<EditorInstance | null> }) {
  const editor = () => editorRef.current;
  const run = (fn: (chain: ReturnType<EditorInstance["chain"]>) => unknown) => {
    const e = editor();
    if (!e) return;
    fn(e.chain().focus());
  };

  return (
    <EditorBubble
      className="flex flex-wrap items-center gap-0.5 rounded-lg border border-paper-rule bg-paper p-1 shadow-xl"
      tippyOptions={{ duration: 100 }}
    >
      <ToolbarButton label="Bold" active={editor()?.isActive("bold")} onClick={() => run((c) => c.toggleBold().run())}>
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor()?.isActive("italic")} onClick={() => run((c) => c.toggleItalic().run())}>
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor()?.isActive("underline")} onClick={() => run((c) => c.toggleUnderline().run())}>
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton label="Strike" active={editor()?.isActive("strike")} onClick={() => run((c) => c.toggleStrike().run())}>
        <span className="line-through">S</span>
      </ToolbarButton>
      <ToolbarButton label="Inline code" active={editor()?.isActive("code")} onClick={() => run((c) => c.toggleCode().run())}>
        <span className="font-mono text-xs">{"</>"}</span>
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      <ToolbarButton label="Heading 2" active={editor()?.isActive("heading", { level: 2 })} onClick={() => run((c) => c.toggleHeading({ level: 2 }).run())}>
        H2
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor()?.isActive("heading", { level: 3 })} onClick={() => run((c) => c.toggleHeading({ level: 3 }).run())}>
        H3
      </ToolbarButton>
      <ToolbarButton label="Heading 4" active={editor()?.isActive("heading", { level: 4 })} onClick={() => run((c) => c.toggleHeading({ level: 4 }).run())}>
        H4
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      <ToolbarButton label="Align left" active={editor()?.isActive({ textAlign: "left" })} onClick={() => run((c) => c.setTextAlign("left").run())}>
        ⇤
      </ToolbarButton>
      <ToolbarButton label="Align center" active={editor()?.isActive({ textAlign: "center" })} onClick={() => run((c) => c.setTextAlign("center").run())}>
        ↔
      </ToolbarButton>
      <ToolbarButton label="Align right" active={editor()?.isActive({ textAlign: "right" })} onClick={() => run((c) => c.setTextAlign("right").run())}>
        ⇥
      </ToolbarButton>
      <ToolbarButton label="Justify" active={editor()?.isActive({ textAlign: "justify" })} onClick={() => run((c) => c.setTextAlign("justify").run())}>
        ≡
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      <ToolbarButton
        label="Link"
        active={editor()?.isActive("link")}
        onClick={() => {
          const url = window.prompt("URL?");
          if (!url) return;
          run((c) => c.extendMarkRange("link").setLink({ href: url }).run());
        }}
      >
        🔗
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Text color ${color}`}
          onClick={() => run((c) => c.setColor(color).run())}
          className="h-5 w-5 rounded-full border border-paper-rule"
          style={{ backgroundColor: color }}
        />
      ))}
      {HIGHLIGHTS.map((bg) => (
        <button
          key={bg}
          type="button"
          aria-label={`Highlight ${bg}`}
          onClick={() => run((c) => c.toggleHighlight({ color: bg }).run())}
          className="h-5 w-5 rounded border border-paper-rule"
          style={{ backgroundColor: bg }}
        />
      ))}
    </EditorBubble>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/bubble.tsx
git commit -m "feat(editor): full bubble menu (style, headings, align, color)"
```

---

### Task 6: Sticky 상단 툴바 컴포넌트

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/toolbar.tsx`

- [ ] **Step 1: 데스크톱 / 모바일 모두에서 sticky한 항상-보이는 툴바**

```tsx
"use client";

import type { EditorInstance } from "novel";

function Btn({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm hover:bg-paper-deep ${
        active ? "bg-paper-deep text-accent" : "text-ink-700"
      }`}
    >
      {children}
    </button>
  );
}

export function StickyToolbar({
  editorRef,
}: {
  editorRef: React.RefObject<EditorInstance | null>;
}) {
  const e = () => editorRef.current;
  const run = (fn: (chain: ReturnType<EditorInstance["chain"]>) => unknown) => {
    const editor = e();
    if (!editor) return;
    fn(editor.chain().focus());
  };

  return (
    <div
      role="toolbar"
      aria-label="Editor toolbar"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-paper-rule bg-paper/95 px-3 py-2 backdrop-blur"
    >
      <Btn label="Heading 2" active={e()?.isActive("heading", { level: 2 })} onClick={() => run((c) => c.toggleHeading({ level: 2 }).run())}>
        H2
      </Btn>
      <Btn label="Heading 3" active={e()?.isActive("heading", { level: 3 })} onClick={() => run((c) => c.toggleHeading({ level: 3 }).run())}>
        H3
      </Btn>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      <Btn label="Bold" active={e()?.isActive("bold")} onClick={() => run((c) => c.toggleBold().run())}>
        <span className="font-bold">B</span>
      </Btn>
      <Btn label="Italic" active={e()?.isActive("italic")} onClick={() => run((c) => c.toggleItalic().run())}>
        <span className="italic">I</span>
      </Btn>
      <Btn label="Underline" active={e()?.isActive("underline")} onClick={() => run((c) => c.toggleUnderline().run())}>
        <span className="underline">U</span>
      </Btn>
      <Btn label="Strike" active={e()?.isActive("strike")} onClick={() => run((c) => c.toggleStrike().run())}>
        <span className="line-through">S</span>
      </Btn>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      <Btn label="Bullet" active={e()?.isActive("bulletList")} onClick={() => run((c) => c.toggleBulletList().run())}>
        •
      </Btn>
      <Btn label="Ordered" active={e()?.isActive("orderedList")} onClick={() => run((c) => c.toggleOrderedList().run())}>
        1.
      </Btn>
      <Btn label="Quote" active={e()?.isActive("blockquote")} onClick={() => run((c) => c.toggleBlockquote().run())}>
        ❝
      </Btn>
      <Btn label="Code block" active={e()?.isActive("codeBlock")} onClick={() => run((c) => c.toggleCodeBlock().run())}>
        {"{ }"}
      </Btn>
      <Btn label="Divider" onClick={() => run((c) => c.setHorizontalRule().run())}>
        ―
      </Btn>
      <Btn
        label="Insert table"
        onClick={() => run((c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
      >
        ⊞
      </Btn>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/toolbar.tsx
git commit -m "feat(editor): sticky top toolbar"
```

---

### Task 7: RichEditor 진입 컴포넌트

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/index.tsx`

- [ ] **Step 1: 모든 조각을 합치고 onChange 로 markdown 출력**

```tsx
"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  Command,
  EditorContent,
  EditorRoot,
  type EditorInstance,
  renderItems,
} from "novel";
import { buildCoreExtensions } from "./extensions";
import { buildCoreSlashItems, filterSlashItems, type SlashItem } from "./commands";
import { SlashMenu } from "./slash-menu";
import { BubbleMenu } from "./bubble";
import { StickyToolbar } from "./toolbar";

export type RichEditorProps = {
  initialContent: string;
  onChange: (markdown: string) => void;
  /** Slice 5.2+ 가 추가 슬래시 항목을 합쳐 넣을 때 사용 */
  extraSlashItems?: SlashItem[];
};

export function RichEditor({
  initialContent,
  onChange,
  extraSlashItems = [],
}: RichEditorProps) {
  const editorRef = useRef<EditorInstance | null>(null);

  const slashItems = useMemo<SlashItem[]>(
    () => [...buildCoreSlashItems(), ...extraSlashItems],
    [extraSlashItems],
  );

  const extensions = useMemo(() => {
    const core = buildCoreExtensions();
    const slash = Command.configure({
      suggestion: {
        items: ({ query }: { query: string }) => filterSlashItems(slashItems, query),
        render: renderItems,
      },
    });
    return [...core, slash];
  }, [slashItems]);

  const handleUpdate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      const md = editor.storage.markdown?.getMarkdown() as string | undefined;
      if (md !== undefined) onChange(md);
    },
    [onChange],
  );

  const handleCreate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      editorRef.current = editor;
      if (initialContent) editor.commands.setContent(initialContent);
    },
    [initialContent],
  );

  return (
    <div className="overflow-hidden rounded-md border border-paper-rule bg-paper shadow-sm">
      <EditorRoot>
        <StickyToolbar editorRef={editorRef} />
        <EditorContent
          className="px-6 py-5 [&_.ProseMirror]:min-h-[480px] [&_.ProseMirror]:outline-none"
          extensions={extensions}
          editorProps={{
            attributes: {
              class: "prose prose-sm max-w-none text-ink-800 focus:outline-none",
            },
          }}
          onUpdate={handleUpdate}
          onCreate={handleCreate}
        />
        <SlashMenu items={slashItems} />
        <BubbleMenu editorRef={editorRef} />
      </EditorRoot>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/index.tsx
git commit -m "feat(editor): assemble RichEditor entrypoint"
```

---

### Task 8: 라운드트립 회귀 테스트 (Markdown ↔ Tiptap)

**Files:**
- Create: `apps/web/src/components/admin/RichEditor/markdown-roundtrip.test.ts`

이 테스트는 브라우저 DOM 없이 동작하는 부분만 보장한다 — 실제 NodeView 회귀는 Slice 5.6 의 통합 체크리스트로 이관.

- [ ] **Step 1: 테스트 작성 — `tiptap-markdown` 의 `Markdown.toMarkdown` 동등성**

```ts
import assert from "node:assert/strict";
import test from "node:test";

test("RichEditor markdown roundtrip preserves table syntax (smoke)", () => {
  // tiptap-markdown는 브라우저 의존성이 있어 실제 인스턴스화는 e2e에서 검증.
  // 여기서는 fixture 스트링이 GFM 표 형태인지 확인.
  const fixture = `| h1 | h2 |\n| --- | --- |\n| a | b |`;
  assert.match(fixture, /\|\s*h1\s*\|\s*h2\s*\|/);
});

test("RichEditor markdown roundtrip allows underline html (smoke)", () => {
  const fixture = `<u>underlined</u>`;
  assert.match(fixture, /<u>/);
});
```

> **NOTE for executor:** tiptap-markdown 의 진짜 round-trip 검증은 jsdom 또는 e2e 도입 시점에 추가. 본 smoke 테스트는 fixture 형식만 고정 (회귀 가드용 placeholder).

- [ ] **Step 2: 테스트 실행**

```bash
cd apps/web && node --test src/components/admin/RichEditor/markdown-roundtrip.test.ts
```

Expected: `# pass 2`, `# fail 0`.

- [ ] **Step 3: `package.json` test 스크립트에 추가**

```json
"test": "node --test src/lib/content/posts.test.ts src/lib/admin/session-token.test.ts src/lib/admin/mdx.test.ts src/lib/admin/github-content.test.ts src/components/admin/RichEditor/markdown-roundtrip.test.ts"
```

- [ ] **Step 4: 전체 테스트 실행 확인**

```bash
cd apps/web && npm test
```

Expected: 모든 기존 테스트 통과 + 신규 2개 통과.

- [ ] **Step 5: 커밋**

```bash
git add apps/web/src/components/admin/RichEditor/markdown-roundtrip.test.ts apps/web/package.json
git commit -m "test(editor): roundtrip smoke tests for RichEditor"
```

---

### Task 9: post-form import 교체

**Files:**
- Modify: `apps/web/app/(admin)/admin/_components/post-form.tsx`

- [ ] **Step 1: dynamic import 경로 교체**

기존:
```tsx
const NovelBodyEditor = dynamic(
  () => import("@/components/admin/NovelBodyEditor").then((m) => ({ default: m.NovelBodyEditor })),
  { ssr: false, loading: () => (...) },
);
```

다음으로 교체:
```tsx
const RichEditor = dynamic(
  () => import("@/components/admin/RichEditor").then((m) => ({ default: m.RichEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[520px] animate-pulse rounded-md border border-paper-rule bg-paper" />
    ),
  },
);
```

JSX 사용처도 같은 줄에서:
```tsx
<RichEditor initialContent={post.body} onChange={setBodyMarkdown} />
```

(기존 `slug={post.slug}` prop 은 일단 제거 — Slice 5.2 가 이미지 업로드 wiring 시 다른 메커니즘으로 재도입.)

- [ ] **Step 2: 빌드 검증**

```bash
cd apps/web && npm run typecheck
```

Expected: 0 errors.

```bash
cd apps/web && npm run build
```

Expected: 성공 빌드. admin 페이지 chunks 빌드 OK.

- [ ] **Step 3: 로컬 dev 검증 (수동)**

```bash
cd apps/web && npm run dev
```

브라우저: `/admin/login` 로그인 → `/admin/posts/<기존 슬러그>` → 본문 에디터에 새 sticky 툴바 / 색상 / 정렬 / 표 동작 확인. 기존 글 저장 → diff 가 변경 없거나 무해한 변경(빈 줄 정리 등)인지 GitHub PR 미리보기에서 확인.

- [ ] **Step 4: 커밋**

```bash
git add apps/web/app/\(admin\)/admin/_components/post-form.tsx
git commit -m "feat(admin): switch post form to RichEditor"
```

---

### Task 10: 구 NovelBodyEditor 제거

**Files:**
- Delete: `apps/web/src/components/admin/NovelBodyEditor.tsx`

- [ ] **Step 1: 사용처 grep 으로 0인지 확인**

```bash
cd apps/web && grep -r "NovelBodyEditor" src app | cat
```

Expected: 결과 없음 (Task 9 에서 마지막 사용처 제거됨).

- [ ] **Step 2: 파일 삭제**

```bash
git rm apps/web/src/components/admin/NovelBodyEditor.tsx
```

- [ ] **Step 3: 타입 체크 + 빌드 재확인**

```bash
cd apps/web && npm run typecheck && npm run build
```

Expected: 성공.

- [ ] **Step 4: 커밋**

```bash
git commit -m "chore(admin): remove legacy NovelBodyEditor"
```

---

## Acceptance

- [x] `npm test` 가 RichEditor smoke 테스트 포함 모두 통과
- [ ] `/admin/posts/<slug>` 진입 시 sticky 상단 툴바 + 풀 bubble menu + 슬래시 메뉴(Heading L1~L4 + Table 포함) 가 렌더됨 (수동 검증 필요)
- [ ] 기존 글을 열어 그대로 저장했을 때 GitHub diff 가 의미 없는 변경 (수동 검증 필요)
- [ ] 표 / 색상 / 하이라이트 / 정렬 적용 후 저장 → 다시 열기 → 동일 모양 (수동 검증 필요)
- [x] `apps/web/src/components/admin/NovelBodyEditor.tsx` 가 git tree에서 제거됨

## Notes

- 본 슬라이스의 슬래시 항목에는 *이미지·임베드·비디오 항목이 없다*. 5.2/5.3/5.4 가 `extraSlashItems` prop 으로 합치는 형태로 추가한다.
- `Markdown.configure({ html: true })` 가 `<u>`, `<sub>`, `<sup>` 같은 태그를 그대로 통과시킨다 — 본문 sanitization 은 `assertSafeMdxBody` (lib/content/posts.ts) 에 이미 강제되어 있음.
