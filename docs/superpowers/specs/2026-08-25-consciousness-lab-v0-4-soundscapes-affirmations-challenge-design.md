# Consciousness Lab V0.4 — Soundscapes, Affirmations & 32-Day Rewire

Date: 2026-08-25
Branch: `feature/consciousness-lab-v0-4-soundscapes-challenge`
Base: V0.3 (`94d240901a23066a8e5c796f13b8af37ee5e58b0`)

## Goal

Upgrade the verified V0.3 meditation app so quiet intervals are immersive rather than silent, while adding a complete affirmation experience and an original 32-day behavior-change challenge inspired by the themes in the supplied materials without presenting the app as an official Dr. Joe Dispenza product or overstating scientific evidence.

## Release identity

- App version: `0.4.0`
- Android versionCode: `4`
- Package ID remains `com.merg357.consciousnesslab`.
- Preserve V0.3 natural female/male neural narration and the existing five-tab navigation.

## 1. Layered meditation audio

Meditation playback becomes a three-layer mixer:

1. **Narration** — existing Warm Female or Deep Male neural clips.
2. **Background** — user-selectable music or nature soundscape.
3. **Frequency** — optional binaural/tonal layer.

Each layer has independent volume control. Background audio loops continuously through quiet portions, automatically ducks while narration is active, and returns smoothly after narration. Pausing a session pauses every active layer. Ending or reflecting stops every layer.

The former `More Silence` control becomes `Less Guidance`: narration is reduced, but the selected background/frequency layers continue.

## 2. Sound library

### Bundled starter pack

Ship compact offline starter tracks generated as original application assets:

**Mind Music**
- Cosmic Ambient
- Deep Space
- Heart Glow

**Nature-inspired**
- Ocean
- Rain
- Forest

**Frequency**
- Alpha 10 Hz binaural
- Theta 6 Hz binaural
- Delta 2 Hz binaural
- Gamma 40 Hz binaural
- 432 Hz ambient tuning drone
- 528 Hz experimental tone bed

Binaural choices display `Headphones recommended for binaural effect`.

### Extended pack

Add additional original downloadable/cached tracks:

- Floating Piano
- Dreamscape
- Mountain Stream
- Night Forest
- Distant Thunder
- Solfeggio experimental tones: 396, 417, 639, 741, 852 Hz

The app keeps an explicit distinction between evidence-supported relaxation tools and experimental frequency/tuning content. It must not claim that 432 Hz, 528 Hz, Solfeggio tones, or binaural beats heal DNA, manifest outcomes, or have proven quantum effects.

## 3. Breath pacing

Offer an optional subtle 6-breath-per-minute pacing layer for suitable practices. It is a gentle audio pulse/visual cue, not a medical treatment. Existing breathing visuals remain compatible.

## 4. Affirmation Studio

Create an affirmation subsystem reachable from Explore and from the 32-day challenge.

Affirmation categories are based on the supplied collection:

- Peace & Prosperity
- Sleep & Night
- Gratitude
- Divine Rhythm
- Circulation & Giving
- Reflection & Confidence
- Faith & Certainty
- Mastery of Thought
- Definite Aim
- Identity
- Repetition & Becoming
- Boldness & Courage
- Action & Urgency
- Legacy & Service

Provide two statement styles:

- **Command** — direct identity/declaration language.
- **Becoming** — gradual, believable identity-building language.

Features:

- Category selection.
- Favorite/unfavorite individual affirmations.
- User-created affirmations.
- Female/male narrator preference.
- Session lengths: 5, 10, 20, 30 minutes.
- Modes: Morning, Meditation, Walking, Sleep.
- Cadence: occasional, regular, affirmation-only.
- Background/frequency choices use the same mixer.
- Persist favorites, custom affirmations, and last-used settings.

Bundled spoken affirmation assets must use natural neural voices; Android system TTS remains prohibited.

## 5. Original 32-Day Rewire Challenge

Create a first-class challenge tracker, clearly labeled `Consciousness Lab 32-Day Rewire` and not as an official Dispenza challenge.

### Phase 1 — Days 1–8: Observe the Old Self

1. Baseline emotional patterns
2. Automatic complaints and language
3. Somatic stress cues
4. Pattern interruption
5. Scarcity/lack vocabulary
6. Environmental input audit
7. Repetitive thought loops
8. Spacious awareness

### Phase 2 — Days 9–16: Interrupt & Release

9. Let go of controlling outcomes
10. Non-reaction under stress
11. Heart-focused breathing
12. Deep rest / Alpha-Theta transition
13. Notice meaningful coincidences without causal claims
14. Release clock/time pressure
15. Define a future-self blueprint
16. Rehearse elevated emotions and concrete behavior

### Phase 3 — Days 17–24: Build the New Self

17. Walk as the chosen future self
18. Speak clear identity statements
19. Health/vitality-supporting identity
20. Coherence under pressure
21. Purpose and direction
22. Prosperity/abundance identity
23. Relationships, compassion, and service
24. Courage and decisive action

### Phase 4 — Days 25–32: Embody & Integrate

25. Act before old patterns regain control
26. Resilience after setbacks
27. Generosity and circulation
28. Gratitude in advance as emotional rehearsal
29. Synchronicity and pattern journal
30. Deep rest and recovery
31. Sustained identity under real-world pressure
32. Integration review and personalized continuation plan

Every day contains:

- Morning practice/affirmation.
- 30–90 second midday reset.
- Evening reflection/journal prompt.
- Completion state and streak tracking.
- Optional linked meditation and affirmation category.

Milestone summaries occur on Days 8, 16, 24, and 32 and ask the user what changed subjectively.

## 6. Expanded meditation library

Add original paths without reproducing copyrighted guided recordings:

- Spacious Awareness
- Breaking the Pattern
- Heart Coherence
- Future Self
- Energy Center Journey
- New Possibilities
- Walking Embodiment
- Gratitude & Receiving
- Deep Sleep Integration
- Abundance Identity
- Purpose & Direction
- Stress-to-Stillness

Scientific framing remains explicit. Content may discuss contemplative/spiritual interpretations when the user selected an appropriate lens, but extraordinary claims stay labeled theoretical/spiritual rather than established.

## 7. Persistence and models

Extend settings/storage without breaking existing V0.3 data:

- narrator
- background track
- background volume
- frequency track
- frequency volume
- narration volume
- breath pulse enabled
- guidance level
- affirmation preferences/favorites/custom statements
- 32-day challenge progress

Migrations must default safely when old V0.3 settings are present.

## 8. Audio assets and licensing

- Original application soundscapes/frequencies are generated deterministically from a checked-in Python asset generator and may be redistributed with the app.
- Natural narration/affirmation assets are checked into the release source or hydrated from explicit source manifests with checksums.
- No paid/licensed third-party track is required for core functionality.
- Extended downloadable packs use assets controlled by this repository so future licensing cannot invalidate the app.

## 9. Offline and downloadable behavior

- Core meditation narration and starter sound pack work fully offline.
- Extended packs can be downloaded and cached when online.
- Missing remote packs fail gracefully and never interrupt the core meditation.
- Users can remove downloaded packs to recover storage.

## 10. Safety and truthfulness

- Frequency content is labeled `Experimental` where appropriate.
- Binaural content explains that headphones are needed to reproduce the intended left/right beat.
- No claim that audio frequencies cure disease, alter DNA, or guarantee manifestation.
- Breath pacing is optional and comfortable; no prolonged breath holds are required.
- The app distinguishes science-supported, emerging, philosophical, and spiritual content using the existing evidence system.

## 11. Verification gates

V0.4 is not releasable unless all of the following pass:

- Existing V0.3 tests remain green.
- New core tests cover mixer settings, challenge progression, affirmation selection, storage migration, and evidence labels.
- `expo-speech` remains absent.
- Starter sound assets exist and validate.
- Neural affirmation assets exist for both narrators.
- Expo Doctor passes.
- TypeScript passes.
- Android prebuild passes.
- Signed release APK builds.
- APK contains standalone JS bundle, 24 existing meditation neural clips, affirmation assets, and starter sound assets.
- Clean Android emulator smoke test verifies narrator selection, background sound selection, frequency selection, challenge navigation, affirmation screen, and active multi-layer playback without fatal crash.
- Exact APK SHA-256 is generated and independently rechecked.
- Merge only after green verification.
- Upload exact verified APK and checksum to `Google Drive → Consciousness Lab Builds`.
