import assert from "node:assert/strict";
import test from "node:test";
import {
  getFigureLightboxAlt,
  getFigureOpenLabel,
  isLightboxDismissKey,
} from "./figure-lightbox.ts";

test("lightbox trigger labels describe opening the image larger", () => {
  assert.equal(getFigureOpenLabel("workflow screenshot"), "workflow screenshot 크게 보기");
});

test("lightbox image alt falls back to caption and then generic copy", () => {
  assert.equal(getFigureLightboxAlt("", "설치 화면"), "설치 화면");
  assert.equal(getFigureLightboxAlt("   ", ""), "게시글 이미지");
});

test("lightbox only treats Escape as the dismiss keyboard shortcut", () => {
  assert.equal(isLightboxDismissKey("Escape"), true);
  assert.equal(isLightboxDismissKey("Enter"), false);
});
