export type AppStatus = "released" | "alpha" | "unreleased" | "someday" | "soon";

/**
 * The home page's Apps section, one group per kind of app, in this order. The filter there has a
 * chip for each, and the group's heading wears its throwback picture.
 */
export const appCategories = [
  { id: "files", label: "Files and documents", icon: "floppy" },
  { id: "development", label: "Development", icon: "pager" },
  { id: "media", label: "Graphics and media", icon: "lavalamp" },
  { id: "organize", label: "Organize", icon: "checkbox" },
] as const;

export type AppCategory = (typeof appCategories)[number]["id"];

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
  /** Home-card screenshot in src/assets/screenshots. */
  cardShot?: string;
  cardAlt?: string;
  cardCaption?: string;
  /** Icon in public/, used on the app page. */
  icon?: string;
  /** Icon in public/ for the home page and the docs' Apps overview, when the app page shows none (Fetch's packaging icon). */
  homeIcon?: string;
  /**
   * The home page card's row of screenshots, which open large. Paths are inside src/assets
   * (screenshots/, shell/ or softcore/). Three at most; the first is the one people see first.
   */
  homeShots?: readonly { file: string; alt: string }[];
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
  /** Home page placement: the Desktop section (shell and compositor) or the Welcome band. Other apps go in the Apps section. */
  spotlight?: "desktop" | "welcome";
  /** The Apps section group. Every app without a spotlight needs one. */
  category?: AppCategory;
  /**
   * Kept off the site until its first release with real screenshots: no page, card, menu entry or
   * install guide line. Only allApps has it.
   */
  held?: boolean;
  /**
   * Shown with a Coming soon badge in its group, the menus and the docs' Apps overview, but with
   * no page, download, install line or version until its first release. Delete this line to
   * release it.
   */
  comingSoon?: boolean;
  /** schema.org applicationCategory. */
  applicationCategory: string;
}

export const repoUrl = "https://github.com/rivetsoft/apps";
export const allReleasesUrl = `${repoUrl}/releases`;
/** Softcore's repository, where its releases are too. */
export const softcoreRepoUrl = "https://github.com/rivetsoft/softcore";

/** Every app, held ones included. The site reads apps. */
export const allApps: AppEntry[] = [
  {
    slug: "shell",
    homeShots: [
      { file: "shell/launcher.jpg", alt: "The Rivet Shell launcher open over a sunset wallpaper, with the Rivet apps in a grid" },
      { file: "shell/quick-settings.jpg", alt: "Rivet Shell quick settings: volume, brightness, toggles, and what is playing" },
      { file: "shell/settings-appearance.jpg", alt: "Rivet Shell settings, Appearance page, with style, accent, and color use" },
    ],
    name: "Rivet Shell",
    line: "A Wayland desktop shell: panel, dock, launcher and wallpaper.",
    tagPrefixes: ["rivet-shell-v"],
    nav: true,
    navLabel: "Shell",
    spotlight: "desktop",
    template: "shell",
    applicationCategory: "DesktopApplication",
    cardShot: "shell-wide.jpg",
    cardAlt: "Rivet Shell: the panel, widgets and dock over a wallpaper",
    cardCaption: "Rivet Shell: the panel, widgets and dock over the wallpaper.",
    icon: "rivet-shell.svg",
    readme: "apps/rivet-shell/README.md",
    homePoints: [
      { icon: "lavalamp", text: "Colors the desktop from your wallpaper" },
      { icon: "globe", text: "Runs on niri, Hyprland and Sway too" },
      { icon: "cassette", text: "Plugins put apps on the panel and in the launcher" },
    ],
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
    homeShots: [
      { file: "softcore/overview.jpg", alt: "The Softcore overview, with two workspaces drawn at half size over the wallpaper" },
      { file: "softcore/tabs.jpg", alt: "A column in Softcore shown as tabs, with a strip across its top" },
      { file: "softcore/chords.jpg", alt: "A chord in Softcore: after Mod+G, a panel lists Terminal, Files, Edit, Notes and Internet with their keys" },
    ],
    template: "softcore",
    name: "Softcore",
    line: "A scrolling Wayland compositor that feels oh so good.",
    tagPrefixes: ["softcore-v"],
    program: "softcore",
    nav: true,
    spotlight: "desktop",
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
      "A scrolling Wayland compositor for the Rivet desktop, built in Rust with Smithay. Scroll side to side or up and down, with workspaces per display, tabs, floating windows, an overview and chords. It is early, and its releases are pre-releases.",
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
    homeShots: [
      { file: "screenshots/icons-wide.png", alt: "Rivet Files in the pink scheme, icon view of Home" },
      { file: "screenshots/peek-code-wide.png", alt: "The Peek panel showing highlighted Rust code" },
      { file: "screenshots/columns-wide.png", alt: "Rivet Files in Miller columns view" },
    ],
    category: "files",
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
    homeShots: [
      { file: "screenshots/ftp-connected-wide.png", alt: "Rivet FTP in the pink scheme, connected, with this computer and the server side by side" },
      { file: "screenshots/ftp-new-connection-wide.png", alt: "The New Connection window, with SFTP selected" },
      { file: "screenshots/ftp-light-wide.png", alt: "Rivet FTP in the light theme, with both panes showing the same site" },
    ],
    category: "development",
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
    homeShots: [
      { file: "screenshots/notes-live-wide.png", alt: "Rivet Notes in the pink scheme, live mode, with Peek open" },
      { file: "screenshots/notes-todos-board-wide.png", alt: "The Todos page as a board, with To do, In progress, and Done columns" },
      { file: "screenshots/notes-quick-open-wide.png", alt: "Quick Open matching a note from a few letters" },
    ],
    category: "organize",
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
    homeShots: [
      { file: "screenshots/edit-editor-wide.png", alt: "Rivet Edit with the hello-rivet folder open, the file tree on the left, and main.rs in the editor" },
      { file: "screenshots/edit-go-to-file-wide.png", alt: "Go to File in Rivet Edit, with a short search and matching paths" },
      { file: "screenshots/edit-light-wide.png", alt: "Rivet Edit in the light theme, with a JavaScript file open" },
    ],
    category: "development",
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
    homeShots: [
      { file: "screenshots/rivet-terminal-wide.png", alt: "Rivet Terminal with three panes" },
    ],
    category: "development",
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
    homeShots: [
      { file: "screenshots/rivet-color-wide.png", alt: "Rivet Color with a picked color, its shades and harmonies" },
    ],
    category: "media",
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
    homeShots: [
      { file: "screenshots/rivet-snip-wide.png", alt: "Rivet Snip with a screenshot marked up with an arrow, a box, numbered steps and blur" },
    ],
    homePoints: [
      { icon: "squiggle", text: "Arrows, boxes, text and numbered steps" },
      { icon: "eye", text: "Blur that can't be lifted off" },
      { icon: "cursor", text: "Takes the screenshot itself on any desktop" },
    ],
    category: "media",
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
    homeShots: [
      { file: "screenshots/rivet-vice-wide.png", alt: "Rivet Vice inside a trip archive, with folders of photos, maps and notes and a dozen files" },
    ],
    homePoints: [
      { icon: "cd", text: "Zip, tar, 7z and more" },
      { icon: "floppy", text: "Extract all of it, or only some" },
      { icon: "cassette", text: "Opens from Rivet Files' right-click menu" },
    ],
    category: "files",
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
    homeShots: [
      { file: "screenshots/rivet-calendar-wide.png", alt: "Rivet Calendar's month view, with work, family, personal and holiday calendars" },
    ],
    homePoints: [
      { icon: "die", text: "Month, week, day or a list" },
      { icon: "globe", text: "CalDAV, Google and Microsoft accounts" },
      { icon: "tamagotchi", text: "Plain folders that khal and vdirsyncer share" },
    ],
    category: "organize",
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
    homeShots: [
      { file: "screenshots/rivet-fetch-wide.png", alt: "rivetfetch in Rivet Terminal: the mascot beside the computer's OS, kernel, CPU, memory and Rivet apps" },
    ],
    homePoints: [
      { icon: "pager", text: "OS, CPU, GPU, memory and more" },
      { icon: "smiley", text: "Choose what shows, and in what order" },
      { icon: "bolt", text: "Every module at once, in about 30 ms" },
    ],
    homeIcon: "rivet-fetch.svg",
    category: "development",
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
  {
    slug: "longshot",
    category: "media",
    comingSoon: true,
    name: "Rivet Long Shot",
    line: "A picture viewer that steps through the folder in Rivet Files' order.",
    icon: "rivet-longshot.svg",
    homePoints: [
      { icon: "eye", text: "Zoom with the wheel, a pinch or a double-click" },
      { icon: "cd", text: "Turn a JPEG and keep every pixel" },
      { icon: "cassette", text: "Slideshows, camera details and animations" },
    ],
    homeShots: [
      { file: "screenshots/rivet-longshot-wide.png", alt: "Rivet Long Shot with a photo of a lake and its camera details" },
    ],
    tagPrefixes: ["rivet-longshot-v"],
    nav: false,
    applicationCategory: "MultimediaApplication",
    readme: "apps/rivet-longshot/README.md",
    summary:
      "A picture viewer: open a picture and step through its folder in Rivet Files' order, with zoom, turning, slideshows, camera details and animations.",
  },
  {
    slug: "reader",
    category: "files",
    comingSoon: true,
    name: "Rivet Reader",
    line: "A reader for PDFs, comic books and pictures.",
    icon: "rivet-reader.svg",
    homePoints: [
      { icon: "floppy", text: "One long scroll or a page at a time" },
      { icon: "eye", text: "Thumbnails, the outline and search" },
      { icon: "yinyang", text: "Dark pages in the desktop's colors" },
    ],
    homeShots: [
      { file: "screenshots/rivet-reader-wide.png", alt: "Rivet Reader reading a field guide, with the page thumbnails beside it" },
      { file: "screenshots/rivet-reader-comic-wide.png", alt: "Rivet Reader showing a comic a page at a time, with its pages down the side" },
      { file: "screenshots/rivet-reader-dark-wide.png", alt: "Rivet Reader with dark pages: a field guide's page on colors and wallpaper" },
    ],
    tagPrefixes: ["rivet-reader-v"],
    nav: false,
    applicationCategory: "UtilitiesApplication",
    readme: "apps/rivet-reader/README.md",
    summary:
      "A document reader for PDFs, comic books and pictures, continuous or a page at a time, with thumbnails, the outline, search, links, dark pages and the last page you read in each file.",
  },
  {
    slug: "cinema",
    category: "media",
    comingSoon: true,
    name: "Rivet Cinema",
    line: "A video and music player.",
    icon: "rivet-cinema.svg",
    homePoints: [
      { icon: "cd", text: "Files, folders and playlists in one queue" },
      { icon: "eye", text: "A frame from anywhere on the seek bar" },
      { icon: "hourglass", text: "Each file starts where you left it" },
    ],
    homeShots: [
      { file: "screenshots/rivet-cinema-wide.png", alt: "Rivet Cinema showing a video with its controls and the seek bar" },
      { file: "screenshots/rivet-cinema-queue-wide.png", alt: "Rivet Cinema with its queue open beside the video" },
      { file: "screenshots/rivet-cinema-music-wide.png", alt: "Rivet Cinema playing music, with the cover beside the queue" },
    ],
    tagPrefixes: ["rivet-cinema-v"],
    nav: false,
    applicationCategory: "MultimediaApplication",
    readme: "apps/rivet-cinema/README.md",
    summary:
      "A video and music player: a queue of files, folders and playlists, previews as you seek, tracks and subtitles, and it picks up where you left off.",
  },
  {
    slug: "greeter",
    spotlight: "desktop",
    comingSoon: true,
    name: "Rivet Greeter",
    line: "The login screen: Rivet Shell's lock screen, for greetd.",
    tagPrefixes: ["rivet-greeter-v"],
    nav: false,
    applicationCategory: "DesktopApplication",
    icon: "rivet-greeter.svg",
    readme: "apps/rivet-greeter/README.md",
    homePoints: [
      { icon: "lavalamp", text: "Your wallpaper and colors before you sign in" },
      { icon: "smiley", text: "Opens on whoever changed their wallpaper last" },
      { icon: "globe", text: "Runs in cage, Sway or Softcore" },
    ],
    homeShots: [
      { file: "screenshots/rivet-greeter-wide.png", alt: "Rivet Greeter: the time, who's signing in and the password field over a wallpaper" },
      { file: "screenshots/rivet-greeter-error-wide.png", alt: "Rivet Greeter after a wrong password, saying Caps Lock is on" },
    ],
    summary:
      "A login screen for greetd that looks like Rivet Shell's lock screen, over the wallpaper and in the colors each person chose last.",
  },
  {
    slug: "rivetctl",
    spotlight: "welcome",
    comingSoon: true,
    name: "rivetctl",
    line: "Installs and updates the apps from the terminal.",
    tagPrefixes: ["rivetctl-v"],
    program: "rivetctl",
    nav: false,
    applicationCategory: "UtilitiesApplication",
    icon: "rivetctl.svg",
    readme: "apps/rivetctl/README.md",
    homePoints: [
      { icon: "pager", text: "A full-screen list of every app, or one command at a time" },
      { icon: "bolt", text: "The same installs as Rivet Welcome, so they never disagree" },
      { icon: "tamagotchi", text: "Build an app from any branch, tag or commit" },
    ],
    homeShots: [
      { file: "screenshots/rivetctl-wide.png", alt: "rivetctl's list of the Rivet apps in Rivet Terminal" },
      { file: "screenshots/rivetctl-progress-wide.png", alt: "rivetctl updating Rivet Notes, with the download's progress" },
    ],
    summary:
      "Installs, updates and removes the Rivet apps from the terminal, on the same engine as Rivet Welcome.",
  },
];

/** The apps the site shows: every app but the held ones. Coming soon ones are listed too. */
export const apps: AppEntry[] = allApps.filter((app) => !app.held);

/** The apps with a page of their own: every listed app but the coming soon ones. */
export const pageApps = apps.filter((app) => !app.comingSoon);

/** Every app released from rivetsoft/apps, in the order the install guide lists them. */
export const releaseApps = pageApps.filter((app) => app.tagPrefixes.length > 0 && !app.repo);

/** Apps released from a repository of their own (Softcore), each read from its own releases. */
export const ownRepoApps = pageApps.filter((app) => app.tagPrefixes.length > 0 && app.repo);

/** "owner/name" of a github.com repository URL. */
export function repoPath(url: string): string {
  return new URL(url).pathname.replace(/^\/|\/$/g, "");
}

export function programFor(app: { slug: string; program?: string }): string {
  return app.program ?? `rivet-${app.slug}`;
}

export const navApps = pageApps.filter((app) => app.nav);

export const statusLabel: Record<AppStatus, string> = {
  released: "Released",
  alpha: "Alpha",
  unreleased: "No release yet",
  someday: "Maybe later",
  soon: "Coming soon",
};

export function appBySlug(slug: string): AppEntry {
  const app = apps.find((entry) => entry.slug === slug);
  if (!app) throw new Error(`Unknown app ${slug}`);
  return app;
}

/** Coming soon wins. Then a published release; a pre-release is alpha. An idea with no release stays "someday". */
export function statusFor(app: AppEntry, release: { prerelease: boolean } | undefined): AppStatus {
  if (app.comingSoon) return "soon";
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
  soon: 4,
};

export function byReleaseStatus<T extends { status: AppStatus }>(items: readonly T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => statusRank[a.item.status] - statusRank[b.item.status] || a.index - b.index)
    .map(({ item }) => item);
}
