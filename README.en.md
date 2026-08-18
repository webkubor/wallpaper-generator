# 🎨 Ambient Wallpaper Studio

> Where the wind has a home, and the heart has a color.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/webkubor/wallpaper-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/webkubor/wallpaper-generator/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/webkubor/wallpaper-generator)](https://github.com/webkubor/wallpaper-generator/releases)

An **online wallpaper maker** that runs entirely in your browser — create beautiful wallpapers adapted to a wide variety of devices in minutes.

## ✨ Features

### 🖌 Simple, WYSIWYG editor
- **Real-time preview** — every adjustment takes effect instantly
- **Drag & drop** — position watermarks and titles with your mouse
- **One-click upload** — drag an image straight into the browser to start

### 📱 Multi-device wallpapers
- **iPhone** — tuned for iOS, including notched screens
- **iPad** — tablet-specific dimensions
- **Mac** — desktop display sizes
- **Car infotainment** — in-vehicle screens
- **Custom size** — any aspect ratio for special needs

### 🎭 Personalization tools
- **Text watermark** — add custom text with selectable fonts & colors
- **Image watermark** — upload a logo or icon as a watermark
- **Title** — add a headline to your wallpaper
- **Opacity** — fine-tune watermark transparency
- **Rotation** — rotate watermarks 360°

### 💾 Templates
- **Save templates** — persist your favorite settings
- **One-click apply** — reuse a saved template instantly
- **Manage templates** — browse and delete personal templates

## 🚀 Quick start (5 minutes)

```bash
pnpm install
pnpm dev
```

1. **Open the site** — visit the local dev server
2. **Upload an image** — click "choose image" or drag & drop
3. **Pick a device** — iPhone / iPad / Mac / car / custom
4. **Add elements** — text watermark, image watermark, or title
5. **Position** — drag elements with your mouse
6. **Export** — download your finished wallpaper

## 🛠 Tech stack

- **Frontend**: Vue 3 + Vite + TypeScript
- **UI**: Naive UI + Phosphor Icons
- **Export**: dom-to-image-more (high-res PNG)
- **PWA**: vite-plugin-pwa (offline-ready)

Pure client-side — **all image processing happens locally in your browser**. No server, no upload, your images stay private.

## ☁️ Deploy

`vercel.json` is included — push to a Vercel project or deploy the static `dist/` anywhere.

## 📄 License

[MIT](./LICENSE) © webkubor

---

*Chinese README: [README.md](./README.md)*
