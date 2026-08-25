const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'practice', label: 'Practice' },
  { key: 'explore', label: 'Explore' },
  { key: 'lab', label: 'Lab' },
  { key: 'journal', label: 'Journal' },
];

function round1(value) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function computeStats(records = []) {
  const completed = records.filter((record) => record && record.completed !== false);
  if (!completed.length) {
    return {
      sessions: 0,
      minutes: 0,
      averageBefore: 0,
      averageAfter: 0,
      averageChange: 0,
      bestPractice: null,
    };
  }

  const sessions = completed.length;
  const minutes = completed.reduce((sum, record) => sum + Number(record.minutes || 0), 0);
  const averageBefore = round1(completed.reduce((sum, record) => sum + Number(record.before || 0), 0) / sessions);
  const averageAfter = round1(completed.reduce((sum, record) => sum + Number(record.after || 0), 0) / sessions);
  const averageChange = round1(completed.reduce((sum, record) => sum + (Number(record.after || 0) - Number(record.before || 0)), 0) / sessions);

  const byPractice = new Map();
  for (const record of completed) {
    const pathId = record.pathId || 'unknown';
    const change = Number(record.after || 0) - Number(record.before || 0);
    const current = byPractice.get(pathId) || { total: 0, count: 0 };
    current.total += change;
    current.count += 1;
    byPractice.set(pathId, current);
  }

  let bestPractice = null;
  let bestAverage = Infinity;
  for (const [pathId, value] of byPractice.entries()) {
    const average = value.total / value.count;
    if (average < bestAverage) {
      bestAverage = average;
      bestPractice = pathId;
    }
  }

  return { sessions, minutes, averageBefore, averageAfter, averageChange, bestPractice };
}

function recommendPractice(text = '') {
  const value = String(text).toLowerCase();
  if (/(sleep|insomnia|bed|tired|rest|night)/.test(value)) {
    return { pathId: 'deep-rest', title: 'Deep Rest', reason: 'A slower, low-guidance wind-down is the clearest match for sleep and nighttime overthinking.' };
  }
  if (/(panic|anxious|anxiety|stress|stressed|calm|heart|overwhelm|overwhelmed)/.test(value)) {
    return { pathId: 'coherence', title: 'Coherence', reason: 'Breath-led regulation is the fastest controlled starting point for high arousal.' };
  }
  if (/(goal|visuali[sz]e|intention|manifest|future|confidence|motivat)/.test(value)) {
    return { pathId: 'intention', title: 'Intention', reason: 'Visualization, mental rehearsal, and a concrete next action fit this goal.' };
  }
  if (/(dream|synchronic|coincidence|symbol)/.test(value)) {
    return { pathId: 'synchronicity-dreams', title: 'Synchronicity & Dreams', reason: 'This route preserves multiple explanatory lenses instead of declaring one interpretation true.' };
  }
  if (/(quantum|entangle|physics|superposition|observer effect)/.test(value)) {
    return { pathId: 'quantum-foundations', title: 'Quantum Foundations', reason: 'Start from established physics, then clearly separate frontier and philosophical interpretations.' };
  }
  if (/(deep|altered|hypnagog|obe|out of body|expanded)/.test(value)) {
    return { pathId: 'expanded-consciousness', title: 'Expanded Consciousness', reason: 'A low-stimulation altered-state practice fits deeper exploration.' };
  }
  return { pathId: 'observer', title: 'Observer', reason: 'Observation and cognitive decentering are a flexible default for repetitive thoughts and mental noise.' };
}

function pickBestVoice(voices = []) {
  const english = voices.filter((voice) => String(voice.language || '').toLowerCase().startsWith('en'));
  const pool = english.length ? english : voices;
  if (!pool.length) return null;

  const scored = pool.map((voice, index) => {
    const name = String(voice.name || '').toLowerCase();
    const quality = String(voice.quality || '').toLowerCase();
    let score = 0;
    if (quality.includes('enhanced')) score += 100;
    if (/(neural|natural|enhanced|studio|premium)/.test(name)) score += 40;
    if (/(google|samsung|microsoft)/.test(name)) score += 8;
    if (/(novelty|robot|whisper|child|funny)/.test(name)) score -= 100;
    score -= index / 1000;
    return { voice, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].voice;
}

module.exports = { NAV_ITEMS, computeStats, recommendPractice, pickBestVoice };
