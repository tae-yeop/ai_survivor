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
