import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

function codeTheme(name) {
  return JSON.parse(readFileSync(new URL(`./src/styles/${name}`, import.meta.url), "utf8"));
}

export default defineConfig({
  site: "https://rivetsoft.github.io",
  base: "/",
  trailingSlash: "always",
  compressHTML: true,
  server: {
    host: "0.0.0.0",
    port: 43123,
  },
  integrations: [
    starlight({
      title: "Rivetsoft",
      description:
        "Notes on Rivet Shell, Rivet Welcome, and the apps. Each one also runs on its own.",
      favicon: "/rivet-mark.svg",
      logo: {
        src: "./public/rivet-files.svg",
        alt: "Rivetsoft",
      },
      customCss: ["./src/styles/starlight.css"],
      expressiveCode: {
        themes: [codeTheme("rivet-code-dark.json"), codeTheme("rivet-code-light.json")],
        minSyntaxHighlightingColorContrast: 0,
      },
      components: {
        Header: "./src/components/DocsHeader.astro",
        Footer: "./src/components/DocsFooter.astro",
        Head: "./src/components/DocsHead.astro",
      },
      lastUpdated: false,
      pagefind: true,
      disable404Route: true,
      head: [
        {
          tag: "script",
          attrs: {
            defer: true,
            src: "https://analytics.stevenswebhosting.com/script.js",
            "data-website-id": "6e7cbc54-64b7-4cc5-9304-d5c2dc7a08a0",
            "data-domains": "rivetsoft.github.io",
          },
        },
      ],
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "What Rivetsoft is", link: "/docs/" },
            { label: "Install", link: "/docs/getting-started/install/" },
            { label: "Shell or standalone", link: "/docs/getting-started/on-your-own/" },
            { label: "How colors work", link: "/docs/colors/" },
          ],
        },
        {
          label: "Shell",
          items: [
            { label: "Rivet Shell", link: "/docs/shell/" },
            { label: "Plugins and hooks", link: "/docs/shell/plugins/" },
          ],
        },
        {
          label: "Softcore",
          items: [
            { label: "Softcore", link: "/docs/softcore/" },
            { label: "Settings", link: "/docs/softcore/settings/" },
            { label: "Keys and chords", link: "/docs/softcore/keys/" },
            { label: "Windows and workspaces", link: "/docs/softcore/layout/" },
            { label: "Rules", link: "/docs/softcore/rules/" },
            { label: "Talking to it", link: "/docs/softcore/msg/" },
            { label: "What isn't built yet", link: "/docs/softcore/status/" },
          ],
        },
        { label: "Welcome", items: [{ label: "Rivet Welcome", link: "/docs/welcome/" }] },
        { label: "Files", items: [{ label: "Rivet Files", link: "/docs/files/" }] },
        { label: "FTP", items: [{ label: "Rivet FTP", link: "/docs/ftp/" }] },
        { label: "Notes", items: [{ label: "Rivet Notes", link: "/docs/notes/" }] },
        { label: "Edit", items: [{ label: "Rivet Edit", link: "/docs/edit/" }] },
        { label: "Terminal", items: [{ label: "Rivet Terminal", link: "/docs/terminal/" }] },
        { label: "Color", items: [{ label: "Rivet Color", link: "/docs/color/" }] },
        { label: "Snip", items: [{ label: "Rivet Snip", link: "/docs/snip/" }] },
        { label: "Vice", items: [{ label: "Rivet Vice", link: "/docs/vice/" }] },
        { label: "Calendar", items: [{ label: "Rivet Calendar", link: "/docs/calendar/" }] },
        { label: "Fetch", items: [{ label: "Rivet Fetch", link: "/docs/fetch/" }] },
      ],
    }),
    sitemap(),
  ],
});
