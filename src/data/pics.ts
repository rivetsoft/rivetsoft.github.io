import shots from "./shots.json";
import { url } from "../paths";
import type { Pic } from "../components/AppPage.astro";

const table = shots as Record<string, { w: number; h: number }>;

/** A screenshot from public/screenshots, with its size, for an app's marketing page. */
export function shotPic(name: string, alt: string): Pic {
  const meta = table[name];
  if (!meta) throw new Error(`Missing screenshot ${name}`);
  return { src: url(`screenshots/${name}`), w: meta.w, h: meta.h, alt };
}
