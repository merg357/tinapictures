const test = require('node:test');
const assert = require('node:assert/strict');

const { mergeSettings } = require('./settingsModel');

test('saving narrator preserves an existing lens', () => {
  assert.deepEqual(mergeSettings({ lens: 'science-frontier' }, { narrator: 'male' }), {
    lens: 'science-frontier',
    narrator: 'male',
  });
});

test('saving lens preserves an existing narrator', () => {
  assert.deepEqual(mergeSettings({ narrator: 'female' }, { lens: 'full' }), {
    narrator: 'female',
    lens: 'full',
  });
});


test('saving audio preserves narrator and lens while replacing only audio settings', () => {
  const current = { lens: 'science', narrator: 'male', audio: { backgroundTrackId: 'rain' } };
  const next = mergeSettings(current, { audio: { backgroundTrackId: 'ocean' } });
  assert.equal(next.lens, 'science');
  assert.equal(next.narrator, 'male');
  assert.deepEqual(next.audio, { backgroundTrackId: 'ocean' });
});
