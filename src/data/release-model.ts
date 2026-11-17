export interface TagApp {
  slug: string;
  tagPrefixes: readonly string[];
}

export interface RawAsset {
  name: string;
  size?: number;
  browser_download_url?: string;
  state?: string;
}

export interface RawRelease {
  tag_name?: string;
  name?: string | null;
  draft?: boolean;
  prerelease?: boolean;
  published_at?: string | null;
  html_url?: string;
  body?: string | null;
  assets?: RawAsset[];
}

export type AssetKind = "appimage" | "flatpak" | "archive" | "other";

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
  kind: AssetKind;
  label: string;
  checksumName?: string;
  checksumUrl?: string;
}

export interface AppRelease {
  slug: string;
  tag: string;
  version: string;
  title: string;
  prerelease: boolean;
  publishedAt: string;
  dateLabel: string;
  htmlUrl: string;
  notes: string;
  assets: ReleaseAsset[];
}

const BARE_VERSION = /^v\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.]+)?$/;

/** Longest prefix wins. "v" matches only a bare vX.Y.Z tag. */
export function matchSlug(tag: string, apps: readonly TagApp[]): string | undefined {
  let best: { slug: string; length: number } | undefined;
  for (const app of apps) {
    for (const prefix of app.tagPrefixes) {
      const matched = prefix === "v" ? BARE_VERSION.test(tag) : tag.startsWith(prefix);
      if (!matched) continue;
      const length = prefix === "v" ? 1 : prefix.length;
      if (!best || length > best.length) best = { slug: app.slug, length };
    }
  }
  return best?.slug;
}

export function versionFromTag(tag: string): string {
  const match = tag.match(/(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.]+)?)$/);
  return match?.[1] ?? tag;
}

function versionParts(version: string): number[] {
  const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return [0, 0, 0];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function prereleaseId(version: string): string | undefined {
  const match = version.match(/\d+\.\d+\.\d+-(.+)$/);
  return match?.[1];
}

/** Higher version is greater. A final release is greater than its prerelease. */
export function compareVersions(a: string, b: string): number {
  const left = versionParts(a);
  const right = versionParts(b);
  for (let i = 0; i < 3; i += 1) {
    const diff = left[i] - right[i];
    if (diff !== 0) return diff;
  }
  const aPre = prereleaseId(a);
  const bPre = prereleaseId(b);
  if (aPre === bPre) return 0;
  if (aPre === undefined) return 1;
  if (bPre === undefined) return -1;
  return aPre < bPre ? -1 : 1;
}

export function formatReleaseDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size < 0) return "";
  if (size < 1000) return `${Math.round(size)} B`;
  const units = ["KB", "MB", "GB"];
  let value = size / 1000;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit += 1;
  }
  const digits = value >= 10 ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unit]}`;
}

export function archiveFolder(name: string): string {
  return name.replace(/\.tar\.gz$/i, "").replace(/\.tgz$/i, "");
}

function checksumTarget(name: string): string | undefined {
  const match = name.match(/^(.*)\.sha256(?:sum)?$/i);
  return match?.[1] || undefined;
}

function assetKind(name: string): AssetKind | "checksum" {
  const lower = name.toLowerCase();
  if (checksumTarget(name)) return "checksum";
  if (lower.endsWith(".appimage")) return "appimage";
  if (lower.endsWith(".flatpak")) return "flatpak";
  if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) return "archive";
  return "other";
}

function assetLabel(kind: AssetKind, name: string): string {
  if (kind === "appimage") return "AppImage";
  if (kind === "flatpak") return "Flatpak";
  if (kind === "archive") return name.toLowerCase().endsWith(".tar.gz") || name.toLowerCase().endsWith(".tgz") ? "tar.gz" : "Archive";
  const ext = name.includes(".") ? name.split(".").pop() : "";
  return ext || "File";
}

const kindOrder: Record<AssetKind, number> = {
  appimage: 0,
  archive: 1,
  flatpak: 2,
  other: 3,
};

function toAssets(raw: RawAsset[] | undefined): ReleaseAsset[] {
  const uploaded = (raw ?? []).filter((asset) => asset.name && asset.browser_download_url && (!asset.state || asset.state === "uploaded"));
  const checksums = new Map<string, RawAsset>();
  for (const asset of uploaded) {
    const target = checksumTarget(asset.name);
    if (target) checksums.set(target, asset);
  }
  const assets: ReleaseAsset[] = [];
  for (const asset of uploaded) {
    const kind = assetKind(asset.name);
    if (kind === "checksum") continue;
    const checksum = checksums.get(asset.name);
    assets.push({
      name: asset.name,
      url: asset.browser_download_url as string,
      size: typeof asset.size === "number" ? asset.size : 0,
      kind,
      label: assetLabel(kind, asset.name),
      checksumName: checksum?.name,
      checksumUrl: checksum?.browser_download_url,
    });
  }
  assets.sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind] || a.name.localeCompare(b.name));
  return assets;
}

function isNewer(candidate: RawRelease, current: RawRelease): boolean {
  const candidateTime = Date.parse(candidate.published_at ?? "");
  const currentTime = Date.parse(current.published_at ?? "");
  if (candidateTime !== currentTime) return candidateTime > currentTime;
  return compareVersions(versionFromTag(candidate.tag_name ?? ""), versionFromTag(current.tag_name ?? "")) > 0;
}

function toAppRelease(slug: string, release: RawRelease): AppRelease {
  const tag = release.tag_name ?? "";
  const publishedAt = release.published_at ?? "";
  return {
    slug,
    tag,
    version: versionFromTag(tag),
    title: release.name?.trim() || tag,
    prerelease: Boolean(release.prerelease),
    publishedAt,
    dateLabel: formatReleaseDate(publishedAt),
    htmlUrl: release.html_url ?? "",
    notes: (release.body ?? "").replace(/\r\n/g, "\n").trim(),
    assets: toAssets(release.assets),
  };
}

/** Skip drafts. Keep prereleases. One newest release per app, by publish date, then semver. */
export function selectReleases(raw: readonly RawRelease[], apps: readonly TagApp[]): AppRelease[] {
  const best = new Map<string, RawRelease>();
  for (const release of raw) {
    if (release.draft) continue;
    if (!release.tag_name || !release.published_at || !release.html_url) continue;
    const slug = matchSlug(release.tag_name, apps);
    if (!slug) continue;
    const current = best.get(slug);
    if (!current || isNewer(release, current)) best.set(slug, release);
  }
  const selected: AppRelease[] = [];
  for (const app of apps) {
    const release = best.get(app.slug);
    if (release) selected.push(toAppRelease(app.slug, release));
  }
  return selected;
}

export function assetByKind(release: AppRelease, kind: AssetKind): ReleaseAsset | undefined {
  return release.assets.find((asset) => asset.kind === kind);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeUrl(raw: string): string | undefined {
  const url = raw.trim();
  if (!url || /[\s<>"']/.test(url)) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:" && parsed.protocol !== "mailto:") return undefined;
    return url;
  } catch {
    return undefined;
  }
}

function inline(text: string): string {
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(!\[[^\]]*\]\([^)\s]+\))|(\[[^\]]+\]\([^)\s]+\))/g;
  const parts: string[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    parts.push(escapeHtml(text.slice(last, index)));
    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(`<code>${escapeHtml(token.slice(1, -1))}</code>`);
    } else if (token.startsWith("**")) {
      parts.push(`<strong>${escapeHtml(token.slice(2, -2))}</strong>`);
    } else if (token.startsWith("*")) {
      parts.push(`<em>${escapeHtml(token.slice(1, -1))}</em>`);
    } else if (token.startsWith("!")) {
      const alt = token.match(/^!\[([^\]]*)\]/)?.[1] ?? "";
      parts.push(escapeHtml(alt));
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      const href = link ? safeUrl(link[2]) : undefined;
      const label = escapeHtml(link?.[1] ?? token);
      parts.push(href ? `<a href="${escapeHtml(href)}">${label}</a>` : label);
    }
    last = index + token.length;
  }
  parts.push(escapeHtml(text.slice(last)));
  return parts.join("");
}

/** A small markdown subset. HTML in the source is escaped, and links must be http(s) or mailto. */
export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === "") {
      index += 1;
      continue;
    }
    if (/^\s*```/.test(line)) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^\s*```/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const tag = heading[1].length >= 4 ? "h4" : "h3";
      blocks.push(`<${tag}>${inline(heading[2])}</${tag}>`);
      index += 1;
      continue;
    }
    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        if (/^\s*[-*]\s+/.test(lines[index])) {
          items.push(lines[index].replace(/^\s*[-*]\s+/, ""));
          index += 1;
          continue;
        }
        if (items.length > 0 && /^\s{2,}\S/.test(lines[index])) {
          items[items.length - 1] += ` ${lines[index].trim()}`;
          index += 1;
          continue;
        }
        break;
      }
      blocks.push(`<ul>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
      continue;
    }
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !/^\s*```/.test(lines[index]) &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*>\s?/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }
  return blocks.join("");
}

/** A short opening paragraph stays visible. Headings and lists go in the disclosure. */
export function splitRenderedNotes(html: string): { lead: string; rest: string } {
  const parts = html.match(/<(?:h3|h4|p|ul|pre|blockquote)\b[\s\S]*?<\/(?:h3|h4|p|ul|pre|blockquote)>/g);
  if (!parts || parts.length === 0) return { lead: "", rest: "" };
  const firstText = parts[0].replace(/<[^>]+>/g, "").trim();
  if (parts[0].startsWith("<p") && firstText.length > 0 && firstText.length <= 280) {
    return { lead: parts[0], rest: parts.slice(1).join("") };
  }
  return { lead: "", rest: parts.join("") };
}
