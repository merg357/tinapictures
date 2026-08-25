const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CHALLENGE_DAYS,
  DEFAULT_CHALLENGE_PROGRESS,
  normalizeChallengeProgress,
  completeChallengeDay,
  getChallengeSummary,
} = require('./challengeModel');

test('challenge has 32 unique days in four eight-day phases', () => {
  assert.equal(CHALLENGE_DAYS.length, 32);
  assert.equal(new Set(CHALLENGE_DAYS.map((d) => d.day)).size, 32);
  assert.equal(CHALLENGE_DAYS.find((d) => d.day === 1).phase, 1);
  assert.equal(CHALLENGE_DAYS.find((d) => d.day === 9).phase, 2);
  assert.equal(CHALLENGE_DAYS.find((d) => d.day === 17).phase, 3);
  assert.equal(CHALLENGE_DAYS.find((d) => d.day === 25).phase, 4);
});

test('every day includes morning, midday, evening and linked content', () => {
  for (const day of CHALLENGE_DAYS) {
    assert.ok(day.title.length > 3);
    assert.ok(day.morning.length > 10);
    assert.ok(day.midday.length > 10);
    assert.ok(day.evening.length > 10);
    assert.ok(day.affirmationCategoryId);
    assert.ok(day.practiceId);
  }
});

test('completing a day is idempotent and starts the challenge once', () => {
  const first = completeChallengeDay(DEFAULT_CHALLENGE_PROGRESS, 1, 1000);
  const second = completeChallengeDay(first, 1, 2000);
  assert.deepEqual(second.completedDays, [1]);
  assert.equal(second.startedAt, 1000);
  assert.equal(second.updatedAt, 2000);
});

test('summary reports current day, contiguous streak and milestones', () => {
  let state = DEFAULT_CHALLENGE_PROGRESS;
  for (let day = 1; day <= 8; day += 1) state = completeChallengeDay(state, day, day * 1000);
  const summary = getChallengeSummary(state);
  assert.equal(summary.completedCount, 8);
  assert.equal(summary.currentDay, 9);
  assert.equal(summary.streak, 8);
  assert.equal(summary.lastMilestone, 8);
});

test('normalization drops invalid days but preserves milestone notes', () => {
  const value = normalizeChallengeProgress({ completedDays: [1, 2, 99, -1], startedAt: 5, updatedAt: 8, milestoneNotes: { '8': 'Changed response speed.' } });
  assert.deepEqual(value.completedDays, [1, 2]);
  assert.equal(value.milestoneNotes['8'], 'Changed response speed.');
});
