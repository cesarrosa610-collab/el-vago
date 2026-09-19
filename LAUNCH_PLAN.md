# El Vago — Plan de lanzamiento V1

**Estado:** Release Candidate final / V1 congelada  
**Fecha:** 19 de septiembre de 2026  
**Producción actual:** https://el-vago.vercel.app

## 1. Producto
- [x] Funcionalidad V1 validada en producción
- [x] CMS y ciclo de publicación validados
- [x] Investigación de La Habitación 317 validada de 0% a 100%
- [x] Persistencia e historial validados
- [x] Responsive móvil validado
- [x] Versión congelada

## 2. Dominio
- [x] URL de producción disponible: el-vago.vercel.app
- [ ] Confirmar dominio personalizado definitivo, si se utilizará
- [ ] Configurar DNS y SSL del dominio personalizado, si aplica
- [ ] Verificar redirección/canonical final

## 3. Legal
Antes de una publicación comercial abierta:
- [ ] Política de privacidad
- [ ] Términos y condiciones
- [ ] Aviso legal y contacto
- [ ] Política de cookies, si las métricas utilizadas lo requieren
- [ ] Revisión de tratamiento de cuentas, progreso y datos de usuarios
- [ ] Revisión de derechos/licencias de textos, imágenes, audio y demás assets

## 4. Analítica
- [ ] Elegir herramienta de analítica
- [ ] Medir visitas y fuentes de adquisición
- [ ] Medir inicio de investigación
- [ ] Medir avance y finalización del expediente
- [ ] Medir registro/login
- [ ] Medir navegación entre secciones
- [ ] Validar que no se envíen datos innecesarios

## 5. Operación
- [ ] Definir rutina de respaldo de PostgreSQL
- [ ] Definir revisión de errores y disponibilidad
- [ ] Definir responsable y procedimiento de rollback
- [ ] Mantener variables/secrets fuera del repositorio
- [ ] Registrar cambios posteriores como nuevas versiones

## 6. Contenido de lanzamiento
**Expediente de lanzamiento:** EV-EXP-001 — La Habitación 317

Mensaje principal:
> HISTORIAS DE FICCIÓN. PREGUNTAS SIN RESPUESTA.

Propuesta de entrada:
> Comienza una investigación. Descubre las pistas. Elige tu hipótesis.

No publicar un segundo expediente hasta que su narrativa, assets, desbloqueos y ciclo CMS hayan pasado la misma validación de V1.

## 7. Regla de lanzamiento
El producto no necesita más cambios de interfaz para considerarse funcionalmente cerrado. Las tareas pendientes de esta lista son de operación, legal, medición y preparación comercial.

Cualquier cambio de código posterior al freeze debe:
1. tener una razón reproducible;
2. identificarse como corrección o nueva versión;
3. pasar nuevamente la validación de producción correspondiente.
