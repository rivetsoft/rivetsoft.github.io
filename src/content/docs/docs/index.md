---
title: What Rivet is
description: A small Linux desktop shell, and apps that also run on their own.
---

Rivet is a small Linux desktop shell, and apps for files, notes, FTP, editing and the terminal. Each one also runs on its own. Built for fun, held together with rivets.

The shell and the apps are written in Rust and drawn with [egui](https://github.com/emilk/egui). There is no GTK or Qt. They share menus, toolbars, Preferences, and the quick panel (`Ctrl+P`). Colors, fonts, and icons follow the desktop. The shell runs [matugen](https://github.com/InioX/matugen) on the wallpaper, and the apps follow those colors while they are open.

The source is [rivetsoft/apps](https://github.com/rivetsoft/apps), under MIT or Apache-2.0.

## Get started

Download the Welcome AppImage, make it executable, and run it. Welcome then installs the apps. The steps are on the [install page](/docs/getting-started/install/#get-started).

## Pieces

- **Rivet Shell** is the Wayland desktop: panel, dock, launcher, widgets, wallpaper.
- **Rivet Welcome** installs and updates the shell and the apps from GitHub releases.
- **Rivet Files**, **FTP**, **Notes**, **Edit**, and **Terminal** are the apps.

More coming soon.
