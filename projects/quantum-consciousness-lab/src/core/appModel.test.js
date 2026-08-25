const test = require('node:test');
const assert = require('node:assert/strict');
const { FLAGSHIP_PATHS, createJournalEntry, createExperimentRecord } = require('./appModel');

test('ships all six flagship exploration paths with explicit evidence labels', () => {
  assert.deepEqual(
    FLAGSHIP_PATHS.map((item) => item.id),
    ['observer', 'coherence', 'intention', 'quantum-foundations', 'expanded-consciousness', 'synchronicity-dreams']
  );
  for (const path of FLAGSHIP_PATHS) {
    assert.ok(path.evidence);
    assert.ok(path.whatWeKnow);
    assert.ok(path.explore);
  }
});

test('journal entries preserve category and trim private user text', () => {
  const entry = createJournalEntry({ category: 'Dream', text: '  A recurring staircase  ', now: 1000 });
  assert.equal(entry.category, 'Dream');
  assert.equal(entry.text, 'A recurring staircase');
  assert.equal(entry.createdAt, 1000);
  assert.match(entry.id, /^journal-/);
});

test('experiment records calculate subjective change without claiming causation', () => {
  const record = createExperimentRecord({ protocol: 'Coherence', before: 8, after: 5, now: 2000 });
  assert.equal(record.change, -3);
  assert.equal(record.before, 8);
  assert.equal(record.after, 5);
  assert.match(record.note, /personal observation/i);
});


test('v0.4 exposes soundscapes, affirmation studio, and the 32-day challenge as first-class practice tools', () => {
  const { V04_TOOLS } = require('./appModel');
  assert.deepEqual(V04_TOOLS.map((item) => item.id), ['sounds', 'affirmations', 'challenge']);
  for (const tool of V04_TOOLS) {
    assert.ok(tool.title);
    assert.ok(tool.subtitle);
  }
});
