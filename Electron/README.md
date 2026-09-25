# Countdown Game — Electron edition

This folder contains a desktop conversion of the browser-based Countdown Game. The original files in the parent folder are unchanged.

## What was changed

1. Added `main.js`, the Electron main process that creates and manages the desktop window.
2. Added `package.json` with development scripts and `electron-builder` packaging targets.
3. Copied the game HTML, JavaScript, CSS, and image assets into this self-contained folder.
4. Kept Node.js APIs out of the game page by enabling context isolation and sandboxing and disabling Node integration.
5. Added a restrictive Content Security Policy and blocked navigation and pop-up windows.
6. Registered F12 as a DevTools toggle because inspecting the console, CSS, and HTML is part of the game.
7. Removed the remote Google Fonts dependency and used local system monospace fonts so the game works offline.
8. Changed the button handling to a standard form submission handler, so both clicking **Stop!** and pressing Enter work.
9. Replaced the original nested CSS rules with broadly compatible CSS selectors.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (the current LTS release is recommended)
- npm, which is installed with Node.js

## Install and run locally

Open a terminal in this `Electron` folder, then run:

```sh
npm install
npm start
```

With the game window focused, press **F12** to toggle its developer tools. On keyboards where F12 controls a hardware feature, use **Fn+F12**. You can also use **Ctrl+Shift+I** on Windows/Linux or **Cmd+Option+I** on macOS.

## Package without creating an installer

```sh
npm run pack
```

This creates an unpacked application under `release/`. It is useful for local testing before producing an installer.

## Build installers

Build output is written to the `release/` folder. In general, build each target on its native operating system. Native builds avoid platform toolchain and code-signing complications.

### Windows

On Windows, install the dependencies and build:

```powershell
npm install
npm run dist:win
```

The configuration produces both an NSIS installer (`.exe`) and a portable `.exe`. For public distribution, sign the executables with a trusted Windows code-signing certificate; otherwise, Windows SmartScreen may warn users.

### macOS

On macOS, install the dependencies and build:

```sh
npm install
npm run dist:mac
```

The configuration produces a `.dmg` and a `.zip`. Public distribution normally requires an Apple Developer ID certificate, hardened runtime signing, and Apple notarization. An unsigned build can still be used for local testing, but Gatekeeper may block or warn about it.

To support both Apple Silicon and Intel Macs, build on the appropriate machines or add an architecture flag:

```sh
npx electron-builder --mac --arm64
npx electron-builder --mac --x64
```

### Linux

On Linux, install the dependencies and build:

```sh
npm install
npm run dist:linux
```

The configuration produces an AppImage and a Debian package. Build the `.deb` on a Debian- or Ubuntu-based system for the most predictable result. Some distributions may require extra packaging tools such as `fakeroot` and `dpkg`.

## Build for the current operating system

To build the configured targets for whichever operating system is currently running:

```sh
npm run dist
```

## Application icon

The desktop window and packaged application use `images/smiley.png` as their icon. Electron Builder converts this source image to the platform-specific icon format during packaging. For the sharpest results across every operating system, use a square PNG of at least 512×512 pixels with transparent padding around non-square artwork.

## Distribution notes

- Do not commit `node_modules/` or `release/`; both are ignored by `.gitignore`.
- Keep the included `package-lock.json` committed so dependency resolution remains reproducible.
- Version the application by changing the `version` field in `package.json` before each release.
- Code signing is not required for private classroom use, but it is strongly recommended for public downloads.
