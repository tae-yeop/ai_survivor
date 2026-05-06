import { NextResponse } from "next/server";
import { getAdminContentConfigStatus, missingEnvMessage } from "@/lib/admin/env";
import { putGitHubBinaryFile } from "@/lib/admin/github-content";
import { getAdminSession } from "@/lib/admin/session";
import { assertValidPostSlug } from "@/lib/admin/slug";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_MIME = /^image\/(png|jpeg|jpg|webp|gif|avif|svg\+xml)$/;
const ALLOWED_EXT = /^(png|jpe?g|webp|gif|avif|svg)$/i;

function sanitizeFilename(input: string) {
  const dot = input.lastIndexOf(".");
  const stem = dot >= 0 ? input.slice(0, dot) : input;
  const ext = dot >= 0 ? input.slice(dot + 1) : "";
  if (!ALLOWED_EXT.test(ext)) return null;
  const safeStem =
    stem
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";
  return `${safeStem}.${ext.toLowerCase()}`;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
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
  if (file.size === 0) return jsonError("File is empty", 400);
  if (file.size > MAX_BYTES) return jsonError("File exceeds 4MB limit", 413);
  if (!ALLOWED_MIME.test(file.type)) return jsonError(`Unsupported MIME: ${file.type}`, 400);

  const safeName = sanitizeFilename(file.name);
  if (!safeName) return jsonError("Unsupported file extension", 400);

  const timestamp = Date.now();
  const finalName = `${timestamp}-${safeName}`;
  const path = `apps/web/content/posts/${slug}/assets/${finalName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await putGitHubBinaryFile(
      contentStatus.config,
      path,
      buffer,
      `content: upload asset ${finalName} for ${slug} (${session.login})`,
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
