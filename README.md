# Rivetsoft

A small static site for [Rivetsoft](https://github.com/rivetsoft/apps), Aaron Mazade's family of Linux desktop apps.

The built site is served at [https://rivetsoft.github.io/](https://rivetsoft.github.io/). Astro's `base` is `/`.

Versions and downloads are read from the [GitHub Releases](https://github.com/rivetsoft/apps/releases) of `rivetsoft/apps` when the site is built. Drafts are skipped. The newest release for each app is kept, including pre-releases. If the API is unreachable, the build uses `src/data/releases.fallback.json` and still succeeds.

Rivet Files, Rivet FTP, Rivet Notes, Rivet Edit, Rivet Terminal, Rivet Shell, and Rivet Welcome are on the site. The home page leads with the shell, then Welcome as the installer. Facts come from the public repository. Screenshots are copied from `docs/screenshots`. The Notes, FTP, Edit, and Terminal pictures are recompressed RGB copies of those files.

The Plugins page lists Rivet Shell's plugins. The official ones are the folders of `apps/rivet-shell/data/plugins` in `rivetsoft/apps`, read when the site is built; `src/data/plugins.ts` keeps a saved copy for when GitHub is unreachable. The shared ones are read from [`plugins/registry.json`](https://github.com/rivetsoft/apps/blob/main/plugins/registry.json) in `rivetsoft/apps` when the site is built, so a listing merged there shows on the next build. Each shared plugin's version comes from its author's release file, read at the same time. If the list is unreachable, the build uses `src/data/plugins.fallback.json`.

The docs page Plugins and hooks (`src/content/docs/docs/shell/plugins.md`) is `apps/rivet-shell/PLUGINS.md` from `rivetsoft/apps` with site links. When that file changes, change the page to match.

## What goes where

- **The site's own pages** (home, the app pages, Plugins, blog) are marketing: what each app is and does, with pictures. No how-tos, no key bindings, no commands or file paths.
- **The docs** (`src/content/docs`) are the how-tos: steps, keys, commands, settings and where files are kept.
- **Downloads and install steps** can be in both.



Node.js 22 or newer.

```sh
npm install
npm run dev
```

The dev server listens on port 43123.

```sh
npm run build
```

The build writes `dist/`. `npm run preview` serves that folder, also on port 43123.

## Add an app

App entries live in `src/data/apps.ts`. A new app needs a `tagPrefixes` entry, for example `rivet-notes-v` for tags `rivet-notes-v0.1.0`. Rivet Files also accepts bare tags such as `v0.6.0`. The badge follows the newest matching release: a final release is Released, a pre-release is Alpha, and no release is "No release yet". Set `laterPhrase` for an idea that should stay "Maybe later" until a tag exists.

- Set `nav` and an optional `navLabel` to show it in the header.
- A short page needs no template: `/your-slug/` shows the name, summary, and release.
- A long page is a component under `src/bodies/`, registered in `src/pages/[slug].astro`, with `template` set to that key.

The site rebuilds on every push to `main`, from Actions' Run workflow button, from a `repository_dispatch` of type `rivet-release`, and hourly. The build sends `GITHUB_TOKEN` to the GitHub API when Actions provides it.

Put screenshots in `public/screenshots/`, add their width and height to `src/data/shots.json`, and use the `Shot` component. If you do not have a picture, do not draw a fake window. Say "Screenshot coming".
