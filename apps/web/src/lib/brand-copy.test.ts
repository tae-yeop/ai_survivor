import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTHOR_DISPLAY_NAME,
  FOOTER_SIGNATURE,
  HERO_HEADLINE_LINE_1,
  HERO_HEADLINE_LINE_2,
  HERO_LEDE,
  SITE_HERO_COPY,
} from "./brand-copy.ts";
import {
  SITE_FOOTER_SIGNATURE,
  SITE_HERO_HEADLINE,
  SITE_HERO_LEDE,
} from "./site.ts";

test("public author identity uses the survival-log persona", () => {
  assert.equal(AUTHOR_DISPLAY_NAME, "AI 생존러");
});

test("homepage hero copy frames the blog as an AI-era survival log", () => {
  assert.equal(HERO_HEADLINE_LINE_1, "AI 시대,");
  assert.equal(HERO_HEADLINE_LINE_2, "생존러의 기록장");
  assert.equal(SITE_HERO_COPY, "AI 시대 살아남기 위한 발버둥, 생존러의 기록장");
  assert.equal(HERO_LEDE, "살아남기 위한 발버둥과 삽질을 남깁니다.");
});

test("shared site copy does not repeat the obvious 직접 써본 것만 promise", () => {
  assert.equal(SITE_HERO_HEADLINE, SITE_HERO_COPY);
  assert.equal(SITE_HERO_LEDE, HERO_LEDE);
  assert.equal(SITE_FOOTER_SIGNATURE, FOOTER_SIGNATURE);

  const visibleBrandCopy = [SITE_HERO_HEADLINE, SITE_HERO_LEDE, SITE_FOOTER_SIGNATURE].join(" ");
  assert.doesNotMatch(visibleBrandCopy, /직접\s*써(?:본|보고)/);
});
