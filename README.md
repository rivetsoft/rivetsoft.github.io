# Rivet

A small static site for [Rivet](https://github.com/ulinaaron/rivet-apps), Aaron Mazade's family of Linux desktop apps.

The built site is served at [https://ulinaaron.github.io/rivet-web/](https://ulinaaron.github.io/rivet-web/). Astro's `base` is `/rivet-web`.

Rivet Files is released (0.6.0). Rivet FTP and Rivet Notes are early alpha. Each has a 0.1.0 pre-release archive. A calculator is only a maybe. Facts come from the public repository. Screenshots are copied from `docs/screenshots`. The Notes and FTP pictures are recompressed RGB copies of those files.

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

- Set `status` to `"released"`, `"alpha"`, or `"someday"`. The home page card and its badge follow that field.
- Set `nav` and an optional `navLabel` to show it in the header.
- A short page needs no template: `/your-slug/` shows the name and summary.
- A long page is a component under `src/bodies/`, registered in `src/pages/[slug].astro`, with `template` set to that key.

Put screenshots in `public/screenshots/`, add their width and height to `src/data/shots.json`, and use the `Shot` component. If you do not have a picture, do not draw a fake window. Say "Screenshot coming".
