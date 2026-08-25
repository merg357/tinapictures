const BACKGROUND_TRACKS = [
  { id: 'off', label: 'Off', kind: 'off', bundled: true, evidence: 'Neutral' },
  { id: 'cosmic-ambient', label: 'Cosmic Ambient', kind: 'music', bundled: true, evidence: 'Relaxation' },
  { id: 'deep-space', label: 'Deep Space', kind: 'music', bundled: true, evidence: 'Relaxation' },
  { id: 'heart-glow', label: 'Heart Glow', kind: 'music', bundled: true, evidence: 'Relaxation' },
  { id: 'ocean', label: 'Ocean', kind: 'nature', bundled: true, evidence: 'Relaxation' },
  { id: 'rain', label: 'Rain', kind: 'nature', bundled: true, evidence: 'Relaxation' },
  { id: 'forest', label: 'Forest', kind: 'nature', bundled: true, evidence: 'Relaxation' },
  { id: 'floating-piano', label: 'Floating Piano', kind: 'music', bundled: false, evidence: 'Relaxation' },
  { id: 'dreamscape', label: 'Dreamscape', kind: 'music', bundled: false, evidence: 'Relaxation' },
  { id: 'mountain-stream', label: 'Mountain Stream', kind: 'nature', bundled: false, evidence: 'Relaxation' },
  { id: 'night-forest', label: 'Night Forest', kind: 'nature', bundled: false, evidence: 'Relaxation' },
  { id: 'distant-thunder', label: 'Distant Thunder', kind: 'nature', bundled: false, evidence: 'Relaxation' },
];

const FREQUENCY_TRACKS = [
  { id: 'off', label: 'Off', bundled: true, binaural: false, evidence: 'Neutral' },
  { id: 'alpha-10', label: 'Alpha 10 Hz', bundled: true, binaural: true, evidence: 'Emerging' },
  { id: 'theta-6', label: 'Theta 6 Hz', bundled: true, binaural: true, evidence: 'Emerging' },
  { id: 'delta-2', label: 'Delta 2 Hz', bundled: true, binaural: true, evidence: 'Emerging' },
  { id: 'gamma-40', label: 'Gamma 40 Hz', bundled: true, binaural: true, evidence: 'Emerging' },
  { id: 'hz-432', label: '432 Hz Tuning', bundled: true, binaural: false, evidence: 'Experimental' },
  { id: 'hz-528', label: '528 Hz Tone Bed', bundled: true, binaural: false, evidence: 'Experimental' },
  { id: 'hz-396', label: '396 Hz', bundled: false, binaural: false, evidence: 'Experimental' },
  { id: 'hz-417', label: '417 Hz', bundled: false, binaural: false, evidence: 'Experimental' },
  { id: 'hz-639', label: '639 Hz', bundled: false, binaural: false, evidence: 'Experimental' },
  { id: 'hz-741', label: '741 Hz', bundled: false, binaural: false, evidence: 'Experimental' },
  { id: 'hz-852', label: '852 Hz', bundled: false, binaural: false, evidence: 'Experimental' },
];

const DEFAULT_AUDIO_SETTINGS = Object.freeze({
  backgroundTrackId: 'cosmic-ambient',
  frequencyTrackId: 'off',
  narrationVolume: 1,
  backgroundVolume: 0.55,
  frequencyVolume: 0.18,
  breathPulseEnabled: false,
  guidanceLevel: 'full',
});

function clamp01(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

function hasTrack(collection, id) {
  return collection.some((item) => item.id === id);
}

function normalizeAudioSettings(input = {}) {
  return {
    backgroundTrackId: hasTrack(BACKGROUND_TRACKS, input.backgroundTrackId) ? input.backgroundTrackId : DEFAULT_AUDIO_SETTINGS.backgroundTrackId,
    frequencyTrackId: hasTrack(FREQUENCY_TRACKS, input.frequencyTrackId) ? input.frequencyTrackId : DEFAULT_AUDIO_SETTINGS.frequencyTrackId,
    narrationVolume: clamp01(input.narrationVolume, DEFAULT_AUDIO_SETTINGS.narrationVolume),
    backgroundVolume: clamp01(input.backgroundVolume, DEFAULT_AUDIO_SETTINGS.backgroundVolume),
    frequencyVolume: clamp01(input.frequencyVolume, DEFAULT_AUDIO_SETTINGS.frequencyVolume),
    breathPulseEnabled: input.breathPulseEnabled === true,
    guidanceLevel: input.guidanceLevel === 'less' ? 'less' : 'full',
  };
}

function effectiveBackgroundVolume(baseVolume, narrationActive) {
  const base = clamp01(baseVolume, DEFAULT_AUDIO_SETTINGS.backgroundVolume);
  return narrationActive ? Math.round(base * 0.35 * 1000) / 1000 : base;
}

function isBundledTrack(id) {
  const track = [...BACKGROUND_TRACKS, ...FREQUENCY_TRACKS].find((item) => item.id === id && item.id !== 'off');
  return track ? track.bundled === true : id === 'off';
}

module.exports = {
  BACKGROUND_TRACKS,
  FREQUENCY_TRACKS,
  DEFAULT_AUDIO_SETTINGS,
  normalizeAudioSettings,
  effectiveBackgroundVolume,
  isBundledTrack,
};
