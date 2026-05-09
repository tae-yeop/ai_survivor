import type { FigureAttrs } from "./figure-node";

const ALIGN_VALUES: ReadonlyArray<FigureAttrs["align"]> = ["left", "center", "right", "full"];

function clampWidth(value: string | null | undefined): string {
  if (!value) return "100%";
  const match = /^(\d{1,3})%$/.exec(value);
  if (!match) return "100%";
  const n = Math.min(100, Math.max(10, Math.round(Number(match[1]) / 5) * 5));
  return `${n}%`;
}

function clampAlign(value: string | null | undefined): FigureAttrs["align"] {
  if (value && (ALIGN_VALUES as readonly string[]).includes(value))
    return value as FigureAttrs["align"];
  return "center";
}

function imageAttr(element: Element, name: string) {
  return element.querySelector("img")?.getAttribute(name) ?? "";
}

export function parseFigureSrc(element: Element): string {
  return imageAttr(element, "src");
}

export function parseFigureAlt(element: Element): string {
  return imageAttr(element, "alt");
}

export function parseFigureWidth(element: Element): string {
  return clampWidth(element.getAttribute("data-width") ?? element.getAttribute("width"));
}

export function parseFigureAlign(element: Element): FigureAttrs["align"] {
  return clampAlign(element.getAttribute("data-align") ?? element.getAttribute("align"));
}

export function parseFigureCaption(element: Element): string {
  return element.getAttribute("data-caption") ?? "";
}

export function clampFigureWidth(value: string | null | undefined): string {
  return clampWidth(value);
}
