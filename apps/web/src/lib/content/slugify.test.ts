import assert from "node:assert/strict";
import test from "node:test";
import { slugifyTaxonomy } from "./slugify.ts";

test("trims surrounding whitespace", () => {
  assert.equal(slugifyTaxonomy("  비용절감  "), "비용절감");
});

test("collapses internal whitespace runs to a single hyphen", () => {
  assert.equal(slugifyTaxonomy("AI  업무   자동화"), "ai-업무-자동화");
});

test("lowercases ASCII letters; leaves Hangul untouched", () => {
  assert.equal(slugifyTaxonomy("Claude Code"), "claude-code");
  assert.equal(slugifyTaxonomy("바이브 코딩 LAB"), "바이브-코딩-lab");
});

test("drops punctuation outside the allow-list", () => {
  assert.equal(slugifyTaxonomy("c/c++"), "cc");
  assert.equal(slugifyTaxonomy("AI: 비용 절감!"), "ai-비용-절감");
});

test("collapses repeated hyphens and trims edge hyphens", () => {
  assert.equal(slugifyTaxonomy("--ai----생존기--"), "ai-생존기");
});

test("preserves digits", () => {
  assert.equal(slugifyTaxonomy("Web3 자동화"), "web3-자동화");
});

test("returns empty string for empty / pure-punctuation input", () => {
  assert.equal(slugifyTaxonomy(""), "");
  assert.equal(slugifyTaxonomy("   "), "");
  assert.equal(slugifyTaxonomy("!!!"), "");
});

test("is idempotent on already-slug values", () => {
  assert.equal(slugifyTaxonomy("claude-code"), "claude-code");
  assert.equal(slugifyTaxonomy("비용절감"), "비용절감");
});
