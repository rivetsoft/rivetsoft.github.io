---
title: Rivet now has a shell
description: The Wayland shell is in the repo. The apps still run on their own.
date: 2026-11-19
author: Aaron Mazade
---

Rivet has a shell now. It is a Wayland desktop: a panel, a dock, a launcher, widgets, and the wallpaper. It needs a compositor with layer-shell (niri, Hyprland, Sway, and the others in the Shell notes). GNOME is not one of them.

The apps still start on their own. Files, Terminal, Edit, and Notes are the ones the dock pins first. Files can be the Open and Save picker. The shell runs matugen on the wallpaper, and the apps pick up those colors while they are open.

Welcome can install them. It downloads a release, checks the sha256, and runs install.sh into `~/.local/bin`. Shell itself has no release yet, so that one is still a build from source. Welcome already has a pre-release.

The notes are under [Docs](/rivet-web/docs/).
