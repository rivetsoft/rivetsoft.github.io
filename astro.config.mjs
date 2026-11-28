import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

import { apps } from "./src/data/apps.ts";

// The docs sidebar's Apps section: every app the site lists that has a docs page, by name. The
// shell and Softcore have the Desktop section, and Welcome is with Getting started.
const notInApps = new Set(["shell", "softcore", "welcome"]);
const appDocs = apps
  .filter((app) => !notInApps.has(app.slug))
  .filter((app) => existsSync(new URL(`./src/content/docs/docs/${app.slug}/`, import.meta.url)))
  .map((app) => ({ label: app.name, link: `/docs/${app.slug}/` }))
  .sort((a, b) => a.label.localeCompare(b.label));

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
            { label: "Rivet Welcome", link: "/docs/welcome/" },
          ],
        },
        {
          label: "Desktop",
          items: [
            {
              label: "Rivet Shell",
              items: [
                { label: "Overview", link: "/docs/shell/" },
                { label: "Plugins and hooks", link: "/docs/shell/plugins/" },
                { label: "Clipboard history", link: "/docs/shell/clipboard/" },
              ],
            },
            {
              label: "Softcore",
              items: [
                { label: "Overview", link: "/docs/softcore/" },
                { label: "Settings", link: "/docs/softcore/settings/" },
                { label: "Keys and chords", link: "/docs/softcore/keys/" },
                { label: "Windows and workspaces", link: "/docs/softcore/layout/" },
                { label: "Rules", link: "/docs/softcore/rules/" },
                { label: "Talking to it", link: "/docs/softcore/msg/" },
                { label: "What isn't built yet", link: "/docs/softcore/status/" },
              ],
            },
          ],
        },
        { label: "Apps", items: [{ label: "Overview", link: "/docs/apps/" }, ...appDocs] },
      ],
    }),
    sitemap(),
  ],
});
