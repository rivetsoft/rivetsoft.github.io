---
title: Talking to it
description: softcore msg, the socket, screen sharing, and the Wayland protocols Softcore gives clients.
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
