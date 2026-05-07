import assert from "node:assert/strict";
import test from "node:test";
import { htmlFigureToMdx } from "./serialize.ts";

test("Figure HTML → MDX shortcode (defaults omitted)", () => {
  const html = `<figure data-figure="true" data-width="100%" data-align="center" data-caption=""><img src="https://x/y.png" alt="hello" /></figure>`;
  const mdx = htmlFigureToMdx(html);
  assert.equal(mdx, `<Figure src="https://x/y.png" alt="hello" />`);
});

test("Figure HTML → MDX shortcode (custom width/align/caption)", () => {
  const html = `<figure data-figure="true" data-width="60%" data-align="left" data-caption="툴바"><img src="https://x/y.png" alt="alt" /></figure>`;
  const mdx = htmlFigureToMdx(html);
  assert.equal(
    mdx,
    `<Figure src="https://x/y.png" alt="alt" width="60%" align="left" caption="툴바" />`,
  );
});

test("Figure HTML → MDX shortcode escapes quotes in caption", () => {
  const html = `<figure data-figure="true" data-width="100%" data-align="center" data-caption='He said &quot;hi&quot;'><img src="https://x/y.png" alt="x" /></figure>`;
  const mdx = htmlFigureToMdx(html);
  assert.match(mdx, /caption="He said &quot;hi&quot;"/);
});
