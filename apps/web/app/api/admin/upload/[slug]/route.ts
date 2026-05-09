import { NextResponse } from "next/server";
import { getAdminContentConfigStatus, missingEnvMessage } from "@/lib/admin/env";
import { putGitHubBinaryFile } from "@/lib/admin/github-content";
import { getAdminSession } from "@/lib/admin/session";
import { assertValidPostSlug } from "@/lib/admin/slug";
import { detectUploadAsset, validateUploadAsset } from "@/lib/admin/upload-asset";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  let slug: string;
  try {
    const { slug: rawSlug } = await params;
    slug = assertValidPostSlug(rawSlug);
  } catch {
    return jsonError("Invalid post slug", 400);
  }

  const contentStatus = getAdminContentConfigStatus();
  if (!contentStatus.configured) {
    return jsonError(
      `GitHub content config missing: ${missingEnvMessage(contentStatus.missing)}`,
      500,
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Expected multipart/form-data body", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return jsonError("Missing file field", 400);

  const issue = validateUploadAsset(file);
  if (issue) return jsonError(issue.message, issue.status);

  const asset = detectUploadAsset(file.type, file.name);
  if (!asset) return jsonError("Unsupported file extension", 400);

  const timestamp = Date.now();
  const finalName = `${timestamp}-${asset.safeName}`;
  const path = `apps/web/content/posts/${slug}/assets/${finalName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await putGitHubBinaryFile(
      contentStatus.config,
      path,
      buffer,
      `content: upload ${asset.kind} asset ${finalName} for ${slug} (${session.login})`,
    );

    const { owner, repo, branch } = contentStatus.config;
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

    return NextResponse.json({
      url: rawUrl,
      path,
      commitSha: result.commitSha,
      commitUrl: result.commitUrl,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Upload failed", 502);
  }
}
