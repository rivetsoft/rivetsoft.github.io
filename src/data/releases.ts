import { releaseApps } from "./apps";
import fallback from "./releases.fallback.json";
import { selectReleases, type AppRelease, type RawRelease } from "./release-model";

const API = "https://api.github.com/repos/rivetsoft/apps/releases?per_page=100";

function releasesApi(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const override = env?.["RIVET_RELEASES_API"];
  return override && override !== "undefined" ? override : API;
}

export interface ReleaseCatalog {
  source: "github" | "fallback";
  bySlug: Record<string, AppRelease>;
}

function githubToken(): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const value = env?.["GITHUB_TOKEN"] || env?.["GH_TOKEN"];
  if (!value || value === "undefined") return undefined;
  return value;
}

async function fetchReleases(): Promise<RawRelease[]> {
  const token = githubToken();
  console.log(`[releases] github token: ${token ? "yes" : "no"}`);
  const all: RawRelease[] = [];
  let url: string | undefined = releasesApi();
  for (let page = 0; url && page < 20; page += 1) {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "rivet-web",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });
    if (!response.ok) {
      throw new Error(`GitHub releases HTTP ${response.status}`);
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("GitHub releases response was not a list");
    all.push(...(data as RawRelease[]));
    const link = response.headers.get("link") ?? "";
    const next = link.split(",").find((part) => part.includes('rel="next"'));
    const match = next?.match(/<([^>]+)>/);
    url = match?.[1];
    if (!url && data.length === 100) {
      const pageNumber = page + 2;
      url = `https://api.github.com/repos/rivetsoft/apps/releases?per_page=100&page=${pageNumber}`;
    }
  }
  return all;
}

function catalogFrom(raw: readonly RawRelease[], source: ReleaseCatalog["source"]): ReleaseCatalog {
  const selected = selectReleases(raw, releaseApps);
  return {
    source,
    bySlug: Object.fromEntries(selected.map((release) => [release.slug, release])),
  };
}

export const catalog: ReleaseCatalog = await (async () => {
  try {
    const live = catalogFrom(await fetchReleases(), "github");
    if (Object.keys(live.bySlug).length === 0) throw new Error("GitHub returned no matching releases");
    const summary = Object.values(live.bySlug)
      .map((release) => `${release.slug} ${release.version}${release.prerelease ? " pre" : ""}`)
      .join(", ");
    console.log(`[releases] github: ${summary}`);
    return live;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[releases] using saved release info (${message})`);
    const now = Date.now();
    const published = (fallback as RawRelease[]).filter((release) => !(Date.parse(release.published_at ?? "") > now));
    return catalogFrom(published, "fallback");
  }
})();

export function releaseFor(slug: string): AppRelease | undefined {
  return catalog.bySlug[slug];
}
