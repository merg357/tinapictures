#!/usr/bin/env python3
"""Generate deterministic, original meditation audio loops for Consciousness Lab.

Uses only the Python standard library. Files are intentionally short loop beds;
the app loops them with expo-audio. Nothing here is a third-party recording.
"""
from __future__ import annotations

import hashlib
import json
import math
import random
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "sounds" / "v1"
RATE = 22050
SECONDS = 20
FRAMES = RATE * SECONDS
TAU = math.tau


def soft_clip(x: float) -> float:
    return math.tanh(x * 1.25) * 0.78


def fade(i: int, total: int, edge_seconds: float = 1.5) -> float:
    edge = max(1, int(RATE * edge_seconds))
    if i < edge:
        return i / edge
    if i > total - edge:
        return max(0.0, (total - i) / edge)
    return 1.0


def write_mono(path: Path, sample_fn) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        buf = bytearray()
        for i in range(FRAMES):
            v = soft_clip(sample_fn(i / RATE, i) * fade(i, FRAMES))
            buf.extend(struct.pack("<h", int(max(-1, min(1, v)) * 32767)))
        wav.writeframes(buf)


def write_stereo(path: Path, sample_fn) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        buf = bytearray()
        for i in range(FRAMES):
            l, r = sample_fn(i / RATE, i)
            f = fade(i, FRAMES)
            l = soft_clip(l * f)
            r = soft_clip(r * f)
            buf.extend(struct.pack("<hh", int(l * 32767), int(r * 32767)))
        wav.writeframes(buf)


def pad(freqs, movement=0.04, brightness=0.10):
    def fn(t, _i):
        total = 0.0
        for idx, f in enumerate(freqs):
            wobble = 1 + movement * math.sin(TAU * (0.021 + idx * 0.004) * t + idx)
            total += math.sin(TAU * f * wobble * t + idx * 0.71) / (idx + 1)
            total += brightness * math.sin(TAU * f * 2.0 * t + idx * 0.2) / (idx + 1)
        return total * 0.18
    return fn


def rain(seed=11, intensity=0.32):
    rng = random.Random(seed)
    state = 0.0
    def fn(_t, _i):
        nonlocal state
        white = rng.uniform(-1, 1)
        state = state * 0.86 + white * 0.14
        tick = rng.uniform(-0.12, 0.12) if rng.random() < 0.012 else 0.0
        return (state * 0.7 + white * 0.25 + tick) * intensity
    return fn


def ocean(seed=19):
    rng = random.Random(seed)
    state = 0.0
    def fn(t, _i):
        nonlocal state
        white = rng.uniform(-1, 1)
        state = state * 0.97 + white * 0.03
        swell = 0.22 + 0.20 * (0.5 + 0.5 * math.sin(TAU * 0.075 * t))
        foam = white * (0.04 + 0.06 * max(0, math.sin(TAU * 0.075 * t)))
        return state * swell + foam
    return fn


def forest(seed=29):
    rng = random.Random(seed)
    air = 0.0
    chirps = []
    for _ in range(22):
        start = rng.uniform(0.4, SECONDS - 0.7)
        dur = rng.uniform(0.12, 0.35)
        freq = rng.uniform(1600, 3600)
        chirps.append((start, dur, freq))
    def fn(t, _i):
        nonlocal air
        white = rng.uniform(-1, 1)
        air = air * 0.985 + white * 0.015
        value = air * 0.16
        for start, dur, freq in chirps:
            x = t - start
            if 0 <= x <= dur:
                env = math.sin(math.pi * x / dur) ** 2
                value += 0.055 * env * math.sin(TAU * (freq + 500 * x) * x)
        return value
    return fn


def stream(seed=37):
    rng = random.Random(seed)
    low = 0.0
    mid = 0.0
    def fn(t, _i):
        nonlocal low, mid
        w = rng.uniform(-1, 1)
        low = low * 0.95 + w * 0.05
        mid = mid * 0.75 + w * 0.25
        bubble = 0.02 * math.sin(TAU * (620 + 80 * math.sin(TAU * 0.3 * t)) * t)
        return low * 0.19 + mid * 0.08 + bubble
    return fn


def night_forest(seed=43):
    rng = random.Random(seed)
    breeze = 0.0
    def fn(t, _i):
        nonlocal breeze
        w = rng.uniform(-1, 1)
        breeze = breeze * 0.99 + w * 0.01
        cricket_gate = max(0.0, math.sin(TAU * 2.4 * t)) ** 10
        cricket = math.sin(TAU * 4200 * t) * cricket_gate * 0.045
        return breeze * 0.12 + cricket
    return fn


def thunder(seed=53):
    rng = random.Random(seed)
    noise = 0.0
    strikes = [4.0, 11.2, 17.1]
    def fn(t, _i):
        nonlocal noise
        w = rng.uniform(-1, 1)
        noise = noise * 0.985 + w * 0.015
        rumble = noise * 0.06
        for start in strikes:
            x = t - start
            if 0 <= x < 2.8:
                env = math.exp(-1.2 * x)
                rumble += env * (0.18 * math.sin(TAU * 47 * t) + 0.09 * math.sin(TAU * 73 * t))
        return rumble
    return fn


def binaural(base: float, beat: float):
    def fn(t, _i):
        slow = 0.72 + 0.10 * math.sin(TAU * 0.05 * t)
        return (
            slow * 0.16 * math.sin(TAU * base * t),
            slow * 0.16 * math.sin(TAU * (base + beat) * t),
        )
    return fn


def tone_bed(freq: float):
    def fn(t, _i):
        lfo = 0.68 + 0.15 * math.sin(TAU * 0.055 * t)
        return lfo * (0.13 * math.sin(TAU * freq * t) + 0.05 * math.sin(TAU * freq / 2 * t))
    return fn


def breath_pulse(t, _i):
    phase = t % 10.0
    env = math.sin(math.pi * min(phase, 4.0) / 4.0) ** 2 if phase < 4.0 else (math.sin(math.pi * min(phase - 4.0, 6.0) / 6.0) ** 2) * 0.45
    return env * (0.07 * math.sin(TAU * 220 * t) + 0.025 * math.sin(TAU * 440 * t))


def floating_piano(t, _i):
    notes = [(0.0, 261.63), (3.3, 329.63), (6.7, 392.0), (10.1, 329.63), (13.4, 293.66), (16.7, 392.0)]
    value = 0.0
    for start, freq in notes:
        x = t - start
        if 0 <= x < 3.0:
            env = math.exp(-1.35 * x)
            value += env * (0.12 * math.sin(TAU * freq * x) + 0.045 * math.sin(TAU * freq * 2 * x))
    return value + 0.035 * math.sin(TAU * 130.81 * t)


def generate() -> dict[str, str]:
    specs = {
        "background/cosmic-ambient.wav": ("mono", pad([110, 164.81, 220], 0.025, 0.08)),
        "background/deep-space.wav": ("mono", pad([73.42, 110, 146.83], 0.018, 0.04)),
        "background/heart-glow.wav": ("mono", pad([130.81, 196, 261.63], 0.035, 0.12)),
        "background/ocean.wav": ("mono", ocean()),
        "background/rain.wav": ("mono", rain()),
        "background/forest.wav": ("mono", forest()),
        "utility/breath-pulse.wav": ("mono", breath_pulse),
        "extended/floating-piano.wav": ("mono", floating_piano),
        "extended/dreamscape.wav": ("mono", pad([98, 146.83, 233.08], 0.05, 0.13)),
        "extended/mountain-stream.wav": ("mono", stream()),
        "extended/night-forest.wav": ("mono", night_forest()),
        "extended/distant-thunder.wav": ("mono", thunder()),
        "frequency/alpha-10.wav": ("stereo", binaural(200, 10)),
        "frequency/theta-6.wav": ("stereo", binaural(180, 6)),
        "frequency/delta-2.wav": ("stereo", binaural(160, 2)),
        "frequency/gamma-40.wav": ("stereo", binaural(220, 40)),
        "frequency/hz-432.wav": ("mono", tone_bed(432)),
        "frequency/hz-528.wav": ("mono", tone_bed(528)),
        "extended/hz-396.wav": ("mono", tone_bed(396)),
        "extended/hz-417.wav": ("mono", tone_bed(417)),
        "extended/hz-639.wav": ("mono", tone_bed(639)),
        "extended/hz-741.wav": ("mono", tone_bed(741)),
        "extended/hz-852.wav": ("mono", tone_bed(852)),
    }
    checksums = {}
    for relative, (mode, fn) in specs.items():
        path = OUT / relative
        if mode == "stereo":
            write_stereo(path, fn)
        else:
            write_mono(path, fn)
        checksums[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
    (OUT / "checksums.json").write_text(json.dumps(checksums, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return checksums


if __name__ == "__main__":
    result = generate()
    print(f"generated={len(result)}")
    print(f"output={OUT}")
