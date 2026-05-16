# YT Downloader — Premiere Pro CEP Extension
Download YouTube, Instagram, and Twitter/X videos directly inside Premiere Pro.

---

## Prerequisites
- Adobe Premiere Pro 2019 or later
- yt-dlp at `C:\Windows\System32\yt-dlp.exe`  ✓ (already installed)
- ffmpeg in PATH (needed for merging video+audio)
  → Download from https://ffmpeg.org/download.html and add to System32 or PATH

---

## Install (Windows)

### Step 1 — Enable unsigned extensions (one-time)

Open **Registry Editor** (regedit) and navigate to:
```
HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.11
```
> If using Premiere 2022 or older, try CSXS.10 or CSXS.9

Right-click → **New → String Value**
- Name:  `PlayerDebugMode`
- Value: `1`

> ⚠️ This allows loading unsigned extensions (safe for local dev use).

### Step 2 — Copy extension folder

Copy the `YTDownloader` folder to:
```
C:\Users\<YourName>\AppData\Roaming\Adobe\CEP\extensions\YTDownloader\
```

(Create the `extensions` folder if it doesn't exist.)

### Step 3 — Launch Premiere Pro

Go to **Window → Extensions → YT Downloader**

---

## Usage

1. Paste a YouTube / Instagram / Twitter URL
2. Pick a format (Best Quality, 1080p, 720p, 480p, or MP3)
3. Choose output folder (defaults to Downloads)
4. Click **↓ DOWNLOAD**
5. Once done, click **↑ IMPORT TO PROJECT** to add to your Premiere project

---

## Notes
- Instagram private content requires being logged in via cookies
- Twitter/X videos download as the best available quality
- The log box shows real-time yt-dlp output
- Cancel button stops the download mid-way

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Extension not showing | Check registry key, restart Premiere |
| yt-dlp not found | Confirm `C:\Windows\System32\yt-dlp.exe` exists |
| No audio in video | Install ffmpeg and add to PATH |
| Instagram fails | Try adding `--cookies-from-browser chrome` manually |
