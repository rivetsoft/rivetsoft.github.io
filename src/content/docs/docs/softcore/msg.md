---
title: Talking to it
description: softcore msg, the socket, screen sharing, what apps get through the desktop portal, and the Wayland protocols Softcore gives clients.
---

`softcore msg` asks a running Softcore. The answers have the fields `niri msg` gives, which is how Rivet Shell works with both.

```sh
softcore msg windows            # also: outputs, workspaces, layers, focused-window, focused-output
softcore msg -j workspaces      # as one line of JSON
softcore msg action focus-workspace 2
softcore msg action close-window --id 4
softcore msg overview-state
softcore msg screenshot shot.png
softcore msg event-stream       # a line whenever workspaces, windows or the focus change
softcore msg version
```

The socket is `$SOFTCORE_SOCKET`, set for everything Softcore starts. A request is one line, a JSON array of words. The answer is `{"ok": …}` or `{"error": "…"}`.

`softcore msg action NAME` runs any action a binding can. The event stream says `OverviewOpenedOrClosed` when the overview opens or shuts, as niri's does.

## Sharing the screen

An app in a call, or a recorder, can share a display or one window.

1. The app asks xdg-desktop-portal, which asks Softcore's own service (`softcore portal`).
2. Softcore shows its picker: a card for each display and window with a small live picture. Arrows and Enter, or a click, choose. Esc says no.
3. Softcore starts a PipeWire stream of what was chosen, and the app reads it.
4. The stream ends when the app ends it, when the window closes, or when whoever asked goes away for any reason.

Softcore draws the picker itself, so no program can cover it, imitate it or answer it for you. A shared window keeps being shared when it scrolls out of view or is on another workspace, and the stream follows it when it is resized.

The same without an app, which is also how to check it:

```sh
softcore msg pick-cast                         # shows the picker, prints the choice
softcore msg cast start output DP-5 --cursor   # prints the PipeWire node; shares until stopped (Ctrl+C)
softcore msg cast start window 4
softcore msg casts                             # what is being shared now
softcore msg cast stop ID
gst-launch-1.0 pipewiresrc path=NODE ! videoconvert ! autovideosink
```

Programs that capture the screen directly (`grim`, and screenshots from a shell) work too, through ext-image-copy-capture.

For apps to reach the portal, `softcore.portal` and `softcore-portals.conf` need installing. [Softcore](/docs/softcore/#as-a-session) says where. On displays of its own, Softcore runs `softcore portal` itself. In a window, `--portal` does.

Frames are copied through memory. That works everywhere, and costs more than it should on a 4K display.

## What apps that aren't Rivet's get

In Softcore built from the source code, and in the release after 0.1.0, `softcore portal` answers more of xdg-desktop-portal's questions, so GTK, libadwaita, Qt, Firefox, Chromium and Electron apps fit in without settings of their own.

- **Dark or light, the accent and the contrast.** They come from where Rivet's apps take theirs: Softcore's `theme` setting (with `system`, the desktop's GTK settings), and the desktop's colors when they are followed, else the `accent` setting. Running apps change with them.
- **Screenshots.** An app that lets you choose gets Softcore's own chooser: drag out an area, click a window, or press Enter for the whole display. One that asks for the screen at once gets the focused display, after you have allowed that app once. The picture is saved with your other screenshots.
- **Picking a color.** The screen stays as it is until you click, and the app gets the color under the pointer.
- **Keeping the screen awake** for a video or a call in a window that isn't in front, and keeping the computer from suspending.
- **Shortcuts that work in any window**, such as push to talk. Each gets the keys its app suggests unless something already uses them; Softcore's bindings come first. `bind.Ctrl+Alt+M=app-shortcut org.example.App mute` gives keys to one that has none.
- **Setting the wallpaper**, through Rivet Shell, after you allow the app.

```sh
softcore msg pick-screenshot ~/shot.png        # the chooser; prints the file once it is saved
softcore msg pick-screenshot --now ~/shot.png  # the focused display, at once
softcore msg pick-color                        # prints the color clicked, as [r, g, b]
softcore msg inhibit-idle                      # keeps the screen awake until Ctrl+C
```

### Which backend answers what

Every interface is named in `softcore-portals.conf`, so none falls to whatever backend happens to be installed.

| Interface | Answered by | Why |
| --- | --- | --- |
| ScreenCast | Softcore | Only the compositor sees the screen; its own picker. |
| Screenshot (and PickColor) | Softcore | Its own chooser, drawn over everything. |
| Settings | Softcore, then GTK | Dark or light, the accent and the contrast are Rivet's; GTK's come after for fonts and GNOME's own keys. |
| Inhibit | Softcore | Idle is Softcore's to hold off; suspending is logind's. |
| GlobalShortcuts | Softcore | Keys are Softcore's before any window's. |
| Wallpaper | Softcore, through Rivet Shell | The wallpaper is Rivet Shell's. |
| FileChooser | Rivet Files, then GTK | Files is the Open and Save window when installed. |
| AppChooser | GTK | Rivet has no "Open with" window of its own yet. |
| Notification | GTK | It passes notifications on to the desktop's notification service, which is Rivet Shell's. |
| Access, Account, Email, Print, DynamicLauncher | GTK | Dialogs Rivet has no window of its own for. Access is the "Allow this app to…?" question the other portals ask. |
| Secret | GNOME Keyring, else oo7 | The keyring the system has; Rivet's apps keep their secrets in the same one. |
| Background | none | Running apps in the background without a window isn't tracked yet; sandboxed apps asking are told no. |
| Lockdown | none | No locked-down settings; everything is allowed. |
| RemoteDesktop, Clipboard, InputCapture | none | Remote control and sharing input aren't built. |
| Usb | none | Not built. |

To change one, copy `softcore-portals.conf` to `~/.config/xdg-desktop-portal/` and edit the line; xdg-desktop-portal reads yours first.

## What clients get

| Area | Protocols |
| --- | --- |
| Windows | xdg-shell with server-side decorations, xdg-activation, foreign-toplevel-list |
| Shell | layer-shell, session lock, ext-workspace, idle notify and idle inhibit, blur behind a surface (ext-background-effect) |
| Clipboard | The clipboard, primary selection, data-control, drag and drop |
| Capture | ext-image-copy-capture, of displays and of windows |
| Input | Virtual keyboards and pointers, pointer constraints, relative pointer, pointer gestures, tablet, text-input and input-method, cursor-shape |
| Drawing | Fractional scale, viewporter, single-pixel buffers, linux-dmabuf |

A bar or dock that isn't Rivet's can list and switch workspaces through ext-workspace-v1. Each display is a group, and its workspaces are named by their place in the stack (1, 2, …), the empty last one included. A client can ask for a workspace to be shown. Making, removing and moving workspaces aren't offered, as Softcore makes and drops them itself.
