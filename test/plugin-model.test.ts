import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readPluginConf, releaseVersion, selectPlugins } from "../src/data/plugin-model.ts";

const sum = "a".repeat(64);
const listing = (over: Record<string, unknown>) => ({
  id: "weather",
  name: "Weather",
  description: "Today's forecast on the panel.",
  author: "Sam Rivera",
  homepage: "https://example.org/weather",
  release: "https://example.org/weather/release.json",
  ...over,
});

describe("selectPlugins", () => {
  it("keeps a complete listing", () => {
    const [plugin] = selectPlugins({ plugins: [listing({})] });
    assert.equal(plugin.id, "weather");
    assert.equal(plugin.official, false);
    assert.equal(plugin.homepage, "https://example.org/weather");
  });

  it("leaves out listings Rivet Shell would refuse", () => {
    const plugins = selectPlugins({
      plugins: [
        listing({ id: "no-release", release: "" }),
        listing({ id: "plain", release: "http://example.org/release.json" }),
        listing({ id: "../up" }),
        listing({ id: "Caps" }),
        listing({ id: "nameless", name: "" }),
        listing({}),
        listing({ name: "Twice" }),
        "not a listing",
      ],
    });
    assert.deepEqual(
      plugins.map((plugin) => plugin.name),
      ["Weather"],
    );
  });

  it("drops a homepage that is not https", () => {
    const [plugin] = selectPlugins({ plugins: [listing({ homepage: "javascript:alert(1)" })] });
    assert.equal(plugin.homepage, "");
  });

  it("sorts by name and refuses a list with no plugins array", () => {
    const plugins = selectPlugins({ plugins: [listing({}), listing({ id: "clock", name: "Clock" })] });
    assert.deepEqual(
      plugins.map((plugin) => plugin.id),
      ["clock", "weather"],
    );
    assert.throws(() => selectPlugins({}));
  });
});

describe("readPluginConf", () => {
  it("reads the name and description, skipping comments", () => {
    const conf = "# a plugin\nname=Disk Space\ndescription = Free space on your disk\nexec=./disk.sh /   # with a comment\n";
    assert.deepEqual(readPluginConf(conf), { name: "Disk Space", description: "Free space on your disk" });
    assert.deepEqual(readPluginConf("exec=./x.sh"), { name: "", description: "" });
  });
});

describe("releaseVersion", () => {
  const release = { version: "1.2", download: "https://example.org/weather-1.2.tar.gz", sha256: sum };
  it("reads the version of a release Rivet Shell would install", () => {
    assert.equal(releaseVersion(release), "1.2");
  });
  it("refuses one it would not", () => {
    assert.equal(releaseVersion({ ...release, sha256: "" }), undefined);
    assert.equal(releaseVersion({ ...release, download: "http://example.org/x.tar.gz" }), undefined);
    assert.equal(releaseVersion({ ...release, version: "" }), undefined);
    assert.equal(releaseVersion(null), undefined);
  });
});
