const checksums = require('../../assets/sounds/v1/checksums.json');

const EXTENDED_IDS = new Set([
  'floating-piano','dreamscape','mountain-stream','night-forest','distant-thunder',
  'hz-396','hz-417','hz-639','hz-741','hz-852',
]);

function assertExtended(id) {
  if (!EXTENDED_IDS.has(id)) throw new Error(`Missing downloadable sound checksum: ${id}`);
}

function remoteRelativePath(id) {
  assertExtended(id);
  return `extended/${id}.wav`;
}

function cacheFileName(id) {
  assertExtended(id);
  return `cl-sound-${id}.wav`;
}

function expectedSoundChecksum(id) {
  const relative = remoteRelativePath(id);
  const value = checksums[relative];
  if (!value) throw new Error(`Missing downloadable sound checksum: ${id}`);
  return value;
}

module.exports = { EXTENDED_IDS, remoteRelativePath, cacheFileName, expectedSoundChecksum };
