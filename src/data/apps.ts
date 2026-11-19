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
  /** One line for the Apps menu. */
  line: string;
  /** Home index and generic page. Also the meta description. */
  summary: string;
  /** Set when this is an idea, not an app in the repository yet. */
  laterPhrase?: string;
  /** Which long page to render. Omit for the short generic page. */
  template?: "files" | "ftp" | "notes" | "shell" | "edit";
  /** Home-card screenshot in public/screenshots. */
  cardShot?: string;
  cardAlt?: string;
  cardCaption?: string;
  /** Icon in public/, used on the app page. */
  icon?: string;
  /** README path inside the rivet-apps repository. */
  readme?: string;
  /** Short facts for the generic page. */
  points?: readonly string[];
  /** Shell lines shown on the short page. */
  source?: string;
  /** Home page placement. Other apps stay in the grid. */
  spotlight?: "shell" | "welcome";
  /** schema.org applicationCategory. */
  applicationCategory: string;
}

export const repoUrl = "https://github.com/ulinaaron/rivet-apps";
export const allReleasesUrl = `${repoUrl}/releases`;

export const apps: AppEntry[] = [
  {
    slug: "shell",
    name: "Rivet Shell",
    line: "A Wayland desktop shell: panel, dock, launcher and wallpaper.",
    tagPrefixes: ["rivet-shell-v"],
    nav: true,
    navLabel: "Shell",
    spotlight: "shell",
    template: "shell",
    applicationCategory: "DesktopApplication",
    cardShot: "shell-wide.jpg",
    cardAlt: "Rivet Shell over a sunset wallpaper, with a Rivet Files window in front",
    cardCaption: "Rivet Shell, with Rivet Files open over the wallpaper.",
    icon: "rivet-shell.svg",
    readme: "apps/rivet-shell/README.md",
    summary:
      "A Wayland desktop shell: panel, dock, launcher, quick settings, notifications, widgets and wallpaper. It colors the desktop from the wallpaper with matugen. Needs a layer-shell compositor (niri, Hyprland, Sway and others, not GNOME).",
    points: [
      "A panel with workspaces, the focused window, clock, volume, battery, notifications and a power menu. Top or bottom, floating or edge to edge.",
      "A dock of pinned apps, then open ones. A dot shows when a window is open. Files, Terminal, Edit and Notes start pinned.",
      "A launcher that searches installed apps.",
      "Wallpaper on every screen. matugen colors the desktop from that picture, and the Rivet apps follow it.",
      "A settings window for wallpaper, colors, panels, dock, widgets and notifications.",
    ],
    source: `cargo build --release -p rivet-shell
./target/release/rivet-shell
./target/release/rivet-shell settings
./target/release/rivet-shell --install-desktop-entry`,
  },
  {
    slug: "welcome",
    name: "Rivet Welcome",
    line: "Installs and updates the shell and the apps.",
    tagPrefixes: ["rivet-welcome-v"],
    nav: true,
    navLabel: "Welcome",
    spotlight: "welcome",
    applicationCategory: "UtilitiesApplication",
    cardShot: "welcome-wide.png",
    cardAlt: "Rivet Welcome with two updates and an install under way",
    cardCaption: "Rivet Welcome, with updates and an install under way.",
    icon: "rivet-welcome.svg",
    readme: "apps/rivet-welcome/README.md",
    summary:
      "Optional. Installs and updates Rivet Shell and the apps from their GitHub releases, and looks for new versions from a tray icon. Every app can still be installed from its own release.",
    points: [
      "Lists Files, Notes, Edit, Terminal, FTP, Shell and Welcome, with Install, Update, Open or Remove. A later app with a rivet-something-v tag and a Linux archive shows up too.",
      "Downloads the archive for this computer, checks the published sha256, and runs install.sh. The program goes in ~/.local/bin. No password.",
      "An app installed by a package (AUR, a distribution, a build in /usr/local/bin) is shown and left alone.",
      "A tray icon checks at sign-in and on a schedule. It works with Rivet Shell, KDE, waybar and other StatusNotifierItem trays.",
    ],
    source: `cargo build --release -p rivet-welcome
./target/release/rivet-welcome --install-desktop-entry
./target/release/rivet-welcome`,
  },
  {
    slug: "files",
    name: "Rivet Files",
    line: "A Linux file manager, with no GTK or Qt.",
    tagPrefixes: ["rivet-files-v", "v"],
    nav: true,
    navLabel: "Files",
    template: "files",
    applicationCategory: "UtilitiesApplication",
    cardShot: "icons-wide.png",
    icon: "rivet-files.svg",
    readme: "apps/rivet-files/README.md",
    summary: "A Linux file manager in Rust and egui, with no GTK or Qt.",
  },
  {
    slug: "ftp",
    name: "Rivet FTP",
    line: "Dual-pane SFTP, with a transfer queue.",
    tagPrefixes: ["rivet-ftp-v"],
    nav: true,
    navLabel: "FTP",
    template: "ftp",
    applicationCategory: "UtilitiesApplication",
    cardShot: "ftp-connected-wide.png",
    icon: "rivet-ftp.svg",
    readme: "apps/rivet-ftp/README.md",
    summary:
      "Dual-pane SFTP, with a transfer queue and saved connections the command line can use. FTP and FTPS are not built yet.",
  },
  {
    slug: "notes",
    name: "Rivet Notes",
    line: "Markdown notes in plain folders.",
    tagPrefixes: ["rivet-notes-v"],
    nav: true,
    navLabel: "Notes",
    template: "notes",
    applicationCategory: "ProductivityApplication",
    cardShot: "notes-live-wide.png",
    icon: "rivet-notes.svg",
    readme: "apps/rivet-notes/README.md",
    summary:
      "Markdown notes in plain folders: live editing, links, properties, and a todos list or board.",
  },
  {
    slug: "edit",
    name: "Rivet Edit",
    line: "A lightweight code editor for folders and files.",
    tagPrefixes: ["rivet-edit-v"],
    nav: true,
    navLabel: "Edit",
    template: "edit",
    applicationCategory: "DeveloperApplication",
    cardShot: "edit-editor-wide.png",
    cardAlt: "Rivet Edit with a Rust project open",
    cardCaption: "Rivet Edit with a Rust project open.",
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
    line: "A terminal with tabs and split panes.",
    tagPrefixes: ["rivet-terminal-v"],
    nav: true,
    navLabel: "Terminal",
    applicationCategory: "DeveloperApplication",
    cardShot: "rivet-terminal-wide.png",
    cardAlt: "Rivet Terminal with three panes",
    cardCaption: "Rivet Terminal with three panes.",
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

/** Released first, then alpha, then anything still unpublished. Original order is kept inside a state. */
const statusRank: Record<AppStatus, number> = {
  released: 0,
  alpha: 1,
  unreleased: 2,
  someday: 3,
};

export function byReleaseStatus<T extends { status: AppStatus }>(items: readonly T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => statusRank[a.item.status] - statusRank[b.item.status] || a.index - b.index)
    .map(({ item }) => item);
}
