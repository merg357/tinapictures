const SUPPORTED_MINUTES = [5, 10, 15, 20];

const PATHS = {
  observer: {
    pathId: 'observer', title: 'Observer', evidence: 'Established',
    rationale: 'Use breathing and cognitive decentering to change your relationship to repetitive thoughts.',
    segmentNames: ['Arrive', 'Settle the breath', 'Observe thoughts', 'Open awareness', 'Reflect'],
  },
  coherence: {
    pathId: 'coherence', title: 'Coherence', evidence: 'Supported',
    rationale: 'Use slow breathing, interoceptive attention, and a calm emotional focus to downshift arousal.',
    segmentNames: ['Arrive', 'Slow breathing', 'Body awareness', 'Coherent focus', 'Reflect'],
  },
  'deep-rest': {
    pathId: 'deep-rest', title: 'Deep Rest', evidence: 'Supported',
    rationale: 'Use body settling, reduced stimulation, and long quiet intervals to prepare for rest without forcing sleep.',
    segmentNames: ['Arrive', 'Lengthen the exhale', 'Body release', 'Quiet awareness', 'Drift'],
  },
  intention: {
    pathId: 'intention', title: 'Intention', evidence: 'Supported',
    rationale: 'Combine mental rehearsal, attention, and implementation intention without treating manifestation as established quantum physics.',
    segmentNames: ['Arrive', 'Regulate', 'Clarify intention', 'Visualize action', 'Commit and reflect'],
  },
  'quantum-foundations': {
    pathId: 'quantum-foundations', title: 'Quantum Foundations', evidence: 'Established',
    rationale: 'Pair contemplative observation with accurate quantum concepts while keeping analogy separate from physical claims.',
    segmentNames: ['Arrive', 'Breath anchor', 'Observation practice', 'Quantum reflection', 'Integrate'],
  },
  'expanded-consciousness': {
    pathId: 'expanded-consciousness', title: 'Expanded Consciousness', evidence: 'Emerging',
    rationale: 'Explore hypnagogic and open-awareness experiences as subjective states without claiming a supernatural mechanism.',
    segmentNames: ['Arrive', 'Body settling', 'Open awareness', 'Deep quiet', 'Integrate'],
  },
  'synchronicity-dreams': {
    pathId: 'synchronicity-dreams', title: 'Synchronicity & Dreams', evidence: 'Philosophical',
    rationale: 'Explore meaning and patterns through Jungian and psychological lenses without treating coincidence as proof of nonlocal causation.',
    segmentNames: ['Arrive', 'Recall', 'Observe symbols', 'Multiple lenses', 'Journal prompt'],
  },
};

function nearestSupportedMinutes(value) {
  const numeric = Number(value) || 10;
  return SUPPORTED_MINUTES.reduce((best, candidate) => Math.abs(candidate - numeric) < Math.abs(best - numeric) ? candidate : best, SUPPORTED_MINUTES[0]);
}

function choosePath(intent = '', goal = '') {
  const text = `${intent} ${goal}`.toLowerCase();
  if (/(sleep|insomnia|bedtime|deep rest|tired|wind down)/.test(text)) return PATHS['deep-rest'];
  if (/(dream|synchronic|coincidence|symbol)/.test(text)) return PATHS['synchronicity-dreams'];
  if (/(intention|manifest|visuali[sz]e|future|goal|confidence)/.test(text)) return PATHS.intention;
  if (/(quantum|entangle|superposition|observer effect|bohm)/.test(text)) return PATHS['quantum-foundations'];
  if (/(expanded|altered|hypnagog|out.of.body|deep state|consciousness|go deep)/.test(text)) return PATHS['expanded-consciousness'];
  if (/(argument|replay|overthink|thought|ruminat|angry|let it go|observer|reset|focus)/.test(text)) return PATHS.observer;
  return PATHS.coherence;
}

function allocateMinutes(total, count) {
  const weights = count === 5 ? [1, 2, 3, 2, 1] : Array(count).fill(1);
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  const raw = weights.map((weight) => (total * weight) / weightTotal);
  const allocated = raw.map((value) => Math.floor(value));
  let remaining = total - allocated.reduce((sum, value) => sum + value, 0);
  const order = raw.map((value, index) => ({ index, fraction: value - Math.floor(value) })).sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let i = 0; i < remaining; i += 1) allocated[order[i % order.length].index] += 1;
  return allocated;
}

function lensNote(lens) {
  if (lens === 'full') return 'Includes clearly labeled philosophical and spiritual interpretations alongside the scientific framing.';
  if (lens === 'science-frontier') return 'Includes established science plus clearly labeled frontier hypotheses where relevant.';
  return 'Keeps explanations centered on established and supported scientific mechanisms.';
}

function composeSession({ intent = '', goal = '', minutes = 10, lens = 'science' } = {}) {
  const normalizedMinutes = nearestSupportedMinutes(minutes);
  const path = choosePath(intent, goal);
  const allocations = allocateMinutes(normalizedMinutes, path.segmentNames.length);
  return {
    id: `${path.pathId}-${normalizedMinutes}-${Date.now()}`,
    pathId: path.pathId, title: path.title, evidence: path.evidence, rationale: path.rationale,
    lens, lensNote: lensNote(lens), minutes: normalizedMinutes,
    intent: String(intent || '').trim(), goal: String(goal || '').trim(),
    segments: path.segmentNames.map((name, index) => ({ id: `${path.pathId}-${index + 1}`, title: name, minutes: allocations[index], prompt: buildPrompt(path.pathId, name, lens) })),
  };
}

function buildPrompt(pathId, segmentName, lens) {
  const prompts = {
    observer: 'Notice thoughts as events appearing in awareness. You do not need to suppress, solve, or believe them right now.',
    coherence: 'Let the exhale stay easy and unforced. Notice the physical signals of settling without trying to manufacture a particular feeling.',
    'deep-rest': 'Let effort soften. Feel the weight of the body being supported. Nothing needs to happen next; simply allow each exhale to release a little more tension.',
    intention: 'Picture the next concrete action that aligns with your intention. Treat visualization as rehearsal, not as a guarantee that reality will change on command.',
    'quantum-foundations': 'Observe experience carefully. Psychological observation can change your relationship to a thought; this is an analogy, not a claim about quantum measurement in the brain.',
    'expanded-consciousness': 'Allow unusual sensations or imagery to come and go. Treat them as subjective experiences without needing to decide what they ultimately mean.',
    'synchronicity-dreams': 'Hold the image or coincidence lightly. Consider meaning, memory, probability, and spiritual interpretation as different lenses rather than a single proven explanation.',
  };
  if (segmentName === 'Arrive') return 'Get comfortable. Feel the support beneath you. Let your shoulders soften, and allow the next few breaths to become natural.';
  if (segmentName === 'Drift') return 'There is nothing more to accomplish. Let the guidance fall away and rest in the quiet for as long as you like.';
  return `${prompts[pathId] || prompts.coherence} ${lensNote(lens)}`;
}

module.exports = { composeSession, nearestSupportedMinutes, choosePath, allocateMinutes };
