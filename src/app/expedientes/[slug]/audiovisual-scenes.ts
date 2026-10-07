import type { AudiovisualScene } from './AudiovisualScenePlayer';

export const EV001_AUDIOVISUAL: AudiovisualScene[] = [
  {
    id: 'ev001-intro',
    title: 'Apertura del expediente',
    description: 'Introducción cinematográfica del caso.',
    type: 'INTRO',
    src: '',
    poster: '/door-317.jpg',
    unlockAtProgress: 1,
  },
  {
    id: 'ev001-evidence-01',
    title: 'Registro del incidente',
    description: 'Pieza audiovisual asociada al primer bloque de evidencias.',
    type: 'EVIDENCE',
    src: '',
    poster: '/door-317.jpg',
    unlockAtProgress: 20,
  },
  {
    id: 'ev001-evidence-02',
    title: 'Pasillo · 03:17',
    description: 'Material audiovisual desbloqueado durante la investigación.',
    type: 'EVIDENCE',
    src: '',
    poster: '/door-317.jpg',
    unlockAtProgress: 50,
  },
  {
    id: 'ev001-reconstruction',
    title: 'Reconstrucción',
    description: 'Pieza final previa a la selección de hipótesis.',
    type: 'RECONSTRUCTION',
    src: '',
    poster: '/door-317.jpg',
    unlockAtProgress: 80,
  },
  {
    id: 'ev001-outro',
    title: 'Cierre del expediente',
    description: 'Revisión audiovisual posterior al cierre de la investigación.',
    type: 'OUTRO',
    src: '',
    poster: '/door-317.jpg',
    unlockAtProgress: 100,
  },
];
