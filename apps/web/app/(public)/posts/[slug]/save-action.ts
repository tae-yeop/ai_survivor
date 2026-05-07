"use server";

import { revalidatePath } from "next/cache";
import {
  GitHubShaConflictError,
  getGitHubContentFile,
  postContentPath,
  savePostSourceWithBaseShaGuard,
} from "@/lib/admin/github-content";
import { getAdminContentConfigStatus, missingEnvMessage } from "@/lib/admin/env";
import {
  adminPostDraftFromFormData,
  parseAdminPostSource,
  serializeAdminPostDraft,
  type AdminPostDraft,
} from "@/lib/admin/mdx";
import { getAdminSession } from "@/lib/admin/session";
import { assertValidPostSlug } from "@/lib/admin/slug";

export type LoadResult =
  | { ok: true; draft: AdminPostDraft; sha: string }
  | { ok: false; error: string };

export async function loadInPlace(slug: string): Promise<LoadResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const safeSlug = assertValidPostSlug(slug);
  const status = getAdminContentConfigStatus();
  if (!status.configured) {
    return { ok: false, error: `Missing GitHub config: ${missingEnvMessage(status.missing)}` };
  }
  const file = await getGitHubContentFile(status.config, postContentPath(safeSlug));
  if (!file) return { ok: false, error: "Post not found in GitHub" };
  const draft = parseAdminPostSource(file.source, safeSlug);
  return { ok: true, draft, sha: file.sha };
}

export type SaveResult =
  | { ok: true; commitSha: string | null; commitUrl: string | null }
  | { ok: false; error: string; conflict?: boolean };

export async function savePostInPlaceAction(formData: FormData): Promise<SaveResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const status = getAdminContentConfigStatus();
  if (!status.configured) {
    return { ok: false, error: `Missing GitHub config: ${missingEnvMessage(status.missing)}` };
  }
  const baseSha = (formData.get("_baseSha") as string) || "";

  let post: AdminPostDraft;
  try {
    post = adminPostDraftFromFormData(formData);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid form" };
  }

  const source = serializeAdminPostDraft(post);
  try {
    const result = await savePostSourceWithBaseShaGuard(
      status.config,
      post.slug,
      source,
      `content: in-place edit ${post.slug} via /posts (${session.login})`,
      baseSha,
    );
    revalidatePath(`/posts/${post.slug}`);
    revalidatePath("/posts");
    revalidatePath(`/categories/${post.category}`);
    for (const tag of post.tags) revalidatePath(`/tags/${tag}`);
    return { ok: true, commitSha: result.commitSha, commitUrl: result.commitUrl };
  } catch (error) {
    if (error instanceof GitHubShaConflictError) {
      return {
        ok: false,
        error: "다른 곳에서 먼저 수정되었습니다. 페이지를 새로고침한 뒤 다시 시도하세요.",
        conflict: true,
      };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Save failed" };
  }
}
