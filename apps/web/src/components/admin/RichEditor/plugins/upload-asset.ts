import {
  acceptedMimeTypes,
  detectUploadAsset,
  getDocumentKind,
  MAX_UPLOAD_BYTES,
  type DocumentEmbedKind,
  type UploadAssetKind,
} from "@/lib/admin/upload-asset";

export type AssetUploadResult = {
  url: string;
  path?: string;
  commitSha?: string;
  commitUrl?: string;
};

export type UploadedEditorAsset = AssetUploadResult & {
  kind: UploadAssetKind;
  documentKind?: DocumentEmbedKind;
};

export async function uploadAssetForSlug(slug: string, file: File): Promise<UploadedEditorAsset> {
  const asset = detectUploadAsset(file.type, file.name);
  if (!asset) throw new Error(`Unsupported file type: ${file.type}`);

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
  const result = (await res.json()) as AssetUploadResult;
  return {
    ...result,
    kind: asset.kind,
    documentKind: asset.kind === "document" ? getDocumentKind(file.type, file.name) : undefined,
  };
}

export function validateAssetFile(file: File, allowedKind?: UploadAssetKind): string | null {
  if (file.size > MAX_UPLOAD_BYTES) return "File exceeds 4MB limit";
  const asset = detectUploadAsset(file.type, file.name);
  if (!asset) return `Unsupported file type: ${file.type}`;
  if (allowedKind && asset.kind !== allowedKind) return `Expected ${allowedKind} file`;
  return null;
}

export function acceptForKind(kind: UploadAssetKind) {
  return acceptedMimeTypes(kind).join(",");
}
