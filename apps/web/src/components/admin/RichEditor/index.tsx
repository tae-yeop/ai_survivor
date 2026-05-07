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
import { buildCoreSlashItems, filterSlashItems, type SlashItem } from "./commands";
import { SlashMenu } from "./slash-menu";
import { BubbleMenu } from "./bubble";
import { StickyToolbar } from "./toolbar";

export type RichEditorProps = {
  initialContent: string;
  onChange: (markdown: string) => void;
  /** Slice 5.2+ adds image/video/embed slash items via this prop */
  extraSlashItems?: SlashItem[];
};

export { type SlashItem };

const EMPTY_SLASH_ITEMS: SlashItem[] = [];

export function RichEditor({
  initialContent,
  onChange,
  extraSlashItems = EMPTY_SLASH_ITEMS,
}: RichEditorProps) {
  // useState so passing editor to toolbar/bubble is reactive.
  // (useRef would not trigger re-renders when the editor mounts)
  const [editor, setEditor] = useState<EditorInstance | null>(null);

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
    ({ editor: e }: { editor: EditorInstance }) => {
      const md = e.storage.markdown?.getMarkdown() as string | undefined;
      if (md !== undefined) onChange(md);
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
