import type { ChallengeProgress } from '../types';

export interface ChallengeDay {
  day: number;
  phase: number;
  phaseTitle: string;
  title: string;
  morning: string;
  midday: string;
  evening: string;
  affirmationCategoryId: string;
  practiceId: string;
  milestone: boolean;
}

const model = require('../core/challengeModel') as {
  CHALLENGE_DAYS: ChallengeDay[];
  DEFAULT_CHALLENGE_PROGRESS: ChallengeProgress;
  completeChallengeDay: (state: ChallengeProgress, day: number, timestamp?: number) => ChallengeProgress;
  getChallengeSummary: (state: ChallengeProgress) => { completedCount: number; currentDay: number; streak: number; percent: number; lastMilestone: number };
  saveMilestoneNote: (state: ChallengeProgress, day: number, note: string, timestamp?: number) => ChallengeProgress;
};

export const CHALLENGE_DAYS = model.CHALLENGE_DAYS;
export const DEFAULT_CHALLENGE_PROGRESS = model.DEFAULT_CHALLENGE_PROGRESS;
export const completeChallengeDay = model.completeChallengeDay;
export const getChallengeSummary = model.getChallengeSummary;
export const saveMilestoneNote = model.saveMilestoneNote;
