const test = require('node:test');
const assert = require('node:assert/strict');

const {
  AFFIRMATION_CATEGORIES,
  AFFIRMATIONS,
  DEFAULT_AFFIRMATION_STATE,
  normalizeAffirmationState,
  selectAffirmations,
  cadenceIntervalSeconds,
} = require('./affirmationModel');

test('affirmation library covers all fourteen approved categories with command and becoming styles', () => {
  assert.equal(AFFIRMATION_CATEGORIES.length, 14);
  const ids = new Set(AFFIRMATION_CATEGORIES.map((c) => c.id));
  assert.ok(ids.has('peace-prosperity'));
  assert.ok(ids.has('sleep-night'));
  assert.ok(ids.has('identity'));
  assert.ok(ids.has('legacy-service'));
  for (const item of AFFIRMATIONS) {
    assert.ok(ids.has(item.categoryId));
    assert.ok(item.command.length > 12);
    assert.ok(item.becoming.length > 12);
  }
});

test('normalization preserves valid preferences and safely defaults malformed input', () => {
  const value = normalizeAffirmationState({
    categoryIds: ['identity', 'not-real'],
    style: 'becoming',
    mode: 'sleep',
    cadence: 'regular',
    minutes: 30,
    favoriteIds: ['identity-1', 'bad'],
    custom: [{ id: 'c1', text: '  I choose calm action.  ', createdAt: 1 }],
  });
  assert.deepEqual(value.categoryIds, ['identity']);
  assert.equal(value.style, 'becoming');
  assert.equal(value.mode, 'sleep');
  assert.equal(value.minutes, 30);
  assert.deepEqual(value.custom, [{ id: 'c1', text: 'I choose calm action.', createdAt: 1 }]);
  assert.equal(normalizeAffirmationState({}).style, DEFAULT_AFFIRMATION_STATE.style);
});

test('selection is deterministic and honors categories and favorites', () => {
  const input = { categoryIds: ['identity'], style: 'command', count: 2, favoriteIds: ['identity-2'] };
  const a = selectAffirmations(input);
  const b = selectAffirmations(input);
  assert.deepEqual(a, b);
  assert.equal(a.length, 2);
  assert.ok(a.every((x) => x.categoryId === 'identity'));
  assert.equal(a[0].id, 'identity-2');
});

test('empty category selection falls back to the full library instead of returning nothing', () => {
  assert.ok(selectAffirmations({ categoryIds: [], style: 'command', count: 3 }).length === 3);
});

test('cadence maps to usable gaps while affirmation-only has no quiet interval', () => {
  assert.equal(cadenceIntervalSeconds('occasional'), 90);
  assert.equal(cadenceIntervalSeconds('regular'), 45);
  assert.equal(cadenceIntervalSeconds('affirmation-only'), 5);
});
