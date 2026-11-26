import { screenshot } from "./shots";
import type { Pic } from "../components/AppPage.astro";

/** A screenshot from src/assets/screenshots, for an app's marketing page. */
export function shotPic(name: string, alt: string): Pic {
  return { img: screenshot(name), alt };
}
