const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { AFFIRMATIONS } = require('./affirmationModel');

const ROOT = path.join(__dirname, '..', '..', 'assets', 'affirmations', 'v1');

test('every bundled affirmation has command and becoming natural audio for both narrators', () => {
  for (const item of AFFIRMATIONS) {
    for (const narrator of ['female', 'male']) {
      for (const style of ['command', 'becoming']) {
        const file = path.join(ROOT, narrator, `${item.id}-${style}.mp3`);
        assert.equal(fs.existsSync(file), true, `missing ${narrator}/${item.id}-${style}.mp3`);
        assert.ok(fs.statSync(file).size > 2000, `audio too small ${narrator}/${item.id}-${style}.mp3`);
      }
    }
  }
});
