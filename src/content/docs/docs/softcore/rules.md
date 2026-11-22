---
title: Rules
description: Softcore rules for windows, shell surfaces, named workspaces and named scratchpads.
---

Rules are lines in the [settings file](/docs/softcore/settings/) that say how particular things are treated. What follows the `=` is words with spaces between. A word that holds a space goes in quotes, and `*` in a program's name or a title stands for anything. Capitals don't matter.

## Windows

```
rule.video=app-id=mpv floating opacity=1
rule.chat=app-id=*discord* workspace=chat focus=false
rule.notes=title="* - Notes" width=30% border=off shadow=off
```

`app-id=` and `title=` say which windows the line is about: both, when both are given, and every window when neither is. The rest is what those windows get.

| Word | What it does |
| --- | --- |
| `floating`, `tiled` | Opens floating over the columns, or in a column whatever it asked for. |
| `workspace=NAME` or `=N` | Opens on that workspace. |
| `output=NAME` | Opens on that display. |
| `width=40%` | The width of its column. |
| `maximized`, `fullscreen` | Opens as wide as the screen, or with the whole screen. |
| `focus=false` | Opens without taking the focus. |
| `scratchpad=NAME` | Opens put away in that scratchpad. |
| `opacity=0.9` | How solid it is, with the focus or without. Without this, `inactive_opacity` applies. |
| `border=off`, `shadow=off`, `blur=off` | Drawn without one. |

When several lines fit a window, each word is taken from the last line that has it. The words about where and how it opens are used once, as the window opens. `opacity`, `border`, `shadow` and `blur` follow the window, so a title that changes can change how it looks.

The name after `rule.` is only there so the line can be found and changed. Patterns are `*` only: there are no regular expressions.

## The shell's surfaces

Panels, wallpapers and launchers go by the name each gives itself. `softcore msg layers` lists them.

```
layer.rivet-panel=opacity=0.9 blur shadow
layer.notif*=blur=off
```

The words are `opacity`, `blur` (on, or off even where the surface asked for it) and `shadow`. `blur_layers` still works and means the same as `blur` here.

## Workspaces with names

```
workspace.chat=output=DP-2 scroll=vertical
workspace.mail=
```

A named workspace is always there, empty or not, first in its display's stack in the order the lines stand.

- `output=` says which display it is made on, and goes back to when that display returns.
- `scroll=` says which way it scrolls.
- A display with nothing on it yet starts on its first named workspace.

Anywhere a workspace is given by number it can be given by name: `focus-workspace chat`, `move-column-to-workspace mail`, `workspace=chat` in a rule. A name is found on whichever display it is, and going to it takes the focus there. `softcore msg workspaces` and ext-workspace give the name.

## Scratchpads with names

```
scratchpad.term=app-id=scratch-term command="rivet-terminal --class scratch-term" size=0.6
bind.Mod+N=toggle-scratchpad term
bind.Mod+Shift+N=move-window-to-scratchpad term
```

Each named scratchpad has its own key and its own windows. The scratchpad without a name (`Mod+S`) is separate from them all.

- `app-id=` and `title=` say which windows go into it as they open.
- `command=` is run when the scratchpad is asked for and holds nothing. The window is shown as soon as it opens, so one key starts the program the first time and shows and hides it after that.
- `size=` is how much of the screen its window takes, in place of `scratchpad_size`.
