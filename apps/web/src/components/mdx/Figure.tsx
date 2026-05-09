import { type FigureAlign, getFigureStyle, normalizeFigureAlign } from "./figure-layout";
import { FigureLightboxImage } from "./FigureLightboxImage";

export type FigureProps = {
  src: string;
  alt: string;
  width?: string;
  align?: FigureAlign;
  caption?: string;
};

export function Figure({ src, alt, width, align, caption }: FigureProps) {
  if (!src) return null;
  const safeAlt = alt ?? "";
  const safeAlign = normalizeFigureAlign(align);

  const figureClass =
    safeAlign === "left"
      ? "my-6 float-left mr-6 mb-3 max-w-full"
      : safeAlign === "right"
        ? "my-6 float-right ml-6 mb-3 max-w-full"
        : safeAlign === "full"
          ? "my-10 max-w-none"
          : "my-10 max-w-none";

  const isExternal = !src.startsWith("/") && !src.includes("raw.githubusercontent.com");

  return (
    <figure className={figureClass} style={getFigureStyle(width, safeAlign)}>
      <FigureLightboxImage
        src={src}
        alt={safeAlt}
        caption={caption}
        referrerPolicy={isExternal ? "no-referrer" : undefined}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-ink-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
