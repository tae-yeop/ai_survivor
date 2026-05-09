import assert from "node:assert/strict";
import test from "node:test";
import {
  chooseEditablePostSource,
  GitHubShaConflictError,
  postContentPath,
  type GitHubContentFile,
} from "./github-content.ts";
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

test("editable post source prefers deployed content when GitHub lags the rendered page", () => {
  const remote: GitHubContentFile = {
    path: postContentPath("rendered-post"),
    sha: "remote-sha",
    source: "---\ntitle: Old\n---\n\nOld body\n",
  };

  const choice = chooseEditablePostSource(
    remote,
    "---\ntitle: New\n---\n\nNew body\n",
    "rendered-post",
  );

  assert.equal(choice?.origin, "deployed");
  assert.equal(choice?.sha, "remote-sha");
  assert.match(choice?.source ?? "", /New body/);
});

test("editable post source ignores line-ending-only differences", () => {
  const remote: GitHubContentFile = {
    path: postContentPath("same-post"),
    sha: "remote-sha",
    source: "---\r\ntitle: Same\r\n---\r\n\r\nSame body\r\n",
  };

  const choice = chooseEditablePostSource(
    remote,
    "---\ntitle: Same\n---\n\nSame body\n",
    "same-post",
  );

  assert.equal(choice?.origin, "github");
  assert.equal(choice?.sha, "remote-sha");
});
