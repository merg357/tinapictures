export type UserLens = 'science' | 'science-frontier' | 'full';
export type NarratorId = 'female' | 'male';
export type TabKey = 'home' | 'practice' | 'explore' | 'lab' | 'journal';
export type EvidenceLevel = 'Established' | 'Supported' | 'Emerging' | 'Theoretical' | 'Philosophical' | 'Spiritual / Experiential';

export interface SessionSegment {
  id: string;
  title: string;
  minutes: number;
  prompt: string;
}

export interface SessionPlan {
  id: string;
  pathId: string;
  title: string;
  evidence: EvidenceLevel;
  rationale: string;
  lens: UserLens;
  lensNote: string;
  minutes: number;
  intent: string;
  goal: string;
  segments: SessionSegment[];
}

export interface SessionRecord {
  id: string;
  pathId: string;
  title: string;
  minutes: number;
  before: number;
  after: number;
  completed: boolean;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  category: string;
  text: string;
  createdAt: number;
}

export interface ExperimentRecord {
  id: string;
  protocol: string;
  before: number;
  after: number;
  change: number;
  createdAt: number;
  note: string;
}
