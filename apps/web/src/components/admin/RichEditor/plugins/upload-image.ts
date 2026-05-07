export type ImageUploadResult = { url: string };

export async function uploadImageForSlug(
  slug: string,
  file: File,
): Promise<ImageUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`/api/admin/upload/${encodeURIComponent(slug)}`, {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });
  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return (await res.json()) as ImageUploadResult;
}

export const ALLOWED_IMAGE_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME.has(file.type))
    return `Unsupported image type: ${file.type}`;
  if (file.size > MAX_IMAGE_BYTES) return "Image exceeds 4MB limit";
  return null;
}
