import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';

const dbPath = '/tmp/elvago-beta-e2e.db';

try {
  fs.unlinkSync(dbPath);
} catch {}

const db = new DatabaseSync(dbPath);

db.exec(`
CREATE TABLE users(
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT NOT NULL
);

CREATE TABLE expedientes(
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE,
  title TEXT,
  slug TEXT UNIQUE,
  published INTEGER NOT NULL
);

CREATE TABLE evidence(
  id TEXT PRIMARY KEY,
  expediente_id TEXT,
  code TEXT,
  title TEXT,
  description TEXT,
  initially_visible INTEGER NOT NULL,
  unlock_after INTEGER NOT NULL
);

CREATE TABLE investigations(
  id TEXT PRIMARY KEY,
  user_id TEXT,
  expediente_id TEXT,
  progress INTEGER NOT NULL,
  status TEXT NOT NULL,
  selected_hypothesis_id TEXT,
  UNIQUE(user_id, expediente_id)
);

CREATE TABLE discoveries(
  investigation_id TEXT,
  evidence_id TEXT,
  UNIQUE(investigation_id, evidence_id)
);

CREATE TABLE hypotheses(
  id TEXT PRIMARY KEY,
  expediente_id TEXT,
  code TEXT,
  title TEXT,
  is_correct INTEGER NOT NULL,
  unlock_after INTEGER NOT NULL
);
`);

const run = (sql, params = []) => {
  return db.prepare(sql).run(...params);
};

const one = (sql, params = []) => {
  return db.prepare(sql).get(...params);
};

run(
  'INSERT INTO users VALUES (?,?,?)',
  ['u1', 'demo@elvago.local', 'USER']
);

run(
  'INSERT INTO users VALUES (?,?,?)',
  ['u2', 'other@elvago.local', 'USER']
);

run(
  'INSERT INTO expedientes VALUES (?,?,?,?,?)',
  ['x1', 'EV-001', 'La Habitación 317', 'la-habitacion-317', 1]
);

run(
  'INSERT INTO evidence VALUES (?,?,?,?,?,?,?)',
  [
    'e1',
    'x1',
    'E-001',
    'Registro',
    'Primera evidencia',
    1,
    0
  ]
);

run(
  'INSERT INTO evidence VALUES (?,?,?,?,?,?,?)',
  [
    'e2',
    'x1',
    'E-002',
    'Fotografía',
    'Segunda evidencia',
    1,
    1
  ]
);

run(
  'INSERT INTO evidence VALUES (?,?,?,?,?,?,?)',
  [
    'e3',
    'x1',
    'E-003',
    'Marca',
    'Contenido desbloqueado',
    0,
    2
  ]
);

run(
  'INSERT INTO hypotheses VALUES (?,?,?,?,?,?)',
  [
    'h1',
    'x1',
    'H-001',
    'Accidente',
    0,
    2
  ]
);

run(
  'INSERT INTO hypotheses VALUES (?,?,?,?,?,?)',
  [
    'h2',
    'x1',
    'H-002',
    'Intervención deliberada',
    1,
    2
  ]
);

run(
  'INSERT INTO investigations VALUES (?,?,?,?,?,?)',
  [
    'i1',
    'u1',
    'x1',
    0,
    'IN_PROGRESS',
    null
  ]
);

const discovered = () => {
  return new Set(
    db
      .prepare(
        'SELECT evidence_id FROM discoveries WHERE investigation_id=?'
      )
      .all('i1')
      .map((x) => x.evidence_id)
  );
};

const discoveryCount = () => {
  return one(
    'SELECT COUNT(*) c FROM discoveries WHERE investigation_id=?',
    ['i1']
  ).c;
};

const visibleEvidence = () => {
  const count = discoveryCount();

  return db
    .prepare(
      `SELECT id, code
       FROM evidence
       WHERE expediente_id=?
       AND unlock_after<=?
       ORDER BY code`
    )
    .all('x1', count);
};

const availableHypotheses = () => {
  const count = discoveryCount();

  return db
    .prepare(
      `SELECT id, code
       FROM hypotheses
       WHERE expediente_id=?
       AND unlock_after<=?
       ORDER BY code`
    )
    .all('x1', count);
};

const discover = (userId, evidenceId) => {
  const investigation = one(
    `SELECT *
     FROM investigations
     WHERE user_id=?
     AND expediente_id=?`,
    [userId, 'x1']
  );

  if (!investigation) {
    throw new Error('investigation missing');
  }

  const evidence = one(
    `SELECT *
     FROM evidence
     WHERE id=?
     AND expediente_id=?
     AND unlock_after<=?`,
    [evidenceId, 'x1', discoveryCount()]
  );

  if (!evidence) {
    throw new Error('evidence blocked or unavailable');
  }

  run(
    'INSERT OR IGNORE INTO discoveries VALUES (?,?)',
    [investigation.id, evidenceId]
  );

  const count = discoveryCount();
  const progress = Math.round((count / 3) * 100);
  const status =
    progress === 100
      ? 'COMPLETED'
      : 'IN_PROGRESS';

  run(
    'UPDATE investigations SET progress=?, status=? WHERE id=?',
    [
      progress,
      status,
      investigation.id
    ]
  );
};

const chooseHypothesis = (
  userId,
  hypothesisId
) => {
  const investigation = one(
    `SELECT *
     FROM investigations
     WHERE user_id=?
     AND expediente_id=?`,
    [userId, 'x1']
  );

  if (!investigation) {
    return {
      ok: false,
      status: 409,
      error: 'Investigación no iniciada'
    };
  }

  if (investigation.status === 'COMPLETED') {
    return {
      ok: false,
      status: 409,
      error: 'La investigación ya está cerrada'
    };
  }

  const hypothesis = one(
    `SELECT *
     FROM hypotheses
     WHERE id=?
     AND expediente_id=?
     AND unlock_after<=?`,
    [
      hypothesisId,
      'x1',
      discoveryCount()
    ]
  );

  if (!hypothesis) {
    return {
      ok: false,
      status: 404,
      error: 'Hipótesis no disponible'
    };
  }

  run(
    `UPDATE investigations
     SET selected_hypothesis_id=?
     WHERE id=?`,
    [
      hypothesis.id,
      investigation.id
    ]
  );

  return {
    ok: true,
    status: 200
  };
};

/*
 * 1. La evidencia bloqueada no debe aparecer
 *    antes de alcanzar su requisito.
 */
if (
  visibleEvidence().some(
    (x) => x.id === 'e3'
  )
) {
  throw new Error(
    'locked evidence leaked before unlock'
  );
}

/*
 * 2. El progreso debe desbloquear
 *    la evidencia progresivamente.
 */
discover('u1', 'e1');
discover('u1', 'e2');

if (
  !visibleEvidence().some(
    (x) => x.id === 'e3'
  )
) {
  throw new Error(
    'expected evidence did not unlock'
  );
}

/*
 * 3. Las hipótesis deben desbloquearse
 *    al alcanzar el requisito.
 */
if (
  availableHypotheses().length !== 2
) {
  throw new Error(
    'hypotheses did not unlock at the expected threshold'
  );
}

/*
 * 4. Debe permitirse seleccionar una
 *    hipótesis mientras la investigación
 *    continúa abierta.
 */
const selected = chooseHypothesis(
  'u1',
  'h2'
);

if (!selected.ok) {
  throw new Error(
    'hypothesis selection failed before completion'
  );
}

const beforeClose = one(
  `SELECT selected_hypothesis_id, status
   FROM investigations
   WHERE id=?`,
  ['i1']
);

if (
  beforeClose.selected_hypothesis_id !== 'h2' ||
  beforeClose.status !== 'IN_PROGRESS'
) {
  throw new Error(
    'investigation state was not persisted correctly'
  );
}

/*
 * 5. Descubrir dos veces la misma evidencia
 *    no debe crear duplicados.
 */
discover('u1', 'e1');

const duplicateCount = one(
  `SELECT COUNT(*) c
   FROM discoveries
   WHERE investigation_id=?
   AND evidence_id=?`,
  ['i1', 'e1']
).c;

if (duplicateCount !== 1) {
  throw new Error(
    'idempotency failed'
  );
}

/*
 * 6. La última evidencia debe llevar
 *    el expediente a 100% COMPLETED.
 */
discover('u1', 'e3');

const completed = one(
  `SELECT progress, status
   FROM investigations
   WHERE id=?`,
  ['i1']
);

if (
  completed.progress !== 100 ||
  completed.status !== 'COMPLETED'
) {
  throw new Error(
    'completion state failed'
  );
}

/*
 * 7. Una investigación cerrada no debe
 *    permitir cambiar la hipótesis.
 */
const afterClose = chooseHypothesis(
  'u1',
  'h1'
);

if (
  afterClose.ok ||
  afterClose.status !== 409
) {
  throw new Error(
    'completed investigation accepted a hypothesis change'
  );
}

/*
 * 8. Confirmar que la selección original
 *    no fue modificada.
 */
const finalState = one(
  `SELECT selected_hypothesis_id
   FROM investigations
   WHERE id=?`,
  ['i1']
);

if (
  finalState.selected_hypothesis_id !== 'h2'
) {
  throw new Error(
    'closed investigation was modified unexpectedly'
  );
}

/*
 * 9. Otro usuario no debe heredar
 *    la investigación del primero.
 */
const otherUser = one(
  `SELECT id
   FROM investigations
   WHERE user_id=?
   AND expediente_id=?`,
  [
    'u2',
    'x1'
  ]
);

if (otherUser) {
  throw new Error(
    'investigation scope leaked across users'
  );
}

console.log(
  'OFFLINE E2E OK: progressive unlock + hypothesis selection + idempotency + 100% completion + post-close protection + user scope'
);

db.close();
