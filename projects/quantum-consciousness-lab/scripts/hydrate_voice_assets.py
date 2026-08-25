#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCES = ROOT / "voice_sources.json"
OUT = ROOT / "assets" / "voices" / "v1"


def main() -> int:
    doc = json.loads(SOURCES.read_text(encoding="utf-8"))
    checksums: dict[str, dict[str, str]] = {}
    for narrator in ("female", "male"):
        checksums[narrator] = {}
        narrator_dir = OUT / narrator
        narrator_dir.mkdir(parents=True, exist_ok=True)
        for key, url in sorted(doc[narrator].items()):
            target = narrator_dir / f"{key}.mp3"
            with urllib.request.urlopen(url, timeout=45) as response:
                data = response.read()
            if len(data) < 4096:
                raise RuntimeError(f"voice asset too small: {narrator}/{key} ({len(data)} bytes)")
            if not (data.startswith(b"ID3") or data[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2")):
                raise RuntimeError(f"voice asset is not MP3: {narrator}/{key}")
            target.write_bytes(data)
            checksums[narrator][key] = hashlib.sha256(data).hexdigest()
            print(f"VOICE_ASSET {narrator}/{key} bytes={len(data)} sha256={checksums[narrator][key]}")
    (OUT / "checksums.json").write_text(json.dumps(checksums, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    expected = 2 * 12
    actual = sum(len(v) for v in checksums.values())
    if actual != expected:
        raise RuntimeError(f"expected {expected} voice assets, got {actual}")
    print(f"VOICE_ASSETS_OK count={actual}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
