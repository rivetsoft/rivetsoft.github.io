---
title: Softcore
description: A scrolling-tiling Wayland compositor for the Rivet desktop. Build it, run it, and the first keys.
---

Softcore is a scrolling-tiling Wayland compositor, in Rust on [smithay](https://github.com/Smithay/smithay). Windows sit in columns on a strip that runs off both sides of the screen. Each display has its own stack of workspaces, with an empty one always last.

![Softcore with three columns of windows on a strip that runs off both sides of the screen](/screenshots/softcore-wide.jpg)

It works the way [niri](https://github.com/YaLTeR/niri) does and is written from scratch. niri's behaviour was studied from the outside: what it advertises to clients, and what `niri msg` says. None of its code is in Softcore.

Softcore is early. It runs in a window of another desktop and with no screen at all, and both are checked. Running on displays of its own is written and compiles, but has not been run on hardware yet. [What isn't built yet](/docs/softcore/status/) has the list.

## Build

There is no release. Build it from the [repository](https://github.com/ulinaaron/softcore). It needs the usual compositor libraries with their headers: libseat, libinput, libudev, libgbm, libxkbcommon and EGL.

```sh
cargo build --release
```

The shared Rivet crates (`rivet-look`, `rivet-kit`, `rivet-xdg`) are pinned to a commit of [rivetsoft/apps](https://github.com/rivetsoft/apps) in `Cargo.toml`. To build against a checkout of the apps repository, copy `.cargo/config.toml.example` to `.cargo/config.toml` and set the path.

## Run

```sh
softcore                # from a desktop: opens in a window. From a TTY: takes the displays.
softcore --headless     # a display in memory, for checks and screenshots
softcore --spawn foot   # run something once started
softcore --size 1600x900 --headless
```

`--tty` and `--winit` choose the backend by hand. `--portal` also runs the screen-sharing service, which is always on when Softcore has displays of its own.

Softcore prints `WAYLAND_DISPLAY` and `SOFTCORE_SOCKET` in its first lines, and sets both for everything it starts. It puts itself on the `PATH` of what it starts, so `softcore msg` is found wherever Softcore was started from.

### In a window

In a window, Mod is Alt, so the desktop outside keeps Super. On displays of its own, Mod is Super.

To try a new build inside a running Softcore, start it from a terminal there and press `Mod+Shift+Escape` on its window. The inner one then gets every key, the outer one's bindings included, and its border turns the opposite colour. The same keys give them back. `mod=super` in the inner one's settings (`SOFTCORE_CONFIG=FILE`) makes it answer to the keys it will have on displays of its own.

### As a session

Three files from `data/` in the repository make Softcore a session a login manager can start, and let apps reach its screen sharing. A package would install them.

| File | Where |
| --- | --- |
| `softcore.desktop` | `/usr/share/wayland-sessions/` |
| `softcore.portal` | `/usr/share/xdg-desktop-portal/portals/` or `~/.local/share/xdg-desktop-portal/portals/` |
| `softcore-portals.conf` | `/usr/share/xdg-desktop-portal/` or `~/.config/xdg-desktop-portal/` |

## First keys

`Mod+Shift+/` shows every key. These are the ones to know first.

| Keys | What |
| --- | --- |
| `Mod+Return` | A terminal |
| `Mod+Space` | The launcher |
| `Mod+Q` | Close the window |
| `Mod+arrows` | Move the focus |
| `Mod+Ctrl+arrows` | Move the window |
| `Mod+R` | The next column width |
| `Mod+F` | A column as wide as the screen |
| `Mod+Page Up`, `Mod+Page Down` | The workspaces |
| `Mod+O` | The overview |
| `Mod+Shift+E` | Leave |

[Keys and chords](/docs/softcore/keys/) has the rest.

## With Rivet Shell

Rivet Shell runs under Softcore. Its panels, dock, wallpaper and launcher are layer-shell surfaces. The shell knows Softcore by name, so its workspaces item, window title, dock and log out work. The shell asks `softcore msg` what it asks `niri msg`, since the answers have the same fields.

```
spawn=rivet-shell
```

Softcore takes its look from the same place as the apps:

- The border of the focused window is the Rivet accent, followed live. A new wallpaper or another palette in Rivet Shell recolours the borders and panels at once.
- The other borders, the colour behind everything and the corner radius come from the same theme.
- Softcore's own panels (the keys, the question before leaving, the note about settings that couldn't be read) are egui in that theme, painted by `rivet-kit`'s software renderer.

The shell's Displays page and window look settings write into `rivet-shell.settings`, next to Softcore's settings file. [Settings](/docs/softcore/settings/#displays) covers that file.

## Checks

```sh
cargo test --workspace
softcore --headless --size 1600x900 --spawn rivet-terminal &
softcore msg screenshot /tmp/softcore.png
wtype -M alt -k Return -m alt
wlrctl pointer click left
```

The tests cover the layout's rules and slides, the settings file both ways, and the bindings. `wtype` and `wlrctl` need `WAYLAND_DISPLAY` from Softcore's first lines, and `softcore msg` needs `SOFTCORE_SOCKET`.

MIT or Apache 2.0, at your choice, like the Rivet apps.
