import type { AudioSettings } from '../types';

export type SoundKind = 'music' | 'nature' | 'frequency';
export type SoundEvidence = 'Relaxation' | 'Emerging' | 'Experimental';

export interface SoundTrackDescriptor {
  id: string;
  label: string;
  kind: SoundKind;
  bundled: boolean;
  evidence: SoundEvidence;
  binaural?: boolean;
  fileName: string;
  source?: number;
  remoteUrl?: string;
}

const RAW_BASE = 'https://raw.githubusercontent.com/merg357/tinapictures/main/projects/quantum-consciousness-lab/assets/sounds/v1/extended';

const STARTER: SoundTrackDescriptor[] = [
  { id: 'cosmic-ambient', label: 'Cosmic Ambient', kind: 'music', bundled: true, evidence: 'Relaxation', fileName: 'cosmic-ambient.wav', source: require('../../assets/sounds/v1/background/cosmic-ambient.wav') },
  { id: 'deep-space', label: 'Deep Space', kind: 'music', bundled: true, evidence: 'Relaxation', fileName: 'deep-space.wav', source: require('../../assets/sounds/v1/background/deep-space.wav') },
  { id: 'heart-glow', label: 'Heart Glow', kind: 'music', bundled: true, evidence: 'Relaxation', fileName: 'heart-glow.wav', source: require('../../assets/sounds/v1/background/heart-glow.wav') },
  { id: 'ocean', label: 'Ocean', kind: 'nature', bundled: true, evidence: 'Relaxation', fileName: 'ocean.wav', source: require('../../assets/sounds/v1/background/ocean.wav') },
  { id: 'rain', label: 'Rain', kind: 'nature', bundled: true, evidence: 'Relaxation', fileName: 'rain.wav', source: require('../../assets/sounds/v1/background/rain.wav') },
  { id: 'forest', label: 'Forest', kind: 'nature', bundled: true, evidence: 'Relaxation', fileName: 'forest.wav', source: require('../../assets/sounds/v1/background/forest.wav') },
  { id: 'alpha-10', label: 'Alpha 10 Hz', kind: 'frequency', bundled: true, evidence: 'Emerging', binaural: true, fileName: 'alpha-10.wav', source: require('../../assets/sounds/v1/frequency/alpha-10.wav') },
  { id: 'theta-6', label: 'Theta 6 Hz', kind: 'frequency', bundled: true, evidence: 'Emerging', binaural: true, fileName: 'theta-6.wav', source: require('../../assets/sounds/v1/frequency/theta-6.wav') },
  { id: 'delta-2', label: 'Delta 2 Hz', kind: 'frequency', bundled: true, evidence: 'Emerging', binaural: true, fileName: 'delta-2.wav', source: require('../../assets/sounds/v1/frequency/delta-2.wav') },
  { id: 'gamma-40', label: 'Gamma 40 Hz', kind: 'frequency', bundled: true, evidence: 'Emerging', binaural: true, fileName: 'gamma-40.wav', source: require('../../assets/sounds/v1/frequency/gamma-40.wav') },
  { id: 'hz-432', label: '432 Hz Tuning', kind: 'frequency', bundled: true, evidence: 'Experimental', fileName: 'hz-432.wav', source: require('../../assets/sounds/v1/frequency/hz-432.wav') },
  { id: 'hz-528', label: '528 Hz Tone Bed', kind: 'frequency', bundled: true, evidence: 'Experimental', fileName: 'hz-528.wav', source: require('../../assets/sounds/v1/frequency/hz-528.wav') },
];

const EXTENDED_BASE: SoundTrackDescriptor[] = [
  { id: 'floating-piano', label: 'Floating Piano', kind: 'music', bundled: false, evidence: 'Relaxation', fileName: 'floating-piano.wav' },
  { id: 'dreamscape', label: 'Dreamscape', kind: 'music', bundled: false, evidence: 'Relaxation', fileName: 'dreamscape.wav' },
  { id: 'mountain-stream', label: 'Mountain Stream', kind: 'nature', bundled: false, evidence: 'Relaxation', fileName: 'mountain-stream.wav' },
  { id: 'night-forest', label: 'Night Forest', kind: 'nature', bundled: false, evidence: 'Relaxation', fileName: 'night-forest.wav' },
  { id: 'distant-thunder', label: 'Distant Thunder', kind: 'nature', bundled: false, evidence: 'Relaxation', fileName: 'distant-thunder.wav' },
  { id: 'hz-396', label: '396 Hz', kind: 'frequency', bundled: false, evidence: 'Experimental', fileName: 'hz-396.wav' },
  { id: 'hz-417', label: '417 Hz', kind: 'frequency', bundled: false, evidence: 'Experimental', fileName: 'hz-417.wav' },
  { id: 'hz-639', label: '639 Hz', kind: 'frequency', bundled: false, evidence: 'Experimental', fileName: 'hz-639.wav' },
  { id: 'hz-741', label: '741 Hz', kind: 'frequency', bundled: false, evidence: 'Experimental', fileName: 'hz-741.wav' },
  { id: 'hz-852', label: '852 Hz', kind: 'frequency', bundled: false, evidence: 'Experimental', fileName: 'hz-852.wav' },
];

const EXTENDED: SoundTrackDescriptor[] = EXTENDED_BASE.map((track) => ({ ...track, remoteUrl: `${RAW_BASE}/${track.fileName}` }));

export const SOUND_TRACKS = [...STARTER, ...EXTENDED];

export function getSoundTrack(id: string): SoundTrackDescriptor | null {
  if (id === 'off') return null;
  return SOUND_TRACKS.find((track) => track.id === id) ?? null;
}

export function resolveBundledSoundAsset(id: string): number | null {
  const track = getSoundTrack(id);
  if (!track || !track.bundled) return null;
  if (!track.source) throw new Error(`Missing bundled sound asset: ${id}`);
  return track.source;
}

export function getRemoteSoundDescriptor(id: string): SoundTrackDescriptor | null {
  const track = getSoundTrack(id);
  return track && !track.bundled ? track : null;
}

export function selectedSoundLabels(settings: AudioSettings) {
  return {
    background: getSoundTrack(settings.backgroundTrackId)?.label ?? 'Off',
    frequency: getSoundTrack(settings.frequencyTrackId)?.label ?? 'Off',
  };
}

export const BREATH_PULSE_ASSET: number = require('../../assets/sounds/v1/utility/breath-pulse.wav');
