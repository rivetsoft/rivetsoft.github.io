---
title: Windows and workspaces
description: Columns, tabs, floating windows and workspaces, snapping, title bars, full screen, the overview and scrolling up and down in Softcore.
---

Windows sit in columns on a strip. The strip runs off both sides of the screen and scrolls. Each display has its own stack of workspaces, with an empty one always last.

## Columns

- `Mod+R` goes through the column widths in `column_widths`. `Mod+Minus` and `Mod+Equal` change the width by a tenth.
- `Mod+F` makes the column as wide as the screen. `Mod+C` centres it.
- `Mod+[` and `Mod+]` take a window into the column on that side, or out into a column of its own.
- `Mod+Shift+Minus` and `Mod+Shift+Equal` make a window shorter or taller. It sits in the middle of the height. `Mod+Ctrl+R` gives it all the height back.
- `default_width` is the width a new column starts at.

## Tabs

`Mod+W` (`toggle-column-tabbed-display`) makes tabs of the focused column's windows. Each has the whole column, one shows, and a strip across the top has a piece for each, the one showing brightest.

- Up and down go from tab to tab. A click on a piece of the strip shows its window.
- The keys that move a window up and down its column change the order.
- The keys that take a window into or out of a column add and remove tabs.
- `Mod+W` again shows them all.

`tab_bar` is the strip's thickness. Where windows scroll up and down, a row's tabs are a strip down its left.

## Floating windows

Dialogs and windows of a fixed size float over the columns. `Mod+V` floats any window, or puts it back. A floating window starts in the middle at the size it chose.

- Mod and the left button moves it. Mod and the right button resizes it from the nearest corner. Its own title bar and edges work too, when it draws them.
- The keys that move and size columns do the same to it: `Mod+Ctrl+arrows` move it, `Mod+Minus` and `Mod+Equal` change its width, `Mod+Shift+Minus` and `Mod+Shift+Equal` its height. `Mod+C` puts it back in the middle, and `Mod+Ctrl+R` back to the size it chooses itself.
- It stays where it was put, at the size it was given, through being put in a column and floated again. Enough of it always stays on the display to take hold of.

### Snapping

In Softcore built from the source code, and in the release after 0.1.0, a floating window snaps. With `snap=true` (the default), a floating window moved with the pointer lines its edges up with the edges of the screen and of other floating windows when they come within a few pixels, a gap away from a neighbor or flush with it.

- Carry it to an edge of the screen and a mark shows where it will go: half the screen by the left or right edge, a quarter by a corner, all of it at the top. Let go and it fills that part.
- Carried away again, it has its own size back. The Maximize button or a double click on its title bar puts it back where it was before it snapped.
- `Mod+F` (`maximize-column`) does the same to a floating window with the focus.

## Floating workspaces

In Softcore built from the source code, and in the release after 0.1.0, a whole workspace can float its windows. Columns are the usual way, and floating is the other: `layout=floating` makes every workspace float its windows, the way most desktops do. Each window opens at the size it asks for in the middle of the screen, and stays where it is put. Scrolling stays the default; the choice can be made for everything, for one display, or for one workspace:

```
layout=floating                         # every workspace
output.HDMI-A-1=layout=scrolling        # but this display's workspaces scroll
workspace.mail=layout=floating          # and so does this named workspace
```

- `Mod+Ctrl+V` (`toggle-workspace-floating`) turns the workspace in view to floating or back, and `set-workspace-layout scrolling|floating|default` says which; `default` is as its display does again. A workspace told this keeps it wherever it goes, until it is empty and gone.
- Turning a workspace to floating floats its windows where they stand, at the size they have, so nothing jumps. Turning it back puts them in columns, left to right as they stood.
- A window floated or put in a column on purpose (with `Mod+V`, by a rule, or a dialog) stays as it is either way.
- On a workspace of floating windows only, the keys that move the focus go to the nearest window that way.

`softcore msg workspaces` gives each workspace's `layout`, and the event stream says when it changes, so a panel can show a switch for it and flip it with `softcore msg action toggle-workspace-floating`.

## Title bars

In Softcore built from the source code, and in the release after 0.1.0, Softcore can draw title bars of its own. `title_bars=floating` gives floating windows one, and `on` gives every window one; `off` (the default) leaves the border as all there is.

- A bar shows the window's name and three buttons: float it or put it back in a column, fill the screen with it (a column as wide as the screen), and close it.
- Dragging the bar moves a floating window and picks up a window in a column, as Mod and the left button do; a double click fills the screen.
- A [rule's](/docs/softcore/rules/) `title-bar=on` or `off` decides for the windows it fits.

The bars are drawn in the Rivet look, with the border around bar and window together, so they follow the desktop's colors and the wallpaper as the borders do. Each part can be given a color of its own:

| Setting | What it does |
| --- | --- |
| `title_bar_height` | How tall a bar is, 16 to 64 pixels; 30 to begin with. |
| `title_bar_active` | The focused window's bar. Empty: from the Rivet theme. |
| `title_bar_inactive` | The other windows' bars. Empty: from the Rivet theme. |
| `title_bar_text` | The name and the buttons. Empty: from the Rivet theme. |
| `title_bar_buttons` | `right` or `left`: the side of the bar the buttons sit on. |

Programs are asked to leave their own title bars off, as before, so a window has one bar, not two. Programs that draw theirs anyway (many GTK ones do) can be given `title-bar=off` by a rule.

## The scratchpad

`Mod+Shift+S` puts a window away in the scratchpad. `Mod+S` shows it floating over whatever is in view, and puts it away again. A window shown from the scratchpad is a floating window.

[Rules](/docs/softcore/rules/#scratchpads-with-names) covers scratchpads with names, each with its own key.

## Full screen

`Mod+Shift+F` (`fullscreen-window`) gives the focused window the whole display, over the shell's panels. A program can ask for the same, and for a display by name. It grows from where the window stood and shrinks back there.

One window a workspace has it at a time. It ends when the focus goes to another window, or when a new window opens on that workspace. The focus is never on something out of sight.

`Mod+Ctrl+Shift+F` (`toggle-windowed-fullscreen`) tells the program it has the whole screen while the window stays in its place. A video or a game drops its own bars and buttons, in a column beside the others.

## The overview

`Mod+O` (`toggle-overview`) draws everything back: every workspace of each display at once, at half size, with the strips running off past the edges of the screen. `overview_zoom` says how small (0.5 is half). There are `open-overview` and `close-overview` too.

- A click on a window gives it the focus, and a click on a workspace brings that one into view. Either shuts the overview.
- The arrows move the focus, on to the next workspace past the end of a column.
- The wheel goes through the workspaces, and with Shift along the strip.
- Return or Escape shuts it where the focus is.

The bindings all go on working, so windows can be moved between workspaces with the view drawn back. Nothing is typed into a window, and the windows hear nothing from the pointer. The shell's panels stay as they are and can be used.

## Moving a window with the pointer

Mod and the left button picks a window up out of its column. It is drawn small by the pointer, and a mark in the accent colour shows where it would go:

- A bar between two columns, for a column of its own there.
- The upper or lower half of a window, for a place above or below it in that window's column. That adds a tab to a tabbed one.

The outer quarters of a column are for the bar, the middle for a place in it. On another display it goes to the workspace in view there.

## Scrolling up and down

`scroll=vertical` turns the layout a quarter turn. Windows sit in rows one under the other, each as wide as the screen, and the strip scrolls up and down.

- `scroll=auto` does that only on a display taller than it is wide. `horizontal` is the usual way.
- A display's own line can say otherwise: `output.HDMI-A-1=scroll=vertical`.
- `Mod+Shift+W` (`toggle-workspace-scroll`) turns the workspace in view the other way.
- `set-workspace-scroll horizontal|vertical|auto|default` says which. `default` is as its display does again.

A workspace told this keeps it wherever it goes, to another display and back, until it is empty and gone. `softcore msg workspaces` gives each one's `scroll`.

Everything follows the turn. Up and down go from row to row, and left and right between the windows sharing a row. A column's width settings (`default_width`, `column_widths`, `set-column-width`) are a row's height. The keys and action names stay as they are: `focus-column-left` means left on the screen.
