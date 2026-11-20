---
title: Rivet Edit
description: How to open folders and files, find things, use Git, and the keys in Rivet Edit.
---

Rivet Edit is a lightweight editor for folders and files. The current downloads are on the [Edit page](/rivet-web/edit/).

![Rivet Edit with a Rust project open](/rivet-web/screenshots/edit-editor-wide.png)

## Open a folder or a file

Open a folder and its files sit in a tree. The tree leaves out `.git`, `node_modules`, `target`, and a few other tool and build folders. Single files open too, each in its own tab.

One click in the tree, or Go to File, opens a preview: the tab title is in italics, and the next preview takes its place. To keep the tab, double-click the file, Ctrl+click it, double-click the tab, or change the text.

## Find a file, a command, or a line

- **Go to File:** Ctrl+P, then a few letters of the name or the path.
- **Commands:** Shift+Ctrl+P lists every command.
- **Go to Line:** Ctrl+G.
- **Go to Definition:** F12.

![Go to File](/rivet-web/screenshots/edit-go-to-file-wide.png)

![The command list](/rivet-web/screenshots/edit-commands-wide.png)

Find and replace work in the open file, and search can cover the whole folder.

## Colors

By default the editor follows the app, which follows your desktop. Preferences can turn that off. Color Theme, in the command list, switches the code to one of 39 themes; moving through the list previews each one.

![Preferences](/rivet-web/screenshots/edit-preferences-wide.png)

![Rivet Edit in the light theme](/rivet-web/screenshots/edit-light-wide.png)

## Git

The sidebar's Git tab shows the branch, a commit message, conflicts, staged changes, and changes not staged yet. Changed files are colored in the tree, and the gutter marks what changed since you staged. It runs your own git, so your config, hooks, and sign-in apply.

## Vim keys

Off until you turn them on in Preferences.

## Keys

| Keys | What |
| --- | --- |
| Ctrl+P | Go to File. |
| Shift+Ctrl+P | Commands. |
| Ctrl+O | Open a folder. |
| Ctrl+G | Go to Line. |
| F12 | Go to Definition. |

The full key table is in the [Edit README](https://github.com/ulinaaron/rivet-apps/blob/main/apps/rivet-edit/README.md).

## Build from source

```sh
cargo build --release -p rivet-edit
```
