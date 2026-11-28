import assert from "node:assert/strict";
import test from "node:test";

import { allApps, appCategories, apps, navApps, ownRepoApps, releaseApps } from "../src/data/apps.ts";

const categoryIds = new Set<string>(appCategories.map((category) => category.id));
const ownSections = new Set(["shell", "softcore", "welcome"]);

test("every app outside the desktop and Welcome is in a known group", () => {
  for (const app of allApps) {
    if (ownSections.has(app.slug)) continue;
    assert.ok(app.category && categoryIds.has(app.category), `${app.slug} needs a category from appCategories`);
  }
});

test("held apps stay off the site, its menus and the install guide", () => {
  const held = allApps.filter((app) => app.held).map((app) => app.slug);
  assert.deepEqual(held, ["longshot", "reader", "cinema"]);
  for (const list of [apps, navApps, releaseApps, ownRepoApps]) {
    assert.ok(list.every((app) => !app.held));
  }
});

test("slugs are unique across every app, held ones included", () => {
  const slugs = allApps.map((app) => app.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
