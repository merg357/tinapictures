import type { NarratorId } from '../types';

export const PRACTICE_IDS = [
  'observer',
  'coherence',
  'deep-rest',
  'intention',
  'quantum-foundations',
  'expanded-consciousness',
  'synchronicity-dreams',
] as const;

export type VoicePracticeId = (typeof PRACTICE_IDS)[number];
export type VoiceAssetKey =
  | 'arrive'
  | 'regulate'
  | 'open'
  | 'closing'
  | 'drift'
  | 'observer-focus'
  | 'coherence-focus'
  | 'deep-rest-focus'
  | 'intention-focus'
  | 'quantum-foundations-focus'
  | 'expanded-consciousness-focus'
  | 'synchronicity-dreams-focus';

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
  },
};

function assertPracticeId(value: string): asserts value is VoicePracticeId {
  if (!(PRACTICE_IDS as readonly string[]).includes(value)) throw new Error(`Missing neural narration for practice: ${value}`);
}

export function assetKeyForPhase(practiceId: string, segmentIndex: number): VoiceAssetKey {
  assertPracticeId(practiceId);
  if (!Number.isInteger(segmentIndex) || segmentIndex < 0 || segmentIndex > 4) {
    throw new Error(`Missing neural narration phase: ${practiceId}/${segmentIndex}`);
  }
  if (segmentIndex === 0) return 'arrive';
  if (segmentIndex === 1) return 'regulate';
  if (segmentIndex === 2) return `${practiceId}-focus` as VoiceAssetKey;
  if (segmentIndex === 3) return 'open';
  return practiceId === 'deep-rest' ? 'drift' : 'closing';
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

export const NARRATOR_LABELS: Record<NarratorId, string> = {
  female: 'Warm Female',
  male: 'Deep Male',
};
