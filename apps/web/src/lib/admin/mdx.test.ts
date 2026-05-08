import assert from "node:assert/strict";
import test from "node:test";
import { parsePostFrontmatter } from "../content/posts.ts";
import { fallbackEditorPath, shouldOpenMetadataPanel } from "./form-state.ts";
import { createEmptyAdminPostDraft, parseAdminPostSource, serializeAdminPostDraft } from "./mdx.ts";

const NOW = new Date("2026-05-06T00:00:00.000Z");

test("empty admin drafts default to draft status", () => {
  const draft = createEmptyAdminPostDraft(NOW);
  assert.equal(draft.status, "draft");
  assert.equal(draft.publishedAt, "2026-05-06");
  assert.equal(draft.updatedAt, "2026-05-06");
});

test("admin MDX serialization produces deterministic frontmatter", () => {
  const source = serializeAdminPostDraft({
    ...createEmptyAdminPostDraft(NOW),
    title: "브라우저 편집 테스트",
    description: "사이트에서 작성한 초안입니다.",
    slug: "browser-editor-test",
    category: "vibe-coding-lab",
    tags: ["vibe-coding", "admin"],
    tools: ["GitHub"],
    body: "## 본문\n\n안전한 본문입니다.",
  });

  assert.match(source, /^---\ntitle: "브라우저 편집 테스트"/);
  const [, frontmatter = ""] = /^---\n([\s\S]*?)\n---/.exec(source) ?? [];
  const parsed = parsePostFrontmatter(frontmatter, "browser-editor-test");
  assert.equal(parsed.status, "draft");
  assert.deepEqual(parsed.tags, ["vibe-coding", "admin"]);
});

test("admin MDX parser preserves editable body", () => {
  const source = serializeAdminPostDraft({
    ...createEmptyAdminPostDraft(NOW),
    title: "Parse me",
    description: "Parse description",
    slug: "parse-me",
    category: "vibe-coding-lab",
    tags: ["parse"],
    tools: ["GitHub"],
    body: "<h2>HTML body</h2><p>Allowed HTML.</p>",
  });
  const parsed = parseAdminPostSource(source, "parse-me");
  assert.equal(parsed.slug, "parse-me");
  assert.match(parsed.body, /HTML body/);
});

test("new post forms open metadata when required list fields start empty", () => {
  const draft = createEmptyAdminPostDraft(NOW);
  assert.equal(shouldOpenMetadataPanel(draft, "new"), true);
});

test("edit forms keep complete metadata collapsed by default", () => {
  const draft = {
    ...createEmptyAdminPostDraft(NOW),
    tags: ["admin"],
    tools: ["GitHub"],
  };
  assert.equal(shouldOpenMetadataPanel(draft, "edit"), false);
});

test("new post save errors return to the originating form instead of a missing slug page", () => {
  const formData = new FormData();
  formData.set("_mode", "new");
  formData.set("_returnTo", "/write");
  formData.set("slug", "unsaved-post");

  assert.equal(fallbackEditorPath(formData), "/write");
});

test("edit save errors return to the original existing slug", () => {
  const formData = new FormData();
  formData.set("_mode", "edit");
  formData.set("_originalSlug", "existing-post");
  formData.set("slug", "renamed-post");

  assert.equal(fallbackEditorPath(formData), "/admin/posts/existing-post");
});
