"use client";

import { useEffect, useReducer } from "react";
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

export function StickyToolbar({ editor }: { editor: EditorInstance | null }) {
  // Re-render on every Tiptap transaction so isActive() stays current.
  // dispatch from useReducer is stable, safe to use as an event callback.
  const [, tick] = useReducer((count: number) => count + 1, 0);
  useEffect(() => {
    if (!editor) return;
    editor.on("transaction", tick);
    return () => {
      editor.off("transaction", tick);
    };
  }, [editor, tick]);

  const run = (fn: (chain: ReturnType<EditorInstance["chain"]>) => unknown) => {
    if (!editor) return;
    fn(editor.chain().focus());
  };

  return (
    <div
      role="toolbar"
      aria-label="Editor toolbar"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-paper-rule bg-paper/95 px-3 py-2 backdrop-blur"
    >
      <Btn
        label="Heading 2"
        active={editor?.isActive("heading", { level: 2 })}
        onClick={() => run((chain) => chain.toggleHeading({ level: 2 }).run())}
      >
        H2
      </Btn>
      <Btn
        label="Heading 3"
        active={editor?.isActive("heading", { level: 3 })}
        onClick={() => run((chain) => chain.toggleHeading({ level: 3 }).run())}
      >
        H3
      </Btn>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      <Btn
        label="Bold"
        active={editor?.isActive("bold")}
        onClick={() => run((chain) => chain.toggleBold().run())}
      >
        <span className="font-bold">B</span>
      </Btn>
      <Btn
        label="Italic"
        active={editor?.isActive("italic")}
        onClick={() => run((chain) => chain.toggleItalic().run())}
      >
        <span className="italic">I</span>
      </Btn>
      <Btn
        label="Underline"
        active={editor?.isActive("underline")}
        onClick={() => run((chain) => chain.toggleUnderline().run())}
      >
        <span className="underline">U</span>
      </Btn>
      <Btn
        label="Strike"
        active={editor?.isActive("strike")}
        onClick={() => run((chain) => chain.toggleStrike().run())}
      >
        <span className="line-through">S</span>
      </Btn>
      <span className="mx-1 h-4 w-px bg-paper-rule" />
      <Btn
        label="Bullet"
        active={editor?.isActive("bulletList")}
        onClick={() => run((chain) => chain.toggleBulletList().run())}
      >
        •
      </Btn>
      <Btn
        label="Ordered"
        active={editor?.isActive("orderedList")}
        onClick={() => run((chain) => chain.toggleOrderedList().run())}
      >
        1.
      </Btn>
      <Btn
        label="Quote"
        active={editor?.isActive("blockquote")}
        onClick={() => run((chain) => chain.toggleBlockquote().run())}
      >
        “”
      </Btn>
      <Btn
        label="Code block"
        active={editor?.isActive("codeBlock")}
        onClick={() => run((chain) => chain.toggleCodeBlock().run())}
      >
        {"{ }"}
      </Btn>
      <Btn label="Divider" onClick={() => run((chain) => chain.setHorizontalRule().run())}>
        —
      </Btn>
      <Btn
        label="Insert table"
        onClick={() =>
          run((chain) => chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())
        }
      >
        표
      </Btn>
    </div>
  );
}
