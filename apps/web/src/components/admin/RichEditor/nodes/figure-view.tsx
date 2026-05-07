"use client";

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useCallback, useRef, useState } from "react";
import { clampFigureWidth } from "./figure-node";

type Align = "left" | "center" | "right" | "full";

export function FigureNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const { src, alt, width, align, caption, uploading } = node.attrs as {
    src: string;
    alt: string;
    width: string;
    align: Align;
    caption: string;
    uploading: boolean;
  };
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isCaptionEditing, setCaptionEditing] = useState(false);

  const setWidth = useCallback(
    (next: string) => updateAttributes({ width: clampFigureWidth(next) }),
    [updateAttributes],
  );
  const setAlign = useCallback(
    (next: Align) => updateAttributes({ align: next }),
    [updateAttributes],
  );

  const onCornerDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const wrap = wrapperRef.current;
      if (!wrap) return;
      const startX = event.clientX;
      const startPx = wrap.getBoundingClientRect().width;
      const parentPx =
        wrap.parentElement?.getBoundingClientRect().width ?? startPx;
      const onMove = (e: PointerEvent) => {
        const deltaPct = ((e.clientX - startX) / parentPx) * 100;
        const startPct = (startPx / parentPx) * 100;
        setWidth(`${Math.round(startPct + deltaPct)}%`);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [setWidth],
  );

  const containerClass =
    align === "left"
      ? "float-left mr-6 mb-3"
      : align === "right"
        ? "float-right ml-6 mb-3"
        : align === "full"
          ? "w-full"
          : "mx-auto";

  return (
    <NodeViewWrapper
      as="figure"
      className={`relative my-6 ${containerClass}`}
      data-figure="true"
      style={align === "full" ? undefined : { width }}
    >
      <div
        ref={wrapperRef}
        className={`relative ${selected ? "ring-2 ring-accent" : ""}`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="block w-full rounded-md border border-paper-rule"
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-paper-rule bg-paper-deep text-sm text-ink-400">
            이미지 정보 없음
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-paper/70 text-sm text-ink-500">
            업로드 중…
          </div>
        )}
        {selected && (
          <button
            type="button"
            aria-label="Resize"
            className="absolute bottom-1 right-1 h-6 w-6 cursor-se-resize rounded-full border border-paper-rule bg-paper shadow"
            onPointerDown={onCornerDrag}
          />
        )}
        {selected && (
          <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-paper-rule bg-paper p-1 shadow">
            <button
              type="button"
              aria-label="Align left"
              aria-pressed={align === "left"}
              onClick={() => setAlign("left")}
              className="rounded px-2 py-1 text-sm hover:bg-paper-deep"
            >
              ◀
            </button>
            <button
              type="button"
              aria-label="Align center"
              aria-pressed={align === "center"}
              onClick={() => setAlign("center")}
              className="rounded px-2 py-1 text-sm hover:bg-paper-deep"
            >
              ◼
            </button>
            <button
              type="button"
              aria-label="Align right"
              aria-pressed={align === "right"}
              onClick={() => setAlign("right")}
              className="rounded px-2 py-1 text-sm hover:bg-paper-deep"
            >
              ▶
            </button>
            <button
              type="button"
              aria-label="Full width"
              aria-pressed={align === "full"}
              onClick={() => setAlign("full")}
              className="rounded px-2 py-1 text-sm hover:bg-paper-deep"
            >
              ─
            </button>
            <span className="mx-1 h-4 w-px bg-paper-rule" />
            <button
              type="button"
              aria-label="Edit caption"
              onClick={() => setCaptionEditing(true)}
              className="rounded px-2 py-1 text-sm hover:bg-paper-deep"
            >
              ✏
            </button>
            <button
              type="button"
              aria-label="Delete"
              onClick={() => deleteNode()}
              className="rounded px-2 py-1 text-sm text-red-600 hover:bg-paper-deep"
            >
              🗑
            </button>
          </div>
        )}
      </div>
      {isCaptionEditing ? (
        <input
          autoFocus
          defaultValue={caption}
          onBlur={(e) => {
            updateAttributes({ caption: e.currentTarget.value });
            setCaptionEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              (e.currentTarget as HTMLInputElement).blur();
            if (e.key === "Escape") setCaptionEditing(false);
          }}
          className="mt-2 w-full rounded border border-paper-rule bg-paper px-2 py-1 text-center text-sm"
          placeholder="캡션 (선택)"
        />
      ) : caption ? (
        <figcaption className="mt-2 text-center text-sm text-ink-500">
          {caption}
        </figcaption>
      ) : null}
    </NodeViewWrapper>
  );
}
