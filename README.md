# Rivet

A small static site for [Rivet](https://github.com/ulinaaron/rivet-files), Aaron Mazade's family of Linux desktop apps.

Rivet Files is the file manager and has a full page. Rivet FTP (working name) is in progress. A notes app and a calculator are only maybes. Facts on the pages come from the public repository (README, changelog, releases, docs, and install script) at commit `3165535f6726a622f79140e704b52b8f6beb7211`. Screenshots are copied from `docs/screenshots` in that commit. Rivet FTP has no screenshot in the repo, so its page says so.

## Run

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

App entries live in `src/data/apps.ts`.

- A maybe, with no page of its own beyond one sentence: set `status` to `"someday"`, `nav` to `false`, and `laterPhrase` to a short noun phrase ("a notes app"). The home page lists it in the quiet line, and `/your-slug/` shows `summary`.
- A real app with a short page: set `status` to `"available"` or `"in-progress"`, `nav` to `true`, and an optional `navLabel`. Leave `template` unset. The page shows the name and summary.
- A real app with a long page: add a component under `src/bodies/`, register it in `src/pages/[slug].astro`, and set `template` to that key.

Put screenshots in `public/screenshots/`, add their width and height to `src/data/shots.json`, and use the `Shot` component. If you do not have a picture, do not draw a fake window. Say "Screenshot coming".

## What the Rivet Files README does not quite match

Checked against the repository, not guessed.

- `utilities/lib/install.sh` installs a user-local binary, desktop entry, and icons. It accepts `--default`. It has no uninstall flag. Preferences, System, App launcher, Remove deletes the desktop entry and the SVG icon only.
- Release downloads are 0.6.0. The changelog on main still marks split view, custom actions, wider thumbnails, and copying files to other programs as unreleased.
- Notes and a calculator are not in the repository.
- Rivet FTP has no screenshot, no tagged release, and FTP/FTPS cannot be opened yet.
- Flatpak and the AUR packages are prepared in the repo and not published to Flathub or the AUR.
