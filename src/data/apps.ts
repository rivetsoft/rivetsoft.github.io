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
}

export const apps: AppEntry[] = [
  {
    slug: "files",
    name: "Rivet Files",
    status: "released",
    nav: true,
    navLabel: "Files",
    template: "files",
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
    summary:
      "Early alpha. A dual-pane SFTP, FTP, and FTPS client. The window is also the connection manager for the command line. No release yet.",
  },
  {
    slug: "notes",
    name: "Rivet Notes",
    status: "alpha",
    nav: true,
    navLabel: "Notes",
    template: "notes",
    summary:
      "Early alpha. Markdown notes in plain folders: vaults, properties, and browsing by folder or tag. No release yet.",
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
