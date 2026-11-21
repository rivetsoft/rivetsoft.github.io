---
title: Rivet Notes
description: How vaults, properties, links, editing, daily notes and todos work in Rivet Notes, and its keys.
---

Rivet Notes keeps Markdown in plain folders. The current downloads are on the [Notes page](/notes/).

![Rivet Notes in live mode, in the pink scheme](/screenshots/notes-live-wide.png)

## Vaults

A vault is any folder. Its `.md` files are the notes, and its subfolders are their folders. Nothing is added to the folder: no database, and no hidden settings. Names that start with a dot, such as `.git` or `.obsidian`, are left out.

- **Switch vaults** from the button at the left of the toolbar, or with File, Switch Vault.
- **Forget a vault** in Preferences. That takes it off the list and leaves the folder alone.
- **Move a note or a folder** by dragging it onto a folder, or onto the empty space under the folders to put it at the top of the vault.
- **Delete** moves a note to the desktop's Trash.

New notes get `title`, `created`, and `tags`. A note's title is its `title` property, or else its file name. Edit the title at the top of the note in place: Enter or clicking away keeps it, and Esc puts it back. Changing the title renames the file to match.

Notes save a second after you stop typing, and with Ctrl+S. A note changed by another program is reloaded, or you are asked if you still had unsaved changes.

## Properties

The `---` block at the top of a note is shown as properties: text, number, checkbox, date (with a calendar), list, tags, or link. The type is worked out from the value.

- Click a property's name, or right-click it, to change its type, rename it, or remove it.
- Add property asks for a name and a type.
- The block folds from its header.

`title` and `created` stay in the file and are not listed there. The file stays plain YAML. Nested values are kept as written and shown read-only. Saving writes back only what changed in that block.

Tags come from the frontmatter (`tags: [a, b]` or a list) and from `#tags` in the text, outside of code.

## Folders, tags, and search

Browse by folder, in a tree that folds, or by tag. Each tag lists its notes, and there is an Untagged group.

Drag a panel's title onto another panel to make them tabs, or to its top or bottom edge to stack them. The same choices are in the menu, in View, and in Preferences, Sidebar. Ctrl+T switches tabs, or folds the last pane when they are stacked.

Ctrl+F opens search. It looks at titles, paths, the first line, and tags. `#name` searches tags only.

## Links

Link a note with `[[Note name]]`, and optionally `[[Note|shown text]]` or `[[Note#Heading]]`. A Markdown link to an `.md` file counts too. A link finds its note by path, file name, or title.

- Typing `[[` lists matches. Up and Down choose, Enter or Tab puts the link in, and Esc hides the list.
- Ctrl+click a link in either mode, or click it in live mode, to follow it.
- A link to a note that is not there yet makes it, beside the current note.
- Renaming a note updates the `[[links]]` that point at it, and keeps their shown text and heading.

Peek lists backlinks, with the line each link is on, and the open note's own links.

## Editing

There are two modes. Switch with the button left of the eye at the top right, or from Preferences, Editor, View, Live Mode, or Quick Actions.

- **Source mode** shows the Markdown as written, colored.
- **Live mode** still writes Markdown. Every line except the one you are on is rendered, and a heading takes its size as soon as its `#` marks are typed.

![Source mode in the pink scheme](/screenshots/notes-source-dark.png)

The **reading view** (the eye, or Ctrl+Space) works in either mode. It renders headings, bold and italic, lists and tasks, quotes, code blocks with a Copy button, tables, rules, links, tags, and pictures stored beside the note. Esc or Ctrl+Space closes it. Arrow keys, Page Up and Page Down, Space, Home, and End scroll. Links to other notes open in place, and Backspace goes back.

![The reading view of a note](/screenshots/notes-reading-wide.png)

### The slash menu

Type `/` at the start of a line, or after a space, for a menu of blocks: headings 1 to 3, bulleted and numbered lists, a todo, a super todo when that module is on, a quote, a code block, a divider, a link to a note, or today's date. Keep typing to filter. Up and Down choose, Enter or Tab adds it, and Esc hides the menu. Used mid-line, a line block starts a new line.

![The slash menu open in a note](/screenshots/notes-slash-wide.png)

### Moving lines

Point at a line and a handle shows in the margin. Drag it up or down. A list item or task brings the items nested under it, and a fenced code block moves as a whole. This works in both modes.

### Formatting

Selecting text brings up a small bar: bold, italic, strikethrough, code, link, headings, lists, and quote. The same ones are keys, and are in the Format menu, the right-click menu, and Preferences, Keyboard. A key wraps the selection, or the word under the cursor; a second press takes the marks off.

| Keys | What |
| --- | --- |
| Ctrl+B, Ctrl+I | Bold, italic. |
| Shift+Ctrl+X | Strikethrough. |
| Ctrl+E | Code. |
| Ctrl+K | Link. |
| Ctrl+1, Ctrl+2, Ctrl+3 | Headings. Ctrl+0 is plain text. |
| Shift+Ctrl+8, Shift+Ctrl+7, Shift+Ctrl+9 | The lists. |
| Ctrl+Enter | Tick a task. |
| Shift+Ctrl+Q | Quote. |
| Shift+Ctrl+E | Code block. |

### Pictures and attachments

Drop files from a file manager onto a note. They are copied into the vault's attachments folder (`Attachments` by default, under Preferences, Editor, Attachments) and linked where the cursor is, relative to the note. A second `photo.png` becomes `photo 2.png`. In live mode, a line that is only a picture shows the picture.

### Fonts

Preferences, Editor sets three fonts (Interface, Editor, and Monospace), the editor's size, and its line spacing. A sample shows the editor's fonts as you choose.

## Modules

Optional, and turned on in Preferences, Modules.

![Preferences, Modules](/screenshots/notes-preferences-wide.png)

### Daily notes

A note for each day, named by its date (`2026-11-16.md`) in a folder you pick. `Daily` is the default, and the folder is made when it is first needed. Ctrl+D, File, Daily Note, or the + button opens today's note, and makes it with a `daily` tag when it is not there yet.

### Super todos

Super todos use a tag, `#task` by default. A plain `- [ ]` stays an ordinary todo; one that carries the tag is a super todo. Shift+Ctrl+T makes the line at the cursor one.

The details are plain text in the line: `due:2026-12-01` and `priority:high`. Progress is the box: `[ ]` to do, `[/]` in progress, `[x]` done. In live mode the tag folds away, the date becomes a pill, and the priority becomes a flag. Clicking the words opens a panel for progress, the due date, the priority, and tags.

### The Todos page

The check box button, File, Todos, or Quick Actions opens it. It lists every super todo in the vault.

- Filter by text, by Open, In progress, Done, or All, by when it is due, and by tag.
- Sort by due date, priority, or note, which also groups the list.
- Tick a box to finish a task. The note changes on disk.
- Click a row to open its note.
- The board has To do, In progress, and Done columns. Drag a card to another column to change its progress.

![The Todos page as a board](/screenshots/notes-todos-board-wide.png)

## Quick Open and Quick Actions

Ctrl+P finds a note from part of its title or folder. Letters in order are enough. With nothing typed, it lists the most recently edited notes. Shift+Ctrl+P runs a command or option by name.

![Quick Open matching a note from a few letters](/screenshots/notes-quick-open-wide.png)

## Peek

The button at the far right of the toolbar, F11, or View, Peek opens a panel about the open note: how it is shown, the file's name, folder, size, words, characters, lines, and reading time, its dates, and its properties. A width chosen in Peek belongs to that note. Preferences, Appearance, Default note width sets it for every other note.

## Keys

| Keys | What |
| --- | --- |
| Ctrl+N | New note. Shift+Ctrl+N makes a folder. |
| Ctrl+S | Save now. |
| Ctrl+Space | Reading view. Esc closes it. |
| F11 | Peek. |
| Ctrl+F | Search. |
| Ctrl+T | Switch folders and tags, or fold the pane when they are stacked. |
| Ctrl+P | Quick Open. |
| Shift+Ctrl+P | Quick Actions. |
| Ctrl+D | Daily note, when that module is on. |
| F9, Ctrl+M | Show or hide the sidebar, the menu bar. |
| Ctrl+, | Preferences. |

## From a terminal

```sh
rivet-notes [VAULT]          # open a vault
rivet-notes tags [VAULT]     # list its tags
```

More is in the [Notes README](https://github.com/rivetsoft/apps/blob/main/apps/rivet-notes/README.md).
