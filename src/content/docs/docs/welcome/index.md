---
title: Rivet Welcome
description: An optional installer and updater for the Rivet shell and apps.
---

Welcome installs and updates the shell and the apps. You can skip it and install another way.

![Rivet Welcome, with updates and an install under way](/rivet-web/screenshots/welcome-wide.png)

It downloads the Linux archive, checks the published `.sha256`, and runs `install.sh` into `~/.local/bin`. It does not ask for a password. Installs from the AUR, a distro package, or `/usr/local/bin` are shown and left alone.

The tray sits in the shell panel, or in any StatusNotifierItem tray.

The commands, the check schedule, and the config paths are on [Install with Welcome](/rivet-web/docs/getting-started/install/). Current downloads are on the [Welcome page](/rivet-web/welcome/).

More coming soon.
