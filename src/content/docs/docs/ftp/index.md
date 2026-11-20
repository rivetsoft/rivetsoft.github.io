---
title: Rivet FTP
description: Dual-pane SFTP with a transfer queue.
---

Rivet FTP is a dual-pane SFTP client with a transfer queue. Saved connections are also there for `ssh`. FTP and FTPS are not built.

![Rivet FTP connected, in the pink scheme](/rivet-web/screenshots/ftp-connected-wide.png)

Connections are stored in `~/.config/rivet-ftp/connections.conf`.

## Saved connections in a terminal

A connection you save in the window also works from a terminal. Nothing needs exporting: the window and the `rivet-ftp` command read the same file.

```sh
rivet-ftp list
```

That prints each connection's name, type, and address. Use the name with the other commands. A name with spaces can be quoted, or written in its short form: small letters with dashes, so "Work site" is `work-site`.

```sh
rivet-ftp ssh work-site               # log in, starting in the saved remote folder
rivet-ftp ssh work-site git status    # run one command there
rivet-ftp sftp work-site              # the sftp command line, in that folder
rivet-ftp show work-site              # everything saved about it
rivet-ftp url work-site               # its address, for other programs
rivet-ftp open work-site              # open the window, connected
```

`ssh` and `sftp` use the key chosen for the connection. Add `--print` to see the command instead of running it. These two need an SFTP connection.

Passwords are not in the connections file. A connection that logs in with a password asks for it in the terminal. A key with a passphrase needs to be in your ssh agent first (`ssh-add`).

### Plain ssh, scp, rsync and git

Rivet FTP also writes your SFTP connections as an ssh config, at `~/.config/rivet-ftp/ssh_config`, each time you save one. Add this line near the top of `~/.ssh/config`:

```
Include ~/.config/rivet-ftp/ssh_config
```

After that, the short names work in any program that uses ssh:

```sh
ssh work-site
scp notes.txt work-site:/var/www/
rsync -av ./site/ work-site:/var/www/
git clone work-site:repos/project.git
```

`rivet-ftp ssh-config` prints the Include line with the right path for your computer. The same line is in the window, under Preferences, Connections.

### Saving one from a terminal

```sh
rivet-ftp add "Work site" sftp://me@example.com:2222/var/www --key id_ed25519 --local ~/Sites/work
rivet-ftp add Pi pi@192.168.1.4       # user@server alone means SFTP
rivet-ftp keys                        # your SSH keys, and which connections use them
rivet-ftp remove Pi
```

A connection added this way shows in the window the next time it opens. `rivet-ftp --help` lists every command.

## More

The current downloads are on the [FTP page](/rivet-web/ftp/). The key table is in the [FTP README](https://github.com/ulinaaron/rivet-apps/blob/main/apps/rivet-ftp/README.md).
