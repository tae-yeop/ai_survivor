import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FigureNodeView } from "./figure-view";

export type FigureAttrs = {
  src: string;
  alt: string;
  width: string;
  align: "left" | "center" | "right" | "full";
  caption: string;
  uploading: boolean;
};

const ALIGN_VALUES: ReadonlyArray<FigureAttrs["align"]> = [
  "left",
  "center",
  "right",
  "full",
];

function clampWidth(value: string | null | undefined): string {
  if (!value) return "100%";
  const match = /^(\d{1,3})%$/.exec(value);
  if (!match) return "100%";
  const n = Math.min(
    100,
    Math.max(10, Math.round(Number(match[1]) / 5) * 5),
  );
  return `${n}%`;
}

function clampAlign(
  value: string | null | undefined,
): FigureAttrs["align"] {
  if (value && (ALIGN_VALUES as readonly string[]).includes(value))
    return value as FigureAttrs["align"];
  return "center";
}

export function clampFigureWidth(value: string | null | undefined): string {
  return clampWidth(value);
}

export const Figure = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
      width: {
        default: "100%",
        parseHTML: (el) => clampWidth(el.getAttribute("width")),
      },
      align: {
        default: "center",
        parseHTML: (el) => clampAlign(el.getAttribute("align")),
      },
      caption: { default: "" },
      uploading: { default: false, rendered: false },
      placeholderID: { default: null, rendered: false },
    };
  },

  parseHTML() {
    return [{ tag: "figure[data-figure]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { src, alt, width, align, caption } = node.attrs as FigureAttrs;
    const attrs = mergeAttributes(HTMLAttributes, {
      "data-figure": "true",
      "data-width": width,
      "data-align": align,
      "data-caption": caption,
    });
    return ["figure", attrs, ["img", { src, alt }]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureNodeView);
  },
});
