import { repoUrl } from "./apps";
import fallback from "./plugins.fallback.json";
import { readPluginConf, releaseVersion, selectPlugins, type PluginEntry } from "./plugin-model";

const REGISTRY = "https://raw.githubusercontent.com/ulinaaron/rivet-apps/main/plugins/registry.json";

function registryUrl(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const override = env?.["RIVET_PLUGINS_REGISTRY"];
  return override && override !== "undefined" ? override : REGISTRY;
}

const OFFICIAL_DIR = "apps/rivet-shell/data/plugins";

const official = (id: string, name: string, description: string): PluginEntry => ({
  id,
  name,
  // Listed as a sentence, whether or not the plugin's own line ends with a period.
  description: /[.!?]$/.test(description) || description === "" ? description : `${description}.`,
  author: "Rivet",
  homepage: `${repoUrl}/tree/main/${OFFICIAL_DIR}/${id}`,
  version: "",
  official: true,
});

/** The official plugins as of the last time this file was edited: used when GitHub can't be read. */
const savedOfficial: PluginEntry[] = [
  official("disk", "Disk Space", "Free space on your disk; click for every disk, and open one"),
  official("edit", "Edit", "Your five most recent folders on the panel and in the launcher (@edit)"),
  official("ftp", "FTP", "Your saved connections on the panel and in the launcher (@ftp)"),
  official("notes", "Notes", "Open tasks and latest notes on the panel; find or make notes in the launcher (@notes)"),
];

function githubHeaders(): Record<string, string> {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const token = env?.["GITHUB_TOKEN"] || env?.["GH_TOKEN"];
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "rivet-web" };
  if (token && token !== "undefined") headers.Authorization = `Bearer ${token}`;
  return headers;
}

/** The plugins that come with Rivet Shell: each folder of `data/plugins` in rivet-apps, read when the site is built. */
export const officialPlugins: PluginEntry[] = await (async () => {
  try {
    const listing = await fetch(`https://api.github.com/repos/ulinaaron/rivet-apps/contents/${OFFICIAL_DIR}`, {
      headers: githubHeaders(),
      signal: AbortSignal.timeout(20_000),
    });
    if (!listing.ok) throw new Error(`official plugins HTTP ${listing.status}`);
    const folders = ((await listing.json()) as { name: string; type: string }[]).filter((entry) => entry.type === "dir");
    const live = await Promise.all(
      folders.map(async ({ name: id }) => {
        const conf = await fetch(`https://raw.githubusercontent.com/ulinaaron/rivet-apps/main/${OFFICIAL_DIR}/${id}/plugin.conf`, {
          signal: AbortSignal.timeout(20_000),
        });
        if (!conf.ok) throw new Error(`${id}/plugin.conf HTTP ${conf.status}`);
        const { name, description } = readPluginConf(await conf.text());
        return official(id, name || id, description);
      }),
    );
    if (live.length === 0) throw new Error("no official plugins found");
    console.log(`[plugins] official: ${live.map((plugin) => plugin.id).join(", ")}`);
    return live.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[plugins] using saved official plugins (${message})`);
    return savedOfficial;
  }
})();

/** The shared plugins, read when the site is built; the saved list if that can't be reached. */
export const sharedPlugins: PluginEntry[] = await (async () => {
  const taken = new Set(officialPlugins.map((plugin) => plugin.id));
  try {
    const response = await fetch(registryUrl(), { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`plugin list HTTP ${response.status}`);
    const listed = selectPlugins(await response.json()).filter((plugin) => !taken.has(plugin.id));
    // Each author's release file says which version is current.
    const versions = await Promise.all(
      listed.map(async (plugin) => {
        try {
          const release = await fetch(plugin.release ?? "", { signal: AbortSignal.timeout(20_000) });
          return release.ok ? releaseVersion(await release.json()) : undefined;
        } catch {
          return undefined;
        }
      }),
    );
    const live = listed.flatMap((plugin, index) => (versions[index] ? [{ ...plugin, version: versions[index] }] : []));
    console.log(`[plugins] registry: ${live.length} shared`);
    return live;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[plugins] using saved plugin list (${message})`);
    return selectPlugins(fallback).filter((plugin) => !taken.has(plugin.id));
  }
})();

export const pluginsGuideUrl = `${repoUrl}/blob/main/apps/rivet-shell/PLUGINS.md`;
