import assert from "node:assert/strict";
import test from "node:test";
import { resolveSiteUrl } from "./site.ts";

test("explicit NEXT_PUBLIC_SITE_URL wins and trims trailing slash", () => {
  assert.equal(
    resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://example.com/",
      VERCEL_PROJECT_PRODUCTION_URL: "ignored.vercel.app",
    }),
    "https://example.com",
  );
});

test("Vercel production URL is used before the local fallback", () => {
  assert.equal(
    resolveSiteUrl({
      VERCEL_PROJECT_PRODUCTION_URL: "ai-survivor.vercel.app",
    }),
    "https://ai-survivor.vercel.app",
  );
});

test("Vercel deployment URL is used when production URL is unavailable", () => {
  assert.equal(
    resolveSiteUrl({
      VERCEL_URL: "preview-ai-survivor.vercel.app",
    }),
    "https://preview-ai-survivor.vercel.app",
  );
});

test("local development fallback does not point canonical URLs at a placeholder domain", () => {
  assert.equal(resolveSiteUrl({}), "http://localhost:3000");
});
