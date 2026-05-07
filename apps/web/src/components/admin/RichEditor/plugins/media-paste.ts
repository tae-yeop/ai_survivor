import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import {
  uploadImageForSlug,
  validateImageFile,
} from "./upload-image";

export type MediaPasteOptions = {
  slug: string;
  onError?: (message: string) => void;
};

const IMAGE_URL_PATTERN =
  /^https?:\/\/\S+\.(?:png|jpe?g|webp|gif|avif|svg)(?:\?\S*)?$/i;

function insertFigure(
  editor: import("@tiptap/core").Editor,
  attrs: Record<string, unknown>,
) {
  editor
    .chain()
    .focus()
    .insertContent({
      type: "figure",
      attrs: {
        width: "100%",
        align: "center",
        caption: "",
        alt: "",
        uploading: false,
        ...attrs,
      },
    })
    .run();
}

async function handleImageFile(
  editor: import("@tiptap/core").Editor,
  file: File,
  slug: string,
  onError?: (message: string) => void,
) {
  const issue = validateImageFile(file);
  if (issue) {
    onError?.(issue);
    return;
  }
  const previewUrl = URL.createObjectURL(file);
  const placeholderId = `pl-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  insertFigure(editor, {
    src: previewUrl,
    alt: file.name,
    uploading: true,
    placeholderID: placeholderId,
  });

  try {
    const { url } = await uploadImageForSlug(slug, file);
    const { state } = editor;
    state.doc.descendants((node, pos) => {
      if (
        node.type.name === "figure" &&
        node.attrs.placeholderID === placeholderId
      ) {
        editor
          .chain()
          .setNodeSelection(pos)
          .updateAttributes("figure", {
            src: url,
            uploading: false,
            placeholderID: null,
          })
          .run();
        return false;
      }
      return true;
    });
  } catch (error) {
    onError?.(
      error instanceof Error ? error.message : "Image upload failed",
    );
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
}

export const MediaPaste = Extension.create<MediaPasteOptions>({
  name: "mediaPaste",

  addOptions() {
    return { slug: "", onError: undefined };
  },

  addProseMirrorPlugins() {
    const { slug, onError } = this.options;
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey("mediaPaste"),
        props: {
          handlePaste(_view, event) {
            const items = event.clipboardData?.items ?? [];
            for (const item of items) {
              if (item.kind === "file") {
                const file = item.getAsFile();
                if (file && file.type.startsWith("image/")) {
                  event.preventDefault();
                  void handleImageFile(editor, file, slug, onError);
                  return true;
                }
              }
            }
            const text =
              event.clipboardData?.getData("text/plain")?.trim() ?? "";
            if (IMAGE_URL_PATTERN.test(text)) {
              event.preventDefault();
              insertFigure(editor, { src: text, alt: "" });
              return true;
            }
            return false;
          },
          handleDrop(_view, event) {
            const files = event.dataTransfer?.files ?? null;
            if (!files || files.length === 0) return false;
            const imageFiles = Array.from(files).filter((f) =>
              f.type.startsWith("image/"),
            );
            if (imageFiles.length === 0) return false;
            event.preventDefault();
            for (const file of imageFiles) {
              void handleImageFile(editor, file, slug, onError);
            }
            return true;
          },
        },
      }),
    ];
  },
});
