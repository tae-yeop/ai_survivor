export const LIGHTBOX_DIALOG_LABEL = "이미지 크게 보기";
export const LIGHTBOX_EXIT_MS = 220;
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

export function getFigureLightboxState(closing: boolean): "open" | "closing" {
  return closing ? "closing" : "open";
}

export function isLightboxImageDismissClick(
  target: EventTarget | null,
  image: HTMLElement | null,
): boolean {
  return target === image;
}

export function getLightboxPortalContainer(doc: Document | undefined): HTMLElement | null {
  return doc?.body ?? null;
}
