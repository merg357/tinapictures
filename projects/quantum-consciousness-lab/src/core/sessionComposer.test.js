const test = require('node:test');
const assert = require('node:assert/strict');
const { composeSession } = require('./sessionComposer');

function totalMinutes(plan) {
  return plan.segments.reduce((sum, segment) => sum + segment.minutes, 0);
}

test('routes replaying an argument to Observer and honors a 15 minute request', () => {
  const plan = composeSession({
    intent: 'I keep replaying an argument from work and want to let it go',
    goal: 'Reset',
    minutes: 15,
    lens: 'science-frontier',
  });

  assert.equal(plan.pathId, 'observer');
  assert.equal(plan.evidence, 'Established');
  assert.equal(totalMinutes(plan), 15);
});

test('routes intention language to Intention and keeps evidence truth invariant across lenses', () => {
  const science = composeSession({ intent: 'Help me visualize my intention for a new goal', goal: 'Intention', minutes: 10, lens: 'science' });
  const full = composeSession({ intent: 'Help me visualize my intention for a new goal', goal: 'Intention', minutes: 10, lens: 'full' });

  assert.equal(science.pathId, 'intention');
  assert.equal(full.pathId, 'intention');
  assert.equal(science.evidence, full.evidence);
  assert.equal(science.evidence, 'Supported');
  assert.equal(totalMinutes(science), 10);
  assert.equal(totalMinutes(full), 10);
});

test('routes dreams and synchronicities to Synchronicity & Dreams without presenting them as established science', () => {
  const plan = composeSession({
    intent: 'I had a vivid dream and then a strange synchronicity today',
    goal: 'Go Deeper',
    minutes: 20,
    lens: 'full',
  });

  assert.equal(plan.pathId, 'synchronicity-dreams');
  assert.equal(plan.evidence, 'Philosophical');
  assert.equal(totalMinutes(plan), 20);
});

test('normalizes unsupported duration to nearest supported duration', () => {
  const plan = composeSession({ intent: 'I need to calm down', goal: 'Calm', minutes: 13, lens: 'science' });
  assert.equal(plan.minutes, 15);
  assert.equal(totalMinutes(plan), 15);
});


test('v0.4 routes twelve expanded practice intents with explicit evidence labels', () => {
  const cases = [
    ['spacious-awareness', 'open spacious awareness and sense the space around my body', 'Emerging'],
    ['breaking-pattern', 'break an old pattern and interrupt my automatic reaction', 'Supported'],
    ['heart-coherence', 'heart focused breathing and coherence', 'Supported'],
    ['future-self', 'rehearse my future self identity', 'Supported'],
    ['energy-centers', 'energy center journey through the body', 'Spiritual / Experiential'],
    ['new-potentials', 'tune in to new possibilities and potential', 'Theoretical'],
    ['walking-embodiment', 'walking meditation embody my new self', 'Supported'],
    ['gratitude-receiving', 'gratitude and receiving practice', 'Supported'],
    ['deep-sleep-integration', 'sleep integration and overnight rest', 'Supported'],
    ['abundance-identity', 'abundance identity and prosperity mindset', 'Supported'],
    ['purpose-direction', 'purpose and direction for my next step', 'Supported'],
    ['stress-stillness', 'stress to stillness right now', 'Supported'],
  ];
  for (const [pathId, intent, evidence] of cases) {
    const plan = composeSession({ intent, goal: '', minutes: 10, lens: 'full' });
    assert.equal(plan.pathId, pathId, intent);
    assert.equal(plan.evidence, evidence, intent);
    assert.equal(totalMinutes(plan), 10);
  }
});


test('approved Become the Future You meditation is fixed-duration and narration-driven', () => {
  const plan = composeSession({
    intent: 'become the future you approved future meditation',
    goal: 'Intention',
    minutes: 10,
    lens: 'full',
  });
  assert.equal(plan.pathId, 'become-future-you');
  assert.equal(plan.title, 'Become the Future You');
  assert.equal(plan.minutes, 30);
  assert.equal(plan.narrationDriven, true);
  assert.equal(plan.segments.length, 1);
  assert.equal(totalMinutes(plan), 30);
});
