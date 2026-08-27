const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..', '..');
const SCRIPT = path.join(ROOT, 'scripts', 'become_future_you_script.txt');
const MANIFEST = path.join(ROOT, 'assets', 'meditations', 'v1', 'become-future-you', 'manifest.json');

function canonicalScriptBytes() {
  const text = fs.readFileSync(SCRIPT, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  return Buffer.from(text, 'utf8');
}

test('Become the Future You keeps the exact approved narration source', () => {
  const raw = canonicalScriptBytes();
  const text = raw.toString('utf8');
  const spoken = text.replace(/\[PAUSE \d+\]/g, '');
  const words = spoken.trim().split(/\s+/).length;
  const pauses = [...text.matchAll(/\[PAUSE (\d+)\]/g)].reduce((sum, match) => sum + Number(match[1]), 0);
  assert.equal(words, 1855);
  assert.equal(pauses, 575);
  assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), '812bf2eb7da5bcf215a127efc178c2c404795761c8d5a9aa1faa717dae9ee0ee');
});

test('both bundled narrators were generated from the approved script', () => {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  assert.equal(manifest.scriptSha256, crypto.createHash('sha256').update(canonicalScriptBytes()).digest('hex'));
  assert.equal(manifest.spokenWordCount, 1855);
  assert.equal(manifest.pauseSeconds, 575);
  assert.ok(manifest.narrators.female.durationSeconds > 1500);
  assert.ok(manifest.narrators.male.durationSeconds > 1500);
  for (const narrator of ['female', 'male']) {
    const audio = path.join(path.dirname(MANIFEST), manifest.narrators[narrator].file);
    const data = fs.readFileSync(audio);
    assert.ok(data.length > 10000000);
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'), manifest.narrators[narrator].sha256);
  }
});
