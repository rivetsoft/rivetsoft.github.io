import { defineConfig } from "astro/config";

export default defineConfig({
  trailingSlash: "always",
  compressHTML: true,
  server: {
    host: "0.0.0.0",
    port: 43123,
  },
});
