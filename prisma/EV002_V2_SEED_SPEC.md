# EV-EXP-002 — V2 Seed Specification

Use this specification to populate the second fictional interactive expediente in the V2 branch. It intentionally remains ARCHIVED until editorial and production validation are complete.

## Metadata
- code: EV-EXP-002
- title: La Llamada de las 03:17
- slug: la-llamada-de-las-0317
- status: ARCHIVED
- description: Una llamada aparece registrada a las 03:17, pero dos sistemas independientes muestran horas incompatibles.
- conclusionTitle: El reloj equivocado
- conclusion: La llamada era real; el conflicto provenía de una sincronización distinta entre los dos sistemas de registro.

## Evidence
- E-201 — La llamada — unlockAfter 0
- E-202 — El registro — unlockAfter 1
- E-203 — La grabación — unlockAfter 2
- E-204 — El reloj del pasillo — unlockAfter 3
- E-205 — La copia de seguridad — unlockAfter 4

## Clues
- C-201 — La diferencia — unlockAfter 1
- C-202 — El tercer reloj — unlockAfter 3
- C-203 — La sincronización — unlockAfter 4

## Questions
- Q-201 — ¿Cuál de los registros refleja la hora real? — unlockAfter 1
- Q-202 — ¿Por qué existen dos horas distintas? — unlockAfter 2
- Q-203 — ¿La diferencia fue accidental o provocada? — unlockAfter 3
- Q-204 — ¿Qué información queda fuera de los registros principales? — unlockAfter 4

## Theories
- T-201 — Error de sincronización — unlockAfter 2
- T-202 — Registro alterado — unlockAfter 4

## Hypotheses
- H-201 — Fallo técnico — unlockAfter 5 — correct
- H-202 — Alteración posterior — unlockAfter 5 — incorrect

## Timeline
- TL-201 — 03:17 — unlockAfter 0
- TL-202 — Registro administrativo — unlockAfter 1
- TL-203 — Grabación — unlockAfter 2
- TL-204 — Sincronización — unlockAfter 4

## Release gate
Do not publish this expediente from this branch. Before V2.1 publication, validate:
1. New account starts at 0%.
2. All five evidence items unlock progressively.
3. Narrative sections unlock at the declared thresholds.
4. Hypothesis correctness is never returned by the public narrative endpoint.
5. Selecting either hypothesis closes the investigation and unlocks Cierre/Timeline.
6. Persistence survives refresh/login.
7. Mobile layout is validated on iPhone.
8. EV-EXP-001 remains unchanged.
