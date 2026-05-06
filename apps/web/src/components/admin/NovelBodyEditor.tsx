"use client";

import { useCallback, useRef } from "react";
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandList,
  EditorCommandEmpty,
  EditorBubble,
  type EditorInstance,
} from "novel";
import { Command, renderItems } from "novel/extensions";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "tiptap-markdown";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

type CommandProps = {
  editor: EditorInstance;
  range: { from: number; to: number };
};

const SLASH_ITEMS = [
  {
    title: "Heading 2",
    description: "대제목",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "소제목",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: "Bullet List",
    description: "글머리 기호",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "번호 목록",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Task List",
    description: "체크리스트",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Code Block",
    description: "코드 블록",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).setCodeBlock().run(),
  },
  {
    title: "Blockquote",
    description: "인용문",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).setBlockquote().run(),
  },
  {
    title: "Divider",
    description: "구분선",
    command: ({ editor, range }: CommandProps) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
];

const EXTENSIONS = [
  StarterKit.configure({ codeBlock: false }),
  TiptapLink.configure({
    openOnClick: false,
    HTMLAttributes: { rel: "noopener noreferrer" },
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  CodeBlockLowlight.configure({ lowlight }),
  Markdown.configure({
    html: true,
    transformPastedText: true,
    transformCopiedText: true,
  }),
  Command.configure({
    suggestion: {
      items: ({ query }: { query: string }) =>
        SLASH_ITEMS.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.includes(query),
        ),
      render: renderItems,
    },
  }),
];

export function NovelBodyEditor({
  initialContent,
  onChange,
}: {
  initialContent: string;
  onChange: (markdown: string) => void;
}) {
  const editorRef = useRef<EditorInstance | null>(null);

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
      if (initialContent) {
        editor.commands.setContent(initialContent);
      }
    },
    [initialContent],
  );

  return (
    <div className="overflow-hidden rounded-md border border-paper-rule bg-paper shadow-sm">
      <EditorRoot>
        <EditorContent
          className="px-6 py-5 [&_.ProseMirror]:min-h-[480px] [&_.ProseMirror]:outline-none"
          extensions={EXTENSIONS}
          editorProps={{
            attributes: {
              class: "prose prose-sm max-w-none text-ink-800 focus:outline-none",
            },
          }}
          onUpdate={handleUpdate}
          onCreate={handleCreate}
        />
        <EditorCommand className="z-50 h-auto max-h-80 overflow-y-auto rounded-lg border border-paper-rule bg-paper px-1 py-2 shadow-xl">
          <EditorCommandEmpty className="px-3 py-2 text-sm text-ink-400">
            결과 없음
          </EditorCommandEmpty>
          <EditorCommandList>
            {SLASH_ITEMS.map((item) => (
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
        <EditorBubble
          className="flex items-center gap-0.5 rounded-lg border border-paper-rule bg-paper p-1 shadow-xl"
          tippyOptions={{ duration: 100 }}
        >
          <button
            type="button"
            onClick={() => editorRef.current?.chain().focus().toggleBold().run()}
            className="rounded px-2 py-1 text-sm font-bold text-ink-700 hover:bg-paper-deep"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editorRef.current?.chain().focus().toggleItalic().run()}
            className="rounded px-2 py-1 text-sm italic text-ink-700 hover:bg-paper-deep"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editorRef.current?.chain().focus().toggleStrike().run()}
            className="rounded px-2 py-1 text-sm text-ink-700 line-through hover:bg-paper-deep"
          >
            S
          </button>
          <button
            type="button"
            onClick={() => editorRef.current?.chain().focus().toggleCode().run()}
            className="rounded px-2 py-1 font-mono text-xs text-ink-700 hover:bg-paper-deep"
          >
            {"</>"}
          </button>
        </EditorBubble>
      </EditorRoot>
    </div>
  );
}
