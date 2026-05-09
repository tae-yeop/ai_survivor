"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

function EmbedShell({
  selected,
  title,
  meta,
  src,
  onDelete,
}: {
  selected: boolean;
  title: string;
  meta: string;
  src: string;
  onDelete: () => void;
}) {
  return (
    <NodeViewWrapper
      as="div"
      className={`relative my-6 rounded-lg border bg-paper-deep p-4 ${
        selected ? "border-accent ring-2 ring-accent/30" : "border-paper-rule"
      }`}
    >
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      <p className="mt-1 break-all text-xs text-ink-400">{src}</p>
      <p className="mt-2 text-xs text-ink-500">{meta}</p>
      {selected ? (
        <button
          type="button"
          aria-label="Delete embed"
          onClick={onDelete}
          className="absolute right-2 top-2 rounded px-2 py-1 text-sm text-red-600 hover:bg-paper"
        >
          삭제
        </button>
      ) : null}
    </NodeViewWrapper>
  );
}

export function AudioEmbedNodeView({ node, selected, deleteNode }: NodeViewProps) {
  const { src, title } = node.attrs as { src: string; title: string };
  return (
    <EmbedShell
      selected={selected}
      title={title || "Audio"}
      meta="AudioEmbed"
      src={src}
      onDelete={deleteNode}
    />
  );
}

export function DocumentEmbedNodeView({ node, selected, deleteNode }: NodeViewProps) {
  const { src, title, kind } = node.attrs as { src: string; title: string; kind: string };
  return (
    <EmbedShell
      selected={selected}
      title={title || "Document"}
      meta={kind === "pdf" ? "DocumentEmbed · PDF" : "DocumentEmbed · document"}
      src={src}
      onDelete={deleteNode}
    />
  );
}
