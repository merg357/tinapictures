import type { NarratorId } from '../types';

export const PRACTICE_IDS = [
  'observer','coherence','deep-rest','intention','quantum-foundations','expanded-consciousness','synchronicity-dreams',
  'spacious-awareness','breaking-pattern','heart-coherence','future-self','energy-centers','new-potentials',
  'walking-embodiment','gratitude-receiving','deep-sleep-integration','abundance-identity','purpose-direction','stress-stillness',
  'become-future-you',
] as const;

export type VoicePracticeId = (typeof PRACTICE_IDS)[number];
export type VoiceAssetKey =
  | 'arrive' | 'regulate' | 'open' | 'closing' | 'drift'
  | 'observer-focus' | 'coherence-focus' | 'deep-rest-focus' | 'intention-focus'
  | 'quantum-foundations-focus' | 'expanded-consciousness-focus' | 'synchronicity-dreams-focus'
  | 'become-future-you-full';

const ASSETS: Record<NarratorId, Record<VoiceAssetKey, number>> = {
  female: {
    arrive: require('../../assets/voices/v1/female/arrive.mp3'),
    regulate: require('../../assets/voices/v1/female/regulate.mp3'),
    open: require('../../assets/voices/v1/female/open.mp3'),
    closing: require('../../assets/voices/v1/female/closing.mp3'),
    drift: require('../../assets/voices/v1/female/drift.mp3'),
    'observer-focus': require('../../assets/voices/v1/female/observer-focus.mp3'),
    'coherence-focus': require('../../assets/voices/v1/female/coherence-focus.mp3'),
    'deep-rest-focus': require('../../assets/voices/v1/female/deep-rest-focus.mp3'),
    'intention-focus': require('../../assets/voices/v1/female/intention-focus.mp3'),
    'quantum-foundations-focus': require('../../assets/voices/v1/female/quantum-foundations-focus.mp3'),
    'expanded-consciousness-focus': require('../../assets/voices/v1/female/expanded-consciousness-focus.mp3'),
    'synchronicity-dreams-focus': require('../../assets/voices/v1/female/synchronicity-dreams-focus.mp3'),
    'become-future-you-full': require('../../assets/meditations/v1/become-future-you/female.mp3'),
  },
  male: {
    arrive: require('../../assets/voices/v1/male/arrive.mp3'),
    regulate: require('../../assets/voices/v1/male/regulate.mp3'),
    open: require('../../assets/voices/v1/male/open.mp3'),
    closing: require('../../assets/voices/v1/male/closing.mp3'),
    drift: require('../../assets/voices/v1/male/drift.mp3'),
    'observer-focus': require('../../assets/voices/v1/male/observer-focus.mp3'),
    'coherence-focus': require('../../assets/voices/v1/male/coherence-focus.mp3'),
    'deep-rest-focus': require('../../assets/voices/v1/male/deep-rest-focus.mp3'),
    'intention-focus': require('../../assets/voices/v1/male/intention-focus.mp3'),
    'quantum-foundations-focus': require('../../assets/voices/v1/male/quantum-foundations-focus.mp3'),
    'expanded-consciousness-focus': require('../../assets/voices/v1/male/expanded-consciousness-focus.mp3'),
    'synchronicity-dreams-focus': require('../../assets/voices/v1/male/synchronicity-dreams-focus.mp3'),
    'become-future-you-full': require('../../assets/meditations/v1/become-future-you/male.mp3'),
  },
};

const FOCUS_ALIAS: Record<VoicePracticeId, VoiceAssetKey> = {
  observer: 'observer-focus',
  coherence: 'coherence-focus',
  'deep-rest': 'deep-rest-focus',
  intention: 'intention-focus',
  'quantum-foundations': 'quantum-foundations-focus',
  'expanded-consciousness': 'expanded-consciousness-focus',
  'synchronicity-dreams': 'synchronicity-dreams-focus',
  'spacious-awareness': 'expanded-consciousness-focus',
  'breaking-pattern': 'observer-focus',
  'heart-coherence': 'coherence-focus',
  'future-self': 'intention-focus',
  'energy-centers': 'coherence-focus',
  'new-potentials': 'intention-focus',
  'walking-embodiment': 'intention-focus',
  'gratitude-receiving': 'coherence-focus',
  'deep-sleep-integration': 'deep-rest-focus',
  'abundance-identity': 'intention-focus',
  'purpose-direction': 'intention-focus',
  'stress-stillness': 'observer-focus',
  'become-future-you': 'become-future-you-full',
};

function assertPracticeId(value: string): asserts value is VoicePracticeId {
  if (!(PRACTICE_IDS as readonly string[]).includes(value)) throw new Error(`Missing neural narration for practice: ${value}`);
}

export function assetKeyForPhase(practiceId: string, segmentIndex: number): VoiceAssetKey {
  assertPracticeId(practiceId);
  if (practiceId === 'become-future-you') {
    if (segmentIndex !== 0) throw new Error(`Missing neural narration phase: ${practiceId}/${segmentIndex}`);
    return 'become-future-you-full';
  }
  if (!Number.isInteger(segmentIndex) || segmentIndex < 0 || segmentIndex > 4) throw new Error(`Missing neural narration phase: ${practiceId}/${segmentIndex}`);
  if (segmentIndex === 0) return 'arrive';
  if (segmentIndex === 1) return 'regulate';
  if (segmentIndex === 2) return FOCUS_ALIAS[practiceId];
  if (segmentIndex === 3) return 'open';
  return practiceId === 'deep-rest' || practiceId === 'deep-sleep-integration' ? 'drift' : 'closing';
}

export function resolveVoiceAsset(practiceId: string, segmentIndex: number, narratorId: NarratorId): number {
  const key = assetKeyForPhase(practiceId, segmentIndex);
  const source = ASSETS[narratorId]?.[key];
  if (!source) throw new Error(`Missing neural narration asset: ${narratorId}/${key}`);
  return source;
}

export function resolvePreviewAsset(narratorId: NarratorId): number {
  return ASSETS[narratorId]['coherence-focus'];
}

export const NARRATOR_LABELS: Record<NarratorId, string> = { female: 'Warm Female', male: 'Deep Male' };
