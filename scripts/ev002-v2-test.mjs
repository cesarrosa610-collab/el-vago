import assert from 'node:assert/strict';

const evidence = [
  ['E-201', 0],
  ['E-202', 1],
  ['E-203', 2],
  ['E-204', 3],
  ['E-205', 4],
];

const clues = [
  ['C-201', 1],
  ['C-202', 3],
  ['C-203', 4],
];

const questions = [
  ['Q-201', 1],
  ['Q-202', 2],
  ['Q-203', 3],
  ['Q-204', 4],
];

const theories = [
  ['T-201', 2],
  ['T-202', 4],
];

const hypotheses = [
  ['H-201', 4],
  ['H-202', 4],
];

const timeline = [
  ['TL-201', 0],
  ['TL-202', 1],
  ['TL-203', 2],
  ['TL-204', 4],
];

const unlocked = (unlockAfter, found) => unlockAfter <= found;

for (let found = 0; found <= 4; found += 1) {
  assert.equal(
    evidence.filter(([, unlock]) => unlocked(unlock, found)).length,
    found + 1
  );
}

assert.deepEqual(
  clues.filter(([, unlock]) => unlocked(unlock, 0)).map(([code]) => code),
  []
);
assert.deepEqual(
  clues.filter(([, unlock]) => unlocked(unlock, 1)).map(([code]) => code),
  ['C-201']
);
assert.deepEqual(
  questions.filter(([, unlock]) => unlocked(unlock, 3)).map(([code]) => code),
  ['Q-201', 'Q-202', 'Q-203']
);
assert.deepEqual(
  theories.filter(([, unlock]) => unlocked(unlock, 4)).map(([code]) => code),
  ['T-201', 'T-202']
);
assert.deepEqual(
  hypotheses.filter(([, unlock]) => unlocked(unlock, 4)).map(([code]) => code),
  ['H-201', 'H-202']
);
assert.deepEqual(
  timeline.filter(([, unlock]) => unlocked(unlock, 4)).map(([code]) => code),
  ['TL-201', 'TL-202', 'TL-203', 'TL-204']
);

console.log('V2 EV-EXP-002 TEST OK: progressive unlock matrix');
