"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Command,
  EditorContent,
  EditorRoot,
  type EditorInstance,
  renderItems,
} from "novel";
import { buildCoreExtensions } from "./extensions";
import { htmlFigureToMdx } from "./serialize";
import {
  buildCoreSlashItems,
  buildImageSlashItems,
  filterSlashItems,
  type SlashItem,
} from "./commands";
import { SlashMenu } from "./slash-menu";
import { BubbleMenu } from "./bubble";
import { StickyToolbar } from "./toolbar";

export type RichEditorProps = {
  slug: string;
  initialContent: string;
  onChange: (markdown: string) => void;
  extraSlashItems?: SlashItem[];
  onMediaError?: (message: string) => void;
};

export { type SlashItem };

const EMPTY_SLASH_ITEMS: SlashItem[] = [];

export function RichEditor({
  slug,
  initialContent,
  onChange,
  extraSlashItems = EMPTY_SLASH_ITEMS,
  onMediaError,
}: RichEditorProps) {
  const [editor, setEditor] = useState<EditorInstance | null>(null);

  const slashItems = useMemo<SlashItem[]>(
    () => [
      ...buildCoreSlashItems(),
      ...buildImageSlashItems(slug, onMediaError ?? (() => {})),
      ...extraSlashItems,
    ],
    [slug, onMediaError, extraSlashItems],
  );

  const extensions = useMemo(() => {
    const core = buildCoreExtensions({ slug, onMediaError });
    const slash = Command.configure({
      suggestion: {
        items: ({ query }: { query: string }) =>
          filterSlashItems(slashItems, query),
        render: renderItems,
      },
    });
    return [...core, slash];
  }, [slug, onMediaError, slashItems]);

  const handleUpdate = useCallback(
    ({ editor: e }: { editor: EditorInstance }) => {
      const md = e.storage.markdown?.getMarkdown() as string | undefined;
      if (md !== undefined) onChange(htmlFigureToMdx(md));
    },
    [onChange],
  );

  const handleCreate = useCallback(
    ({ editor: e }: { editor: EditorInstance }) => {
      setEditor(e);
      if (initialContent) e.commands.setContent(initialContent);
    },
    [initialContent],
  );

  return (
    <div className="overflow-hidden rounded-md border border-paper-rule bg-paper shadow-sm">
      <EditorRoot>
        {/* StickyToolbar sits above EditorContent and receives editor as a prop */}
        <StickyToolbar editor={editor} />
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
        >
          {/* SlashMenu and BubbleMenu must be children of EditorContent to access Novel context */}
          <SlashMenu items={slashItems} />
          <BubbleMenu editor={editor} />
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
