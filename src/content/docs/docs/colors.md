---
title: How colors work
description: The color files Rivet reads, how often they are checked, and the accent and preset names.
---

The apps follow a color file. Matugen can write it, and so can any other tool. Rivet Shell can also write a preset into its own file. The windows restyle when the file changes. You do not restart them.

## The files

Both Rivet files are CSS, in your config home (usually `~/.config`):

- `rivet/palette.css` is written by Rivet when you pick a preset in the shell. While it is there, it comes first.
- `rivet/colors.css` is the file matugen, or anything else, can write.

After those, the apps read the GTK files, in this order: `gtk-4.0/gtk.css`, `gtk-4.0/colors.css`, `gtk-3.0/gtk.css`, `gtk-3.0/colors.css`. `@import`s are followed.

The lines look like this:

```css
@define-color accent_bg_color #d53f8c;
@define-color accent_fg_color #ffffff;
@define-color window_bg_color #24121b;
@define-color window_fg_color #d6d6d6;
@define-color headerbar_bg_color #24121b;
@define-color view_bg_color #2a1820;
@define-color view_fg_color #d6d6d6;
@define-color popover_bg_color #321e28;
```

Names the apps look for include `accent_bg_color`, `accent_color`, `window_bg_color`, `window_fg_color`, `view_bg_color`, `view_fg_color`, `headerbar_bg_color`, `popover_bg_color`, `secondary`, and `tertiary`.

## Live reload

The apps check those files about every 2 seconds. If a modification time changed, they load the colors again and restyle.

## Matugen

In Rivet Shell settings, Colors, From the Wallpaper, the button "Add Rivet's Colors to matugen" writes a template and a config block:

```toml
[templates.rivet]
input_path = '~/.config/matugen/templates/rivet-colors.css'
output_path = '~/.config/rivet/colors.css'
```

The template file is `~/.config/matugen/templates/rivet-colors.css`. After that, matugen's output lands in `rivet/colors.css`.

## Accents

Style and Accent has nine accents: Blue, Green, Teal, Purple, Pink, Yellow, Orange, Red, Grey. Style is Follow System, Light, or Dark.

## Presets

The preset list is the same set Rivet Edit uses for code and Rivet Terminal uses for its colors. Picking one in the shell writes `palette.css`. The names are:

One Dark, One Light, Dracula, Monokai, Monokai Pro, Solarized Dark, Solarized Light, Nord, Gruvbox Dark, Gruvbox Light, Catppuccin Latte, Catppuccin Frappé, Catppuccin Macchiato, Catppuccin Mocha, Tokyo Night, Tokyo Night Day, GitHub Light, GitHub Dark, GitHub Dark Dimmed, Rosé Pine, Rosé Pine Moon, Rosé Pine Dawn, Everforest, Everforest Light, Ayu Dark, Ayu Mirage, Ayu Light, Material, Palenight, Kanagawa, Night Owl, Light Owl, VS Code Dark Modern, VS Code Light Modern, JetBrains Darcula, Xcode Light, Xcode Dark, High Contrast Dark, High Contrast Light.
