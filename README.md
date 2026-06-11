# OpenImage Viewer

**Fast advanced image viewer for Chrome & Edge**

OpenImage Viewer is a community-maintained fork inspired by the original BetterViewer project. It preserves the existing UI/UX and toolset while adding a Manifest V3-compatible hybrid detection architecture that restores automatic image-tab opening in modern Chromium browsers.

<p align="center">    
   <a href="https://chrome.google.com/webstore/detail/dfpemcegmaneancpddbicmlemcnfekoj"><img src="./docs/download-chrome.svg"></a>
   <a href="https://microsoftedge.microsoft.com/addons/detail/openimage-viewer/mljgllcfchmdmmgemmjghhdkbnbmmjgb?hl=en-GB"><img src="./docs/edge.svg"></a>
   <a href="https://addons.mozilla.org/en-US/firefox/addon/openimage-viewer/"><img src="./docs/firefox.svg"></a>
</p>

## Why this fork exists

When Chromium moved from MV2 to MV3, automatic behavior for **“Open image in new tab”** became unreliable in many image viewer extensions.

This fork solves that with a hybrid approach:

- URL-based image detection
- File extension detection
- MIME/content-type detection from response headers
- Navigation event detection
- Direct image-tab DOM detection
- Automatic redirect to the viewer page

Fallback remains available:

- Right-click image → **Open Image in OpenImage Viewer**

## Features

- Zoom in / zoom out / 1:1 / reset
- Fullscreen
- Rotate / flip
- Crop image
- Photo editor
- Annotate image
- Color picker
- Download image
- Image details (EXIF/metadata)
- QR scanner
- Reverse image search
- Photopea integration
- Keyboard shortcuts and toolbar customization

## Screenshots

![Screenshot 1](./docs/screenshot1.png)
![Screenshot 2](./docs/screenshot2.png)
![Screenshot 3](./docs/screenshot3.png)
![Screenshot 4](./docs/screenshot4.png)

## Installation

### Local development

```bash
pnpm install
pnpm dev
```

### Build packages

```bash
pnpm build:chrome
pnpm build
```

## MV3 compatibility notes

This extension is built on Manifest V3 and uses a layered detection strategy to preserve auto-open behavior for direct image tabs in Chromium-based browsers.

It keeps permissions focused on what is required for:

- tab/navigation tracking
- content-type checks
- context menu fallback
- local state storage

## Keyboard shortcuts

Default shortcuts include:

- `+` / `-` / `0` for zoom controls
- `Shift + Arrow` for rotation
- `Ctrl + E` editor
- `Ctrl + X` crop
- `Shift + C` color picker
- `Ctrl + D` download
- `Ctrl + I` image details

## Supported image formats

Common formats include:

- JPG / JPEG / PNG / GIF / WEBP
- SVG / BMP / ICO
- AVIF
- TIFF / TIF
- APNG / JFIF / PJPEG / PJP
- HEIC / HEIF (site/browser support dependent)

## Known limitations

- Some websites intentionally block direct image access via headers/CSP.
- HEIC/HEIF behavior depends on browser decoding support.
- Firefox MV3 behavior may differ from Chromium behavior.

## Roadmap

- [ ] Refine Firefox-specific image-tab detection
- [ ] Add automated end-to-end regression tests for redirect flow
- [ ] Add refreshed store assets and icon set for OpenImage Viewer branding
- [ ] Improve onboarding and in-app settings UX

## Attribution

- Inspired by / based on: **[BetterViewer](https://github.com/Ademking/BetterViewer)** (original open-source project)
- License: **MIT**
- Icon attribution: **Icons made by Graphics Plazza from Flaticon**

## Credits

OpenImage Viewer is a community-maintained fork inspired by the original BetterViewer project by Adem Kouki.

Original project:
https://github.com/Ademking/BetterViewer

Includes additional Manifest V3 compatibility improvements and modern Chromium support.

## Contributors

Community-maintained. Contributions are welcome via pull requests and issues.

## License

MIT License. See [LICENSE](./LICENSE).
