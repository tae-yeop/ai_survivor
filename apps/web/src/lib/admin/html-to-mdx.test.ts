import assert from "node:assert/strict";
import test from "node:test";
import { htmlToMdx } from "./html-to-mdx.ts";

test("htmlToMdx converts common blog HTML blocks to MDX markdown", () => {
  const mdx = htmlToMdx(`
    <h2>준비물</h2>
    <p><strong>Cursor</strong>와 <a href="https://example.com">참고 링크</a>를 준비합니다.</p>
    <ul>
      <li>초안 작성</li>
      <li>이미지 추가</li>
    </ul>
    <blockquote>저장하면 MDX가 됩니다.</blockquote>
  `);

  assert.equal(
    mdx,
    [
      "## 준비물",
      "",
      "**Cursor**와 [참고 링크](https://example.com)를 준비합니다.",
      "",
      "- 초안 작성",
      "- 이미지 추가",
      "",
      "> 저장하면 MDX가 됩니다.",
    ].join("\n"),
  );
});

test("htmlToMdx converts images into the existing Figure MDX component", () => {
  const mdx = htmlToMdx(`
    <figure>
      <img src="/posts/demo/assets/a.png" alt="데모 이미지">
      <figcaption>캡션 "테스트"</figcaption>
    </figure>
  `);

  assert.equal(
    mdx,
    '<Figure src="/posts/demo/assets/a.png" alt="데모 이미지" caption="캡션 &quot;테스트&quot;" />',
  );
});

test("htmlToMdx keeps unsafe script content out of generated MDX", () => {
  const mdx = htmlToMdx(`<p>안전한 문장</p><script>alert("x")</script>`);
  assert.equal(mdx, "안전한 문장");
});

test("htmlToMdx preserves editor audio and document embeds as MDX components", () => {
  const mdx = htmlToMdx(`
    <div data-audio-embed="true" data-src="/posts/demo/assets/intro.mp3" data-title="Intro"></div>
    <div data-document-embed="true" data-src="/posts/demo/assets/guide.pdf" data-title="Guide" data-kind="pdf"></div>
  `);

  assert.equal(
    mdx,
    [
      `<AudioEmbed src="/posts/demo/assets/intro.mp3" title="Intro" />`,
      "",
      `<DocumentEmbed src="/posts/demo/assets/guide.pdf" title="Guide" kind="pdf" />`,
    ].join("\n"),
  );
});
