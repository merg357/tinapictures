import type { AffirmationDefinition, AffirmationState } from '../types';

const model = require('../core/affirmationModel') as {
  AFFIRMATION_CATEGORIES: Array<{ id: string; label: string }>;
  AFFIRMATIONS: AffirmationDefinition[];
  DEFAULT_AFFIRMATION_STATE: AffirmationState;
  selectAffirmations: (input: { categoryIds?: string[]; style?: string; count?: number; favoriteIds?: string[] }) => Array<AffirmationDefinition & { text: string }>;
  cadenceIntervalSeconds: (cadence: string) => number;
};

export const AFFIRMATION_CATEGORIES = model.AFFIRMATION_CATEGORIES;
export const AFFIRMATIONS = model.AFFIRMATIONS;
export const DEFAULT_AFFIRMATION_STATE = model.DEFAULT_AFFIRMATION_STATE;
export const selectAffirmations = model.selectAffirmations;
export const cadenceIntervalSeconds = model.cadenceIntervalSeconds;
