# Consciousness Lab V0.4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Consciousness Lab 0.4.0 with layered meditation audio, original sound/frequency packs, an Affirmation Studio, a 32-day Rewire challenge, expanded practices, persistence, Android verification, and a verified APK/checksum delivery.

**Architecture:** Keep V0.3's session composer and natural narration as the core. Add pure-JS models for mixer configuration, affirmations, and challenge state; TypeScript UI/screens and storage consume those models. A deterministic Python generator creates redistributable original WAV loops, while neural affirmation clips are hydrated/committed separately and the runtime uses multiple `expo-audio` players for narration/background/frequency.

**Tech Stack:** React Native 0.86.2, Expo SDK 57, React 19.2.3, `expo-audio`, `expo-file-system`, AsyncStorage, Node test runner, TypeScript 6, Python standard library WAV generation, GitHub Actions Android build/emulator.

**Spec:** `docs/superpowers/specs/2026-08-25-consciousness-lab-v0-4-soundscapes-affirmations-challenge-design.md`

## Global Constraints

- Version must be `0.4.0`, Android versionCode `4`.
- Preserve package ID `com.merg357.consciousnesslab`.
- Preserve V0.3 Warm Female and Deep Male meditation narration.
- `expo-speech` and Android system TTS remain prohibited.
- Frequency/tuning content must not claim disease treatment, DNA modification, guaranteed manifestation, or proven quantum effects.
- Core starter audio must work offline.
- Existing five-tab navigation and V0.3 session/history behavior must keep working.

---

### Task 1: Mixer model and settings migration

**Files:**
- Create: `projects/quantum-consciousness-lab/src/core/audioModel.test.js`
- Create: `projects/quantum-consciousness-lab/src/core/audioModel.js`
- Modify: `projects/quantum-consciousness-lab/src/core/settingsModel.test.js`
- Modify: `projects/quantum-consciousness-lab/src/core/settingsModel.js`
- Modify: `projects/quantum-consciousness-lab/src/types.ts`
- Modify: `projects/quantum-consciousness-lab/src/lib/storage.ts`

**Interfaces:**
- Produces `normalizeAudioSettings(input)`, `BACKGROUND_TRACKS`, `FREQUENCY_TRACKS`, `DEFAULT_AUDIO_SETTINGS`.
- Storage produces `loadAudioSettings()` and `saveAudioSettings(settings)` without erasing lens/narrator.

- [ ] Write failing tests for default background/frequency, volume clamping, binaural metadata, evidence labels, and V0.3 settings preservation.
- [ ] Run `npm test` and verify the new tests fail because the model/storage behavior does not exist.
- [ ] Implement the minimal pure-JS audio model and settings merge support.
- [ ] Extend TypeScript types/storage with the exact model fields.
- [ ] Run `npm test` and `npm run typecheck` until green.
- [ ] Commit as `feat(v0.4): add layered audio settings model`.

### Task 2: Original starter and extended audio assets

**Files:**
- Create: `projects/quantum-consciousness-lab/scripts/generate_sound_assets.py`
- Create generated assets under `projects/quantum-consciousness-lab/assets/sounds/v1/...`
- Create: `projects/quantum-consciousness-lab/assets/sounds/v1/checksums.json`
- Create: `projects/quantum-consciousness-lab/src/audio/soundManifest.ts`

**Interfaces:**
- `resolveBundledSoundAsset(trackId)` returns a Metro asset number for starter tracks.
- `getRemoteSoundDescriptor(trackId)` returns repository-controlled URL/checksum metadata for extended tracks.

- [ ] Add failing model tests that require all starter IDs and distinguish bundled vs downloadable tracks.
- [ ] Verify RED with `npm test`.
- [ ] Implement deterministic standard-library WAV generation: 3 music, 3 nature-inspired, 4 binaural, 432 Hz, 528 Hz, 5 extended experimental tones and additional music/nature loops.
- [ ] Generate the assets twice and verify deterministic SHA-256 output.
- [ ] Implement the TypeScript manifest and checksum metadata.
- [ ] Run tests/typecheck and inspect sizes/durations.
- [ ] Commit as `feat(v0.4): add original meditation sound packs`.

### Task 3: Multi-layer meditation playback

**Files:**
- Create: `projects/quantum-consciousness-lab/src/audio/useMeditationMixer.ts`
- Modify: `projects/quantum-consciousness-lab/src/voice/useMeditationPlayer.ts`
- Modify: `projects/quantum-consciousness-lab/src/screens/SessionScreen.tsx`
- Modify: `projects/quantum-consciousness-lab/App.tsx`

**Interfaces:**
- `useMeditationMixer({ narrationActive, running, started, finished, reflecting, settings })` owns looping background/frequency players.
- Narration player exposes `isNarrating` so the mixer can duck background volume.

- [ ] Add failing pure-model tests for ducked vs normal background volumes and pause/stop semantics.
- [ ] Verify RED.
- [ ] Implement mixer helper functions and hook with separate Expo Audio players.
- [ ] Add session controls for background, frequency, narration/background/frequency volume, breath pulse and `Less Guidance`.
- [ ] Persist changes through App/storage.
- [ ] Run tests/typecheck and fix regressions.
- [ ] Commit as `feat(v0.4): layer soundscapes under neural meditation`.

### Task 4: Affirmation model, library and persistence

**Files:**
- Create: `projects/quantum-consciousness-lab/src/core/affirmationModel.test.js`
- Create: `projects/quantum-consciousness-lab/src/core/affirmationModel.js`
- Create: `projects/quantum-consciousness-lab/src/data/affirmations.ts`
- Modify: `projects/quantum-consciousness-lab/src/types.ts`
- Modify: `projects/quantum-consciousness-lab/src/lib/storage.ts`

**Interfaces:**
- `selectAffirmations({ categoryIds, style, count, favorites, custom })` returns deterministic eligible statements.
- Storage exposes `loadAffirmationState()` / `saveAffirmationState()`.

- [ ] Write failing tests for categories, Command/Becoming styles, favorites, custom statements, deterministic selection, and empty-category fallback.
- [ ] Verify RED.
- [ ] Implement the pure model.
- [ ] Add an original affirmation library covering the 14 approved categories without representing the content as official Dr. Joe Dispenza text.
- [ ] Add types/storage migration.
- [ ] Run tests/typecheck.
- [ ] Commit as `feat(v0.4): add affirmation library and preferences`.

### Task 5: Natural affirmation audio

**Files:**
- Create: `projects/quantum-consciousness-lab/scripts/generate_affirmation_audio.py`
- Create: `projects/quantum-consciousness-lab/affirmation_voice_sources.json` or checked-in assets under `assets/affirmations/v1/{female,male}`.
- Create: `projects/quantum-consciousness-lab/src/voice/affirmationManifest.ts`

**Interfaces:**
- `resolveAffirmationAsset(affirmationId, narratorId)` returns a local natural-voice audio source.

- [ ] Add a failing manifest validation test requiring both narrators for every bundled affirmation used in sessions.
- [ ] Verify RED.
- [ ] Generate natural female/male clips with a neural voice source available on the build machine; validate MP3/WAV headers and non-trivial sizes.
- [ ] Build the manifest and checksum inventory.
- [ ] Run validation/tests/typecheck.
- [ ] Commit as `feat(v0.4): add natural affirmation narration`.

### Task 6: Affirmation Studio UI and playback

**Files:**
- Create: `projects/quantum-consciousness-lab/src/screens/AffirmationScreen.tsx`
- Create: `projects/quantum-consciousness-lab/src/voice/useAffirmationPlayer.ts`
- Modify: `projects/quantum-consciousness-lab/src/screens/ExploreScreen.tsx`
- Modify: `projects/quantum-consciousness-lab/App.tsx`

**Interfaces:**
- Explore launches `AffirmationScreen`.
- Screen supports category/style/mode/cadence/duration/favorites/custom entries and reuses mixer settings.

- [ ] Write/extend pure tests for session cadence calculation.
- [ ] Verify RED.
- [ ] Implement natural-voice sequential playback with background/frequency layering.
- [ ] Implement UI controls and persistence.
- [ ] Add accessibility labels needed for Android smoke testing.
- [ ] Run tests/typecheck.
- [ ] Commit as `feat(v0.4): build affirmation studio`.

### Task 7: 32-Day Rewire model and challenge UI

**Files:**
- Create: `projects/quantum-consciousness-lab/src/core/challengeModel.test.js`
- Create: `projects/quantum-consciousness-lab/src/core/challengeModel.js`
- Create: `projects/quantum-consciousness-lab/src/data/challenge.ts`
- Create: `projects/quantum-consciousness-lab/src/screens/ChallengeScreen.tsx`
- Modify: `projects/quantum-consciousness-lab/src/lib/storage.ts`
- Modify: `projects/quantum-consciousness-lab/src/screens/TodayScreen.tsx`
- Modify: `projects/quantum-consciousness-lab/App.tsx`

**Interfaces:**
- `completeChallengeDay(state, day, timestamp)` preserves completed days, calculates current day/streak/milestones.
- Challenge day content contains morning, midday, evening, affirmation category, and optional linked practice.

- [ ] Write failing tests for 32 unique days, phase boundaries 1/9/17/25, completion idempotence, streaks, milestones 8/16/24/32, and resume behavior.
- [ ] Verify RED.
- [ ] Implement the pure challenge state model.
- [ ] Add all 32 original daily programs and prompts.
- [ ] Implement storage and Challenge screen with progress ring/cards, completion, milestone reflection, and links to practices/affirmations.
- [ ] Add Home entry card.
- [ ] Run tests/typecheck.
- [ ] Commit as `feat(v0.4): add 32-day rewire challenge`.

### Task 8: Expanded meditation paths

**Files:**
- Modify: `projects/quantum-consciousness-lab/src/core/sessionComposer.test.js`
- Modify: `projects/quantum-consciousness-lab/src/core/sessionComposer.js`
- Modify: `projects/quantum-consciousness-lab/src/screens/PracticeScreen.tsx`
- Modify: `projects/quantum-consciousness-lab/src/voice/voiceManifest.ts`

**Interfaces:**
- New paths compose through the same `SessionPlan` contract.
- New paths reuse safe generic neural phase clips where path-specific narration is unavailable; no Android TTS fallback.

- [ ] Write failing tests for all 12 new path IDs/evidence labels and routing keywords.
- [ ] Verify RED.
- [ ] Implement path definitions/prompts and Practice cards.
- [ ] Map new practices to generic natural narration phases while preserving explicit missing-asset checks.
- [ ] Run tests/typecheck.
- [ ] Commit as `feat(v0.4): expand guided meditation library`.

### Task 9: Downloadable pack cache manager

**Files:**
- Add dependency: `expo-file-system`
- Create: `projects/quantum-consciousness-lab/src/audio/packManager.ts`
- Create: `projects/quantum-consciousness-lab/src/screens/SoundLibraryScreen.tsx`
- Modify: `projects/quantum-consciousness-lab/src/screens/ExploreScreen.tsx`
- Modify: `projects/quantum-consciousness-lab/App.tsx`

**Interfaces:**
- `downloadTrack(track)`, `removeTrack(trackId)`, `resolveTrackUri(track)` with SHA-256 validation and graceful offline failure.

- [ ] Add failing pure helper tests for checksum/path decisions.
- [ ] Verify RED.
- [ ] Install Expo-compatible file-system package.
- [ ] Implement cache manager and Sound Library screen.
- [ ] Expose download/remove state and storage usage text.
- [ ] Run tests, Expo Doctor, typecheck.
- [ ] Commit as `feat(v0.4): add downloadable sound packs`.

### Task 10: Version, CI and Android regression gates

**Files:**
- Modify: `projects/quantum-consciousness-lab/package.json`
- Modify: `projects/quantum-consciousness-lab/app.json`
- Modify: `.github/workflows/consciousness-lab-pr-build.yml`
- Create: `projects/quantum-consciousness-lab/scripts/android_v04_smoke.sh`

**Interfaces:**
- CI outputs `ConsciousnessLab-v0.4.0-universal-standalone.apk` and `.sha256`.

- [ ] Update version/versionCode.
- [ ] Extend CI to validate sound assets, affirmation assets, no-system-TTS gate, JS bundle, signing, and audio counts.
- [ ] Implement Android smoke flow: onboarding → Practice → Deep Rest → Deep Male → background → Theta → active playback; Explore → Affirmations; Home → 32-Day Challenge.
- [ ] Run `npm test`, `npx expo-doctor`, `npm run typecheck`, `npx expo prebuild --platform android --clean --no-install` locally.
- [ ] Commit as `build(v0.4): harden Android release verification`.

### Task 11: Release verification and delivery

**Files:**
- Generated: `ConsciousnessLab-v0.4.0-universal-standalone.apk`
- Generated: `ConsciousnessLab-v0.4.0-universal-standalone.sha256`

- [ ] Push feature branch and open PR to `main`.
- [ ] Wait for the exact PR workflow run to complete; if any gate fails, diagnose, fix, push, and rerun until green.
- [ ] Download the exact green candidate artifact and independently SHA-256 it.
- [ ] Inspect APK contents and signature.
- [ ] Merge only the exact green head SHA.
- [ ] Upload the exact verified APK and checksum to Google Drive folder `Consciousness Lab Builds` (`1NUN1iYo8m5NwjwtF7PIgLI3xWc53YHAt`).
- [ ] Download the Drive copy and verify its SHA-256 matches the green candidate.
- [ ] Report final merge SHA, APK SHA-256, Drive IDs, and direct sandbox download copies.
