import assert from "node:assert/strict";
import test from "node:test";
import { getMdxImageReferrerPolicy } from "./mdx-image-policy.ts";

test("MDX fallback images hide referrers for external hosts", () => {
  assert.equal(
    getMdxImageReferrerPolicy("https://example.com/image.png"),
    "no-referrer",
  );
  assert.equal(
    getMdxImageReferrerPolicy("http://example.com/image.png"),
    "no-referrer",
  );
});

test("MDX fallback images preserve internal and GitHub asset referrer policy", () => {
  assert.equal(getMdxImageReferrerPolicy("/posts/demo/assets/a.png"), undefined);
  assert.equal(
    getMdxImageReferrerPolicy(
      "https://raw.githubusercontent.com/owner/repo/main/apps/web/content/posts/demo/assets/a.png",
    ),
    undefined,
  );
  assert.equal(
    getMdxImageReferrerPolicy("/posts/demo/assets/a.png", "origin"),
    "origin",
  );
});
