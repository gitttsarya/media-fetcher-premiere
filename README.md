# 🎬 Media Fetcher — Premiere Pro Extension

<img width="482" height="637" alt="Image" src="https://github.com/user-attachments/assets/80d7b18b-05aa-4da2-ad41-564e1c43dda4" />

Download videos from **YouTube, Instagram & X/Twitter** inside Premiere Pro and auto-import them to your project bin.

---

## ✨ Features

- 🔗 Paste any YouTube / Instagram / X link and download instantly
- 📂 Auto-imports file into your Premiere Pro project bin
- 🎞️ Quality options — Best, 1080p, 720p, 480p, MP3
- 📊 Live progress bar with speed & ETA
- ❌ Cancel anytime

---

## 📋 Requirements

- Adobe Premiere Pro 2019 or newer (Windows)
- [yt-dlp.exe](https://github.com/yt-dlp/yt-dlp/releases/latest)
- [ffmpeg.exe](https://ffmpeg.org/download.html)

---

## ⚙️ Installation

### 1️⃣ Install yt-dlp & ffmpeg

- Download `yt-dlp.exe` → [yt-dlp releases](https://github.com/yt-dlp/yt-dlp/releases/latest)
- Download `ffmpeg.exe` → [ffmpeg.org](https://ffmpeg.org/download.html) (inside the `bin` folder of the zip)
- Copy **both files** to `C:\Windows\System32\`

---

### 2️⃣ Enable extensions in Registry (one-time)

1. Press `Win + R` → type `regedit` → Enter
2. Navigate to:
   ```
   HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.11
   ```
   > Use `CSXS.10` for Premiere 2022 or `CSXS.9` for Premiere 2021
3. Right-click empty space on right panel → **New → String Value**
   - Name: `PlayerDebugMode`
   - Value: `1`
4. Close Registry Editor

---

### 3️⃣ Copy the extension folder

1. Download this repo → green **Code** button → **Download ZIP** → extract it
2. Open this folder (create it if it doesn't exist):
   ```
   C:\Users\YourName\AppData\Roaming\Adobe\CEP\extensions\
   ```
   > Shortcut: `Win + R` → type `%appdata%` → Enter → go to `Adobe\CEP\extensions`
3. Copy the `Media Fetcher` folder inside `extensions\`

---

### 4️⃣ Open in Premiere Pro

1. Launch / restart Premiere Pro
2. **Window → Extensions → Media Fetcher**
3. Dock the panel anywhere ✓

---

## 🚀 How to use

1. Paste a URL
2. Select quality
3. Click **↓ DOWNLOAD & IMPORT**
4. Done — file appears in your project bin automatically ✅

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| Panel not showing | Check `PlayerDebugMode = 1` in regedit & folder name is exactly `Media Fetcher` |
| Download fails | Run `yt-dlp --version` in terminal to confirm it's installed |
| Doesn't import | Make sure `ffmpeg.exe` is also in `C:\Windows\System32\` |

---
