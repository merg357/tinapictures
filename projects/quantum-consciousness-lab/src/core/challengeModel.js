const DAYS = [
  [1,'Baseline Emotional Patterns','Notice the emotion you most often wake up carrying. Name it without judging it.','Pause once today and label the emotion before acting from it.','Where did this familiar emotion influence a choice today?','mastery-thought','observer'],
  [2,'Automatic Complaints & Language','Listen for repeated complaints, blame, or rehearsed stories.','Use one clean interruption: “That is the old script; choose again.”','Which phrase showed up most often, and what could replace it?','mastery-thought','breaking-pattern'],
  [3,'Somatic Stress Cues','Scan jaw, throat, chest, gut, shoulders, and hands for early tension.','When tension appears, soften one area and lengthen one exhale.','Which body cue warned you before the mind caught up?','peace-prosperity','stress-stillness'],
  [4,'Pattern Interruption','Choose one automatic reaction you are ready to interrupt.','When it starts, stop, exhale, and deliberately choose a different response.','Did you catch the pattern earlier than usual?','action-urgency','breaking-pattern'],
  [5,'Scarcity Vocabulary','Notice words that assume there is never enough time, money, energy, or support.','Replace one scarcity sentence with a specific, reality-based possibility.','Which replacement felt believable and useful?','peace-prosperity','abundance-identity'],
  [6,'Environmental Input Audit','Begin the day without threat-driven media for the first 20 minutes.','Notice whether a piece of media increases agitation or clarity before continuing.','Which inputs strengthened you, and which ones pulled you backward?','mastery-thought','observer'],
  [7,'Repetitive Thought Loops','Watch one recurring thought as an event, not an instruction.','Say internally: “I notice this thought; I do not have to rehearse it.”','What happened when you stopped arguing with the thought?','mastery-thought','observer'],
  [8,'Spacious Awareness','Spend a few minutes sensing the space around and within the body.','Take a 60-second open-focus pause with soft eyes.','What changed when attention widened instead of narrowing?','reflection-confidence','spacious-awareness'],

  [9,'Release Outcome Control','Set one clear intention, then release the need to predict every step.','Ask: “What is the next useful action I can actually control?”','Where did control create tension, and where did action create relief?','faith-certainty','future-self'],
  [10,'Non-Reaction Under Stress','Rehearse being the pause between trigger and response.','Use three slow breaths before replying to one stressful moment.','What became possible because you delayed the automatic reaction?','reflection-confidence','stress-stillness'],
  [11,'Heart-Focused Breathing','Breathe slowly while attending to the center of the chest and a genuine feeling of care.','Take one minute for easy breathing near six breaths per minute.','Did the emotional tone shift when breath and attention were coordinated?','gratitude','heart-coherence'],
  [12,'Deep Rest Window','Practice rest without demanding sleep or a special state.','Give yourself 90 seconds with no problem-solving and no phone.','What did your body do when you stopped trying to force relaxation?','sleep-night','deep-rest'],
  [13,'Notice Meaningful Coincidences','Stay curious about patterns without turning coincidence into proof.','Record one event that felt meaningful and list at least two possible explanations.','What meaning was useful even without proving a cause?','reflection-confidence','synchronicity-dreams'],
  [14,'Release Clock Pressure','Practice moving deliberately instead of treating every moment as late.','Choose one task and do it without checking the time until it is complete.','Where did urgency help, and where was it only a habit?','divine-rhythm','coherence'],
  [15,'Future-Self Blueprint','Define how your future self thinks, speaks, moves, and chooses in one real situation.','Before a decision, ask: “What would the version of me I am practicing do next?”','Which future-self behavior did you actually rehearse today?','identity','future-self'],
  [16,'Elevated Emotion + Behavior','Pair a chosen feeling with a concrete action instead of waiting for circumstances to create the feeling.','Generate gratitude, courage, or calm for 30 seconds, then act from it.','Which emotion made the next action easier?','repetition-becoming','future-self'],

  [17,'Walk as the New Self','Begin the day with posture, pace, and attention that match the person you are becoming.','Take a short walk while rehearsing calm, deliberate identity.','How did changing posture or pace affect choices?','identity','walking-embodiment'],
  [18,'Speak Clear Identity','Choose one identity statement you can support with behavior today.','Repeat it once, then immediately do one matching action.','What evidence did you create for the identity you stated?','identity','walking-embodiment'],
  [19,'Vitality-Supporting Identity','Choose behaviors that support energy, recovery, movement, and sleep without magical health claims.','Make one health-supporting choice your future self would repeat.','Which small choice made your body feel more supported?','repetition-becoming','deep-rest'],
  [20,'Coherence Under Pressure','Practice maintaining a slower internal rhythm while the environment speeds up.','Drop your shoulders, exhale longer, and answer only after the exhale.','Where did calm improve your effectiveness?','peace-prosperity','heart-coherence'],
  [21,'Purpose & Direction','Name the one direction that deserves more of your attention this season.','Decline or delay one action that does not serve that direction.','What became clearer when you protected your priority?','definite-aim','purpose-direction'],
  [22,'Prosperity Identity','Focus on value creation, resourcefulness, and useful opportunities rather than fantasy guarantees.','Notice one opportunity to create, save, earn, learn, or help.','What opportunity became visible when attention shifted from lack to value?','peace-prosperity','abundance-identity'],
  [23,'Relationships & Service','Rehearse being the person you want others to experience.','Offer one useful act, sincere appreciation, or clear boundary.','How did your presence affect the interaction?','circulation-giving','gratitude-receiving'],
  [24,'Courage & Decisive Action','Pick one useful action you have delayed because of discomfort.','Do the smallest irreversible first step before negotiating with fear.','What did action teach you that thinking could not?','boldness-courage','purpose-direction'],

  [25,'Act Before the Old Pattern','Identify the moment just before the old habit usually takes over.','Use that early cue to choose the new response sooner.','How early did you recognize the turning point?','action-urgency','breaking-pattern'],
  [26,'Resilience After Setbacks','Treat a setback as data about the process, not a verdict on identity.','Ask what can be learned, corrected, or tried next within ten minutes.','What did you recover faster from today?','boldness-courage','stress-stillness'],
  [27,'Generosity & Circulation','Practice healthy giving that does not require self-erasure.','Give time, attention, encouragement, or resources where it is genuinely useful.','What did giving reveal about abundance and boundaries?','circulation-giving','gratitude-receiving'],
  [28,'Gratitude in Advance','Rehearse the feeling you expect to have after completing an important goal, then use it as fuel for action.','Feel the chosen emotion briefly, then complete one aligned step.','Did gratitude change effort, attention, or persistence?','gratitude','future-self'],
  [29,'Pattern & Synchronicity Journal','Observe coincidences, recurring themes, dreams, and cues with curiosity and skepticism together.','Write the event first; interpretation comes second.','What pattern deserves further observation rather than immediate belief?','reflection-confidence','synchronicity-dreams'],
  [30,'Deep Rest & Recovery','Treat recovery as part of performance rather than a reward after exhaustion.','Take a deliberate low-stimulation reset before you feel completely depleted.','What improved after you gave the nervous system less input?','sleep-night','deep-rest'],
  [31,'Identity Under Pressure','Choose one stressful situation as the final rehearsal ground for the new identity.','Slow down enough to make one response match your values rather than your reflex.','Which part of the new identity stayed available under pressure?','identity','heart-coherence'],
  [32,'Integration & Continuation','Review the strongest changes from the last 31 days and choose the practices worth keeping.','Pick one morning, one midday, and one evening practice for your next 30 days.','What changed, what did not, and what will you deliberately continue?','legacy-service','spacious-awareness'],
];

const CHALLENGE_DAYS = DAYS.map(([day,title,morning,midday,evening,affirmationCategoryId,practiceId]) => ({
  day,
  phase: Math.floor((day - 1) / 8) + 1,
  phaseTitle: ['Observe the Old Self','Interrupt & Release','Build the New Self','Embody & Integrate'][Math.floor((day - 1) / 8)],
  title,
  morning,
  midday,
  evening,
  affirmationCategoryId,
  practiceId,
  milestone: [8,16,24,32].includes(day),
}));

const DEFAULT_CHALLENGE_PROGRESS = Object.freeze({ completedDays: [], startedAt: null, updatedAt: null, milestoneNotes: {} });

function normalizeChallengeProgress(input = {}) {
  const completedDays = [...new Set(Array.isArray(input.completedDays) ? input.completedDays.map(Number).filter((d) => Number.isInteger(d) && d >= 1 && d <= 32) : [])].sort((a,b) => a-b);
  const notes = {};
  if (input.milestoneNotes && typeof input.milestoneNotes === 'object') {
    for (const key of ['8','16','24','32']) {
      if (typeof input.milestoneNotes[key] === 'string' && input.milestoneNotes[key].trim()) notes[key] = input.milestoneNotes[key].trim();
    }
  }
  return {
    completedDays,
    startedAt: Number.isFinite(Number(input.startedAt)) && Number(input.startedAt) > 0 ? Number(input.startedAt) : null,
    updatedAt: Number.isFinite(Number(input.updatedAt)) && Number(input.updatedAt) > 0 ? Number(input.updatedAt) : null,
    milestoneNotes: notes,
  };
}

function completeChallengeDay(progress, day, timestamp = Date.now()) {
  const state = normalizeChallengeProgress(progress);
  if (!Number.isInteger(day) || day < 1 || day > 32) return state;
  return {
    ...state,
    completedDays: [...new Set([...state.completedDays, day])].sort((a,b) => a-b),
    startedAt: state.startedAt ?? timestamp,
    updatedAt: timestamp,
  };
}

function getChallengeSummary(progress) {
  const state = normalizeChallengeProgress(progress);
  const set = new Set(state.completedDays);
  let streak = 0;
  while (set.has(streak + 1)) streak += 1;
  const currentDay = Math.min(32, streak + 1);
  const milestones = [8,16,24,32].filter((d) => set.has(d));
  return {
    completedCount: state.completedDays.length,
    currentDay: state.completedDays.length === 32 ? 32 : currentDay,
    streak,
    percent: Math.round((state.completedDays.length / 32) * 100),
    lastMilestone: milestones.length ? milestones[milestones.length - 1] : 0,
  };
}

function saveMilestoneNote(progress, day, note, timestamp = Date.now()) {
  const state = normalizeChallengeProgress(progress);
  if (![8,16,24,32].includes(day)) return state;
  return { ...state, milestoneNotes: { ...state.milestoneNotes, [String(day)]: String(note || '').trim() }, updatedAt: timestamp };
}

module.exports = { CHALLENGE_DAYS, DEFAULT_CHALLENGE_PROGRESS, normalizeChallengeProgress, completeChallengeDay, getChallengeSummary, saveMilestoneNote };
