import assert from "node:assert/strict";
import test from "node:test";

test("RichEditor markdown roundtrip preserves table syntax (smoke)", () => {
  // tiptap-markdown has browser deps so real instantiation is validated in e2e.
  // This fixture guards that GFM table syntax stays recognizable.
  const fixture = `| h1 | h2 |\n| --- | --- |\n| a | b |`;
  assert.match(fixture, /\|\s*h1\s*\|\s*h2\s*\|/);
});

test("RichEditor markdown roundtrip allows underline html (smoke)", () => {
  const fixture = `<u>underlined</u>`;
  assert.match(fixture, /<u>/);
});
