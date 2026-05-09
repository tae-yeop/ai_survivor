import assert from "node:assert/strict";
import test from "node:test";
import { detectUploadAsset, getDocumentKind, validateUploadAsset } from "./upload-asset.ts";

test("detectUploadAsset accepts configured audio and document MIME/extension pairs", () => {
  assert.equal(detectUploadAsset("audio/mpeg", "intro.mp3")?.kind, "audio");
  assert.equal(detectUploadAsset("audio/mp4", "voice.m4a")?.kind, "audio");
  assert.equal(detectUploadAsset("application/pdf", "brief.pdf")?.kind, "document");
  assert.equal(
    detectUploadAsset(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "notes.docx",
    )?.kind,
    "document",
  );
});

test("validateUploadAsset rejects mismatched, unsupported, empty, and oversized files", () => {
  assert.match(
    validateUploadAsset({ name: "sound.exe", type: "audio/mpeg", size: 100 })?.message ?? "",
    /extension/i,
  );
  assert.match(
    validateUploadAsset({ name: "sound.mp3", type: "application/pdf", size: 100 })?.message ?? "",
    /MIME/i,
  );
  assert.match(
    validateUploadAsset({ name: "empty.pdf", type: "application/pdf", size: 0 })?.message ?? "",
    /empty/i,
  );
  assert.match(
    validateUploadAsset({ name: "big.pdf", type: "application/pdf", size: 4 * 1024 * 1024 + 1 })
      ?.message ?? "",
    /4MB/i,
  );
});

test("detectUploadAsset returns kind and sanitized filename for accepted assets", () => {
  assert.deepEqual(
    detectUploadAsset(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "My Deck (Final).PPTX",
    ),
    {
      kind: "document",
      safeName: "my-deck-final.pptx",
      extension: "pptx",
    },
  );
});

test("getDocumentKind stores PDF documents separately from other documents", () => {
  assert.equal(getDocumentKind("application/pdf", "guide.pdf"), "pdf");
  assert.equal(getDocumentKind("text/markdown", "guide.md"), "document");
});
