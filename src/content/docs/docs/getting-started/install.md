---
title: Install with Welcome
description: How Rivet Welcome installs and updates the shell and the apps.
---

Rivet Welcome is optional. It downloads a Linux archive from the [GitHub releases](https://github.com/ulinaaron/rivet-apps/releases), checks the published `.sha256`, and runs `install.sh`. The files land in `~/.local/bin`. It does not ask for a password.

It leaves installs from the AUR, a distro package, or `/usr/local/bin` alone. Those show up, and Welcome does not update or remove them.

A future `rivet-something-v*` tag with a Linux archive shows up on its own. Welcome does not need a new release for that.

## Commands

```sh
rivet-welcome
rivet-welcome --tray
rivet-welcome list
rivet-welcome check
rivet-welcome install notes edit
rivet-welcome update
rivet-welcome remove ftp
```

`check` exits 2 when an update is waiting. The tray can live in the shell panel, or in any StatusNotifierItem tray. It can look every 3, 6, or 12 hours, daily, or only at sign-in.

It needs `curl`, `tar`, and `sha256sum`.

## Paths

- Settings: `~/.config/rivet-welcome/settings`
- Tray autostart: `~/.config/autostart/rivet-welcome-tray.desktop`
- Release cache: `~/.cache/rivet-welcome/releases.json`

Downloads for the current build are on the [Welcome page](/rivet-web/welcome/).

More coming soon.
