import assert from "node:assert/strict";
import test from "node:test";
import { GitHubShaConflictError, postContentPath } from "./github-content.ts";
import { assertValidPostSlug, normalizePostSlug } from "./slug.ts";

test("post content paths are constrained to the MDX content tree", () => {
  assert.equal(postContentPath("my-post-1"), "apps/web/content/posts/my-post-1/index.mdx");
});

test("post slugs normalize titles and reject unsafe paths", () => {
  assert.equal(normalizePostSlug(" My First Post! "), "my-first-post");
  assert.equal(assertValidPostSlug("My First Post"), "my-first-post");
  assert.throws(() => assertValidPostSlug("../../secret"), /slug/i);
});

test("GitHubShaConflictError carries currentSha and baseSha", () => {
  const e = new GitHubShaConflictError("aaa", "bbb");
  assert.equal(e.currentSha, "aaa");
  assert.equal(e.baseSha, "bbb");
  assert.equal(e.name, "GitHubShaConflictError");
});
