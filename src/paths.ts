/** Site root with a trailing slash. Follows Astro's `base`. */
export const baseUrl = import.meta.env.BASE_URL;

/** Prefix a site path so it works under GitHub Pages. */
export function url(path = ""): string {
  return `${baseUrl}${path.replace(/^\/+/, "")}`;
}
