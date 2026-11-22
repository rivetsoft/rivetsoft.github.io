---
title: What isn't built yet
description: What in Softcore is checked, what is written but not run on hardware, and what is missing.
---

Softcore is early. This page is the honest list.

## Checked

- Running in a window of another desktop, and headless with a display in memory.
- The layout's rules and slides, the settings file both ways, and the bindings, by `cargo test --workspace`.
- Bindings, typing and click-to-focus, through virtual devices (`wtype`, `wlrctl`), which take the same path as real ones.
- Pointer lock and keeping the pointer inside a window.
- Each part of screen sharing on its own: the D-Bus service called by hand, the picker, and the stream read by GStreamer.

## Written, not run on hardware

- **Real displays.** The TTY backend (DRM, libinput, libseat, TTY switching) is written from smithay's own examples and compiles. Nobody has started it on hardware yet. Expect to fix things there first. It draws with one GPU.
- **Real keyboards and mice.** libinput devices, and with them touchpad settings, wait for the first run on hardware. The wheel, and menus that close on a click outside, are written but not checked.
- **Fingers, pens and input methods.** Three- and four-finger swipes, touch, tablets and input methods have not met a real device. A touchscreen or tablet is taken to belong to the laptop's own display, or the first one, and can't be given another.
- **Screen sharing from a real app.** A browser going through xdg-desktop-portal needs a Softcore session and the portal files installed, and has not been tried.

## Not built

- Sharing more than one thing in one request, and remembering a choice.
- Handing the GPU's own buffers to PipeWire. Frames are copied through memory.
- Presentation timing.
- Blur that follows a surface's round corners or its see-through parts. It fills the rectangle.
- Animations for floating windows. They jump, as a floating window going to full screen does.
- Regular expressions in rules, and a rule for keeping a window out of screen sharing.
- Titles on the tabs. The strip shows how many there are and which is showing.
- In the overview: dragging a window to another workspace, a corner of the screen that opens it, and a touchpad gesture for it.
- A dialog opening over its parent. It opens in the middle of the screen.
- Taking a window carried by the pointer to a workspace out of view, or letting go of it as a floating window.
- Clipping a window's own corners. The border is drawn over them, which reads as rounded, but a window with no border has square corners.
- A settings window. Rivet Shell's can depend on `softcore-settings` and edit the file through the code that owns the format, but that window isn't built.
- Asking a Softcore outside for its key bindings. `Mod+Shift+Escape` does it by hand.
