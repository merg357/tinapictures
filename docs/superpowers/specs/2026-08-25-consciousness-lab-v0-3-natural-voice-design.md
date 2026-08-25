# Consciousness Lab V0.3 — Natural Voice Architecture

Date: 2026-08-25
Status: Design approved in chat; implementation not started

## Problem

V0.2 still uses `expo-speech`, which delegates narration to Android system TTS. Device voice selection, slower rate, lower pitch, and sentence pauses cannot overcome the synthetic character of the underlying system voice. The user has explicitly rejected the current narration quality.

## Product goal

Meditation narration must sound intentionally produced for meditation rather than like a phone reading text. V0.3 will support both a warm/soft female narrator and a calm/deep male narrator, selected by the user.

## Core decision

System TTS is removed from the normal meditation playback path.

V0.3 uses a hybrid voice architecture:

1. **Core practices:** pre-rendered studio-quality neural narration bundled or downloaded as versioned audio assets.
2. **Personalized sessions:** high-quality neural voice generation renders complete audio segments before playback.
3. **Local cache:** personalized renders are cached so repeat sessions play instantly and can work offline after first generation.
4. **Emergency fallback:** Android TTS may remain only as an explicit accessibility/emergency fallback and must never be used silently as the default meditation narrator.

## Narrators

### Female narrator
- Warm, soft, grounded delivery
- Low theatricality
- Natural breath and sentence cadence
- Gentle but not whispery
- Neutral American English for initial release

### Male narrator
- Calm, deep, grounded delivery
- Slow without sounding artificially stretched
- Minimal dramatic emphasis
- Neutral American English for initial release

The user can choose either narrator globally and may override narrator per session.

## Audio-generation strategy

### Core library

The initial core library will have pre-rendered narration for:
- Coherence
- Observer
- Intention
- Deep Rest
- Quantum Foundations
- Expanded Consciousness
- Synchronicity & Dreams

Each core practice has separate male and female tracks.

Tracks are rendered in meaningful segments rather than one giant file so the session engine can preserve phase transitions, pauses, and resume behavior.

### Personalized sessions

For AI-composed sessions, the app sends a validated session script to the neural voice renderer. The renderer returns audio for each segment. Playback begins only after enough segments are ready to guarantee smooth uninterrupted delivery.

The initial preferred open architecture is a Chatterbox-class neural TTS renderer or equivalent high-quality neural voice service. The renderer is behind a provider interface so the app is not permanently coupled to one vendor or model.

## Session audio model

Each meditation segment contains:
- narration audio URI
- start/end metadata
- intended silence before/after
- optional breath cue metadata
- optional ambient layer metadata
- checksum/version
- narrator ID

Silence is implemented as real timing in the session timeline, not punctuation tricks passed to TTS.

## Playback engine

A dedicated audio playback layer replaces `expo-speech` for guided sessions.

Responsibilities:
- preload next segment
- play/pause/resume
- preserve session position
- play real silence between cues
- continue correctly across screen lock/background mode where Android permits
- switch between narration and silence cleanly
- expose playback state to the session screen
- never fall back to system TTS without explicit user consent

## User experience

Before a session starts, the user sees:
- narrator: Female / Male
- guidance: Full / More Silence
- optional voice preview

The app stores the preferred narrator locally.

The UI must not say “best available device voice.” It should show the selected named narrator profile.

## Offline behavior

Core practices must be usable offline.

Personalized sessions work as follows:
- cached render available: play offline
- uncached render and online: generate, cache, play
- uncached render and offline: offer a core practice using the selected narrator instead of silently switching to Android TTS

## Privacy

Personalized session text sent for rendering must contain only the generated meditation script required for narration. Private journal entries are not sent to the voice renderer unless the user explicitly chooses a feature that requires them later.

Voice cache is stored locally under app-controlled storage and can be cleared from settings.

## Reliability and error handling

If neural rendering fails:
1. retry once if the network error is transient
2. use an already cached version if available
3. offer the closest pre-rendered core practice
4. show an explicit error if nothing is available

The app must never silently degrade to robotic system TTS.

## Versioning

Voice assets are versioned independently from app code.

A voice manifest maps:
- practice ID
- narrator ID
- segment ID
- asset version
- SHA-256
- duration
- local/remote URI

This allows narrator improvements without changing meditation logic.

## Architecture boundaries

### `voiceProvider`
Generates or retrieves neural narration assets.

### `voiceManifest`
Resolves versioned narrator assets for core practices.

### `audioCache`
Stores and validates downloaded/generated audio.

### `meditationPlayer`
Controls playback timing, pauses, resume, and background state.

### `SessionScreen`
Consumes playback state but does not generate speech itself.

No screen component calls Android TTS directly.

## Release tests

V0.3 may not ship unless CI/device testing verifies:

1. `expo-speech` is not invoked by the standard meditation path.
2. Female narrator selection plays the female neural audio asset.
3. Male narrator selection plays the male neural audio asset.
4. Pause/resume returns to the correct audio position.
5. Session phase transitions preserve intended silence.
6. Core practice starts with airplane-mode-compatible local audio.
7. Cached personalized session replays without network access.
8. Failed generation produces an explicit fallback choice, not system TTS.
9. APK installs and launches on a clean Android emulator/device.
10. Five-tab navigation still passes the existing smoke test.
11. At least one meditation is started and audio playback state is confirmed in an Android integration test.

## Success criteria

V0.3 is successful when:
- the default meditation path never uses Android system TTS
- both male and female narrators are available
- core sessions work offline
- personalized renders are cacheable
- narration pacing uses real silence and segment timing
- the app passes installation, navigation, audio-selection, and playback tests before APK delivery

## Non-goals for V0.3

- voice cloning of the user
- dozens of narrator voices
- multilingual narration
- live conversational voice chat during meditation
- automatic journal-to-voice personalization

These can be considered later after the core narration quality is proven.
