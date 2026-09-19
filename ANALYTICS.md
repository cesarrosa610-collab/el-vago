# El Vago — Analytics V1

## Implementación

El proyecto integra **Vercel Web Analytics** mediante `@vercel/analytics`.

La integración registra las páginas visitadas y permite disponer de métricas de tráfico sin introducir una plataforma de seguimiento adicional en el código.

## Estado

- [x] Dependencia agregada.
- [x] Componente `<Analytics />` integrado en el layout global.
- [ ] Activar **Web Analytics** en el proyecto desde el panel de Vercel.
- [ ] Confirmar recepción de datos después de la activación.
- [ ] Revisar la política de privacidad/cookies según la configuración final y la normativa aplicable.

## Métricas iniciales

La V1 debe comenzar con métricas simples:

- visitas;
- páginas consultadas;
- navegación general;
- rendimiento/uso básico que proporcione la plataforma.

No se añaden identificadores personales, correo, contraseña, progreso individual ni contenido de investigación como parámetros de analytics.

## Criterio de cierre

Analytics solo se considera operativo cuando Web Analytics esté habilitado en el proyecto Vercel y se confirme que aparecen datos reales después de una visita de producción.

Referencia: documentación y paquete oficial de Vercel Web Analytics.
