import assert from "node:assert/strict";
import test from "node:test";
import { createAdminSessionToken, verifyAdminSessionToken } from "./session-token.ts";

const SECRET = "0123456789abcdef0123456789abcdef";
const NOW = Date.parse("2026-05-06T00:00:00.000Z");

test("admin session token verifies valid payloads", () => {
  const token = createAdminSessionToken({ login: "owner", id: 123, exp: NOW + 1000 }, SECRET);
  assert.deepEqual(verifyAdminSessionToken(token, SECRET, NOW), {
    login: "owner",
    id: 123,
    exp: NOW + 1000,
  });
});

test("admin session token rejects tampering and expiry", () => {
  const token = createAdminSessionToken({ login: "owner", id: 123, exp: NOW + 1000 }, SECRET);
  assert.equal(verifyAdminSessionToken(`${token}x`, SECRET, NOW), null);
  assert.equal(verifyAdminSessionToken(token, "different-secret-0123456789abcdef", NOW), null);
  assert.equal(verifyAdminSessionToken(token, SECRET, NOW + 1001), null);
});
