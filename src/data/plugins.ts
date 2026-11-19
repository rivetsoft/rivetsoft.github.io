import { repoUrl } from "./apps";
import fallback from "./plugins.fallback.json";
import { selectPlugins, type PluginEntry } from "./plugin-model";

const REGISTRY = "https://raw.githubusercontent.com/ulinaaron/rivet-apps/main/plugins/registry.json";

function registryUrl(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const override = env?.["RIVET_PLUGINS_REGISTRY"];
  return override && override !== "undefined" ? override : REGISTRY;
}

/** The plugins that come with Rivet Shell (`apps/rivet-shell/data/plugins` in rivet-apps). */
export const officialPlugins: PluginEntry[] = [
  ["disk", "Disk Space", "Free space on your disk; click for every disk, and open one."],
  ["edit", "Edit", "Your five most recent folders on the panel and in the launcher (@edit)."],
  ["ftp", "FTP", "Your saved connections on the panel and in the launcher (@ftp)."],
  ["notes", "Notes", "Open tasks and latest notes on the panel; find or make notes in the launcher (@notes)."],
].map(([id, name, description]) => ({
  id,
  name,
  description,
  author: "Rivet",
  homepage: `${repoUrl}/tree/main/apps/rivet-shell/data/plugins/${id}`,
  version: "",
  official: true,
}));

/** The shared plugins, read when the site is built; the saved list if that can't be reached. */
export const sharedPlugins: PluginEntry[] = await (async () => {
  const taken = new Set(officialPlugins.map((plugin) => plugin.id));
  try {
    const response = await fetch(registryUrl(), { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`plugin list HTTP ${response.status}`);
    const live = selectPlugins(await response.json()).filter((plugin) => !taken.has(plugin.id));
    console.log(`[plugins] registry: ${live.length} shared`);
    return live;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[plugins] using saved plugin list (${message})`);
    return selectPlugins(fallback).filter((plugin) => !taken.has(plugin.id));
  }
})();

export const pluginsGuideUrl = `${repoUrl}/blob/main/apps/rivet-shell/PLUGINS.md`;
