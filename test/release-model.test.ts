import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { releaseApps } from "../src/data/apps.ts";
import {
  assetByKind,
  compareVersions,
  matchSlug,
  renderMarkdown,
  selectReleases,
  splitRenderedNotes,
  type RawRelease,
} from "../src/data/release-model.ts";

const tagApps = releaseApps.map((app) => ({ slug: app.slug, tagPrefixes: app.tagPrefixes }));

function release(partial: RawRelease): RawRelease {
  return {
    draft: false,
    prerelease: false,
    published_at: "2026-11-01T00:00:00Z",
    html_url: `https://github.com/rivetsoft/apps/releases/tag/${partial.tag_name}`,
    body: "",
    assets: [],
    ...partial,
  };
}

describe("tag mapping", () => {
  it("maps bare v* and rivet-files-v* to Files, and leaves other apps alone", () => {
    assert.equal(matchSlug("v0.6.0", tagApps), "files");
    assert.equal(matchSlug("rivet-files-v1.2.3", tagApps), "files");
    assert.equal(matchSlug("rivet-notes-v0.1.0", tagApps), "notes");
    assert.equal(matchSlug("rivet-ftp-v0.1.0", tagApps), "ftp");
    assert.equal(matchSlug("rivet-edit-v0.1.0", tagApps), "edit");
    assert.equal(matchSlug("rivet-terminal-v0.1.0", tagApps), "terminal");
    assert.equal(matchSlug("rivet-shell-v0.1.0", tagApps), "shell");
    assert.equal(matchSlug("rivet-welcome-v0.1.0", tagApps), "welcome");
    assert.equal(matchSlug("not-a-release", tagApps), undefined);
  });
});

describe("newest release", () => {
  it("prefers the later publish date, then the higher version, and skips drafts", () => {
    const selected = selectReleases(
      [
        release({ tag_name: "v0.9.0", published_at: "2026-01-01T00:00:00Z" }),
        release({ tag_name: "v0.6.0", published_at: "2026-11-15T00:00:00Z" }),
        release({ tag_name: "rivet-files-v1.0.0", draft: true, published_at: "2026-12-01T00:00:00Z" }),
        release({
          tag_name: "rivet-notes-v0.1.0",
          prerelease: true,
          published_at: "2026-11-17T00:00:00Z",
        }),
        release({
          tag_name: "rivet-edit-v0.2.0",
          published_at: "2026-11-20T00:00:00Z",
        }),
        release({
          tag_name: "rivet-edit-v0.3.0-rc.1",
          prerelease: true,
          published_at: "2026-11-20T00:00:00Z",
        }),
      ],
      tagApps,
    );
    const bySlug = Object.fromEntries(selected.map((item) => [item.slug, item]));
    assert.equal(bySlug.files.version, "0.6.0");
    assert.equal(bySlug.files.prerelease, false);
    assert.equal(bySlug.notes.version, "0.1.0");
    assert.equal(bySlug.notes.prerelease, true);
    assert.equal(bySlug.edit.version, "0.3.0-rc.1");
    assert.equal(bySlug.ftp, undefined);
  });

  it("orders versions with prereleases below the final release", () => {
    assert.ok(compareVersions("1.0.0", "1.0.0-rc.1") > 0);
    assert.ok(compareVersions("0.2.0", "0.1.9") > 0);
  });
});

describe("assets", () => {
  it("pairs sha256 files and keeps AppImage, tar.gz, and Flatpak", () => {
    const [files] = selectReleases(
      [
        release({
          tag_name: "v0.6.0",
          published_at: "2026-11-15T01:26:14Z",
          assets: [
            { name: "rivet-files-0.6.0-x86_64-linux.tar.gz.sha256", size: 104, browser_download_url: "https://example.test/tar.sha256" },
            { name: "notes.txt", size: 10, browser_download_url: "https://example.test/notes.txt" },
            { name: "rivet-files.flatpak", size: 50, browser_download_url: "https://example.test/app.flatpak" },
            { name: "Rivet_Files-0.6.0-x86_64.AppImage", size: 7444984, browser_download_url: "https://example.test/app.AppImage" },
            { name: "Rivet_Files-0.6.0-x86_64.AppImage.sha256", size: 100, browser_download_url: "https://example.test/app.sha256" },
            { name: "rivet-files-0.6.0-x86_64-linux.tar.gz", size: 80, browser_download_url: "https://example.test/tar.gz" },
            { name: "half-uploaded.bin", size: 1, state: "starter", browser_download_url: "https://example.test/half" },
          ],
        }),
      ],
      tagApps,
    );
    assert.deepEqual(
      files.assets.map((asset) => asset.label),
      ["AppImage", "Portable build (tar.gz)", "Flatpak", "txt"],
    );
    const appImage = assetByKind(files, "appimage");
    assert.equal(appImage?.checksumUrl, "https://example.test/app.sha256");
    assert.equal(assetByKind(files, "flatpak")?.checksumUrl, undefined);
    assert.equal(files.assets.some((asset) => asset.name.endsWith(".sha256")), false);
    assert.equal(files.dateLabel, "15 November 2026");
  });
});

describe("markdown", () => {
  it("renders a short safe subset and drops unsafe links", () => {
    const html = renderMarkdown(
      "The first version.\n\n- **Vaults** and `[[Note]]`\n  continued\n\n<script>alert(1)</script>\n\n[ok](https://example.com/a) [bad](javascript:alert(1))\n",
    );
    assert.match(html, /<p>The first version\.<\/p><ul><li><strong>Vaults<\/strong> and <code>\[\[Note\]\]<\/code> continued<\/li><\/ul>/);
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(html, /<a href="https:\/\/example.com\/a">ok<\/a>/);
    assert.doesNotMatch(html, /javascript:/);
    assert.doesNotMatch(html, /<script>/);
  });

  it("keeps a short opening paragraph out of the disclosure", () => {
    const html = renderMarkdown("The first version.\n\n- One\n- Two\n");
    const split = splitRenderedNotes(html);
    assert.equal(split.lead, "<p>The first version.</p>");
    assert.match(split.rest, /<ul>/);
    const headed = splitRenderedNotes(renderMarkdown("### New\n\n- A long note\n"));
    assert.equal(headed.lead, "");
    assert.match(headed.rest, /<h3>New<\/h3>/);
  });
});

describe("saved releases", () => {
  it("has every app's newest release, with its downloads at the tag", () => {
    const raw = JSON.parse(readFileSync(new URL("../src/data/releases.fallback.json", import.meta.url), "utf8")) as RawRelease[];
    const bySlug = Object.fromEntries(selectReleases(raw, tagApps).map((item) => [item.slug, item]));
    const expected: [string, string, string, boolean][] = [
      ["files", "v0.10.0", "Rivet_Files", false],
      ["notes", "rivet-notes-v0.4.1", "Rivet_Notes", false],
      ["edit", "rivet-edit-v0.3.1", "Rivet_Edit", false],
      ["terminal", "rivet-terminal-v0.3.1", "Rivet_Terminal", false],
      ["ftp", "rivet-ftp-v0.4.1", "Rivet_FTP", true],
      ["welcome", "rivet-welcome-v0.3.0", "Rivet_Welcome", true],
      ["shell", "rivet-shell-v0.1.0", "Rivet_Shell", true],
      ["snip", "rivet-snip-v0.1.0", "Rivet_Snip", true],
      ["vice", "rivet-vice-v0.1.0", "Rivet_Vice", true],
      ["calendar", "rivet-calendar-v0.1.0", "Rivet_Calendar", true],
      ["color", "rivet-color-v0.1.0", "Rivet_Color", true],
      ["fetch", "rivet-fetch-v0.1.0", "Rivet_Fetch", true],
    ];
    for (const [slug, tag, title, prerelease] of expected) {
      const item = bySlug[slug];
      assert.equal(item?.tag, tag, slug);
      assert.equal(item.prerelease, prerelease, slug);
      const appImage = assetByKind(item, "appimage");
      assert.equal(appImage?.name, `${title}-${item.version}-x86_64.AppImage`);
      assert.equal(appImage?.url, `https://github.com/rivetsoft/apps/releases/download/${tag}/${appImage?.name}`);
      assert.ok(appImage?.checksumUrl);
      const archive = assetByKind(item, "archive");
      assert.match(archive?.name ?? "", new RegExp(`^rivet-${slug}-${item.version.replaceAll(".", "\\.")}-x86_64-linux\\.tar\\.gz$`));
      assert.ok(archive?.checksumUrl);
      assert.match(item.notes, /### Install/);
    }
    assert.equal(bySlug.softcore, undefined);
  });
});
