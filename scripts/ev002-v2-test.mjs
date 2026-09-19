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

const progressFor = (found, total = evidence.length) =>
  total ? Math.round((found / total) * 100) : 0;

const stateAfterDiscovery = (found) => ({
  found,
  progress: progressFor(found),
  status: 'IN_PROGRESS',
  completed: false,
});

const stateAfterHypothesis = (found, hypothesisId) => ({
  found,
  hypothesisId,
  progress: 100,
  status: 'COMPLETED',
  completed: true,
});

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
  timeline.filter(([, unlock]) => unlocked(unlock, 0)).map(([code]) => code),
  ['TL-201']
);
assert.deepEqual(
  timeline.filter(([, unlock]) => unlocked(unlock, 3)).map(([code]) => code),
  ['TL-201', 'TL-202', 'TL-203']
);
assert.deepEqual(
  timeline.filter(([, unlock]) => unlocked(unlock, 4)).map(([code]) => code),
  ['TL-201', 'TL-202', 'TL-203', 'TL-204']
);

const timelineVisible = (completed, found) => completed && timeline.some(([, unlock]) => unlocked(unlock, found));
assert.equal(timelineVisible(false, 4), false);
assert.equal(timelineVisible(true, 4), true);

for (let found = 1; found <= 5; found += 1) {
  const state = stateAfterDiscovery(found);
  assert.equal(state.progress, progressFor(found));
  assert.equal(state.status, 'IN_PROGRESS');
  assert.equal(state.completed, false);
}

assert.equal(progressFor(5), 100);
assert.equal(stateAfterDiscovery(5).status, 'IN_PROGRESS');
assert.equal(stateAfterDiscovery(5).completed, false);

const completed = stateAfterHypothesis(5, 'H-201');
assert.equal(completed.progress, 100);
assert.equal(completed.status, 'COMPLETED');
assert.equal(completed.completed, true);
assert.equal(completed.hypothesisId, 'H-201');

assert.equal(completed.hypothesisId, 'H-201');
assert.notEqual(completed.hypothesisId, 'H-202');

console.log('V2 EV-EXP-002 TEST OK: full narrative lifecycle');
