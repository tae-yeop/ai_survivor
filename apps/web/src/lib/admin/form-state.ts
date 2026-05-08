import type { AdminPostDraft } from "./mdx.ts";
import { normalizePostSlug } from "./slug.ts";

type PostFormMode = "new" | "edit";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safeNewEditorPath(value: string) {
  return value === "/write" || value === "/admin/posts/new" ? value : "";
}

export function shouldOpenMetadataPanel(post: AdminPostDraft, mode: PostFormMode) {
  return mode === "new" || post.tags.length === 0 || post.tools.length === 0;
}

export function fallbackEditorPath(formData: FormData) {
  const mode: PostFormMode = formData.get("_mode") === "new" ? "new" : "edit";

  if (mode === "new") {
    return safeNewEditorPath(stringValue(formData, "_returnTo")) || "/admin/posts/new";
  }

  const slug = normalizePostSlug(
    stringValue(formData, "_originalSlug") || stringValue(formData, "slug"),
  );
  return slug ? `/admin/posts/${slug}` : "/admin/posts/new";
}
