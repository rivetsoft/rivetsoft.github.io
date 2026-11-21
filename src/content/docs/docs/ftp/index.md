---
title: Rivet FTP
description: How to connect, move and edit files, use SSH keys and saved connections from a terminal, and the keys in Rivet FTP.
---

Rivet FTP is a dual-pane SFTP client with a transfer queue. Saved connections are also there for `ssh`. FTP and FTPS are not built.

![Rivet FTP connected, in the pink scheme](/screenshots/ftp-connected-wide.png)

## Connect

The quick-connect bar takes `user@server` or `sftp://user@server:port/folder`. `user@server` alone means SFTP. To keep a connection, use New Connection (Ctrl+N); it shows in the sidebar, where connections sit in groups that fold.

![The New Connection window](/screenshots/ftp-new-connection-wide.png)

Passwords are never written into the connections file. If you ask the window to remember a password or a key passphrase, it goes in the desktop keyring.

## Move files

Drag between the panes, double-click a file to send it across, or use Upload (Ctrl+U) and Download (Ctrl+D). Files and whole folders go into a queue. A failed transfer can be retried from its row.

When a file is already on the other side, the dates and sizes are compared first. You can keep the copy already there, replace the older files, or replace all of them. Preferences, Transfers sets that choice to ask, replace, or skip, and whether a double-click sends the file or only selects it.

![A dialog comparing two items that are already on the server](/screenshots/ftp-replace-wide.png)

## Edit a file on the server

Right-click a file on the server and choose Open in Editor (or press F4), or Open With to pick an app. Rivet FTP downloads it to a private folder, opens it, and sends each save back. If the server copy changed, it asks before replacing it.

The files open for editing are listed above the transfers. Stop ends it and deletes the local copy. Preferences, Transfers chooses the editor: one app, or the default for each type.

## Permissions

Info shows a file's size, date, owner, and permissions, and changes the permissions (chmod), for one file or for everything in a folder.

![Info for a file on the server](/screenshots/ftp-info-wide.png)

## SSH keys

SFTP goes through the system's own `sftp` program, so your keys, the ssh agent, `~/.ssh/config`, and known_hosts apply. A new server is trusted on first use. A changed server key is refused.

Preferences, SSH Keys lists the keys in `~/.ssh`. From there you can:

- make a new Ed25519 or RSA 4096 key, with an optional passphrase;
- copy a public key;
- add a key to a server, which runs `ssh-copy-id` in a terminal.

Each connection's settings pick its key. With no key chosen, ssh tries the agent and its usual keys. A key with a passphrase needs to be in your ssh agent (`ssh-add`) before connecting. Private keys stay in `~/.ssh`.

![Preferences, SSH Keys](/screenshots/ftp-keys-wide.png)

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

## The connections file

Connections are stored in `~/.config/rivet-ftp/connections.conf`: plain text, readable only by you. You can edit it by hand.

```ini
[Work site]
protocol=sftp
host=example.com
port=2222
user=me
key=~/.ssh/id_ed25519
remote=/var/www
local=~/Sites/work
```

## Keys

These are also in the menus, and in Help, Keyboard Shortcuts.

| Keys | What |
| --- | --- |
| Tab | Switch between the panes. |
| Enter | Open a folder, or send a file to the other side. |
| Backspace, Alt+Up | Up a folder. Alt+Home is the home folder. |
| Up, Down | Move through the list. Shift extends the selection. |
| Ctrl+A | Select everything. |
| F4 | Open a server file in an editor. |
| Ctrl+U, Ctrl+D | Upload or download the selection. |
| F2 | Rename. |
| Delete | Delete on the server, after a confirmation. |
| Ctrl+Shift+N | New folder. |
| Ctrl+L | Type a path. |
| Ctrl+N, Ctrl+K | New connection, quick connect. |
| Ctrl+Shift+D | Disconnect. |
| Ctrl+H | Show hidden files. |
| Ctrl+M, F9, F8 | Show or hide the menu bar, connections, transfers. |
| F5 | Refresh. |
| Ctrl+T, Ctrl+W | New tab, close the tab. |
| Ctrl+Tab | Next or previous tab. Ctrl+Page Down and Ctrl+Page Up do this too. |
| Ctrl+, | Preferences. |

## More

The current downloads are on the [FTP page](/ftp/). More is in the [FTP README](https://github.com/rivetsoft/apps/blob/main/apps/rivet-ftp/README.md).

## Installing

The [install guide](/docs/getting-started/install/) has the usual ways. Unpacking the archive and running `install.sh` puts `rivet-ftp` in `~/.local/bin` and adds Rivet FTP to the app launcher.

The program is a portable x86_64 build, linked against glibc 2.31. The window needs [the same libraries as Rivet Files](/docs/files/#installing).

### From source

Rust 1.88 or newer. From the top of the repository, `utilities/rivet-dev install ftp` builds a release and adds the launcher entry. Or:

```sh
cargo build --release -p rivet-ftp
./target/release/rivet-ftp
./target/release/rivet-ftp open work-site
./target/release/rivet-ftp --help
./target/release/rivet-ftp --install-desktop-entry
```

### What is next

Opening FTP and FTPS, pause and resume, more than one transfer at a time, folder sync, reconnecting after a drop, and Rivet's icon and compact views inside the panes. The checklist is [docs/rivet-ftp-parity.md](https://github.com/rivetsoft/apps/blob/main/docs/rivet-ftp-parity.md).
