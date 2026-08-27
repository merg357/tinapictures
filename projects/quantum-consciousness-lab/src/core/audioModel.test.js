const test = require('node:test');
const assert = require('node:assert/strict');

const {
  BACKGROUND_TRACKS,
  FREQUENCY_TRACKS,
  DEFAULT_AUDIO_SETTINGS,
  normalizeAudioSettings,
  effectiveBackgroundVolume,
  isBundledTrack,
} = require('./audioModel');

test('v0.4 ships mind music, nature and frequency choices with safe evidence labels', () => {
  assert.ok(BACKGROUND_TRACKS.some((t) => t.kind === 'music' && t.id === 'cosmic-ambient'));
  assert.ok(BACKGROUND_TRACKS.some((t) => t.kind === 'nature' && t.id === 'ocean'));
  assert.ok(FREQUENCY_TRACKS.some((t) => t.id === 'theta-6' && t.binaural === true));
  assert.equal(FREQUENCY_TRACKS.find((t) => t.id === 'hz-528').evidence, 'Experimental');
  assert.equal(FREQUENCY_TRACKS.find((t) => t.id === 'hz-432').evidence, 'Experimental');
});

test('audio defaults keep immersive background on and frequency off', () => {
  assert.equal(DEFAULT_AUDIO_SETTINGS.backgroundTrackId, 'cosmic-ambient');
  assert.equal(DEFAULT_AUDIO_SETTINGS.frequencyTrackId, 'off');
  assert.equal(DEFAULT_AUDIO_SETTINGS.narrationSpeed, 1);
  assert.equal(DEFAULT_AUDIO_SETTINGS.guidanceLevel, 'full');
});

test('normalization clamps volumes and rejects unknown track ids', () => {
  const value = normalizeAudioSettings({
    backgroundTrackId: 'not-real',
    frequencyTrackId: 'theta-6',
    narrationVolume: 2,
    narrationSpeed: 0.2,
    backgroundVolume: -1,
    frequencyVolume: 0.45,
    guidanceLevel: 'less',
  });
  assert.equal(value.backgroundTrackId, DEFAULT_AUDIO_SETTINGS.backgroundTrackId);
  assert.equal(value.frequencyTrackId, 'theta-6');
  assert.equal(value.narrationVolume, 1);
  assert.equal(value.narrationSpeed, 0.5);
  assert.equal(value.backgroundVolume, 0);
  assert.equal(value.frequencyVolume, 0.45);
  assert.equal(value.guidanceLevel, 'less');
});

test('background ducks during narration and restores in quiet intervals', () => {
  assert.equal(effectiveBackgroundVolume(0.8, true), 0.28);
  assert.equal(effectiveBackgroundVolume(0.8, false), 0.8);
});

test('starter tracks are bundled while extended packs are downloadable', () => {
  assert.equal(isBundledTrack('cosmic-ambient'), true);
  assert.equal(isBundledTrack('ocean'), true);
  assert.equal(isBundledTrack('floating-piano'), false);
  assert.equal(isBundledTrack('hz-852'), false);
});
