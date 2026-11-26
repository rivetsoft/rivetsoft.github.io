import { ownRepoApps, releaseApps, repoPath, type AppEntry } from "./apps";
import fallback from "./releases.fallback.json";
import ownRepoFallback from "./releases.own-repos.fallback.json";
import { selectReleases, type AppRelease, type RawRelease } from "./release-model";

const APPS_API = "https://api.github.com/repos/rivetsoft/apps/releases?per_page=100";

function env(name: string): string | undefined {
  const value = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
  return value && value !== "undefined" ? value : undefined;
}

export interface ReleaseCatalog {
  /** Where rivetsoft/apps' releases came from. */
  source: "github" | "fallback";
  bySlug: Record<string, AppRelease>;
  /** Apps whose release info is the saved copy, because GitHub couldn't be reached. */
  fallbackSlugs: string[];
}

function githubToken(): string | undefined {
  return env("GITHUB_TOKEN") || env("GH_TOKEN");
}

async function fetchReleases(first: string): Promise<RawRelease[]> {
  const token = githubToken();
  const all: RawRelease[] = [];
  let url: string | undefined = first;
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
    url = next?.match(/<([^>]+)>/)?.[1];
    if (!url && data.length === 100) {
      const base = new URL(first);
      base.searchParams.set("page", String(page + 2));
      url = base.toString();
    }
  }
  return all;
}

function summary(releases: readonly AppRelease[]): string {
  return releases.map((release) => `${release.slug} ${release.version}${release.prerelease ? " pre" : ""}`).join(", ") || "none";
}

/** rivetsoft/apps: having no matching release at all means something is wrong, so the saved copy is used. */
async function appsReleases(): Promise<{ releases: AppRelease[]; fallback: boolean }> {
  try {
    const releases = selectReleases(await fetchReleases(env("RIVET_RELEASES_API") ?? APPS_API), releaseApps);
    if (releases.length === 0) throw new Error("GitHub returned no matching releases");
    console.log(`[releases] rivetsoft/apps: ${summary(releases)}`);
    return { releases, fallback: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[releases] rivetsoft/apps: using saved release info (${message})`);
    return { releases: selectReleases(fallback as RawRelease[], releaseApps), fallback: true };
  }
}

/** An app with a repository of its own. No release yet is a normal answer there. */
async function ownRepoReleases(app: AppEntry): Promise<{ releases: AppRelease[]; fallback: boolean }> {
  const repo = repoPath(app.repo!);
  try {
    const releases = selectReleases(await fetchReleases(`https://api.github.com/repos/${repo}/releases?per_page=100`), [app]);
    console.log(`[releases] ${repo}: ${summary(releases)}`);
    return { releases, fallback: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[releases] ${repo}: using saved release info (${message})`);
    const saved = (ownRepoFallback as Record<string, RawRelease[]>)[repo] ?? [];
    return { releases: selectReleases(saved, [app]), fallback: true };
  }
}

export const catalog: ReleaseCatalog = await (async () => {
  console.log(`[releases] github token: ${githubToken() ? "yes" : "no"}`);
  const apps = await appsReleases();
  const own = await Promise.all(ownRepoApps.map(async (app) => ({ app, ...(await ownRepoReleases(app)) })));
  const releases = [...apps.releases, ...own.flatMap((entry) => entry.releases)];
  return {
    source: apps.fallback ? "fallback" : "github",
    bySlug: Object.fromEntries(releases.map((release) => [release.slug, release])),
    fallbackSlugs: [
      ...(apps.fallback ? releaseApps.map((app) => app.slug) : []),
      ...own.filter((entry) => entry.fallback).map((entry) => entry.app.slug),
    ],
  };
})();

export function releaseFor(slug: string): AppRelease | undefined {
  return catalog.bySlug[slug];
}
