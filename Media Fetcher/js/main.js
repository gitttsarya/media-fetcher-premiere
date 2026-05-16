const { spawn } = require("child_process");
const path = require("path");
const os   = require("os");
const fs   = require("fs");

const YTDLP = "C:\\Windows\\System32\\yt-dlp.exe";
const DL    = path.join(os.homedir(), "Downloads");

let proc = null, lastFile = null;

const $ = id => document.getElementById(id);
const urlEl  = $("url-input");
const fmtEl  = $("format-sel");
const outEl  = $("out-dir");
const dlBtn  = $("download-btn");
const cnlBtn = $("cancel-btn");
const progW  = $("progress-wrap");
const barEl  = $("bar");
const pctEl  = $("pct");
const etaEl  = $("eta");
const statEl = $("status");
const dotEl  = $("dot");
const logEl  = $("log");

outEl.value = DL;

$("browse-btn").onclick = () => {
  try {
    const r = window.cep.fs.showOpenDialog(false, true, "Select Folder", outEl.value);
    if (r && r.data && r.data[0]) outEl.value = r.data[0];
  } catch(e) {
    const p = prompt("Output folder:", outEl.value);
    if (p) outEl.value = p;
  }
};

dlBtn.onclick = () => {
  const url = urlEl.value.trim();
  if (!url) { setStatus("Paste a URL first", "warn"); return; }
  if (!fs.existsSync(YTDLP)) { setStatus("yt-dlp not found", "err"); return; }

  const dir = outEl.value.trim() || DL;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  lastFile = null;
  logEl.textContent = "";
  progW.style.display = "flex";
  etaEl.textContent = "";
  setBar(0);
  dlBtn.disabled = true;
  cnlBtn.style.display = "block";
  setStatus("Downloading…", "info");

  const args = buildArgs(url, fmtEl.value, dir);

  proc = spawn(YTDLP, args);

  proc.stdout.on("data", d => { const t = d.toString(); log(t); parseLine(t, dir); });
  proc.stderr.on("data", d => { log(d.toString()); });

  proc.on("close", code => {
    proc = null;
    dlBtn.disabled = false;
    cnlBtn.style.display = "none";
    if (code === 0) {
      setBar(100);
      // If we still don't have the file, scan the folder for newest video
      if (!lastFile) lastFile = newestFile(dir);
      setStatus("Importing…", "info");
      setTimeout(autoImport, 600);
    } else if (code === null) {
      setStatus("Cancelled", "warn");
    } else {
      setStatus("Failed — check log", "err");
    }
  });

  proc.on("error", e => {
    dlBtn.disabled = false;
    cnlBtn.style.display = "none";
    setStatus("Error: " + e.message, "err");
  });
};

cnlBtn.onclick = () => {
  if (proc) { proc.kill(); proc = null; }
  dlBtn.disabled = false;
  cnlBtn.style.display = "none";
  setStatus("Cancelled", "warn");
};

function autoImport() {
  if (!lastFile) { setStatus("Done ✓ (file path not found)", "warn"); return; }
  if (!fs.existsSync(lastFile)) {
    // try newest file fallback
    const dir = outEl.value.trim() || DL;
    lastFile = newestFile(dir);
  }
  if (!lastFile) { setStatus("Done ✓ (file not found on disk)", "warn"); return; }

  try {
    const cs = new CSInterface();
    const p  = lastFile.replace(/\\/g, "\\\\");
    cs.evalScript('importFileToProject("' + p + '")', res => {
      if (res === "OK") {
        setStatus("Imported to project ✓", "ok");
        log('\n✓ Imported: ' + lastFile + '\n', 'g');
      } else {
        setStatus("Done — import failed: " + res, "warn");
        log('\n[import error] ' + res + '\n', 'e');
      }
    });
  } catch(e) {
    setStatus("Done ✓ (Premiere link error)", "warn");
    log('\n[CSInterface error] ' + e.message + '\n', 'e');
  }
}

// Scan directory for most recently modified media file (fallback)
function newestFile(dir) {
  try {
    const exts = [".mp4", ".mkv", ".webm", ".mp3", ".m4a", ".mov"];
    const files = fs.readdirSync(dir)
      .filter(f => exts.some(e => f.toLowerCase().endsWith(e)))
      .map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t);
    if (files.length && (Date.now() - files[0].t < 60000)) {
      return path.join(dir, files[0].f);
    }
  } catch(e) {}
  return null;
}

function buildArgs(url, fmt, dir) {
  const o    = path.join(dir, "%(title)s.%(ext)s");
  const base = ["-o", o, "--newline", "--no-playlist", "--progress"];
  if (fmt === "bestaudio") return [...base, "-x", "--audio-format", "mp3", url];
  const h = { "1080":"1080", "720":"720", "480":"480" }[fmt];
  if (h) return [...base, "-f", `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`, "--merge-output-format", "mp4", url];
  return [...base, "-f", "bestvideo+bestaudio/best", "--merge-output-format", "mp4", url];
}

function parseLine(line, dir) {
  // Progress: [download]  68.2% of ...
  const m = line.match(/\[download\]\s+([\d.]+)%(?:.*?at\s+([\S]+))?(?:.*?ETA\s+([\S]+))?/);
  if (m) {
    setBar(parseFloat(m[1]));
    setStatus(`Downloading ${parseFloat(m[1]).toFixed(1)}%${m[2] ? " · " + m[2] : ""}`, "info");
    if (m[3]) etaEl.textContent = "ETA " + m[3];
  }

  if (/\[Merger\]|Merging/i.test(line)) { setStatus("Merging…", "info"); setBar(97); }
  if (/\[ExtractAudio\]/i.test(line))   { setStatus("Converting…", "info"); setBar(97); }

  // All known path patterns:
  trySetFile(line.match(/Destination:\s+(.+)/),            1);
  trySetFile(line.match(/Merging formats into "(.+?)"/),   1);
  trySetFile(line.match(/\[ExtractAudio\] Destination:\s+(.+)/), 1);
  // "[download] C:\path\file.mp4 has already been downloaded"
  trySetFile(line.match(/\[download\]\s+(.+?)\s+has already been downloaded/), 1);
  // "[download] C:\path\file.mp4" on its own line (some versions)
  trySetFile(line.match(/\[download\]\s+((?:[A-Za-z]:\\|\/)[^\n]+\.(mp4|mkv|webm|mp3|m4a|mov))/i), 1);
}

function trySetFile(match, idx) {
  if (!match) return;
  const p = match[idx].trim();
  if (p.length > 4 && fs.existsSync(p)) lastFile = p;
}

function setBar(v) {
  barEl.style.width = v + "%";
  pctEl.textContent = Math.round(v) + "%";
}

function setStatus(msg, type) {
  statEl.textContent = msg;
  statEl.className   = type || "";
  dotEl.className    = "dot " + (type || "");
}

function log(txt, cls) {
  if (cls) {
    const s = document.createElement("span");
    s.className = cls; s.textContent = txt;
    logEl.appendChild(s);
  } else {
    logEl.insertAdjacentText("beforeend", txt);
  }
  logEl.scrollTop = logEl.scrollHeight;
}
