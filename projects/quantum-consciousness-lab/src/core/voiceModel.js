const NARRATORS = {
  female: {
    id: 'female',
    label: 'Warm Female',
    description: 'Warm, soft, grounded neural meditation narrator.',
  },
  male: {
    id: 'male',
    label: 'Deep Male',
    description: 'Calm, deep, grounded neural meditation narrator.',
  },
};

const PRACTICES = [
  'observer',
  'coherence',
  'deep-rest',
  'intention',
  'quantum-foundations',
  'expanded-consciousness',
  'synchronicity-dreams',
];

function resolveVoiceSlots(practiceId, narratorId) {
  if (!PRACTICES.includes(practiceId)) {
    throw new Error(`Unknown practice: ${practiceId}`);
  }
  if (!NARRATORS[narratorId]) {
    throw new Error(`Unknown narrator: ${narratorId}`);
  }

  return Array.from({ length: 5 }, (_, segmentIndex) => ({
    practiceId,
    narratorId,
    segmentIndex,
    provider: 'neural-asset',
    assetVersion: 'v1',
  }));
}

module.exports = { NARRATORS, PRACTICES, resolveVoiceSlots };
