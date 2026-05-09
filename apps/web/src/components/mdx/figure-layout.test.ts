import assert from "node:assert/strict";
import test from "node:test";
import { FIGURE_BLEED_WIDTH_PX, getFigureStyle } from "./figure-layout.ts";

test("centered figures use a wide article image lane instead of the narrow prose column", () => {
  const style = getFigureStyle(undefined, "center");

  assert.equal(style.width, `min(calc(100vw - 3rem), ${FIGURE_BLEED_WIDTH_PX}px)`);
  assert.equal(style.marginLeft, "50%");
  assert.equal(style.transform, "translateX(-50%)");
});

test("figure width percentages scale against the wide image lane", () => {
  const style = getFigureStyle("60%", "center");

  assert.equal(
    style.width,
    `min(calc(100vw - 3rem), ${Math.round(FIGURE_BLEED_WIDTH_PX * 0.6)}px)`,
  );
});

test("floated figures stay inside the prose column while keeping percentage control", () => {
  const style = getFigureStyle("60%", "left");

  assert.equal(style.width, `min(100%, ${Math.round(FIGURE_BLEED_WIDTH_PX * 0.6)}px)`);
  assert.equal(style.marginLeft, undefined);
  assert.equal(style.transform, undefined);
});
