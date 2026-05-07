import type { Editor, Range } from "@tiptap/core";
import { uploadImageForSlug, validateImageFile } from "./plugins/upload-image";

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

export function buildImageSlashItems(
  slug: string,
  onError: (message: string) => void,
): SlashItem[] {
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
              attrs: {
                src: url,
                alt: file.name,
                width: "100%",
                align: "center",
                caption: "",
              },
            })
            .run();
        } catch (e) {
          onError(e instanceof Error ? e.message : "Image upload failed");
        }
      },
    },
  ];
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
