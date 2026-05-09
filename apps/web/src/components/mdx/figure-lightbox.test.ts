import assert from "node:assert/strict";
import test from "node:test";
import {
  getFigureLightboxAlt,
  getFigureOpenLabel,
  getLightboxPortalContainer,
  isLightboxImageDismissClick,
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

test("lightbox treats clicking the enlarged image as a dismiss action", () => {
  const image = { nodeName: "IMG" } as HTMLElement;
  const caption = { nodeName: "FIGCAPTION" } as HTMLElement;

  assert.equal(isLightboxImageDismissClick(image, image), true);
  assert.equal(isLightboxImageDismissClick(caption, image), false);
});

test("lightbox portals to document body so transformed figures cannot constrain fixed positioning", () => {
  const body = { nodeName: "BODY" } as HTMLElement;

  assert.equal(getLightboxPortalContainer({ body } as Document), body);
  assert.equal(getLightboxPortalContainer(undefined), null);
});
