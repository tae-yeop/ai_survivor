import assert from "node:assert/strict";
import test from "node:test";
import {
  htmlEmbedsToMdx,
  htmlFigureToMdx,
  mdxEmbedsToEditorHtml,
  mdxFigureToEditorHtml,
} from "./serialize.ts";

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

test("MDX Figure shortcode becomes editor figure HTML before TipTap parsing", () => {
  const mdx = `<Figure src="https://x/y.png" alt="hello" width="70%" align="right" caption="screen" />`;
  const html = mdxFigureToEditorHtml(mdx);

  assert.equal(
    html,
    `<figure data-figure="true" data-width="70%" data-align="right" data-caption="screen"><img src="https://x/y.png" alt="hello" /></figure>`,
  );
});

test("MDX Figure shortcode defaults editor figure layout attrs", () => {
  const html = mdxFigureToEditorHtml(`<Figure src="https://x/y.png" alt="hello" />`);

  assert.match(html, /data-width="100%"/);
  assert.match(html, /data-align="center"/);
  assert.match(html, /<img src="https:\/\/x\/y.png" alt="hello" \/>/);
});

test("Audio and Document editor HTML become MDX embed components", () => {
  const html = [
    `<div data-audio-embed="true" data-src="/a.mp3" data-title="Intro"></div>`,
    `<div data-document-embed="true" data-src="/guide.pdf" data-title="Guide" data-kind="pdf"></div>`,
  ].join("\n");

  assert.equal(
    htmlEmbedsToMdx(html),
    [
      `<AudioEmbed src="/a.mp3" title="Intro" />`,
      `<DocumentEmbed src="/guide.pdf" title="Guide" kind="pdf" />`,
    ].join("\n"),
  );
});

test("MDX AudioEmbed and DocumentEmbed become editor atom HTML", () => {
  const mdx = [
    `<AudioEmbed src="/a.mp3" title="Intro" />`,
    `<DocumentEmbed src="/guide.docx" title="Guide" kind="document" />`,
  ].join("\n");

  assert.equal(
    mdxEmbedsToEditorHtml(mdx),
    [
      `<div data-audio-embed="true" data-src="/a.mp3" data-title="Intro"></div>`,
      `<div data-document-embed="true" data-src="/guide.docx" data-title="Guide" data-kind="document"></div>`,
    ].join("\n"),
  );
});
