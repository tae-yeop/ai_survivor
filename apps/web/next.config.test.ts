import assert from "node:assert/strict";
import test from "node:test";
import nextConfig from "./next.config.ts";

test("Next config applies baseline security headers to all routes", async () => {
  const headersFn = nextConfig.headers;
  assert.equal(typeof headersFn, "function");
  assert.ok(headersFn);

  const routes = await headersFn();
  const catchAll = routes.find((route) => route.source === "/(.*)");
  assert.ok(catchAll);

  const headers = new Map(catchAll.headers.map((header) => [header.key, header.value]));

  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("X-Frame-Options"), "DENY");
  assert.match(headers.get("Permissions-Policy") ?? "", /camera=\(\)/);
});
