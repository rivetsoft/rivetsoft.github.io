---
title: Windows and workspaces
description: Columns, tabs, floating windows, full screen, the overview and scrolling up and down in Softcore.
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
