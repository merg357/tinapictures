const test = require('node:test');
const assert = require('node:assert/strict');
const { cacheFileName, expectedSoundChecksum, remoteRelativePath } = require('./packModel');

test('downloadable pack helpers use stable safe filenames and repository paths', () => {
  assert.equal(cacheFileName('floating-piano'), 'cl-sound-floating-piano.wav');
  assert.equal(remoteRelativePath('floating-piano'), 'extended/floating-piano.wav');
  assert.equal(remoteRelativePath('hz-852'), 'extended/hz-852.wav');
});

test('extended tracks have sha256 integrity metadata', () => {
  const digest = expectedSoundChecksum('floating-piano');
  assert.match(digest, /^[a-f0-9]{64}$/);
  assert.throws(() => expectedSoundChecksum('not-real'), /checksum/i);
});
