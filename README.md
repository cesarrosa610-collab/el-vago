# El Vago — V2 · Cierre final

**Estado:** V2 validada en producción / cierre final  
**Fecha de cierre:** 20 de septiembre de 2026

El Vago es una plataforma de **historias reales, misterios y formato documental** centrada en expedientes que el usuario investiga mediante evidencias, pistas, preguntas, teorías e hipótesis.

## Producción

- URL canónica actual: https://el-vago.vercel.app
- Stack: Next.js, React, TypeScript, Prisma y PostgreSQL
- Deploy: Vercel
- Expediente publicado: **EV-EXP-001 — La Habitación 317**
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
- Identidad editorial documental validada en producción
- Recorrido final de aceptación de V2 completado
- Robots y sitemap públicos configurados
- Metadatos y canonical por ruta pública configurados
- Rutas de autenticación marcadas como no indexables

## Cierre operativo

La V2 funcional queda congelada. El trabajo posterior debe ser una corrección reproducible o una nueva versión.

### Checklist antes de publicación comercial

- [ ] Analítica de producto configurada y verificada en producción.
- [ ] Dominio definitivo conectado, si se sustituirá la URL de Vercel.
- [ ] Política de privacidad, términos y avisos legales publicados.
- [ ] Copias de seguridad de PostgreSQL y procedimiento de restauración probado.
- [ ] Procedimiento de publicación de nuevos expedientes documentado.
- [ ] Procedimiento de rollback documentado y probado con una versión previa.
- [ ] Canal de atención de incidencias definido.
- [ ] Revisión periódica de errores runtime y disponibilidad establecida.

### Procedimiento de publicación de un expediente

1. Crear el expediente en el CMS.
2. Mantenerlo fuera de publicación mientras se cargan evidencias y narrativa.
3. Verificar título, descripción, slug, evidencias, orden de desbloqueo y contenido editorial.
4. Publicar desde el CMS.
5. Comprobar que aparece en Explorar y en el sitemap.
6. Abrir la ruta pública en producción.
7. Validar autenticación, descubrimiento progresivo, hipótesis, Timeline y Cierre.
8. Revisar runtime logs y confirmar ausencia de errores nuevos.

### Procedimiento de rollback

1. Identificar el deployment de producción inmediatamente anterior conocido como estable.
2. Verificar que su commit corresponde a una versión validada.
3. Reasignar producción a ese deployment desde Vercel.
4. Confirmar rutas críticas: inicio, Explorar, login, registro y el expediente publicado.
5. Revisar runtime errors después del rollback.
6. Registrar la incidencia y el commit que la originó antes de volver a desplegar.

### Mantenimiento mínimo

- Revisar errores runtime después de cada despliegue.
- Mantener dependencias y Prisma actualizados de forma controlada.
- Ejecutar build/typecheck antes de cambios de producción.
- Evitar cambios directos a la lógica narrativa congelada sin una corrección reproducible.
- Mantener una copia de seguridad verificable antes de cambios de esquema de base de datos.

> Los elementos marcados como pendientes no se consideran configurados hasta que sean comprobados explícitamente en producción.