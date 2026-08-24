import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExperimentRecord, JournalEntry, UserLens } from '../types';

const SETTINGS_KEY = 'cl.settings.v1';
const JOURNAL_KEY = 'cl.journal.v1';
const EXPERIMENTS_KEY = 'cl.experiments.v1';

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

export async function loadLens(): Promise<UserLens | null> {
  const settings = await readJson<{ lens?: UserLens }>(SETTINGS_KEY, {});
  return settings.lens ?? null;
}

export async function saveLens(lens: UserLens): Promise<void> {
  await writeJson(SETTINGS_KEY, { lens });
}

export const loadJournal = () => readJson<JournalEntry[]>(JOURNAL_KEY, []);
export const saveJournal = (entries: JournalEntry[]) => writeJson(JOURNAL_KEY, entries);
export const loadExperiments = () => readJson<ExperimentRecord[]>(EXPERIMENTS_KEY, []);
export const saveExperiments = (entries: ExperimentRecord[]) => writeJson(EXPERIMENTS_KEY, entries);
