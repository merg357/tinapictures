import type { EvidenceLevel, UserLens } from '../types';

export const LENS_OPTIONS: Array<{ id: UserLens; title: string; subtitle: string }> = [
  { id: 'science', title: 'Science', subtitle: 'Established and supported science first.' },
  { id: 'science-frontier', title: 'Science + Frontier', subtitle: 'Science plus clearly labeled emerging theories.' },
  { id: 'full', title: 'Full Exploration', subtitle: 'Add philosophical and spiritual lenses without changing the evidence labels.' },
];

export const QUICK_GOALS = ['Calm', 'Reset', 'Focus', 'Sleep', 'Intention', 'Go Deeper'];
export const DURATIONS = [5, 10, 15, 20];

export const EVIDENCE_COLORS: Record<EvidenceLevel, string> = {
  Established: '#86EFAC',
  Supported: '#67E8F9',
  Emerging: '#FCD34D',
  Theoretical: '#C4B5FD',
  Philosophical: '#FDA4AF',
  'Spiritual / Experiential': '#F0ABFC',
};
