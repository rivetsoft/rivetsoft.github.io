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
  /** The command it installs, when it is not rivet-{slug}. */
  program?: string;
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
  template?: "files" | "ftp" | "notes" | "shell" | "softcore" | "edit" | "terminal" | "welcome" | "color";
  /** Home-card screenshot in public/screenshots. */
  cardShot?: string;
  cardAlt?: string;
  cardCaption?: string;
  /** Icon in public/, used on the app page. */
  icon?: string;
  /** README path inside the rivet-apps repository. */
  readme?: string;
  /** A repository of its own, when it is not part of rivetsoft/apps. */
  repo?: string;
  /** Three short points for the home page, each with the throwback picture that is its bullet. */
  homePoints?: readonly { icon: string; text: string }[];
  /** Short facts for the generic page. */
  points?: readonly string[];
  /** Shell lines shown on the short page. */
  source?: string;
  /** Home page placement. Other apps stay in the grid. */
  spotlight?: "shell" | "welcome";
  /** schema.org applicationCategory. */
  applicationCategory: string;
}

export const repoUrl = "https://github.com/rivetsoft/apps";
export const allReleasesUrl = `${repoUrl}/releases`;
/** Softcore's repository. It moves to github.com/rivetsoft/softcore: change it here. */
export const softcoreRepoUrl = "https://github.com/ulinaaron/softcore";

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
    cardAlt: "Rivet Shell: the panel, widgets and dock over a wallpaper",
    cardCaption: "Rivet Shell: the panel, widgets and dock over the wallpaper.",
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
    slug: "softcore",
    template: "softcore",
    name: "Softcore",
    line: "A scrolling Wayland compositor that feels oh so good.",
    tagPrefixes: [],
    nav: true,
    applicationCategory: "DesktopApplication",
    cardShot: "softcore-wide.jpg",
    cardAlt: "Softcore with three columns of windows on a strip that runs off both sides of the screen, under Rivet Shell's panel",
    cardCaption: "Softcore, with windows running off both sides.",
    icon: "softcore.svg",
    repo: softcoreRepoUrl,
    homePoints: [
      { icon: "squiggle", text: "Scroll side to side, or up and down" },
      { icon: "cassette", text: "Tabs, floats and scratchpads" },
      { icon: "yinyang", text: "Built in Rust with Smithay" },
    ],
    summary:
      "A scrolling Wayland compositor for the Rivet desktop, built in Rust with Smithay. Scroll side to side or up and down, with workspaces per display, tabs, floating windows, an overview and chords. It is early, with no release yet.",
  },
  {
    slug: "welcome",
    template: "welcome",
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
      "Lists every Rivet app, with Install, Update, Open or Remove. A later app with a rivet-something-v tag and a Linux archive shows up too.",
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
    homePoints: [
      { icon: "floppy", text: "Icons, list, compact and Miller columns" },
      { icon: "eye", text: "Peek: previews for images, video and code" },
      { icon: "pager", text: "Terminal mode: monospace, Nerd Font icons, boxed panels" },
      { icon: "alien", text: "A file picker for the whole desktop, over xdg-desktop-portal" },
    ],
    name: "Rivet Files",
    line: "A Linux file manager, with no GTK or Qt.",
    tagPrefixes: ["rivet-files-v", "v"],
    program: "rivet",
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
    homePoints: [
      { icon: "cd", text: "A classic two-pane experience" },
      { icon: "eightball", text: "Bring your GUI connections into the terminal" },
    ],
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
    homePoints: [
      { icon: "cassette", text: "Live Markdown in plain folders" },
      { icon: "yinyang", text: "Bi-directional links between notes" },
      { icon: "tamagotchi", text: "Daily notes" },
      { icon: "checkbox", text: "Todos as a list or a kanban board" },
    ],
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
    homePoints: [
      { icon: "bolt", text: "Tree-sitter and LSP" },
      { icon: "lavalamp", text: "Built-in color schemes" },
      { icon: "globe", text: "Full find and replace" },
      { icon: "die", text: "VS Code-like default key bindings" },
      { icon: "flame", text: "Vim key bindings, optional" },
    ],
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
    template: "terminal",
    homePoints: [
      { icon: "hourglass", text: "Alacritty, wrapped cutely in rivets" },
      { icon: "squiggle", text: "Tabs, panes, detach and re-attach" },
    ],
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
  {
    slug: "color",
    template: "color",
    homePoints: [
      { icon: "eye", text: "A loupe over the held-still screen" },
      { icon: "lavalamp", text: "Shades, harmonies and contrast" },
      { icon: "floppy", text: "Palettes GIMP, Inkscape and Krita open" },
    ],
    name: "Rivet Color",
    line: "A color picker, with shades, harmonies and palettes.",
    tagPrefixes: ["rivet-color-v"],
    nav: true,
    navLabel: "Color",
    applicationCategory: "DesignApplication",
    cardShot: "rivet-color-wide.png",
    cardAlt: "Rivet Color with a picked color, its shades and harmonies",
    cardCaption: "Rivet Color with a picked color.",
    icon: "rivet-color.svg",
    readme: "apps/rivet-color/README.md",
    summary:
      "A color picker: pick a color from anywhere on the screen with a loupe, and it's copied in hex, RGB, HSL or OKLCH. Its shades, harmonies and contrast, a history, and palettes kept as GIMP palette files.",
    source: `cargo build --release -p rivet-color
./target/release/rivet-color
./target/release/rivet-color pick
./target/release/rivet-color --install-desktop-entry`,
  },
  {
    slug: "snip",
    name: "Rivet Snip",
    line: "Clip and mark up a screenshot.",
    tagPrefixes: ["rivet-snip-v"],
    nav: false,
    applicationCategory: "GraphicsApplication",
    cardShot: "rivet-snip-wide.png",
    cardAlt: "Rivet Snip with a screenshot marked up with an arrow, a box, numbered steps and blur",
    cardCaption: "Rivet Snip with a marked-up screenshot.",
    icon: "rivet-snip.svg",
    readme: "apps/rivet-snip/README.md",
    summary:
      "Clip and mark up a screenshot, then copy or save it: crop, arrows, boxes, text, numbered steps, and blur for what shouldn't be read.",
    points: [
      "Crop, then draw arrows, lines, boxes, ovals and freehand, highlight, type text and place numbered steps.",
      "Blur what shouldn't be read. The saved picture has squares of averaged color there, not a cover that could be lifted off.",
      "Marks can be moved, recolored and removed after they are drawn, with Undo and Redo.",
      "A compositor can hand it the picture it took. On any other desktop it takes the picture itself.",
    ],
  },
  {
    slug: "vice",
    name: "Rivet Vice",
    line: "An archive manager.",
    tagPrefixes: ["rivet-vice-v"],
    nav: false,
    applicationCategory: "UtilitiesApplication",
    cardShot: "rivet-vice-wide.png",
    cardAlt: "Rivet Vice inside a trip archive, with folders of photos, maps and notes and a dozen files",
    cardCaption: "Rivet Vice, looking inside an archive.",
    icon: "rivet-vice.svg",
    readme: "apps/rivet-vice/README.md",
    summary:
      "An archive manager: open an archive and walk through it folder by folder, take out all of it or some, and make new ones.",
    points: [
      "Zip, tar of every kind, 7z and more, using the archive tools the computer already has.",
      "Extract All into a folder you choose, or Extract Selected for only some rows. Nothing already there is written over.",
      "Make a zip, tar.gz, tar.xz, tar.zst or 7z from a folder, or from files dropped on the window.",
      "Rivet Files opens an archive in it from the right-click menu.",
    ],
  },
  {
    slug: "calendar",
    name: "Rivet Calendar",
    line: "A calendar in plain .ics folders.",
    tagPrefixes: ["rivet-calendar-v"],
    nav: false,
    applicationCategory: "ProductivityApplication",
    cardShot: "rivet-calendar-wide.png",
    cardAlt: "Rivet Calendar's month view, with work, family, personal and holiday calendars",
    cardCaption: "Rivet Calendar's month view.",
    icon: "rivet-calendar.svg",
    readme: "apps/rivet-calendar/README.md",
    summary:
      "A calendar kept in plain .ics folders, by month, week, day or as a list, with CalDAV, Google and Microsoft accounts and feeds to subscribe to.",
    points: [
      "Make, change and delete events, whole-day and repeating ones too, and change one occurrence or all of them.",
      "Plain folders that vdirsyncer and khal share.",
      "CalDAV (Nextcloud, Fastmail, iCloud, Radicale), Google and Microsoft accounts, synced both ways.",
      "Subscribe to a feed such as holidays or a webcal:// link.",
      "With Rivet Shell's Calendar plugin, the panel's calendar marks the days with events.",
    ],
  },
  {
    slug: "fetch",
    name: "Rivet Fetch",
    line: "rivetfetch: this computer at a glance in the terminal, beside the mascot.",
    tagPrefixes: ["rivet-fetch-v"],
    program: "rivetfetch",
    nav: false,
    applicationCategory: "UtilitiesApplication",
    cardShot: "rivet-fetch-wide.png",
    cardAlt: "rivetfetch in Rivet Terminal: the mascot beside the computer's OS, kernel, CPU, memory and Rivet apps",
    cardCaption: "rivetfetch in Rivet Terminal.",
    readme: "apps/rivet-fetch/README.md",
    summary:
      "A system summary in the terminal, beside Rivet the mascot, in the desktop's accent: OS, host, kernel, uptime, packages, shell, window manager, CPU, GPU and memory.",
    points: [
      "Screens, theme, disk, battery and the Rivet apps installed are there to add.",
      "Choose what to show and in what order, and the picture beside it: the mascot, none, or a fastfetch logo file.",
      "Every module runs at once, in about 30 ms.",
    ],
  },
];


/** Every app with releases, in the order the install guide lists them. */
export const releaseApps = apps.filter((app) => app.tagPrefixes.length > 0);

export function programFor(app: { slug: string; program?: string }): string {
  return app.program ?? `rivet-${app.slug}`;
}

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
