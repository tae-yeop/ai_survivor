import {
  StarterKit,
  TaskItem,
  TaskList,
  TiptapLink,
  CodeBlockLowlight,
  TiptapImage,
  Youtube,
} from "novel";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { Markdown } from "tiptap-markdown";
import { common, createLowlight } from "lowlight";
import { Figure } from "./nodes/figure-node";
import { AudioEmbed, DocumentEmbed } from "./nodes/embed-node";
import { MediaPaste } from "./plugins/media-paste";

const lowlight = createLowlight(common);

export type CoreExtensionsOptions = {
  slug: string;
  onMediaError?: (message: string) => void;
};

export function buildCoreExtensions(options: CoreExtensionsOptions) {
  return [
    StarterKit.configure({ codeBlock: false }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Typography,
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    TiptapLink.configure({
      openOnClick: false,
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
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
    Figure,
    AudioEmbed,
    DocumentEmbed,
    MediaPaste.configure({
      slug: options.slug,
      onError: options.onMediaError,
    }),
  ];
}
