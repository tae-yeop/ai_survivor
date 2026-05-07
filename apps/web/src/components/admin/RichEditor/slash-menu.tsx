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
