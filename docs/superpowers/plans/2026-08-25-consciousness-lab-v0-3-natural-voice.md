# Consciousness Lab V0.3 Natural Voice — Implementation Plan

Date: 2026-08-25
Branch: `feature/consciousness-lab-v0-3-natural-voice`
Design: `docs/superpowers/specs/2026-08-25-consciousness-lab-v0-3-natural-voice-design.md`

## Goal

Replace Android system TTS in the normal meditation path with real pre-rendered neural narration, support both warm female and calm deep male narrators, preserve offline core practices, keep five-tab navigation intact, build a signed standalone APK, verify it on Android, and upload the exact passing APK plus checksum to Google Drive.

## Task 1 — Lock the voice contract with tests first

Files:
- Create `projects/quantum-consciousness-lab/src/core/voiceModel.test.js`
- Create `projects/quantum-consciousness-lab/src/core/voiceModel.js`
- Update `projects/quantum-consciousness-lab/src/core/insights.test.js`
- Update `projects/quantum-consciousness-lab/src/core/insights.js`

Steps:
1. Add failing tests requiring narrator IDs `female` and `male`.
2. Add failing tests requiring all seven practice paths and five phase slots per path.
3. Add failing tests requiring resolver output to preserve requested narrator and never return a system-TTS provider.
4. Remove the obsolete `pickBestVoice` test and implementation because device voice selection is no longer part of the product path.
5. Run `npm test` and confirm the new tests fail before implementation.
6. Implement the smallest pure-JS voice model needed for tests to pass.
7. Run `npm test` and confirm all tests pass.

## Task 2 — Create real meditation narration assets

Files:
- Add audio under `projects/quantum-consciousness-lab/assets/voices/v1/female/...`
- Add audio under `projects/quantum-consciousness-lab/assets/voices/v1/male/...`
- Create `projects/quantum-consciousness-lab/src/voice/voiceManifest.ts`

Steps:
1. Write phase-specific narration for Observer, Coherence, Deep Rest, Intention, Quantum Foundations, Expanded Consciousness, and Synchronicity & Dreams.
2. Generate female assets with a warm, soft neural voice.
3. Generate male assets with a calm, deep neural voice.
4. Keep clips concise enough that the remainder of each phase can be intentional quiet.
5. Store assets as versioned bundled files so core practices are usable offline.
6. Build a typed manifest mapping practice ID + segment index + narrator ID to the exact bundled asset.
7. Make missing assets explicit errors; never silently substitute Android TTS.

## Task 3 — Replace `expo-speech` with an audio player

Files:
- Update `projects/quantum-consciousness-lab/package.json`
- Update `projects/quantum-consciousness-lab/app.json`
- Create `projects/quantum-consciousness-lab/src/voice/useMeditationPlayer.ts`
- Update `projects/quantum-consciousness-lab/src/screens/SessionScreen.tsx`

Steps:
1. Remove `expo-speech` from dependencies.
2. Add Expo SDK 57 compatible `expo-audio`.
3. Configure audio mode for silent-mode playback and background continuation where Android permits.
4. Implement a dedicated meditation player that loads the narrator clip for the active phase, pauses/resumes correctly, and leaves actual silence after narration until the next phase boundary.
5. Refactor `SessionScreen` so it does not import or call any speech API.
6. Keep haptics, timer, before/after ratings, and evidence labels intact.
7. Display an explicit playback state such as `Natural narration · playing` for smoke-test visibility.

## Task 4 — Persist narrator preference and expose both choices

Files:
- Update `projects/quantum-consciousness-lab/src/types.ts`
- Update `projects/quantum-consciousness-lab/src/lib/storage.ts`
- Update `projects/quantum-consciousness-lab/App.tsx`
- Update `projects/quantum-consciousness-lab/src/screens/SessionScreen.tsx`

Steps:
1. Add `NarratorId = 'female' | 'male'`.
2. Store narrator preference independently from the existing lens setting so saving one cannot erase the other.
3. Default new users to the warm female narrator while allowing immediate per-session selection of male.
4. Persist the last selected narrator for future sessions.
5. Add a preview control that plays the selected neural asset, not device TTS.
6. Keep `Full Guidance` / `More Silence`; the latter shortens narration use rather than changing engines.

## Task 5 — Version the Android app as V0.3

Files:
- Update `projects/quantum-consciousness-lab/package.json`
- Update `projects/quantum-consciousness-lab/app.json`

Steps:
1. Set app/package version to `0.3.0`.
2. Set Android `versionCode` to `3`.
3. Preserve package ID `com.merg357.consciousnesslab`.
4. Run Expo Doctor and TypeScript checks.

## Task 6 — Harden CI specifically against robotic-TTS regression

Files:
- Update `.github/workflows/consciousness-lab-pr-build.yml`

Steps:
1. Fail if `expo-speech` appears in runtime meditation source or package dependencies.
2. Require `expo-audio`.
3. Verify expected female and male voice asset directories are present before Gradle build.
4. Keep standalone JS-bundle and APK-signature checks.
5. Rename candidate artifact to `ConsciousnessLab-v0.3.0-universal-standalone.apk`.
6. Install exact candidate on a clean Android emulator.
7. Complete onboarding and verify all five tabs.
8. Open a core practice, confirm both narrator choices are visible, choose a narrator, start the practice, and confirm the natural-narration playback state is visible without crashes.
9. Reject `Unable to load script` and `FATAL EXCEPTION` as before.
10. Upload launch evidence.

## Task 7 — Full verification and release

Steps:
1. Open a pull request from the V0.3 branch to `main`.
2. Wait for the full PR workflow to finish.
3. If any gate fails, use systematic debugging and rerun only after the root cause is corrected.
4. Download the exact candidate artifact from the successful workflow.
5. Independently extract the APK and checksum.
6. Recalculate SHA-256 in the container and compare it to the CI checksum.
7. Inspect the APK archive to confirm the standalone JS bundle and bundled voice assets exist.
8. Merge the passing V0.3 PR to `main`.

## Task 8 — Google Drive delivery

Destination:
`/Google Drive/Consciousness Lab Builds/`

Files:
- `ConsciousnessLab-v0.3.0-universal-standalone.apk`
- `ConsciousnessLab-v0.3.0-universal-standalone.sha256`

Steps:
1. Upload only the exact APK that passed the final CI/emulator run.
2. Upload its matching checksum file.
3. Re-list the Drive folder and verify file names and sizes.
4. Report the Drive file location and SHA-256 to the user.

## Completion criteria

Do not call V0.3 finished unless all are true:
- normal meditation playback contains no Android system TTS calls
- both female and male neural narrator choices exist
- core narration assets are packaged for offline use
- narrator preference persists
- behavior tests pass
- Expo Doctor passes
- TypeScript passes
- standalone release APK compiles
- JS bundle and APK signature checks pass
- Android install/launch/navigation/narrator smoke tests pass
- exact passing APK checksum is independently verified
- passing code is merged
- APK and checksum are present in Google Drive `Consciousness Lab Builds`
