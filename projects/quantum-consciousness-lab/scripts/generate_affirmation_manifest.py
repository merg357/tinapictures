#!/usr/bin/env python3
from __future__ import annotations
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src' / 'voice' / 'affirmationManifest.ts'
script = "const {AFFIRMATIONS}=require('./src/core/affirmationModel'); process.stdout.write(JSON.stringify(AFFIRMATIONS.map(x=>x.id)));"
ids = json.loads(subprocess.check_output(['node','-e',script], cwd=ROOT, text=True, encoding='utf-8'))
lines = [
    "import type { AffirmationStyle, NarratorId } from '../types';",
    '',
    'const ASSETS: Record<NarratorId, Record<string, number>> = {',
]
for narrator in ('female','male'):
    lines.append(f'  {narrator}: {{')
    for item_id in ids:
        for style in ('command','becoming'):
            key = f'{item_id}:{style}'
            lines.append(f"    '{key}': require('../../assets/affirmations/v1/{narrator}/{item_id}-{style}.mp3'),")
    lines.append('  },')
lines.extend([
    '};',
    '',
    'export function resolveAffirmationAsset(affirmationId: string, style: AffirmationStyle, narratorId: NarratorId): number {',
    '  const key = `${affirmationId}:${style}`;',
    '  const source = ASSETS[narratorId]?.[key];',
    '  if (!source) throw new Error(`Missing neural affirmation asset: ${narratorId}/${key}`);',
    '  return source;',
    '}',
    '',
    f"export const BUNDLED_AFFIRMATION_COUNT = {len(ids)};",
    '',
])
OUT.write_text('\n'.join(lines), encoding='utf-8')
print(f'wrote={OUT}')
