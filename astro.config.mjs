import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://ulinaaron.github.io",
  base: "/rivet-web",
  trailingSlash: "always",
  compressHTML: true,
  server: {
    host: "0.0.0.0",
    port: 43123,
  },
  integrations: [
    starlight({
      title: "Rivet",
      description:
        "Notes on Rivet Shell, Rivet Welcome, and the apps. Each one also runs on its own.",
      favicon: "/rivet-mark.svg",
      logo: {
        src: "./public/rivet-files.svg",
        alt: "Rivet",
      },
      customCss: ["./src/styles/starlight.css"],
      components: {
        Header: "./src/components/DocsHeader.astro",
        Footer: "./src/components/DocsFooter.astro",
        Head: "./src/components/DocsHead.astro",
      },
      lastUpdated: false,
      pagination: false,
      pagefind: false,
      disable404Route: true,
      head: [
        {
          tag: "script",
          attrs: {
            defer: true,
            src: "https://analytics.stevenswebhosting.com/script.js",
            "data-website-id": "6e7cbc54-64b7-4cc5-9304-d5c2dc7a08a0",
            "data-domains": "ulinaaron.github.io",
          },
        },
      ],
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "What Rivet is", link: "/docs/" },
            { label: "Install with Welcome", link: "/docs/getting-started/install/" },
            { label: "Shell, or on its own", link: "/docs/getting-started/on-your-own/" },
            { label: "How colors work", link: "/docs/colors/" },
          ],
        },
        { label: "Shell", items: [{ label: "Rivet Shell", link: "/docs/shell/" }] },
        { label: "Welcome", items: [{ label: "Rivet Welcome", link: "/docs/welcome/" }] },
        { label: "Files", items: [{ label: "Rivet Files", link: "/docs/files/" }] },
        { label: "FTP", items: [{ label: "Rivet FTP", link: "/docs/ftp/" }] },
        { label: "Notes", items: [{ label: "Rivet Notes", link: "/docs/notes/" }] },
        { label: "Edit", items: [{ label: "Rivet Edit", link: "/docs/edit/" }] },
        { label: "Terminal", items: [{ label: "Rivet Terminal", link: "/docs/terminal/" }] },
      ],
    }),
    sitemap(),
  ],
});
