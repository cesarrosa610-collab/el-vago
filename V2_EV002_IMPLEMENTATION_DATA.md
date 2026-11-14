# EV-EXP-002 — Datos de implementación V2

Este archivo contiene la especificación exacta de datos para implementar EV-EXP-002 sin modificar la V1.

## Expediente
- code: EV-EXP-002
- title: La Llamada de las 03:17
- slug: la-llamada-de-las-0317
- status: ARCHIVED
- description: Una llamada aparece registrada a las 03:17, pero dos sistemas independientes muestran horas incompatibles.
- conclusionTitle: El reloj equivocado
- conclusion: La llamada era real; el conflicto provenía de una sincronización distinta entre los dos sistemas de registro.

## Evidencias
| code | title | unlockAfter |
|---|---|---:|
| E-201 | La llamada | 0 |
| E-202 | El registro | 1 |
| E-203 | La grabación | 2 |
| E-204 | El reloj del pasillo | 3 |
| E-205 | La copia de seguridad | 4 |

## Pistas
| code | title | unlockAfter |
|---|---|---:|
| C-201 | La diferencia | 1 |
| C-202 | El tercer reloj | 3 |
| C-203 | La sincronización | 4 |

## Preguntas
| code | unlockAfter |
|---|---:|
| Q-201 | 1 |
| Q-202 | 2 |
| Q-203 | 3 |
| Q-204 | 4 |

## Teorías
| code | title | unlockAfter |
|---|---|---:|
| T-201 | Error de sincronización | 2 |
| T-202 | Registro alterado | 4 |

## Hipótesis
| code | title | unlockAfter | isCorrect |
|---|---|---:|---|
| H-201 | Fallo técnico | 5 | true |
| H-202 | Alteración posterior | 5 | false |

La API narrativa debe omitir el campo de corrección antes de completar la selección.

## Timeline
| code | label | sortOrder | unlockAfter |
|---|---|---:|---:|
| TL-201 | 03:17 | 0 | 0 |
| TL-202 | Registro administrativo | 1 | 1 |
| TL-203 | Grabación | 2 | 2 |
| TL-204 | Sincronización | 3 | 4 |

## Estado de publicación

EV-EXP-002 permanece ARCHIVED. Esta rama no publica ni modifica el expediente en producción.

## Validación obligatoria

- Usuario nuevo inicia en 0%.
- E-201 desbloqueada inicialmente.
- Cada descubrimiento aumenta el progreso de forma progresiva.
- Hipótesis no revela corrección.
- A 80% (4/5), hipótesis permanece bloqueada; a 100% (5/5), ambas se habilitan.
- Selección completa la investigación.
- Cierre aparece únicamente después de la selección.
- Timeline queda disponible al completar.
- Progreso persiste.
- V1 / EV-EXP-001 permanece sin cambios.
