export const LIGHTBOX_DIALOG_LABEL = "이미지 크게 보기";
const FALLBACK_IMAGE_ALT = "게시글 이미지";

function cleanText(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getFigureLightboxAlt(alt: string | undefined, caption?: string): string {
  return cleanText(alt) || cleanText(caption) || FALLBACK_IMAGE_ALT;
}

export function getFigureOpenLabel(alt: string | undefined, caption?: string): string {
  return `${getFigureLightboxAlt(alt, caption)} 크게 보기`;
}

export function isLightboxDismissKey(key: string): boolean {
  return key === "Escape";
}
