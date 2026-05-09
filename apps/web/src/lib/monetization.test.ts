import assert from "node:assert/strict";
import test from "node:test";
import { externalResourceRel, monetizationDisclosureLabel } from "./monetization.ts";

test("editorial external links use only browsing safety rel values", () => {
  assert.equal(externalResourceRel("editorial"), "noopener noreferrer");
});

test("affiliate and sponsored links include sponsored and nofollow rel values", () => {
  assert.equal(externalResourceRel("affiliate"), "sponsored nofollow noopener noreferrer");
  assert.equal(externalResourceRel("sponsored"), "sponsored nofollow noopener noreferrer");
});

test("monetization disclosure labels are explicit for readers", () => {
  assert.equal(monetizationDisclosureLabel("editorial"), "편집상 참고 링크");
  assert.equal(monetizationDisclosureLabel("affiliate"), "제휴 링크");
  assert.equal(monetizationDisclosureLabel("sponsored"), "스폰서 링크");
});
