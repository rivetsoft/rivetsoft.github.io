/** A Rivet Shell plugin, as the Plugins page lists it. */
export interface PluginEntry {
  id: string;
  name: string;
  description: string;
  author: string;
  /** Where its source can be read. */
  homepage: string;
  version: string;
  /** Comes with Rivet Shell, so there is nothing to install. */
  official: boolean;
}

/**
 * The shared plugins from `plugins/registry.json` in rivet-apps. The rules match Rivet Shell's
 * own (`plugin_store.rs`): a listing the shell would refuse to install is not shown here either.
 */
export function selectPlugins(raw: unknown): PluginEntry[] {
  const rows = (raw as { plugins?: unknown })?.plugins;
  if (!Array.isArray(rows)) throw new Error("the plugin list has no plugins array");
  const text = (row: Record<string, unknown>, key: string) =>
    typeof row[key] === "string" ? (row[key] as string).trim() : "";
  const out: PluginEntry[] = [];
  for (const row of rows as Record<string, unknown>[]) {
    if (!row || typeof row !== "object") continue;
    const id = text(row, "id");
    const homepage = text(row, "homepage");
    const ok =
      /^[a-z0-9][a-z0-9_-]{0,39}$/.test(id) &&
      text(row, "name") !== "" &&
      text(row, "download").startsWith("https://") &&
      /^[0-9a-fA-F]{64}$/.test(text(row, "sha256")) &&
      !out.some((entry) => entry.id === id);
    if (!ok) continue;
    out.push({
      id,
      name: text(row, "name"),
      description: text(row, "description"),
      author: text(row, "author"),
      homepage: homepage.startsWith("https://") ? homepage : "",
      version: text(row, "version"),
      official: false,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** The name and description from a plugin's `plugin.conf` (`key=value` lines, `#` comments). */
export function readPluginConf(text: string): { name: string; description: string } {
  const found: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    const at = trimmed.indexOf("=");
    if (trimmed.startsWith("#") || at < 1) continue;
    found[trimmed.slice(0, at).trim()] = trimmed.slice(at + 1).trim();
  }
  return { name: found["name"] ?? "", description: found["description"] ?? "" };
}
