import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { selectPlugins } from "../src/data/plugin-model.ts";

const sum = "a".repeat(64);
const listing = (over: Record<string, unknown>) => ({
  id: "weather",
  name: "Weather",
  description: "Today's forecast on the panel.",
  author: "Sam Rivera",
  homepage: "https://example.org/weather",
  version: "1.0",
  download: "https://example.org/weather-1.0.tar.gz",
  sha256: sum,
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
        listing({ id: "no-sum", sha256: "" }),
        listing({ id: "plain", download: "http://example.org/x.tar.gz" }),
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
