import assert from "node:assert/strict";
import test from "node:test";
import { isInPlaceEditEnabled } from "./inplace-flag.ts";

test("default true when unset", () => {
  assert.equal(isInPlaceEditEnabled({}), true);
});
test("explicit false disables", () => {
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "false" }), false);
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "0" }), false);
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "no" }), false);
});
test("truthy variants enable", () => {
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "1" }), true);
  assert.equal(isInPlaceEditEnabled({ INPLACE_EDIT_ENABLED: "TRUE" }), true);
});
