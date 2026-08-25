const SUPPORTED_MINUTES = [5, 10, 15, 20];

const PATHS = {
  observer: { pathId:'observer', title:'Observer', evidence:'Established', rationale:'Use breathing and cognitive decentering to change your relationship to repetitive thoughts.', segmentNames:['Arrive','Settle the breath','Observe thoughts','Open awareness','Reflect'] },
  coherence: { pathId:'coherence', title:'Coherence', evidence:'Supported', rationale:'Use slow breathing, interoceptive attention, and a calm emotional focus to downshift arousal.', segmentNames:['Arrive','Slow breathing','Body awareness','Coherent focus','Reflect'] },
  'deep-rest': { pathId:'deep-rest', title:'Deep Rest', evidence:'Supported', rationale:'Use body settling, reduced stimulation, and long quiet intervals to prepare for rest without forcing sleep.', segmentNames:['Arrive','Lengthen the exhale','Body release','Quiet awareness','Drift'] },
  intention: { pathId:'intention', title:'Intention', evidence:'Supported', rationale:'Combine mental rehearsal, attention, and implementation intention without treating manifestation as established quantum physics.', segmentNames:['Arrive','Regulate','Clarify intention','Visualize action','Commit and reflect'] },
  'quantum-foundations': { pathId:'quantum-foundations', title:'Quantum Foundations', evidence:'Established', rationale:'Pair contemplative observation with accurate quantum concepts while keeping analogy separate from physical claims.', segmentNames:['Arrive','Breath anchor','Observation practice','Quantum reflection','Integrate'] },
  'expanded-consciousness': { pathId:'expanded-consciousness', title:'Expanded Consciousness', evidence:'Emerging', rationale:'Explore hypnagogic and open-awareness experiences as subjective states without claiming a supernatural mechanism.', segmentNames:['Arrive','Body settling','Open awareness','Deep quiet','Integrate'] },
  'synchronicity-dreams': { pathId:'synchronicity-dreams', title:'Synchronicity & Dreams', evidence:'Philosophical', rationale:'Explore meaning and patterns through Jungian and psychological lenses without treating coincidence as proof of nonlocal causation.', segmentNames:['Arrive','Recall','Observe symbols','Multiple lenses','Journal prompt'] },

  'spacious-awareness': { pathId:'spacious-awareness', title:'Spacious Awareness', evidence:'Emerging', rationale:'Use open-focus attention and awareness of surrounding space to reduce narrow attentional fixation and explore a broader subjective field.', segmentNames:['Arrive','Sense space','Open the field','Rest as awareness','Integrate'] },
  'breaking-pattern': { pathId:'breaking-pattern', title:'Breaking the Pattern', evidence:'Supported', rationale:'Notice an automatic thought-emotion-action loop, interrupt it, and rehearse a more useful response.', segmentNames:['Arrive','Recognize the loop','Interrupt','Rehearse a new response','Integrate'] },
  'heart-coherence': { pathId:'heart-coherence', title:'Heart Coherence', evidence:'Supported', rationale:'Pair slow comfortable breathing with heart-area attention and a genuine positive emotion to support autonomic settling.', segmentNames:['Arrive','Slow breathing','Heart attention','Elevated emotion','Integrate'] },
  'future-self': { pathId:'future-self', title:'Future Self', evidence:'Supported', rationale:'Use mental rehearsal to make chosen future behaviors more familiar, then connect imagery to a concrete action.', segmentNames:['Arrive','Regulate','Meet the future self','Rehearse behavior','Commit'] },
  'energy-centers': { pathId:'energy-centers', title:'Energy Center Journey', evidence:'Spiritual / Experiential', rationale:'Move attention through body regions as a contemplative practice. Energy-center meanings are presented as experiential/spiritual framing, not established anatomy.', segmentNames:['Arrive','Ground','Move attention','Open attention','Integrate'] },
  'new-potentials': { pathId:'new-potentials', title:'New Possibilities', evidence:'Theoretical', rationale:'Use imagination and emotional rehearsal to explore possible futures while separating psychological rehearsal from unproven quantum-manifestation claims.', segmentNames:['Arrive','Regulate','Choose a possibility','Rehearse it','Release'] },
  'walking-embodiment': { pathId:'walking-embodiment', title:'Walking Embodiment', evidence:'Supported', rationale:'Use posture, pace, attention, and mental rehearsal while walking to practice a chosen identity in motion.', segmentNames:['Arrive','Stand and orient','Walk with intention','Rehearse identity','Integrate'] },
  'gratitude-receiving': { pathId:'gratitude-receiving', title:'Gratitude & Receiving', evidence:'Supported', rationale:'Use specific gratitude and receptive attention to broaden focus and cultivate a calmer positive emotional state.', segmentNames:['Arrive','Slow breathing','Recall something real','Receive the feeling','Integrate'] },
  'deep-sleep-integration': { pathId:'deep-sleep-integration', title:'Deep Sleep Integration', evidence:'Supported', rationale:'Pair low stimulation, body release, and gentle identity rehearsal before sleep without claiming that sleep guarantees subconscious reprogramming.', segmentNames:['Arrive','Release the day','Body settling','Gentle rehearsal','Drift'] },
  'abundance-identity': { pathId:'abundance-identity', title:'Abundance Identity', evidence:'Supported', rationale:'Shift from scarcity-focused attention toward resourcefulness, opportunity recognition, value creation, and grounded self-efficacy.', segmentNames:['Arrive','Notice scarcity','Open attention','Rehearse resourcefulness','Commit'] },
  'purpose-direction': { pathId:'purpose-direction', title:'Purpose & Direction', evidence:'Supported', rationale:'Clarify a meaningful direction and translate it into one concrete next action.', segmentNames:['Arrive','Regulate','Name what matters','Rehearse the next step','Commit'] },
  'stress-stillness': { pathId:'stress-stillness', title:'Stress-to-Stillness', evidence:'Supported', rationale:'Use slow breathing, muscle release, and attentional widening to reduce acute subjective arousal.', segmentNames:['Arrive','Longer exhale','Release tension','Widen attention','Integrate'] },
};

function nearestSupportedMinutes(value) {
  const numeric = Number(value) || 10;
  return SUPPORTED_MINUTES.reduce((best, candidate) => Math.abs(candidate - numeric) < Math.abs(best - numeric) ? candidate : best, SUPPORTED_MINUTES[0]);
}

function choosePath(intent = '', goal = '') {
  const text = `${intent} ${goal}`.toLowerCase();
  // V0.4 specific routes come first so they are not swallowed by broader legacy keywords.
  if (/(spacious awareness|sense the space|open[- ]focus|space around my body)/.test(text)) return PATHS['spacious-awareness'];
  if (/(break.*pattern|breaking the pattern|interrupt.*automatic|pattern interruption|old pattern)/.test(text)) return PATHS['breaking-pattern'];
  if (/(heart.*coherence|heart focused|heart-focused|heart breathing)/.test(text)) return PATHS['heart-coherence'];
  if (/(future self|future-self|new self identity|rehearse.*identity)/.test(text)) return PATHS['future-self'];
  if (/(energy center|energy centre|centers? journey|blessing.*center)/.test(text)) return PATHS['energy-centers'];
  if (/(new possibilit|new potential|tune in.*potential)/.test(text)) return PATHS['new-potentials'];
  if (/(walking meditation|walking embodiment|walk.*new self|embody.*walk)/.test(text)) return PATHS['walking-embodiment'];
  if (/(gratitude.*receiv|receiving.*gratitude|gratitude practice)/.test(text)) return PATHS['gratitude-receiving'];
  if (/(sleep integration|overnight rest|night integration)/.test(text)) return PATHS['deep-sleep-integration'];
  if (/(abundance identity|prosperity mindset|scarcity.*abundance|resourceful.*abundance)/.test(text)) return PATHS['abundance-identity'];
  if (/(purpose and direction|purpose.*next step|direction.*next step|definite aim)/.test(text)) return PATHS['purpose-direction'];
  if (/(stress to stillness|stress-to-stillness|acute stress|stillness right now)/.test(text)) return PATHS['stress-stillness'];

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

const PROMPTS = {
  observer: 'Notice thoughts as events appearing in awareness. You do not need to suppress, solve, or believe them right now.',
  coherence: 'Let the exhale stay easy and unforced. Notice physical signals of settling without trying to manufacture a particular feeling.',
  'deep-rest': 'Let effort soften. Feel the weight of the body being supported and allow each exhale to release a little more tension.',
  intention: 'Picture the next concrete action that aligns with your intention. Treat visualization as rehearsal, not as a guarantee that reality will change on command.',
  'quantum-foundations': 'Observe experience carefully. Psychological observation can change your relationship to a thought; this is an analogy, not a claim about quantum measurement in the brain.',
  'expanded-consciousness': 'Allow unusual sensations or imagery to come and go. Treat them as subjective experiences without needing to decide what they ultimately mean.',
  'synchronicity-dreams': 'Hold the image or coincidence lightly. Consider meaning, memory, probability, and spiritual interpretation as different lenses rather than a single proven explanation.',
  'spacious-awareness': 'Sense the space around the body as well as sensations inside it. Let attention become broad rather than effortfully fixed.',
  'breaking-pattern': 'Recognize the old sequence without shame. Interrupt it, breathe, and rehearse the response you want available next time.',
  'heart-coherence': 'Breathe comfortably and attend to the center of the chest while recalling a real feeling of care, gratitude, or appreciation.',
  'future-self': 'Imagine a future version of you handling one real situation well, then identify the behavior you can practice today.',
  'energy-centers': 'Move attention slowly through body regions and notice sensations. Any energy-center symbolism is an experiential lens, not established anatomy.',
  'new-potentials': 'Explore a possible future vividly while remembering that mental rehearsal can shape behavior without guaranteeing external outcomes.',
  'walking-embodiment': 'Let posture, pace, gaze, and breathing match the identity you are practicing while you move safely through the environment.',
  'gratitude-receiving': 'Recall something specific you genuinely appreciate and allow the feeling to be present without forcing intensity.',
  'deep-sleep-integration': 'Release the day and rehearse one simple quality you want to carry tomorrow. Then let the rehearsal end and rest.',
  'abundance-identity': 'Notice scarcity-focused thoughts and widen attention toward resources, skills, opportunities, relationships, and useful action.',
  'purpose-direction': 'Name what matters most right now and rehearse the smallest concrete action that moves in that direction.',
  'stress-stillness': 'Lengthen the exhale gently, soften tension, and widen attention until the moment feels less compressed.',
};

function buildPrompt(pathId, segmentName, lens) {
  if (segmentName === 'Arrive') return 'Get comfortable. Feel the support beneath you. Let your shoulders soften, and allow the next few breaths to become natural.';
  if (segmentName === 'Drift') return 'There is nothing more to accomplish. Let the guidance fall away and rest in the quiet for as long as you like.';
  return `${PROMPTS[pathId] || PROMPTS.coherence} ${lensNote(lens)}`;
}

function composeSession({ intent = '', goal = '', minutes = 10, lens = 'science' } = {}) {
  const normalizedMinutes = nearestSupportedMinutes(minutes);
  const path = choosePath(intent, goal);
  const allocations = allocateMinutes(normalizedMinutes, path.segmentNames.length);
  return {
    id: `${path.pathId}-${normalizedMinutes}-${Date.now()}`,
    pathId: path.pathId,
    title: path.title,
    evidence: path.evidence,
    rationale: path.rationale,
    lens,
    lensNote: lensNote(lens),
    minutes: normalizedMinutes,
    intent: String(intent || '').trim(),
    goal: String(goal || '').trim(),
    segments: path.segmentNames.map((name, index) => ({ id: `${path.pathId}-${index + 1}`, title: name, minutes: allocations[index], prompt: buildPrompt(path.pathId, name, lens) })),
  };
}

module.exports = { composeSession, nearestSupportedMinutes, choosePath, allocateMinutes, PATHS };
