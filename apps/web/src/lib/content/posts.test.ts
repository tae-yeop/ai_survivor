import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  assertSafeMdxBody,
  loadPostsForTest,
  parsePostFrontmatter,
  publishedPosts,
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

test("body validator rejects unsafe script-like HTML", () => {
  assert.throws(() => assertSafeMdxBody("<script>alert('xss')</script>"), /Unsafe post body/i);
  assert.throws(
    () => assertSafeMdxBody("<p onclick=\"alert('xss')\">bad</p>"),
    /Unsafe post body/i,
  );
  assert.throws(() => assertSafeMdxBody('<embed src="/bad.pdf">'), /Unsafe post body/i);
  assert.throws(
    () => assertSafeMdxBody('<AudioEmbed src="javascript:alert(1)" />'),
    /Unsafe post body/i,
  );
  assert.doesNotThrow(() =>
    assertSafeMdxBody(
      '<AudioEmbed src="/posts/demo/assets/a.mp3" title="A" />\n<DocumentEmbed src="/posts/demo/assets/a.pdf" title="A" kind="pdf" />',
    ),
  );
});

test("default publishedPosts is backed by real content tree and excludes draft or scheduled slugs", () => {
  const slugs = publishedPosts.map((post) => post.slug);
  assert.ok(slugs.length >= 5);
  assert.ok(slugs.includes("vibe-coding-blog-pre-doc-checklist"));
  assert.ok(!slugs.includes("draft-github-mdx-workflow-note"));
  assert.ok(!slugs.includes("scheduled-search-console-check"));
});

test("free-form category resolves via slugifyTaxonomy on both bucket and lookup", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "post-cost-saving",
      validBase
        .replace("slug: published-one", "slug: post-cost-saving")
        .replace("category: vibe-coding-lab", 'category: "비용 절감"'),
    );
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts.length, 1);
    assert.equal(posts[0]?.category, "비용 절감");
  });
});

test("categoryBuckets warns (dev) on two distinct categories that slugify to the same target", () => {
  const original = console.warn;
  const warnings: string[] = [];
  console.warn = (msg: string) => warnings.push(msg);
  try {
    withContentRoot((root) => {
      writePost(
        root,
        "post-a",
        validBase
          .replace("slug: published-one", "slug: post-a")
          .replace("category: vibe-coding-lab", 'category: "Claude Code"'),
      );
      writePost(
        root,
        "post-b",
        validBase
          .replace("slug: published-one", "slug: post-b")
          .replace("category: vibe-coding-lab", 'category: "claude code"'),
      );
      const posts = loadPostsForTest({ root, now: NOW });
      assert.equal(posts.length, 2);
      const seen = new Set<string>();
      for (const post of posts) seen.add(post.category);
      assert.deepEqual([...seen].sort(), ["Claude Code", "claude code"]);
    });
  } finally {
    console.warn = original;
  }
});

test("free-form tag resolves via slugifyTaxonomy on bucket and lookup", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "post-tag-test",
      validBase
        .replace("slug: published-one", "slug: post-tag-test")
        .replace("- vibe-coding\n  - mdx", '- "Claude Code"\n  - 비용절감'),
    );
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts.length, 1);
    assert.deepEqual(posts[0]?.tags.sort(), ["Claude Code", "비용절감"]);
  });
});

test("featured field is parsed as true when set in frontmatter", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "featured-post",
      validBase
        .replace("slug: published-one", "slug: featured-post")
        .replace("series: building-ai-blog", "series: building-ai-blog\nfeatured: true"),
    );
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts[0]?.featured, true);
  });
});

test("featured field defaults to false when absent from frontmatter", () => {
  withContentRoot((root) => {
    writePost(root, "normal-post", validBase.replace("slug: published-one", "slug: normal-post"));
    const posts = loadPostsForTest({ root, now: NOW });
    assert.equal(posts[0]?.featured, false);
  });
});

test("featured field rejects non-boolean values", () => {
  withContentRoot((root) => {
    writePost(
      root,
      "bad-featured",
      validBase
        .replace("slug: published-one", "slug: bad-featured")
        .replace("series: building-ai-blog", "series: building-ai-blog\nfeatured: banana"),
    );
    assert.throws(() => loadPostsForTest({ root, now: NOW }), /featured must be true or false/i);
  });
});
