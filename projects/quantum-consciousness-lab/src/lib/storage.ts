import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExperimentRecord, JournalEntry, NarratorId, SessionRecord, UserLens } from '../types';

const { mergeSettings } = require('../core/settingsModel') as {
  mergeSettings: (current: Settings, patch: Partial<Settings>) => Settings;
};

type Settings = { lens?: UserLens; narrator?: NarratorId };

const SETTINGS_KEY = 'cl.settings.v2';
const JOURNAL_KEY = 'cl.journal.v1';
const EXPERIMENTS_KEY = 'cl.experiments.v1';
const SESSIONS_KEY = 'cl.sessions.v2';

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

async function patchSettings(patch: Partial<Settings>): Promise<void> {
  const current = await readJson<Settings>(SETTINGS_KEY, {});
  await writeJson(SETTINGS_KEY, mergeSettings(current, patch));
}

export async function loadLens(): Promise<UserLens | null> {
  const settings = await readJson<Settings>(SETTINGS_KEY, {});
  return settings.lens ?? null;
}

export async function saveLens(lens: UserLens): Promise<void> {
  await patchSettings({ lens });
}

export async function loadNarrator(): Promise<NarratorId> {
  const settings = await readJson<Settings>(SETTINGS_KEY, {});
  return settings.narrator === 'male' ? 'male' : 'female';
}

export async function saveNarrator(narrator: NarratorId): Promise<void> {
  await patchSettings({ narrator });
}

export const loadJournal = () => readJson<JournalEntry[]>(JOURNAL_KEY, []);
export const saveJournal = (entries: JournalEntry[]) => writeJson(JOURNAL_KEY, entries);
export const loadExperiments = () => readJson<ExperimentRecord[]>(EXPERIMENTS_KEY, []);
export const saveExperiments = (entries: ExperimentRecord[]) => writeJson(EXPERIMENTS_KEY, entries);
export const loadSessions = () => readJson<SessionRecord[]>(SESSIONS_KEY, []);
export const saveSessions = (entries: SessionRecord[]) => writeJson(SESSIONS_KEY, entries.slice(0, 500));
