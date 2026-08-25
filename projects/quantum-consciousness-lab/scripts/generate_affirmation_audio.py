#!/usr/bin/env python3
"""Generate natural neural affirmation clips with Microsoft Edge neural voices.

The generated MP3 files are checked into the repository, so the released app
never needs a TTS service and never falls back to Android system TTS.
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'affirmations' / 'v1'
VOICES = {
    'female': ('en-US-JennyNeural', '-12%', '-2Hz'),
    'male': ('en-US-GuyNeural', '-14%', '-6Hz'),
}


def load_affirmations():
    script = "const {AFFIRMATIONS}=require('./src/core/affirmationModel'); process.stdout.write(JSON.stringify(AFFIRMATIONS));"
    raw = subprocess.check_output(['node', '-e', script], cwd=ROOT, text=True, encoding='utf-8')
    return json.loads(raw)


async def render_one(sem, narrator, voice, rate, pitch, item, style):
    path = OUT / narrator / f"{item['id']}-{style}.mp3"
    path.parent.mkdir(parents=True, exist_ok=True)
    text = item[style]
    async with sem:
        last_error = None
        for attempt in range(4):
            try:
                communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch, volume='-2%')
                await communicate.save(str(path))
                if path.exists() and path.stat().st_size > 2000:
                    return path
            except Exception as exc:
                last_error = exc
                await asyncio.sleep(1.5 * (attempt + 1))
        raise RuntimeError(f'failed {narrator}/{item["id"]}-{style}: {last_error}')


async def main_async():
    items = load_affirmations()
    sem = asyncio.Semaphore(6)
    tasks = []
    for narrator, (voice, rate, pitch) in VOICES.items():
        for item in items:
            for style in ('command', 'becoming'):
                tasks.append(render_one(sem, narrator, voice, rate, pitch, item, style))
    paths = await asyncio.gather(*tasks)
    checksums = {}
    for path in paths:
        relative = path.relative_to(OUT).as_posix()
        checksums[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
    (OUT / 'checksums.json').write_text(json.dumps(checksums, indent=2, sort_keys=True) + '\n', encoding='utf-8')
    (OUT / 'generator.json').write_text(json.dumps({
        'provider': 'Microsoft Edge neural voices via edge-tts',
        'femaleVoice': VOICES['female'][0],
        'maleVoice': VOICES['male'][0],
        'files': len(paths),
        'runtimeTtsRequired': False,
    }, indent=2) + '\n', encoding='utf-8')
    print(f'generated={len(paths)}')
    print(f'output={OUT}')


if __name__ == '__main__':
    asyncio.run(main_async())
