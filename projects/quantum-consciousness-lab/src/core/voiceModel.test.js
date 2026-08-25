const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const MODULE_PATH = path.join(__dirname, 'voiceModel.js');
const PRACTICES = [
  'observer','coherence','deep-rest','intention','quantum-foundations','expanded-consciousness','synchronicity-dreams',
  'spacious-awareness','breaking-pattern','heart-coherence','future-self','energy-centers','new-potentials',
  'walking-embodiment','gratitude-receiving','deep-sleep-integration','abundance-identity','purpose-direction','stress-stillness',
];

test('v0.3 ships a dedicated neural voice model instead of device voice selection', () => {
  assert.equal(fs.existsSync(MODULE_PATH), true, 'voiceModel.js must exist for V0.3+');
});

test('voice model exposes warm female and calm deep male narrators', () => {
  const { NARRATORS } = require(MODULE_PATH);
  assert.deepEqual(Object.keys(NARRATORS).sort(), ['female', 'male']);
  assert.match(NARRATORS.female.description, /warm|soft|gentle/i);
  assert.match(NARRATORS.male.description, /calm|deep|grounded/i);
});

test('every meditation practice resolves five neural phase slots for either narrator', () => {
  const { resolveVoiceSlots } = require(MODULE_PATH);
  for (const practiceId of PRACTICES) {
    for (const narratorId of ['female', 'male']) {
      const slots = resolveVoiceSlots(practiceId, narratorId);
      assert.equal(slots.length, 5, `${practiceId}/${narratorId} must have five phase slots`);
      for (const [index, slot] of slots.entries()) {
        assert.equal(slot.practiceId, practiceId);
        assert.equal(slot.narratorId, narratorId);
        assert.equal(slot.segmentIndex, index);
        assert.equal(slot.provider, 'neural-asset');
        assert.notEqual(slot.provider, 'system-tts');
      }
    }
  }
});

test('unknown practice or narrator fails explicitly rather than falling back to system TTS', () => {
  const { resolveVoiceSlots } = require(MODULE_PATH);
  assert.throws(() => resolveVoiceSlots('missing-practice', 'female'), /unknown practice/i);
  assert.throws(() => resolveVoiceSlots('coherence', 'robot'), /unknown narrator/i);
});
