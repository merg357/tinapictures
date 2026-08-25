const test = require('node:test');
const assert = require('node:assert/strict');
const insights = require('./insights');
const { NAV_ITEMS, computeStats, recommendPractice } = insights;

test('navigation exposes five simple destinations', () => {
  assert.deepEqual(NAV_ITEMS.map((item) => item.key), ['home', 'practice', 'explore', 'lab', 'journal']);
});

test('computeStats summarizes personal session outcomes', () => {
  const stats = computeStats([
    { minutes: 10, pathId: 'coherence', before: 8, after: 5, completed: true, createdAt: 1 },
    { minutes: 12, pathId: 'coherence', before: 7, after: 4, completed: true, createdAt: 2 },
    { minutes: 8, pathId: 'observer', before: 6, after: 5, completed: true, createdAt: 3 },
  ]);
  assert.equal(stats.sessions, 3);
  assert.equal(stats.minutes, 30);
  assert.equal(stats.averageBefore, 7);
  assert.equal(stats.averageAfter, 4.7);
  assert.equal(stats.averageChange, -2.3);
  assert.equal(stats.bestPractice, 'coherence');
});

test('recommendPractice routes immediate needs without a content maze', () => {
  assert.equal(recommendPractice('I am panicking and need to calm down').pathId, 'coherence');
  assert.equal(recommendPractice('I cannot sleep and my mind will not stop').pathId, 'deep-rest');
  assert.equal(recommendPractice('I want to visualize a goal').pathId, 'intention');
});

test('v0.3 removes legacy device voice selection from the meditation model', () => {
  assert.equal(insights.pickBestVoice, undefined);
});
