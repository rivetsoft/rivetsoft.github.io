---
title: Settings
description: Softcore's settings file, the settings command, displays, borders, motion, shadows and blur.
---

One file, `~/.config/softcore/settings`. You edit it, and a settings window can edit it too. It is `key=value` lines, like every Rivet app's.

```
# Look
gaps=8
border=3
border_active=#e66100

# Keys
bind.Mod+T=spawn foot
bind.Mod+E=

# Displays
output.DP-5=mode=2560x1440@59.951 scale=1.5 position=0,0
output.eDP-1=off

spawn=rivet-shell
env.MOZ_ENABLE_WAYLAND=1
```

`SOFTCORE_CONFIG=FILE` reads another file in its place.

## How the file works

- **Every plain setting is one key with one typed value.** They are listed with type, range, default, label and group in one table (`SETTINGS` in `crates/softcore-settings`). The reader checks values against it. `softcore settings describe` prints it as JSON.
- **Things there are many of have a name in their key**: `bind.KEYS`, `output.NAME`, `env.NAME`, `rule.NAME`, `layer.NAME`, `workspace.NAME`, `scratchpad.NAME`, `chord.KEYS`. Each is one line. `spawn` is a plain list, in order.
- **A change touches one line.** The writer puts the new value where the old one stood. Comments, blank lines, the order, and keys it doesn't know are left alone.
- **Order doesn't matter** between different keys. An empty value means "follow": the edges follow `gaps`, colours and the radius follow Rivet.
- **Softcore reads the file again the moment it changes**, whoever changed it.

Lines that can't be read are listed in a panel on screen, and the rest still applies. Keys Softcore doesn't know are skipped, so a newer file still loads. `include=FILE` reads another file in place.

## The settings command

```sh
softcore settings                    # every setting and its value; a star marks ones in the file
softcore settings set gaps 16        # checked first, then one line changed
softcore settings set bind.Mod+T spawn kitty
softcore settings unset gaps         # back to the default
softcore settings describe           # the table of settings, as JSON
softcore validate                    # what couldn't be read, without starting anything
```

## The plain settings

`softcore settings` says what each one is.

| Group | Keys |
| --- | --- |
| Windows | `gaps`, `gaps_out`, `border`, `radius`, `border_active`, `border_inactive`, `border_active_to`, `border_inactive_to`, `border_angle`, `inactive_opacity`, `shadows`, `shadow_size`, `shadow_offset`, `shadow_opacity`, `shadow_color`, `xwayland`, `blur`, `blur_strength`, `blur_layers` |
| Columns | `scroll`, `column_widths`, `default_width`, `center_short_columns`, `overview_zoom`, `tab_bar`, `scratchpad_size` |
| Look | `theme`, `accent`, `follow_desktop_colors`, `background` |
| Motion | `animations`, `animation_speed` |
| Keyboard | `mod`, `chord_panel`, `chord_vim`, `default_binds`, `xkb_layout`, `xkb_variant`, `xkb_options`, `repeat_delay`, `repeat_rate` |
| Pointer | `tap_to_click`, `natural_scroll`, `cursor_theme`, `cursor_size` |

## Displays

One line a display, by the name `softcore msg outputs` gives it.

```
output.DP-5=mode=2560x1440@59.951 scale=1.5 position=0,0 transform=normal
output.HDMI-A-1=transform=90
output.eDP-1=off
```

- `mode` is a resolution and, after `@`, a refresh rate. The nearest the display has is used.
- `transform` is `normal`, `90`, `180`, `270`, or `flipped` with or without a turn (`flipped-90`).
- `scroll=vertical` on a display's line sets which way its workspaces scroll.
- Anything left out stays the display's own choice.

A change applies as the file is saved. A display whose resolution changes, or that is turned off or on, is taken down and set up again, and its workspaces come straight back. A display turned off is still listed by `softcore msg outputs`, so it can be turned on again.

When a display is unplugged, its workspaces move to another display and go back when it returns. With no display left, they wait for the next one.

Rivet Shell's Displays page and its window look settings write these lines, and the look's own (`gaps`, `border`, `radius` and so on), into `rivet-shell.settings` next to the settings file. The settings file includes it with one line at its end: `include=rivet-shell.settings`. What you write after that line still wins.

## Borders

A border is one colour, or a gradient. Give it a second colour to run to, and the way it runs.

```
border=4
border_active_to=#00c8ff
border_angle=135
```

`border_active_to` is for the focused window and `border_inactive_to` for the others. `border_angle` is in degrees: 0 upwards, 90 to the right, 180 downwards. The first colour of each is still Rivet's unless the settings name one, so a gradient can start from the accent of the day.

## Motion

Windows fade in a little small and grow into place, and fade out the same way. A window that changes column, width or height slides and grows to its new place, and its neighbours slide to make room. The strip and the workspaces slide too.

`animation_speed` makes all of it faster or slower (2 is twice as fast). `animations=false` puts everything where it belongs at once.

A window changing size on its way is never stretched. It is drawn as it is and cut off at where it has got to. A program that is killed outright vanishes without fading.

## Shadows and blur

Shadows have a size (larger is softer), an offset below the window, a strength and a colour: `shadow_size`, `shadow_offset`, `shadow_opacity`, `shadow_color`.

What shows through a window that isn't solid is blurred: `blur`, and `blur_strength` from 1 to 10. That covers a see-through terminal, and an unfocused window with `inactive_opacity` below 1. A window is blurred against the wallpaper, not the windows under it, so the blur is made once and kept until the wallpaper changes.

Shell surfaces get blur behind them when they ask for it (ext-background-effect), or when `blur_layers` names them. Behind those, everything is blurred, windows included. A surface named in `blur_layers` is blurred behind all of its rectangle, so name only ones that fill theirs. None are named by default: Rivet Shell's panel and dock are see-through around their bars.

## Keyboards and programs

```
xkb_layout=us,de
xkb_options=grp:alt_shift_toggle
env.MOZ_ENABLE_WAYLAND=1
spawn=rivet-shell
```

`env.NAME` is set for everything Softcore starts. Each `spawn` line runs once Softcore is up, in order.

### X11 programs

Programs written for X11 open through [xwayland-satellite](https://github.com/Supreeeme/xwayland-satellite), 0.7 or later, with Xwayland installed. Softcore takes an X11 display number when it starts and gives it to what it runs as `DISPLAY`. Satellite is started when the first X11 program asks, and again if it ever stops. Each X11 window arrives as an ordinary window.

`xwayland=false` turns it off. Without satellite installed, Softcore says so in its log and carries on. Either is read when Softcore starts, not while it runs.

X11 programs only know about each other. One of them can't read the keys typed into a Wayland window or take a picture of the screen the X11 way, and its main windows go where Softcore puts them.
