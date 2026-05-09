export type UploadAssetKind = "image" | "audio" | "document";
export type DocumentEmbedKind = "pdf" | "document";

export type UploadAsset = {
  kind: UploadAssetKind;
  safeName: string;
  extension: string;
};

export type UploadFileLike = {
  name: string;
  type: string;
  size: number;
};

export type UploadValidationIssue = {
  message: string;
  status: number;
};

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

const IMAGE_MIME_BY_EXT: Record<string, Set<string>> = {
  png: new Set(["image/png"]),
  jpg: new Set(["image/jpeg", "image/jpg"]),
  jpeg: new Set(["image/jpeg", "image/jpg"]),
  webp: new Set(["image/webp"]),
  gif: new Set(["image/gif"]),
  avif: new Set(["image/avif"]),
  svg: new Set(["image/svg+xml"]),
};

const AUDIO_MIME_BY_EXT: Record<string, Set<string>> = {
  mp3: new Set(["audio/mpeg"]),
  wav: new Set(["audio/wav", "audio/x-wav"]),
  m4a: new Set(["audio/mp4"]),
  ogg: new Set(["audio/ogg"]),
  webm: new Set(["audio/webm"]),
};

const DOCUMENT_MIME_BY_EXT: Record<string, Set<string>> = {
  pdf: new Set(["application/pdf"]),
  md: new Set(["text/markdown", "text/plain"]),
  markdown: new Set(["text/markdown", "text/plain"]),
  txt: new Set(["text/plain"]),
  csv: new Set(["text/csv", "application/csv", "text/plain"]),
  rtf: new Set(["application/rtf", "text/rtf"]),
  doc: new Set(["application/msword"]),
  docx: new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),
  ppt: new Set(["application/vnd.ms-powerpoint"]),
  pptx: new Set(["application/vnd.openxmlformats-officedocument.presentationml.presentation"]),
  xls: new Set(["application/vnd.ms-excel"]),
  xlsx: new Set(["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]),
};

const MIME_TABLES: Array<{
  kind: UploadAssetKind;
  byExt: Record<string, Set<string>>;
  fallbackStem: string;
}> = [
  { kind: "image", byExt: IMAGE_MIME_BY_EXT, fallbackStem: "image" },
  { kind: "audio", byExt: AUDIO_MIME_BY_EXT, fallbackStem: "audio" },
  { kind: "document", byExt: DOCUMENT_MIME_BY_EXT, fallbackStem: "document" },
];

function extensionFromName(name: string) {
  const dot = name.lastIndexOf(".");
  if (dot < 0 || dot === name.length - 1) return "";
  return name.slice(dot + 1).toLowerCase();
}

function sanitizeFilename(input: string, fallbackStem: string, extension: string) {
  const dot = input.lastIndexOf(".");
  const stem = dot >= 0 ? input.slice(0, dot) : input;
  const safeStem =
    stem
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || fallbackStem;
  return `${safeStem}.${extension}`;
}

export function detectUploadAsset(mimeType: string, filename: string): UploadAsset | null {
  const extension = extensionFromName(filename);
  if (!extension) return null;

  for (const table of MIME_TABLES) {
    const allowedMime = table.byExt[extension];
    if (!allowedMime) continue;
    if (!allowedMime.has(mimeType)) return null;
    return {
      kind: table.kind,
      safeName: sanitizeFilename(filename, table.fallbackStem, extension),
      extension,
    };
  }

  return null;
}

export function validateUploadAsset(file: UploadFileLike): UploadValidationIssue | null {
  if (file.size === 0) return { message: "File is empty", status: 400 };
  if (file.size > MAX_UPLOAD_BYTES) return { message: "File exceeds 4MB limit", status: 413 };

  const extension = extensionFromName(file.name);
  const table = MIME_TABLES.find((candidate) => candidate.byExt[extension]);
  if (!table) return { message: "Unsupported file extension", status: 400 };
  const allowedMime = table.byExt[extension];
  if (!allowedMime?.has(file.type))
    return { message: `Unsupported MIME: ${file.type}`, status: 400 };

  return null;
}

export function getDocumentKind(mimeType: string, filename: string): DocumentEmbedKind {
  return mimeType === "application/pdf" || extensionFromName(filename) === "pdf"
    ? "pdf"
    : "document";
}

export function acceptedMimeTypes(kind: UploadAssetKind) {
  const table = MIME_TABLES.find((candidate) => candidate.kind === kind);
  if (!table) return [];
  return [...new Set(Object.values(table.byExt).flatMap((mimes) => [...mimes]))];
}
