import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { brokenLinks } from "../scripts/check-links.mjs";

// Needs a built site, so CI runs the build first. Without dist/ there is nothing to check yet.
test("every internal link in the built site resolves", { skip: existsSync("dist") ? false : "no dist/: run npm run build first" }, () => {
  const { pages, broken } = brokenLinks("dist");
  assert.ok(pages > 0);
  assert.deepEqual(broken, []);
});
