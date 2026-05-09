import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AudioEmbedNodeView, DocumentEmbedNodeView } from "./embed-view";

function readDataAttr(name: string) {
  return (element: Element) => element.getAttribute(`data-${name}`) ?? "";
}

export const AudioEmbed = Node.create({
  name: "audioEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "", parseHTML: readDataAttr("src") },
      title: { default: "", parseHTML: readDataAttr("title") },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-audio-embed]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-audio-embed": "true",
        "data-src": node.attrs.src,
        "data-title": node.attrs.title,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioEmbedNodeView);
  },
});

export const DocumentEmbed = Node.create({
  name: "documentEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "", parseHTML: readDataAttr("src") },
      title: { default: "", parseHTML: readDataAttr("title") },
      kind: {
        default: "document",
        parseHTML: (element: Element) =>
          element.getAttribute("data-kind") === "pdf" ? "pdf" : "document",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-document-embed]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-document-embed": "true",
        "data-src": node.attrs.src,
        "data-title": node.attrs.title,
        "data-kind": node.attrs.kind === "pdf" ? "pdf" : "document",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocumentEmbedNodeView);
  },
});
