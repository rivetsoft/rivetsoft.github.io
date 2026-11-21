---
title: Rivet Files
description: How to get around, work with files, add your own actions, and the keys in Rivet Files.
---

Rivet Files is a file manager in the same family as Dolphin, Nemo, Thunar, and Caja. It is a Rust and egui app, with no GTK or Qt. It also runs on its own, and the shell can use it as the Open and Save picker.

The current downloads, and what each one needs, are on the [Files page](/files/).

![Icon view of Home in the pink scheme](/screenshots/icons-wide.png)

## Getting around

- **Type a location.** Press Ctrl+L and type a path. Matching folders appear, even from a few scattered letters. Tab completes the suggested one.
- **Quick Open.** Ctrl+P finds a folder from a few letters and opens it. It looks in recent folders, places, bookmarks, drives, and folders under Home.
- **Quick Actions.** Ctrl+Shift+P lists every command and setting. Try "tree", "theme dark", or "zen".
- **Split view.** F3 shows two folders side by side. Drag between them, or copy or move to the other pane. F6 switches panes.
- **Filter a folder.** Start typing, or press Ctrl+F. Enter searches the subfolders too.
- **Filters.** Ctrl+Shift+F limits a folder by type, name, or date: everywhere, for this folder, or for this folder and below. They are kept in `~/.config/rivet/filters`.

![A filter hiding some of the folder](/screenshots/filters-wide.png)

## Previews

- **Peek.** F11 opens a side panel with a large preview, video playback, colored code, and file details. Drag the grip under the preview to change its height.
- **Preview.** Space shows the selection in the whole window. Left and Right step through the folder's pictures, videos, and text. Return opens the file.

![Peek showing a picture](/screenshots/peek-picture-wide.png)

## Rename many files

Select several files and press F2. Bulk Rename can insert text, dates, or numbers, remove or replace text, and change case. Every new name is previewed before anything is renamed.

![Bulk rename, with a preview of the new names](/screenshots/bulk-rename-wide.png)

## Be other apps' Open and Save window

Rivet Files can be the window other apps show for Open and Save, through xdg-desktop-portal. Turn it on in Preferences, System, File picker, or from a terminal:

```sh
rivet --file-picker on
```

The picker you had stays as the fallback. This is not available inside the Flatpak.

## Your own actions in the right-click menu

A custom action is one small `.action` file in `~/.local/share/rivet/actions`. Preferences, Modules, Add an Example writes a starter file. An action looks like this:

```ini
[Action]
Name=Shrink Pictures
Icon=image-x-generic
Exec=mogrify -resize 50% %F
For=some
Types=image/*
Requires=mogrify
```

The full list of codes is in the [Files README](https://github.com/rivetsoft/rivet-apps/blob/main/apps/rivet-files/README.md).

## Layout

- **Menu bar:** Ctrl+M shows or hides it.
- **Status bar:** F8. Preferences can put it at the top or the bottom.
- **Sidebar:** F9.
- **Zen mode:** F12. The files fill the window, and the toolbar, sidebar, and Peek slide in when the pointer reaches an edge.
- **Terminal mode:** F7. Monospace text, Nerd Font icons, and panels drawn as boxes. It uses the monospace font from Preferences, Appearance, Typography, and any installed Nerd Font.
- **Modules:** Preferences, Modules turns off Bulk Rename, Convert and Resize, or custom actions.

![Preferences, Appearance](/screenshots/preferences-wide.png)

## Keys

F1 lists every shortcut inside the app. A short set:

| Keys | What |
| --- | --- |
| Ctrl+L | Type a location. Tab completes the suggested folder. |
| Ctrl+F | Filter this folder. Typing does this too, unless Vim keys are on. |
| Ctrl+T, Ctrl+W | New tab, close tab. |
| Ctrl+H | Show hidden files. |
| Ctrl+1, Ctrl+2, Ctrl+3 | Icon, list, or compact view. |
| F2 | Rename. With several selected, Bulk Rename. |
| Delete | Move to Trash. |
| Ctrl+Z, Ctrl+Shift+Z | Undo, redo. |
| Ctrl+P | Quick Open. |
| Ctrl+Shift+P | Quick Actions. |
| F3, F6 | Split view, the other pane. |
| F7, F8, F9, F11, F12 | Terminal mode, status bar, sidebar, Peek, Zen mode. |
| Space | Preview the selection. |
| Ctrl+, | Preferences. |

### Vim keys

Off until you turn them on in Preferences, Behavior.

| Keys | What |
| --- | --- |
| `h` `j` `k` `l` | Move. In the list view, `h` goes to the parent and `l` opens. |
| `-`, `o` | The parent folder, open. |
| `gg`, `G` | First, last. Counts work: `5j`, `10G`. |
| `V` | Visual selection. |
| `yy`, `dd` or `x`, `p` | Copy, cut, paste. |
| `cw`, `D` | Rename, move to Trash. |
| `.` or `zh` | Show hidden files. |
| `H`, `L` | Back, forward. |
| `/`, `:` | Search, Quick Actions. |
| `~` | Home. |

The status bar shows `-- VISUAL --` and any half-typed command. While Vim keys are on, typing letters does not filter the folder; `/` does.

## Where things are kept

- Filters: `~/.config/rivet/filters`
- Actions: `~/.local/share/rivet/actions`
- Thumbnails: `~/.cache/thumbnails`, shared with other file managers
- Crash reports: `~/.local/state/rivet/crashes`. Nothing is sent unless you choose to share it.
