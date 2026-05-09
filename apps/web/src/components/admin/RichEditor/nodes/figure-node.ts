import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import {
  clampFigureWidth,
  parseFigureAlign,
  parseFigureAlt,
  parseFigureCaption,
  parseFigureSrc,
  parseFigureWidth,
} from "./figure-attrs";
import { FigureNodeView } from "./figure-view";

export type FigureAttrs = {
  src: string;
  alt: string;
  width: string;
  align: "left" | "center" | "right" | "full";
  caption: string;
  uploading: boolean;
};

export { clampFigureWidth };

export const Figure = Node.create({
  name: "figure",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "", parseHTML: parseFigureSrc },
      alt: { default: "", parseHTML: parseFigureAlt },
      width: {
        default: "100%",
        parseHTML: parseFigureWidth,
      },
      align: {
        default: "center",
        parseHTML: parseFigureAlign,
      },
      caption: { default: "", parseHTML: parseFigureCaption },
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
