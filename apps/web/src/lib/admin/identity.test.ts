import assert from "node:assert/strict";
import test from "node:test";
import { adminIdentityFromSession } from "./identity.ts";

test("admin identity uses a non-error anonymous state for public page checks", () => {
  assert.deepEqual(adminIdentityFromSession(null), { admin: false });
});

test("admin identity exposes the owner login when a session exists", () => {
  assert.deepEqual(adminIdentityFromSession({ login: "owner", id: 1, exp: Date.now() + 1000 }), {
    admin: true,
    login: "owner",
  });
});
