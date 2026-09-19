# El Vago — Operations & Recovery Runbook

**Estado:** V1 congelada / preparación operativa  
**Fecha:** 19 de septiembre de 2026  
**Producción:** https://el-vago.vercel.app

## 1. Estado verificado

- Proyecto Vercel: `el-vago`
- Producción administrada en Vercel.
- En la revisión del 19/09/2026 no se detectaron errores de runtime agrupados durante los últimos 7 días.
- La plataforma conserva deployments anteriores, por lo que existe una vía de rollback de deployment.
- El deployment correspondiente al commit `080c9f4d4eddeefa2b8046ff0cf39190c51fb43f` está en estado READY.
- El deployment más reciente, correspondiente al commit `aedba9e2fdb953d17d690176e0922379f074f596`, estaba BUILDING durante esta revisión. Su estado debe comprobarse antes de considerar esta revisión operativa completamente cerrada.

## 2. Regla de rollback

Si un deployment nuevo introduce un fallo reproducible en producción:

1. Identificar el deployment anterior que estaba funcionando.
2. En Vercel, abrir Deployments.
3. Usar **Instant Rollback** sobre el deployment estable anterior.
4. Confirmar que producción vuelve a responder correctamente.
5. Corregir el problema en un nuevo commit.
6. Volver a desplegar y validar antes de promover la nueva versión.

No modificar manualmente la base de datos como primera respuesta a un fallo de frontend.

## 3. Base de datos — backup

La aplicación utiliza PostgreSQL mediante Prisma. **El proveedor concreto de PostgreSQL no se marca aquí como verificado**, por lo que no se inventa un procedimiento específico.

Antes del lanzamiento comercial:

- [ ] Identificar proveedor exacto de PostgreSQL.
- [ ] Confirmar si el plan activo ofrece snapshots/backups automáticos.
- [ ] Confirmar frecuencia y retención.
- [ ] Confirmar cómo se restaura un backup.
- [ ] Crear al menos un backup manual verificable si el proveedor lo permite.
- [ ] Documentar quién puede ejecutar una restauración.
- [ ] Mantener las credenciales fuera del repositorio.

Si el proveedor es Prisma Postgres, su documentación actual indica backups/snapshots automáticos y también permite crear un archivo mediante `pg_dump`; la disponibilidad y retención dependen del plan. Revisar el plan real antes de marcar este punto como completado.

## 4. Qué debe respaldarse

El backup de base de datos debe cubrir, como mínimo, los datos que permiten conservar:

- cuentas de usuarios;
- investigaciones;
- descubrimientos;
- progreso;
- hipótesis seleccionadas;
- contenido de expedientes;
- estados de publicación.

Los assets del repositorio deben permanecer versionados en GitHub y los secretos no deben almacenarse en Git.

## 5. Mantenimiento

Revisión periódica:

- errores de runtime;
- deployments fallidos;
- consumo/costos;
- disponibilidad;
- base de datos;
- integridad del flujo de investigación;
- autenticación;
- almacenamiento de progreso.

Después de cualquier cambio de código que afecte narrativa, autenticación, base de datos o publicación, repetir las pruebas correspondientes antes de promoverlo como nueva versión.

## 6. Incidente de producción

### A. Error visual
Reproducir → identificar commit → corregir → desplegar → validar móvil y desktop.

### B. Error de API
Reproducir → revisar logs → identificar endpoint → corregir → validar autorización y datos → desplegar.

### C. Error de base de datos
No borrar ni modificar registros manualmente sin identificar la causa. Confirmar estado del proveedor y del backup antes de ejecutar una restauración.

### D. Deployment roto
Rollback inmediato al último deployment estable; después preparar la corrección como nueva versión.

## 7. Regla de congelación V1

No realizar cambios de diseño o lógica narrativa únicamente por preferencia después de la congelación. Un cambio posterior debe corresponder a:

- error reproducible;
- requisito legal/operativo;
- mejora de seguridad;
- nueva funcionalidad de una versión posterior.

Cada cambio de este tipo debe quedar asociado a un commit y volver a validarse en producción.

## 8. Criterio de cierre operativo

No marcar el bloque de operaciones como completo hasta verificar:

- proveedor de PostgreSQL;
- backup automático;
- restauración;
- secretos/configuración;
- rollback de Vercel;
- monitorización de errores;
- procedimiento de incidente.

### Referencias técnicas

- Vercel Deployments: los deployments son inmutables y Vercel ofrece Instant Rollback.
- Prisma Postgres: documentación de backups y restauración.
