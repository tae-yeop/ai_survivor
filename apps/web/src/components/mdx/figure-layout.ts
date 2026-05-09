import type { CSSProperties } from "react";

export const FIGURE_BLEED_WIDTH_PX = 1040;
const FIGURE_VIEWPORT_GUTTER = "3rem";
const PCT = /^(\d{1,3})%$/;
export type FigureAlign = "left" | "center" | "right" | "full";

export function normalizeFigureAlign(value: FigureAlign | undefined): FigureAlign {
  if (value === "left" || value === "right" || value === "full") return value;
  return "center";
}

export function parseFigureWidthPercent(width: string | undefined): number {
  if (!width) return 100;
  const match = PCT.exec(width);
  if (!match) return 100;
  const n = Number(match[1]);
  if (!Number.isFinite(n) || n <= 0 || n > 100) return 100;
  return n;
}

function targetWidthPx(width: string | undefined, align: FigureAlign | undefined) {
  const safeAlign = normalizeFigureAlign(align);
  const pct = safeAlign === "full" ? 100 : parseFigureWidthPercent(width);
  return Math.round(FIGURE_BLEED_WIDTH_PX * (pct / 100));
}

export function getFigureStyle(
  width: string | undefined,
  align: FigureAlign | undefined,
): CSSProperties {
  const safeAlign = normalizeFigureAlign(align);
  const targetPx = targetWidthPx(width, safeAlign);

  if (safeAlign === "left" || safeAlign === "right") {
    return { width: `min(100%, ${targetPx}px)` };
  }

  return {
    width: `min(calc(100vw - ${FIGURE_VIEWPORT_GUTTER}), ${targetPx}px)`,
    maxWidth: `calc(100vw - ${FIGURE_VIEWPORT_GUTTER})`,
    marginLeft: "50%",
    transform: "translateX(-50%)",
  };
}
