"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminContentConfigStatus, missingEnvMessage } from "@/lib/admin/env";
import { savePostSourceToGitHub } from "@/lib/admin/github-content";
import { adminPostDraftFromFormData, serializeAdminPostDraft } from "@/lib/admin/mdx";
import { normalizePostSlug } from "@/lib/admin/slug";
import { requireAdminSession } from "@/lib/admin/session";

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Unknown admin save error";
}

function fallbackEditorPath(formData: FormData) {
  const rawSlug = formData.get("slug");
  const slug = typeof rawSlug === "string" ? normalizePostSlug(rawSlug) : "";
  return slug ? `/admin/posts/${slug}` : "/admin/posts/new";
}

export async function savePostAction(formData: FormData) {
  const session = await requireAdminSession();
  let target = "/admin";

  try {
    const contentStatus = getAdminContentConfigStatus();
    if (!contentStatus.configured) {
      throw new Error(`Missing GitHub content config: ${missingEnvMessage(contentStatus.missing)}`);
    }

    const post = adminPostDraftFromFormData(formData);
    const source = serializeAdminPostDraft(post);
    const mode = formData.get("_mode") === "new" ? "create" : "update";
    const result = await savePostSourceToGitHub(
      contentStatus.config,
      post.slug,
      source,
      `content: ${mode} ${post.slug} via admin editor (${session.login})`,
    );

    revalidatePath("/admin");
    revalidatePath(`/admin/posts/${post.slug}`);

    const query = new URLSearchParams({ saved: "1" });
    if (result.commitSha) query.set("commit", result.commitSha.slice(0, 7));
    if (result.commitUrl) query.set("commitUrl", result.commitUrl);
    target = `/admin/posts/${post.slug}?${query.toString()}`;
  } catch (error) {
    const query = new URLSearchParams({ error: errorText(error) });
    target = `${fallbackEditorPath(formData)}?${query.toString()}`;
  }

  redirect(target);
}
