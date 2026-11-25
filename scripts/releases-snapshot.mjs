#!/usr/bin/env node
// Saves the published releases of rivetsoft/apps to src/data/releases.fallback.json, the copy the
// build uses when the GitHub API is unreachable. Drafts are left out, as on the site.
//
//   npm run releases:snapshot
//
// Uses GITHUB_TOKEN or GH_TOKEN, or `gh auth token`, when there is one.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const out = new URL("../src/data/releases.fallback.json", import.meta.url);
let next = process.env.RIVET_RELEASES_API || "https://api.github.com/repos/rivetsoft/apps/releases?per_page=100";

function token() {
  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) return process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return undefined;
  }
}

const auth = token();
const releases = [];
while (next) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "rivet-web", "X-GitHub-Api-Version": "2022-11-28" };
  if (auth) headers.Authorization = `Bearer ${auth}`;
  const response = await fetch(next, { headers, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`GitHub releases HTTP ${response.status}`);
  releases.push(...(await response.json()));
  next = (response.headers.get("link") ?? "").match(/<([^>]+)>;\s*rel="next"/)?.[1];
}

const saved = releases
  .filter((release) => !release.draft && release.published_at)
  .map((release) => ({
    tag_name: release.tag_name,
    name: release.name,
    draft: false,
    prerelease: release.prerelease,
    published_at: release.published_at,
    html_url: release.html_url,
    body: release.body,
    assets: release.assets.map((asset) => ({
      name: asset.name,
      size: asset.size,
      browser_download_url: asset.browser_download_url,
      state: asset.state,
    })),
  }))
  .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));

if (saved.length === 0) throw new Error("GitHub returned no published releases; the saved copy is unchanged");
writeFileSync(out, `${JSON.stringify(saved, null, 2)}\n`);
console.log(`Saved ${saved.length} releases, newest ${saved[0].tag_name}, to src/data/releases.fallback.json`);
