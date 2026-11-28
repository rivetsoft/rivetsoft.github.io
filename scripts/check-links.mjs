// Every link and picture inside the built site points at a file that is there. Run after
// npm run build: node scripts/check-links.mjs [dist]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";

export function brokenLinks(dist) {
  const pages = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (name.endsWith(".html")) pages.push(path);
    }
  };
  walk(dist);
  const found = (target) => {
    const file = join(dist, ...target.split("/"));
    if (target.endsWith("/")) return existsSync(join(file, "index.html"));
    return existsSync(file) && (statSync(file).isFile() || existsSync(join(file, "index.html")));
  };
  const broken = [];
  for (const page of pages) {
    const from = "/" + relative(dist, page).split(sep).join("/");
    const html = readFileSync(page, "utf8");
    for (const match of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
      const raw = match[1].replace(/&amp;/g, "&");
      if (!raw || raw.startsWith("#") || raw.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(raw)) continue;
      const path = decodeURI(raw.split(/[?#]/)[0]);
      if (!path) continue;
      const target = path.startsWith("/") ? path : posix.join(posix.dirname(from), path);
      if (!found(target.replace(/^\//, ""))) broken.push(`${from} -> ${raw}`);
    }
  }
  return { pages: pages.length, broken: [...new Set(broken)] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { pages, broken } = brokenLinks(process.argv[2] ?? "dist");
  for (const line of broken) console.error(line);
  console.log(`${pages} pages, ${broken.length} broken links`);
  process.exit(broken.length ? 1 : 0);
}
