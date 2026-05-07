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
