import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ulinaaron.github.io",
  base: "/rivet-web",
  trailingSlash: "always",
  compressHTML: true,
  server: {
    host: "0.0.0.0",
    port: 43123,
  },
});
