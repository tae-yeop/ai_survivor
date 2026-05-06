"use client";

import { useCallback, useRef } from "react";
import {
  Command,
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapLink,
  CodeBlockLowlight,
  TiptapImage,
  Youtube,
  renderItems,
} from "novel";
import { Markdown } from "tiptap-markdown";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

type CommandProps = {
  editor: EditorInstance;
  range: { from: number; to: number };
};

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (YOUTUBE_ID.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const v = url.searchParams.get("v");
    if (v && YOUTUBE_ID.test(v)) return v;
    const segs = url.pathname.split("/").filter(Boolean);
    const last = segs[segs.length - 1] ?? "";
    if (YOUTUBE_ID.test(last)) return last;
  } catch {}
  return null;
}

function pickImage(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

async function uploadImage(slug: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`/api/admin/upload/${encodeURIComponent(slug)}`, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? `Upload failed (${res.status})`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

function youtubeIframeToShortcode(markdown: string): string {
  return markdown.replace(
    /<iframe[^>]*src="https?:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com\/embed|youtu\.be)\/([A-Za-z0-9_-]{6,20})[^"]*"[^>]*><\/iframe>/g,
    (_match, id: string) => `<YouTube id="${id}" />`,
  );
}

function buildSlashItems(slug: string) {
  return [
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
    {
      title: "Image",
      description: "이미지 업로드",
      command: async ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        const file = await pickImage();
        if (!file) return;
        try {
          const url = await uploadImage(slug, file);
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        } catch (error) {
          alert(error instanceof Error ? error.message : "Image upload failed");
        }
      },
    },
    {
      title: "YouTube",
      description: "유튜브 링크 임베드",
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        const input = window.prompt("YouTube URL 또는 비디오 ID");
        if (!input) return;
        const id = extractYouTubeId(input);
        if (!id) {
          alert("올바른 YouTube URL이 아닙니다.");
          return;
        }
        editor
          .chain()
          .focus()
          .setYoutubeVideo({ src: `https://www.youtube.com/watch?v=${id}` })
          .run();
      },
    },
  ];
}

function buildExtensions(slug: string) {
  const slashItems = buildSlashItems(slug);
  return [
    StarterKit.configure({ codeBlock: false }),
    TiptapLink.configure({
      openOnClick: false,
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
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
    Command.configure({
      suggestion: {
        items: ({ query }: { query: string }) =>
          slashItems.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.description.includes(query),
          ),
        render: renderItems,
      },
    }),
  ];
}

export function NovelBodyEditor({
  slug,
  initialContent,
  onChange,
}: {
  slug: string;
  initialContent: string;
  onChange: (markdown: string) => void;
}) {
  const editorRef = useRef<EditorInstance | null>(null);
  const slashItems = buildSlashItems(slug);
  const extensions = buildExtensions(slug);

  const handleUpdate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      const md = editor.storage.markdown?.getMarkdown() as string | undefined;
      if (md !== undefined) onChange(youtubeIframeToShortcode(md));
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
          extensions={extensions}
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
            {slashItems.map((item) => (
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
