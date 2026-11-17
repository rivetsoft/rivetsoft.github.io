export type AppStatus = "released" | "alpha" | "someday";

export interface AppEntry {
  /** Route slug. The page is /{slug}/ */
  slug: string;
  name: string;
  status: AppStatus;
  /** Included in the header. */
  nav: boolean;
  /** Short header label. Defaults to the name. */
  navLabel?: string;
  /** Home index and generic page. Also the meta description. */
  summary: string;
  /** Quiet home-page phrase for status "someday". */
  laterPhrase?: string;
  /** Which long page to render. Omit for the short generic page. */
  template?: "files" | "ftp" | "notes";
  /** Home-card screenshot in public/screenshots. */
  cardShot?: string;
}

export const apps: AppEntry[] = [
  {
    slug: "files",
    name: "Rivet Files",
    status: "released",
    nav: true,
    navLabel: "Files",
    template: "files",
    cardShot: "icons-wide.png",
    summary:
      "A Linux file manager in Rust and egui, with no GTK or Qt. The latest download is 0.6.0.",
  },
  {
    slug: "ftp",
    name: "Rivet FTP",
    status: "alpha",
    nav: true,
    navLabel: "FTP",
    template: "ftp",
    cardShot: "ftp-connected-wide.png",
    summary:
      "Early alpha. Dual-pane SFTP, with a transfer queue and saved connections the command line can use. FTP and FTPS are not built yet. 0.1.0 is a pre-release.",
  },
  {
    slug: "notes",
    name: "Rivet Notes",
    status: "alpha",
    nav: true,
    navLabel: "Notes",
    template: "notes",
    cardShot: "notes-live-wide.png",
    summary:
      "Early alpha. Markdown notes in plain folders: live editing, links, properties, and a todos list or board. 0.1.0 is a pre-release.",
  },
  {
    slug: "calculator",
    name: "Calculator",
    status: "someday",
    nav: false,
    laterPhrase: "a calculator",
    summary:
      "Maybe later. A calculator is not in the repository, so there is nothing to install and no feature list.",
  },
];

export const navApps = apps.filter((app) => app.nav);

export const release = {
  version: "0.6.0",
  date: "15 November 2026",
  page: "https://github.com/ulinaaron/rivet-apps/releases/tag/v0.6.0",
  repo: "https://github.com/ulinaaron/rivet-apps",
  commit: "3165535f6726a622f79140e704b52b8f6beb7211",
  base: "https://github.com/ulinaaron/rivet-apps/releases/download/v0.6.0",
  appImage: "Rivet_Files-0.6.0-x86_64.AppImage",
  archive: "rivet-files-0.6.0-x86_64-linux.tar.gz",
  flatpak: "rivet-files.flatpak",
} as const;

const repo = "https://github.com/ulinaaron/rivet-apps";

export const notesRelease = {
  version: "0.1.0",
  date: "17 November 2026",
  page: `${repo}/releases/tag/rivet-notes-v0.1.0`,
  base: `${repo}/releases/download/rivet-notes-v0.1.0`,
  archive: "rivet-notes-0.1.0-x86_64-linux.tar.gz",
  repo,
} as const;

export const ftpRelease = {
  version: "0.1.0",
  date: "17 November 2026",
  page: `${repo}/releases/tag/rivet-ftp-v0.1.0`,
  base: `${repo}/releases/download/rivet-ftp-v0.1.0`,
  archive: "rivet-ftp-0.1.0-x86_64-linux.tar.gz",
  repo,
} as const;
