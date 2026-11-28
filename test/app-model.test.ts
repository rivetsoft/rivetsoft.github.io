import assert from "node:assert/strict";
import test from "node:test";

import { allApps, appCategories, apps, navApps, ownRepoApps, pageApps, releaseApps, statusFor } from "../src/data/apps.ts";

const categoryIds = new Set<string>(appCategories.map((category) => category.id));

test("every app outside the desktop and Welcome is in a known Apps group", () => {
  for (const app of allApps) {
    if (app.spotlight) {
      assert.equal(app.category, undefined, `${app.slug} has a spotlight and a category`);
      continue;
    }
    assert.ok(app.category && categoryIds.has(app.category), `${app.slug} needs a category from appCategories`);
  }
});

test("the desktop section holds Rivet Shell and Softcore, with Rivet Greeter coming soon", () => {
  const desktop = apps.filter((app) => app.spotlight === "desktop");
  assert.deepEqual(
    desktop.filter((app) => !app.comingSoon).map((app) => app.slug),
    ["shell", "softcore"],
  );
  assert.deepEqual(
    desktop.filter((app) => app.comingSoon).map((app) => app.slug),
    ["greeter"],
  );
});

test("held apps stay off the site, its menus and the install guide", () => {
  for (const list of [apps, pageApps, navApps, releaseApps, ownRepoApps]) {
    assert.ok(list.every((app) => !app.held));
  }
});

test("coming soon apps are listed, but get no page, menu link, download or install line", () => {
  const soon = apps.filter((app) => app.comingSoon).map((app) => app.slug);
  assert.deepEqual(soon, ["longshot", "reader", "cinema", "greeter", "rivetctl"]);
  for (const list of [pageApps, navApps, releaseApps, ownRepoApps]) {
    assert.ok(list.every((app) => !app.comingSoon));
  }
  for (const app of apps.filter((entry) => entry.comingSoon)) {
    assert.equal(statusFor(app, { prerelease: false }), "soon", `${app.slug} shows a release`);
    assert.ok(app.icon && app.homePoints?.length && app.homeShots?.length, `${app.slug} needs an icon, points and screenshots`);
  }
});

test("slugs are unique across every app, held ones included", () => {
  const slugs = allApps.map((app) => app.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
