import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  loadPostsForTest,
  parsePostFrontmatter,
  publishedPosts,
  renderPostBodyToHtml,
} from "./posts.ts";

const NOW = new Date("2026-05-06T00:00:00.000Z");

function withContentRoot(run: (root: string) => void) {
  const root = mkdtempSync(path.join(tmpdir(), "ai-vibe-posts-"));
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function writePost(
  root: string,
  slug: string,
  frontmatter: string,
  body = "<h2>본문</h2><p>검증용 본문입니다.</p>",
) {
  const dir = path.join(root, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(dir, "index.mdx"),
    `---\n${frontmatter.trim()}\n---\n\n${body}\n`,
    "utf8",
  );
}

const validBase = `
title: 공개 글
description: 공개 글 설명입니다.
slug: published-one
publishedAt: 2026-05-03
updatedAt: 2026-05-04
status: published
category: vibe-coding-lab
tags:
  - vibe-coding
  - mdx
series: building-ai-blog
seriesOrder: 1
author: owner
difficulty: beginner
tools:
  - Cursor
  - MDX
`;

test("loadPosts returns every valid MDX post while getPublishedPosts exposes only public posts", () => {
  withContentRoot((root) => {
    writePost(root, "published-one", validBase);
    writePost(
      root,
      "draft-one",
      validBase
        .replace("slug: published-one", "slug: draft-one")
        .replace("status: published", "status: draft"),
    );
    writePost(
      root,
      "scheduled-one",
      validBase
        .replace("slug: published-one", "slug: scheduled-one")
        .replace("status: published", "status: scheduled")
        .replace("publishedAt: 2026-05-03", "publishedAt: 2026-06-01"),
    );

    assert.equal(loadPostsForTest({ root, now: NOW, includeNonPublic: true }).length, 3);
    assert.deepEqual(
      loadPostsForTest({ root, now: NOW }).map((post) => post.slug),
      ["published-one"],
    );
  });
});

test("frontmatter validation rejects missing required fields", () => {
  assert.throws(
    () => parsePostFrontmatter("title: Missing fields", "missing-fields"),
    /description.*publishedAt.*status.*category.*tags.*author.*difficulty.*tools/i,
  );
});

test("frontmatter validation rejects folder slug mismatch", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "folder-slug",
      validBase.replace("slug: published-one", "slug: different-slug"),
    );
    assert.throws(() => loadPostsForTest({ root, now: NOW }), /Slug mismatch/i);
  });
});

test("body renderer rejects unsafe script-like HTML", () => {
  assert.throws(() => renderPostBodyToHtml("<script>alert('xss')</script>"), /Unsafe post body/i);
  assert.throws(
    () => renderPostBodyToHtml("<p onclick=\"alert('xss')\">bad</p>"),
    /Unsafe post body/i,
  );
});

test("default publishedPosts is backed by real content tree and excludes draft or scheduled slugs", () => {
  const slugs = publishedPosts.map((post) => post.slug);
  assert.ok(slugs.length >= 5);
  assert.ok(slugs.includes("vibe-coding-blog-pre-doc-checklist"));
  assert.ok(!slugs.includes("draft-github-mdx-workflow-note"));
  assert.ok(!slugs.includes("scheduled-search-console-check"));
});
