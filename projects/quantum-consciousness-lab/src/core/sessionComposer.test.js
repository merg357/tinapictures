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
