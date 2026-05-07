import type { CSSProperties } from "react";

export type FigureProps = {
  src: string;
  alt: string;
  width?: string;
  align?: "left" | "center" | "right" | "full";
  caption?: string;
};

const PCT = /^(\d{1,3})%$/;

function isPercent(value: string | undefined): value is string {
  if (!value) return false;
  const match = PCT.exec(value);
  if (!match) return false;
  const n = Number(match[1]);
  return Number.isFinite(n) && n > 0 && n <= 100;
}

function normalizeAlign(
  value: FigureProps["align"],
): NonNullable<FigureProps["align"]> {
  if (value === "left" || value === "right" || value === "full") return value;
  return "center";
}

export function Figure({ src, alt, width, align, caption }: FigureProps) {
  if (!src) return null;
  const safeAlt = alt ?? "";
  const safeAlign = normalizeAlign(align);
  const safeWidth = isPercent(width) ? width : "100%";

  const figureClass =
    safeAlign === "left"
      ? "my-6 float-left mr-6 mb-3 max-w-full"
      : safeAlign === "right"
        ? "my-6 float-right ml-6 mb-3 max-w-full"
        : safeAlign === "full"
          ? "my-8 w-full"
          : "my-8 mx-auto max-w-full";

  const wrapperStyle: CSSProperties =
    safeAlign === "full" ? {} : { width: safeWidth };

  const isExternal =
    !src.startsWith("/") && !src.includes("raw.githubusercontent.com");

  return (
    <figure className={figureClass} style={wrapperStyle}>
      <img
        src={src}
        alt={safeAlt}
        loading="lazy"
        referrerPolicy={isExternal ? "no-referrer" : undefined}
        className="block w-full rounded-md border border-paper-rule"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-ink-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
