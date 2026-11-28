import type { ImageMetadata } from "astro";

const files = import.meta.glob<{ default: ImageMetadata }>("../assets/screenshots/*.{png,jpg}", { eager: true });
const byName = new Map(Object.entries(files).map(([path, mod]) => [path.slice(path.lastIndexOf("/") + 1), mod.default]));

// On a phone held upright a screenshot is drawn under 400 pixels wide, and the 800-wide copy is
// sharp there even on a three-times screen, so phones are told 260px and never take a larger one.
const phone = "(max-width: 479px) 260px";

/** The sizes attribute for each place a screenshot shows: about as wide as the picture is drawn. */
export const shotSizes = {
  hero: `${phone}, (min-width: 1100px) 40rem, (min-width: 800px) 56vw, 92vw`,
  row: `${phone}, (min-width: 1100px) 41rem, (min-width: 800px) 58vw, 92vw`,
  grid: `${phone}, (min-width: 1100px) 16rem, (min-width: 620px) 46vw, 92vw`,
  pair: `${phone}, (min-width: 620px) 46vw, 92vw`,
  swatch: "(min-width: 800px) 17rem, 45vw",
  page: `${phone}, (min-width: 1100px) 68rem, 92vw`,
  thumb: "(min-width: 1100px) 8rem, (min-width: 700px) 14vw, 30vw",
};

// The home page's thumbnails come from the app screenshots and the shell's and Softcore's photographs.
const homeFiles = import.meta.glob<{ default: ImageMetadata }>("../assets/{screenshots,shell,softcore}/*.{png,jpg}", { eager: true });
const byAssetPath = new Map(Object.entries(homeFiles).map(([path, mod]) => [path.replace("../assets/", ""), mod.default]));

/** A picture by its path inside src/assets, such as "shell/launcher.jpg". */
export function assetShot(path: string): ImageMetadata {
  const image = byAssetPath.get(path);
  if (!image) throw new Error(`Missing picture ${path}`);
  return image;
}

/** A screenshot from src/assets/screenshots, by file name. */
export function screenshot(name: string): ImageMetadata {
  const image = byName.get(name);
  if (!image) throw new Error(`Missing screenshot ${name}`);
  return image;
}
