#!/usr/bin/env python3
"""Generate the approved Become the Future You guided meditation.

The script text is the single source of truth. [PAUSE N] markers become silence
and are never spoken. Final MP3 assets are bundled with the Android app.
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "become_future_you_script.txt"
OUT = ROOT / "assets" / "meditations" / "v1" / "become-future-you"
VOICES = {
    "female": ("en-US-JennyNeural", "-12%", "-2Hz"),
    "male": ("en-US-GuyNeural", "-14%", "-6Hz"),
}
PAUSE_RE = re.compile(r"\[PAUSE\s+(\d+)\]")


def parse_script() -> list[tuple[str, int]]:
    raw = SCRIPT.read_text(encoding="utf-8-sig").strip()
    parts = PAUSE_RE.split(raw)
    sections: list[tuple[str, int]] = []
    index = 0
    while index < len(parts):
        text = parts[index].strip()
        pause = int(parts[index + 1]) if index + 1 < len(parts) else 0
        if text:
            sections.append((text, pause))
        index += 2
    return sections


def run(*args: str) -> None:
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


async def render_text(path: Path, text: str, voice: str, rate: str, pitch: str) -> None:
    last_error: Exception | None = None
    for attempt in range(5):
        try:
            await edge_tts.Communicate(
                text=text,
                voice=voice,
                rate=rate,
                pitch=pitch,
                volume="-2%",
            ).save(str(path))
            if path.exists() and path.stat().st_size > 1500:
                return
        except Exception as exc:
            last_error = exc
            await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Failed to render {path.name}: {last_error}")


async def build_narrator(narrator: str, voice: str, rate: str, pitch: str, sections: list[tuple[str, int]]) -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    final = OUT / f"{narrator}.mp3"
    with tempfile.TemporaryDirectory(prefix=f"future-you-{narrator}-") as temp_name:
        temp = Path(temp_name)
        pieces: list[Path] = []
        silence_cache: dict[int, Path] = {}

        for idx, (text, pause_seconds) in enumerate(sections):
            raw_mp3 = temp / f"speech-{idx:03d}.mp3"
            speech_wav = temp / f"speech-{idx:03d}.wav"
            await render_text(raw_mp3, text, voice, rate, pitch)
            run(
                "ffmpeg", "-y", "-i", str(raw_mp3),
                "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(speech_wav),
            )
            pieces.append(speech_wav)

            if pause_seconds:
                silence = silence_cache.get(pause_seconds)
                if silence is None:
                    silence = temp / f"silence-{pause_seconds}.wav"
                    run(
                        "ffmpeg", "-y",
                        "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
                        "-t", str(pause_seconds),
                        "-c:a", "pcm_s16le", str(silence),
                    )
                    silence_cache[pause_seconds] = silence
                pieces.append(silence)

        concat = temp / "concat.txt"
        concat.write_text(
            "".join(f"file '{piece.as_posix().replace(chr(39), chr(39) + '\\\\' + chr(39) + chr(39))}'\n" for piece in pieces),
            encoding="utf-8",
        )
        run(
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat),
            "-ar", "24000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", str(final),
        )

    probe = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(final)
    ], text=True).strip()
    data = final.read_bytes()
    return {
        "file": final.name,
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
        "durationSeconds": round(float(probe), 3),
        "voice": voice,
        "baseRate": rate,
        "pitch": pitch,
    }


async def main_async() -> None:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        raise RuntimeError("ffmpeg and ffprobe are required")
    sections = parse_script()
    if len(sections) < 20:
        raise RuntimeError(f"Unexpectedly short script structure: {len(sections)} sections")

    script_text = SCRIPT.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    spoken = PAUSE_RE.sub("", SCRIPT.read_text(encoding="utf-8-sig"))
    word_count = len(re.findall(r"\S+", spoken))
    pause_seconds = sum(pause for _, pause in sections)

    results = {}
    for narrator, (voice, rate, pitch) in VOICES.items():
        print(f"Rendering {narrator} with {voice}...")
        results[narrator] = await build_narrator(narrator, voice, rate, pitch, sections)
        print(json.dumps(results[narrator], indent=2))

    metadata = {
        "title": "Become the Future You",
        "script": SCRIPT.name,
        "scriptSha256": hashlib.sha256(script_text.encode("utf-8")).hexdigest(),
        "spokenWordCount": word_count,
        "pauseSeconds": pause_seconds,
        "sections": len(sections),
        "provider": "Microsoft Edge neural voices via edge-tts",
        "edgeTtsVersion": getattr(edge_tts, "__version__", "unknown"),
        "runtimeTtsRequired": False,
        "narrators": results,
    }
    (OUT / "manifest.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    print(f"GUIDED_MEDITATION_OK words={word_count} pauses={pause_seconds}s sections={len(sections)}")


if __name__ == "__main__":
    asyncio.run(main_async())
