# El Vago — V1 · Lanzamiento

**Estado:** versión inicial congelada / Release Candidate final  
**Fecha de cierre funcional:** 19 de septiembre de 2026

El Vago es una plataforma de **ficción interactiva** centrada en historias de misterio que el usuario investiga mediante expedientes narrativos.

## Producción

- URL canónica actual: https://el-vago.vercel.app
- Stack: Next.js, React, TypeScript, Prisma y PostgreSQL
- Deploy: Vercel
- Expediente inicial: **EV-EXP-001 — La Habitación 317**
- Estado del expediente inicial: **PUBLISHED**

## Funcionalidad validada

- Navegación pública: Inicio, Explorar, Multimedia, Comunidad y Mi Vago
- Registro, inicio de sesión y sesiones persistentes
- CMS: publicar, archivar, restaurar y republicar expedientes
- Investigación narrativa protegida por autenticación
- Evidencias y descubrimientos progresivos
- Pistas, preguntas, teorías e hipótesis con desbloqueo progresivo
- Protección de la respuesta correcta de las hipótesis antes de la selección
- Selección de hipótesis y cierre de investigación
- Timeline y Cierre desbloqueados al completar la investigación
- Persistencia del progreso
- Historial de investigaciones completadas en Mi Vago
- Experiencia responsive validada en iPhone

## Congelación de V1

La lógica narrativa y la estructura visual de esta versión quedan congeladas. Los cambios posteriores deberán corresponder a una nueva versión o a una corrección reproducible de producción.

La aceptación funcional y las comprobaciones de cierre están documentadas en **LAUNCH_ACCEPTANCE.md**.

## Preparación de lanzamiento

Quedan como tareas operativas separadas del producto:

1. Confirmación del dominio definitivo, si se sustituirá la URL de Vercel.
2. Política de privacidad, términos y demás avisos legales necesarios para publicación comercial.
3. Configuración y validación de analítica/métricas.
4. Rutina de copias de seguridad y mantenimiento.
5. Plan de publicación de nuevas historias.
6. Procedimiento de rollback y atención de incidencias.

> No se consideran configurados estos elementos hasta que sean comprobados explícitamente en producción.
