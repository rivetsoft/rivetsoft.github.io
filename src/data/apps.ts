export type AppStatus = "released" | "alpha" | "unreleased" | "someday";

export interface AppEntry {
  /** Route slug. The page is /{slug}/ */
  slug: string;
  name: string;
  /**
   * GitHub release tag prefixes. The longest match wins.
   * "v" matches only a bare tag such as v0.6.0, not rivet-notes-v0.1.0.
   */
  tagPrefixes: readonly string[];
  /** Included in the header. */
  nav: boolean;
  /** Short header label. Defaults to the name. */
  navLabel?: string;
  /** Home index and generic page. Also the meta description. */
  summary: string;
  /** Set when this is an idea, not an app in the repository yet. */
  laterPhrase?: string;
  /** Which long page to render. Omit for the short generic page. */
  template?: "files" | "ftp" | "notes";
  /** Home-card screenshot in public/screenshots. */
  cardShot?: string;
  cardAlt?: string;
  cardCaption?: string;
  /** Icon in public/, used on the app page. */
  icon?: string;
  /** README path inside the rivet-apps repository. */
  readme?: string;
  /** Shell lines shown on the short page. */
  source?: string;
}

export const repoUrl = "https://github.com/ulinaaron/rivet-apps";
export const allReleasesUrl = `${repoUrl}/releases`;

export const apps: AppEntry[] = [
  {
    slug: "files",
    name: "Rivet Files",
    tagPrefixes: ["rivet-files-v", "v"],
    nav: true,
    navLabel: "Files",
    template: "files",
    cardShot: "icons-wide.png",
    icon: "rivet-files.svg",
    readme: "apps/rivet-files/README.md",
    summary: "A Linux file manager in Rust and egui, with no GTK or Qt.",
  },
  {
    slug: "ftp",
    name: "Rivet FTP",
    tagPrefixes: ["rivet-ftp-v"],
    nav: true,
    navLabel: "FTP",
    template: "ftp",
    cardShot: "ftp-connected-wide.png",
    icon: "rivet-ftp.svg",
    readme: "apps/rivet-ftp/README.md",
    summary:
      "Dual-pane SFTP, with a transfer queue and saved connections the command line can use. FTP and FTPS are not built yet.",
  },
  {
    slug: "notes",
    name: "Rivet Notes",
    tagPrefixes: ["rivet-notes-v"],
    nav: true,
    navLabel: "Notes",
    template: "notes",
    cardShot: "notes-live-wide.png",
    icon: "rivet-notes.svg",
    readme: "apps/rivet-notes/README.md",
    summary:
      "Markdown notes in plain folders: live editing, links, properties, and a todos list or board.",
  },
  {
    slug: "edit",
    name: "Rivet Edit",
    tagPrefixes: ["rivet-edit-v"],
    nav: true,
    navLabel: "Edit",
    cardShot: "edit-editor-wide.png",
    cardAlt: "Rivet Edit with a Rust project open",
    cardCaption: "Rivet Edit with a Rust project open. Screenshot from the repository.",
    icon: "rivet-edit.svg",
    readme: "apps/rivet-edit/README.md",
    summary:
      "A lightweight code editor: open a folder or single files, tree-sitter colors for a dozen languages, and Go to File and Commands on the same quick panel as the other apps.",
    source: `cargo build --release -p rivet-edit
./target/release/rivet-edit [FOLDER] [FILE...]
./target/release/rivet-edit --install-desktop-entry`,
  },
  {
    slug: "terminal",
    name: "Rivet Terminal",
    tagPrefixes: ["rivet-terminal-v"],
    nav: true,
    navLabel: "Terminal",
    cardShot: "rivet-terminal-wide.png",
    cardAlt: "Rivet Terminal with three panes",
    cardCaption: "Rivet Terminal with three panes. Screenshot from the repository.",
    icon: "rivet-terminal.svg",
    readme: "apps/rivet-terminal/README.md",
    summary:
      "A terminal with tabs and split panes in layouts (Tall, Fat, Grid, Side by Side, Stacked), in the desktop's colors or any of Rivet Edit's color themes. Its keys use Ctrl+Shift, so plain Ctrl+letters reach your programs.",
    source: `cargo build --release -p rivet-terminal
./target/release/rivet-terminal
./target/release/rivet-terminal -d ~/projects
./target/release/rivet-terminal --install-desktop-entry`,
  },
];

export const navApps = apps.filter((app) => app.nav);

export const statusLabel: Record<AppStatus, string> = {
  released: "Released",
  alpha: "Alpha",
  unreleased: "No release yet",
  someday: "Maybe later",
};

export function appBySlug(slug: string): AppEntry {
  const app = apps.find((entry) => entry.slug === slug);
  if (!app) throw new Error(`Unknown app ${slug}`);
  return app;
}

/** A published release wins. A pre-release is alpha. An idea with no release stays "someday". */
export function statusFor(app: AppEntry, release: { prerelease: boolean } | undefined): AppStatus {
  if (release) return release.prerelease ? "alpha" : "released";
  if (app.laterPhrase) return "someday";
  return "unreleased";
}
