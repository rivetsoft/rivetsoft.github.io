---
title: Keys and chords
description: Softcore's bindings, the default keys, chords, the pointer and touchpad gestures.
---

A binding is a line in the [settings file](/docs/softcore/settings/): keys, then an action.

```
bind.Mod+T=spawn rivet-terminal
bind.Mod+E=
bind.Mod+Shift+P=title="" spawn some-script
```

- `Mod` is Super on displays of its own and Alt in a window. `mod=super` or `mod=alt` says otherwise (`auto` is the default).
- An action is named as niri names it: `focus-column-left`, `move-column-to-workspace 3`, `set-column-width +10%`, `set-window-height 60%`.
- An empty binding takes a default away. `default_binds=false` takes them all away.
- `allow-when-locked` before the action lets the keys work on the lock screen.
- `title="…"` before the action is what the keys panel shows for it. `title=""` leaves it out of the panel.

`Mod+Shift+/` shows every binding.

## The default keys

| Keys | What |
| --- | --- |
| `Mod+Return` | Rivet Terminal |
| `Mod+Space` | Rivet Shell's launcher |
| `Mod+E` | Rivet Files |
| `Mod+Q` | Close the window |
| `Mod+Left`, `Right`, `Up`, `Down` (or `H`, `L`, `K`, `J`) | Move the focus |
| `Mod+Home`, `Mod+End` | The first or last column |
| `Mod+Ctrl+Left`, `Right` | Move the column |
| `Mod+Ctrl+Up`, `Down` | Move the window in its column |
| `Mod+[`, `Mod+]` | Into or out of the column on that side |
| `Mod+R` | The next column width |
| `Mod+Minus`, `Mod+Equal` | A narrower or wider column |
| `Mod+Shift+Minus`, `Mod+Shift+Equal` | A shorter or taller window |
| `Mod+Ctrl+R` | The window as tall as there is room |
| `Mod+F` | A column as wide as the screen |
| `Mod+C` | Centre the column |
| `Mod+W` | The column's windows as tabs, or all showing |
| `Mod+Shift+W` | This workspace scrolls the other way |
| `Mod+Shift+F` | Full screen |
| `Mod+Ctrl+Shift+F` | Full screen as the program sees it, in its place |
| `Mod+V` | Float the window, or put it back |
| `Mod+Shift+V` | Between floating windows and columns |
| `Mod+S` | Show the scratchpad, or put it away |
| `Mod+Shift+S` | Put the window away in the scratchpad |
| `Mod+O` | The overview |
| `Mod+Page Down`, `Mod+Page Up` (or `U`, `I`) | The workspace below or above |
| `Mod+Ctrl+Page Down`, `Page Up` | Move the column to that workspace |
| `Mod+1` to `Mod+9` | A workspace by number |
| `Mod+Ctrl+1` to `9` | Move the column to a workspace by number |
| `Mod+Shift+Left`, `Right` | The previous or next display |
| `Mod+Shift+Ctrl+Left`, `Right` | Move the column to that display |
| `Mod+Shift+/` | Show these keys |
| `Mod+Shift+Escape` | Give this window every key, or take them back |
| `Mod+Escape` | Lock the screen |
| `Mod+Shift+E` | Leave Softcore |

## Chords

A binding can be several keys pressed one after another, with commas between them.

```
bind.Mod+G,T=spawn rivet-terminal
bind.Mod+G,W,F=title="Browser" spawn firefox
bind.Mod+G,W,M=spawn thunderbird
chord.Mod+G=Go to
chord.Mod+G,W=Internet
```

The first keys open the chord, and a panel shows what can come next: each key with what it does, and a `›` on those that lead on to more keys.

- Press the next key, or go up and down the list with the arrow keys and press Enter.
- Backspace goes back a step. Escape leaves, and so does any key that isn't part of the chord.
- Mod can stay held for the keys after the first.
- `chord.KEYS=Name` names the list those keys open. Without one it shows the keys.
- `chord_panel=false` shows nothing. The keys work the same, and the arrow keys are no longer taken.
- `chord_vim=true` adds J and K for down and up, L to take and H to go back. A step of the chord on one of those letters still wins.
- Keys that begin a chord are no longer a binding of their own: `bind.Mod+W,F=…` takes `Mod+W` away from what it did.

## The pointer

- Mod and the left button picks a window up out of its column. A window's own title bar does too. A mark in the accent colour shows where it would go: a bar between two columns for a column of its own, or the upper or lower half of a window for a place in that window's column.
- On a floating window, Mod and the left button moves it, and Mod and the right button resizes it from the nearest corner.
- Let go where it started and nothing moves.

## Touchpads, touchscreens and pens

These are written and wait for a run on a real machine. See [what isn't built yet](/docs/softcore/status/).

- **Three fingers on a touchpad** move what is in view: along the strip the windows scroll, and across it the workspaces do. **Four fingers** up open the overview, and down close it.
- **A touchscreen** works as the program expects. A finger put down gives the keyboard to what it lands on.
- **A drawing tablet's pen** moves the pointer and reaches the program as a pen, with pressure, tilt and buttons.
- **A program may lock the pointer** in place and read how the mouse moves, or keep it inside its window. This one is checked.
- **Input methods** (fcitx5, ibus) can take what is typed and give text back.
