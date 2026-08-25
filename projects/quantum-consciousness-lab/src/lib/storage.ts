import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AffirmationState,
  AudioSettings,
  ChallengeProgress,
  ExperimentRecord,
  JournalEntry,
  NarratorId,
  SessionRecord,
  UserLens,
} from '../types';

const { mergeSettings } = require('../core/settingsModel') as {
  mergeSettings: (current: Settings, patch: Partial<Settings>) => Settings;
};
const { normalizeAudioSettings, DEFAULT_AUDIO_SETTINGS } = require('../core/audioModel') as {
  normalizeAudioSettings: (input?: Partial<AudioSettings>) => AudioSettings;
  DEFAULT_AUDIO_SETTINGS: AudioSettings;
};
const { normalizeAffirmationState, DEFAULT_AFFIRMATION_STATE } = require('../core/affirmationModel') as {
  normalizeAffirmationState: (input?: Partial<AffirmationState>) => AffirmationState;
  DEFAULT_AFFIRMATION_STATE: AffirmationState;
};
const { normalizeChallengeProgress, DEFAULT_CHALLENGE_PROGRESS } = require('../core/challengeModel') as {
  normalizeChallengeProgress: (input?: Partial<ChallengeProgress>) => ChallengeProgress;
  DEFAULT_CHALLENGE_PROGRESS: ChallengeProgress;
};

type Settings = { lens?: UserLens; narrator?: NarratorId; audio?: Partial<AudioSettings> };

const SETTINGS_KEY = 'cl.settings.v3';
const LEGACY_SETTINGS_KEY = 'cl.settings.v2';
const JOURNAL_KEY = 'cl.journal.v1';
const EXPERIMENTS_KEY = 'cl.experiments.v1';
const SESSIONS_KEY = 'cl.sessions.v2';
const AFFIRMATIONS_KEY = 'cl.affirmations.v1';
const CHALLENGE_KEY = 'cl.challenge.v1';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function readSettings(): Promise<Settings> {
  const current = await readJson<Settings>(SETTINGS_KEY, {});
  if (Object.keys(current).length) return current;
  const legacy = await readJson<Settings>(LEGACY_SETTINGS_KEY, {});
  if (Object.keys(legacy).length) {
    await writeJson(SETTINGS_KEY, legacy);
    return legacy;
  }
  return {};
}

async function patchSettings(patch: Partial<Settings>): Promise<void> {
  const current = await readSettings();
  await writeJson(SETTINGS_KEY, mergeSettings(current, patch));
}

export async function loadLens(): Promise<UserLens | null> {
  const settings = await readSettings();
  return settings.lens ?? null;
}

export async function saveLens(lens: UserLens): Promise<void> {
  await patchSettings({ lens });
}

export async function loadNarrator(): Promise<NarratorId> {
  const settings = await readSettings();
  return settings.narrator === 'male' ? 'male' : 'female';
}

export async function saveNarrator(narrator: NarratorId): Promise<void> {
  await patchSettings({ narrator });
}

export async function loadAudioSettings(): Promise<AudioSettings> {
  const settings = await readSettings();
  return normalizeAudioSettings(settings.audio ?? DEFAULT_AUDIO_SETTINGS);
}

export async function saveAudioSettings(audio: AudioSettings): Promise<void> {
  await patchSettings({ audio: normalizeAudioSettings(audio) });
}

export async function loadAffirmationState(): Promise<AffirmationState> {
  return normalizeAffirmationState(await readJson<Partial<AffirmationState>>(AFFIRMATIONS_KEY, DEFAULT_AFFIRMATION_STATE));
}

export async function saveAffirmationState(state: AffirmationState): Promise<void> {
  await writeJson(AFFIRMATIONS_KEY, normalizeAffirmationState(state));
}

export async function loadChallengeProgress(): Promise<ChallengeProgress> {
  return normalizeChallengeProgress(await readJson<Partial<ChallengeProgress>>(CHALLENGE_KEY, DEFAULT_CHALLENGE_PROGRESS));
}

export async function saveChallengeProgress(state: ChallengeProgress): Promise<void> {
  await writeJson(CHALLENGE_KEY, normalizeChallengeProgress(state));
}

export const loadJournal = () => readJson<JournalEntry[]>(JOURNAL_KEY, []);
export const saveJournal = (entries: JournalEntry[]) => writeJson(JOURNAL_KEY, entries);
export const loadExperiments = () => readJson<ExperimentRecord[]>(EXPERIMENTS_KEY, []);
export const saveExperiments = (entries: ExperimentRecord[]) => writeJson(EXPERIMENTS_KEY, entries);
export const loadSessions = () => readJson<SessionRecord[]>(SESSIONS_KEY, []);
export const saveSessions = (entries: SessionRecord[]) => writeJson(SESSIONS_KEY, entries.slice(0, 500));
