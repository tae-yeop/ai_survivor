import assert from "node:assert/strict";
import test from "node:test";
import {
  parseFigureAlt,
  parseFigureAlign,
  parseFigureCaption,
  parseFigureSrc,
  parseFigureWidth,
} from "./nodes/figure-attrs.ts";

function figureElement(attrs: Record<string, string>, imgAttrs: Record<string, string> = {}) {
  return {
    getAttribute(name: string) {
      return attrs[name] ?? null;
    },
    querySelector(selector: string) {
      if (selector !== "img") return null;
      return {
        getAttribute(name: string) {
          return imgAttrs[name] ?? null;
        },
      };
    },
  } as unknown as Element;
}

test("figure node parses image details from editor figure HTML", () => {
  const element = figureElement(
    { "data-width": "70%", "data-align": "right", "data-caption": "screen" },
    { src: "https://x/y.png", alt: "hello" },
  );

  assert.equal(parseFigureSrc(element), "https://x/y.png");
  assert.equal(parseFigureAlt(element), "hello");
  assert.equal(parseFigureWidth(element), "70%");
  assert.equal(parseFigureAlign(element), "right");
  assert.equal(parseFigureCaption(element), "screen");
});

test("figure node falls back to safe defaults for missing layout attrs", () => {
  const element = figureElement({}, { src: "https://x/y.png" });

  assert.equal(parseFigureWidth(element), "100%");
  assert.equal(parseFigureAlign(element), "center");
  assert.equal(parseFigureAlt(element), "");
  assert.equal(parseFigureCaption(element), "");
});
