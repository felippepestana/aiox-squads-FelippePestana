#!/usr/bin/env bash
# Extract transcript (and optionally frames) from a YouTube video so Claude can read it.
# Usage: extract.sh <url> [--frames <interval_seconds>] [--out <dir>]
set -euo pipefail

ok()   { printf '\033[32m[ok]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[warn]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[31m[err]\033[0m %s\n' "$*" >&2; }
step() { printf '\033[36m==>\033[0m %s\n' "$*"; }

URL="${1:-}"
[ -n "$URL" ] || { err "Usage: extract.sh <url> [--frames <seconds>] [--out <dir>]"; exit 1; }
shift

FRAMES_INTERVAL=""
OUT="./youtube_out"
while [ $# -gt 0 ]; do
  case "$1" in
    --frames) FRAMES_INTERVAL="${2:?missing interval}"; shift 2 ;;
    --out)    OUT="${2:?missing dir}"; shift 2 ;;
    *) err "Unknown option: $1"; exit 1 ;;
  esac
done

command -v yt-dlp >/dev/null 2>&1 || { err "yt-dlp not found. Install: pip install yt-dlp"; exit 1; }
mkdir -p "$OUT"

step "Fetching subtitles"
yt-dlp --skip-download --write-subs --write-auto-subs \
  --sub-langs "pt.*,en.*" --convert-subs srt \
  -o "$OUT/video" "$URL" || warn "yt-dlp subtitle fetch failed"

if ls "$OUT"/video*.srt >/dev/null 2>&1; then
  ok "Subtitles saved in $OUT"
else
  warn "No subtitles found; falling back to Whisper"
  command -v whisper >/dev/null 2>&1 || { err "whisper not found. Install: pip install openai-whisper"; exit 1; }
  command -v ffmpeg >/dev/null 2>&1 || { err "ffmpeg not found"; exit 1; }
  step "Downloading audio"
  yt-dlp -x --audio-format mp3 -o "$OUT/audio.%(ext)s" "$URL"
  step "Transcribing (this can take a while)"
  whisper "$OUT/audio.mp3" --language pt --model small --output_format srt --output_dir "$OUT"
  ok "Transcript saved in $OUT"
fi

if [ -n "$FRAMES_INTERVAL" ]; then
  command -v ffmpeg >/dev/null 2>&1 || { err "ffmpeg not found"; exit 1; }
  step "Downloading video (<=720p) and extracting frames every ${FRAMES_INTERVAL}s"
  yt-dlp -f "bv*[height<=720]" -o "$OUT/video.mp4" "$URL"
  mkdir -p "$OUT/frames"
  ffmpeg -loglevel error -i "$OUT/video.mp4" -vf "fps=1/${FRAMES_INTERVAL}" "$OUT/frames/f_%04d.jpg"
  ok "Frames saved in $OUT/frames"
fi
