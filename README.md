# Rivetsoft

A small static site for [Rivetsoft](https://github.com/rivetsoft/apps), Aaron Mazade's family of Linux desktop apps.

The built site is served at [https://rivetsoft.github.io/](https://rivetsoft.github.io/). Astro's `base` is `/`.

Versions and downloads are read from the [GitHub Releases](https://github.com/rivetsoft/apps/releases) of `rivetsoft/apps` when the site is built. Drafts are skipped. The newest release for each app is kept, including pre-releases. Every app page's download block, the badges, and the install guide's links and commands come from that data; no page names a version. If the API is unreachable, the build uses `src/data/releases.fallback.json` and still succeeds. Saved releases dated in the future are left out, so a copy prepared before a release cannot link to files that are not up yet.

`npm run releases:snapshot` replaces `releases.fallback.json` with the published releases on GitHub (it uses `GITHUB_TOKEN`, `GH_TOKEN` or `gh auth token` when there is one). `RIVET_RELEASES_API` points the build and the script at another address, for example an unreachable one to try the saved copy.

Rivet Files, Rivet FTP, Rivet Notes, Rivet Edit, Rivet Terminal, Rivet Shell, Rivet Welcome, Rivet Snip, Rivet Vice, Rivet Calendar, and rivetfetch are on the site. Rivet Color's releases are read too, for the install guide, until it has a page. The home page leads with the shell, then Welcome as the installer. Facts come from the public repository. Screenshots are copied from `docs/screenshots`. The Notes, FTP, Edit, and Terminal pictures are recompressed RGB copies of those files.

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

## Releasing: what the site needs

A release in `rivetsoft/apps` needs nothing changed here when it follows the usual shape:

- The tag is `vX.Y.Z` for Rivet Files and `rivet-<app>-vX.Y.Z` for every other app, matching a `tagPrefixes` entry in `src/data/apps.ts`. The pre-release flag sets the badge: Released or Alpha.
- The assets are `<dist>-X.Y.Z-x86_64-linux.tar.gz` (the portable build with `install.sh`, which Rivet Welcome installs) and `<Title_With_Underscores>-X.Y.Z-x86_64.AppImage`, each with a `.sha256`. "Source code" links are GitHub's archives at the tag.
- The body is the changelog section, then an `### Install` block. It shows as the release notes.

Drafts are invisible to the build, so publish the release first, then rebuild the site:

```sh
gh workflow run deploy.yml -R rivetsoft/rivetsoft.github.io
```

The hourly build picks it up anyway. Then run `npm run releases:snapshot` and commit the result, so the saved copy is current. A first release of a new app also needs its entry in `src/data/apps.ts`; an app with releases but no page yet goes in `pagelessApps` there, so the install guide still lists it.

Put screenshots in `public/screenshots/`, add their width and height to `src/data/shots.json`, and use the `Shot` component. If you do not have a picture, do not draw a fake window. Say "Screenshot coming".
