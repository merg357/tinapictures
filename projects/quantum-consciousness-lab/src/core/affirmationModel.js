const AFFIRMATION_CATEGORIES = [
  ['peace-prosperity', 'Peace & Prosperity'],
  ['sleep-night', 'Sleep & Night'],
  ['gratitude', 'Gratitude'],
  ['divine-rhythm', 'Divine Rhythm'],
  ['circulation-giving', 'Circulation & Giving'],
  ['reflection-confidence', 'Reflection & Confidence'],
  ['faith-certainty', 'Faith & Certainty'],
  ['mastery-thought', 'Mastery of Thought'],
  ['definite-aim', 'Definite Aim'],
  ['identity', 'Identity'],
  ['repetition-becoming', 'Repetition & Becoming'],
  ['boldness-courage', 'Boldness & Courage'],
  ['action-urgency', 'Action & Urgency'],
  ['legacy-service', 'Legacy & Service'],
].map(([id, label]) => ({ id, label }));

const RAW = {
  'peace-prosperity': [
    ['I move through today with calm confidence and an open mind for opportunity.', 'Each day I am becoming calmer, more confident, and more able to recognize opportunity.'],
    ['I create value with a peaceful mind and allow prosperity to grow from useful action.', 'I am learning to create value consistently and let prosperity grow from steady action.'],
  ],
  'sleep-night': [
    ['I release the day. My body can rest, and tomorrow can begin with a clear mind.', 'Night by night I am learning to release the day and rest more deeply.'],
    ['I do not need to solve anything right now. Rest is productive and safe.', 'I am becoming more comfortable letting unresolved thoughts wait until morning.'],
  ],
  gratitude: [
    ['I notice what is already working and let gratitude widen my attention.', 'I am becoming quicker to notice what is useful, supportive, and worth appreciating.'],
    ['I can feel grateful now while still moving toward what matters next.', 'I am learning to pair ambition with genuine appreciation for the present.'],
  ],
  'divine-rhythm': [
    ['I move without panic. I can be purposeful without being rushed.', 'I am becoming more patient, timely, and deliberate in the way I move through life.'],
    ['I trust disciplined action more than frantic urgency.', 'I am learning to choose steady progress over pressure and haste.'],
  ],
  'circulation-giving': [
    ['I use what I have wisely, give where I can, and remain open to receiving support.', 'I am becoming more generous, resourceful, and receptive in healthy ways.'],
    ['My success can create value for other people as well as for me.', 'I am learning to build forms of success that benefit both me and the people around me.'],
  ],
  'reflection-confidence': [
    ['I can observe feedback without surrendering my worth.', 'I am becoming more able to learn from feedback while keeping my self-respect intact.'],
    ['I speak calmly, stand clearly, and let my actions support my confidence.', 'I am building confidence through calm speech, clear boundaries, and repeated action.'],
  ],
  'faith-certainty': [
    ['I trust my ability to choose, adapt, and continue.', 'I am becoming more certain of my ability to respond well even when outcomes are unknown.'],
    ['My direction is clear enough for the next step, and the next step is enough for now.', 'I am learning to replace vague hope with clear choices and practical follow-through.'],
  ],
  'mastery-thought': [
    ['My attention belongs to me. I choose which thoughts deserve repetition.', 'I am becoming more skilled at noticing thoughts without automatically feeding them.'],
    ['I practice the thoughts and behaviors that support the person I intend to become.', 'I am gradually replacing old mental habits with thoughts and behaviors that serve my goals.'],
  ],
  'definite-aim': [
    ['I know what matters, and I organize my actions around it.', 'I am becoming clearer about my priorities and more consistent in acting on them.'],
    ['I turn intention into a specific next action.', 'I am learning to translate big goals into concrete steps I can complete today.'],
  ],
  identity: [
    ['I am a person who follows through with calm, focused action.', 'I am becoming a person who follows through more consistently with calm, focused action.'],
    ['I keep my word to myself and make decisions that match my values.', 'I am getting better at keeping commitments to myself and choosing in line with my values.'],
  ],
  'repetition-becoming': [
    ['What I practice repeatedly becomes easier to live.', 'Each repetition makes the habits I want a little more familiar and automatic.'],
    ['I rehearse the identity I want through thought, emotion, and behavior.', 'I am gradually becoming more like the person I repeatedly practice being.'],
  ],
  'boldness-courage': [
    ['I can feel fear and still choose the useful action.', 'I am becoming more willing to act while uncertainty is present.'],
    ['Difficulty is information, not a command to quit.', 'I am learning to use setbacks as feedback instead of proof that I should stop.'],
  ],
  'action-urgency': [
    ['I begin with the next useful action instead of waiting for perfect motivation.', 'I am getting faster at starting useful work before I feel completely ready.'],
    ['I decide, act, review, and adjust.', 'I am building a habit of acting, learning from results, and correcting quickly.'],
  ],
  'legacy-service': [
    ['I want my work, choices, and presence to leave people better than I found them.', 'I am becoming more intentional about creating a positive effect through how I live and serve.'],
    ['I build something worth passing forward.', 'I am learning to make choices that serve both my present life and the people who come after me.'],
  ],
};

const AFFIRMATIONS = [];
for (const category of AFFIRMATION_CATEGORIES) {
  (RAW[category.id] || []).forEach(([command, becoming], index) => {
    AFFIRMATIONS.push({ id: `${category.id}-${index + 1}`, categoryId: category.id, command, becoming });
  });
}

const DEFAULT_AFFIRMATION_STATE = Object.freeze({
  categoryIds: ['identity', 'gratitude'],
  style: 'becoming',
  mode: 'meditation',
  cadence: 'regular',
  minutes: 10,
  favoriteIds: [],
  custom: [],
});

function normalizeAffirmationState(input = {}) {
  const categorySet = new Set(AFFIRMATION_CATEGORIES.map((x) => x.id));
  const affirmationSet = new Set(AFFIRMATIONS.map((x) => x.id));
  const categoryIds = Array.isArray(input.categoryIds) ? input.categoryIds.filter((x) => categorySet.has(x)) : DEFAULT_AFFIRMATION_STATE.categoryIds;
  const custom = Array.isArray(input.custom)
    ? input.custom.filter((x) => x && typeof x.text === 'string' && x.text.trim()).map((x) => ({ id: String(x.id || `custom-${Date.now()}`), text: x.text.trim(), createdAt: Number(x.createdAt) || Date.now() })).slice(0, 100)
    : [];
  return {
    categoryIds,
    style: input.style === 'command' ? 'command' : 'becoming',
    mode: ['morning', 'meditation', 'walking', 'sleep'].includes(input.mode) ? input.mode : DEFAULT_AFFIRMATION_STATE.mode,
    cadence: ['occasional', 'regular', 'affirmation-only'].includes(input.cadence) ? input.cadence : DEFAULT_AFFIRMATION_STATE.cadence,
    minutes: [5, 10, 20, 30].includes(Number(input.minutes)) ? Number(input.minutes) : DEFAULT_AFFIRMATION_STATE.minutes,
    favoriteIds: Array.isArray(input.favoriteIds) ? [...new Set(input.favoriteIds.filter((x) => affirmationSet.has(x)))] : [],
    custom,
  };
}

function selectAffirmations({ categoryIds = [], style = 'becoming', count = 5, favoriteIds = [] } = {}) {
  const allowed = new Set(categoryIds);
  let pool = AFFIRMATIONS.filter((x) => allowed.size === 0 || allowed.has(x.categoryId));
  const favorites = new Set(favoriteIds);
  pool = [...pool].sort((a, b) => Number(favorites.has(b.id)) - Number(favorites.has(a.id)) || a.id.localeCompare(b.id));
  return pool.slice(0, Math.max(1, Number(count) || 5)).map((x) => ({ ...x, text: style === 'command' ? x.command : x.becoming }));
}

function cadenceIntervalSeconds(cadence) {
  if (cadence === 'occasional') return 90;
  if (cadence === 'affirmation-only') return 5;
  return 45;
}

module.exports = {
  AFFIRMATION_CATEGORIES,
  AFFIRMATIONS,
  DEFAULT_AFFIRMATION_STATE,
  normalizeAffirmationState,
  selectAffirmations,
  cadenceIntervalSeconds,
};
