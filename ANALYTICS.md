# El Vago — Analytics

## Estado actual

La integración de **Vercel Web Analytics está pendiente**.

Los intentos realizados durante V1 con `@vercel/analytics` provocaron fallos de build por resolución de dependencia (`module_not_found`). La implementación fue retirada de la aplicación estable para no comprometer la versión congelada.

Por lo tanto:

- [ ] Dependencia `@vercel/analytics` instalada.
- [ ] Componente `<Analytics />` integrado en el layout.
- [ ] Web Analytics activado en Vercel.
- [ ] Recepción de datos reales confirmada.

## Criterio de cierre

Analytics solo se considera operativo cuando:

1. la dependencia se instala correctamente;
2. el build de producción termina sin errores;
3. el componente queda integrado;
4. Web Analytics está habilitado en Vercel;
5. se confirma recepción de datos reales.

La implementación deberá realizarse como cambio controlado de V2, nunca directamente sobre la V1 congelada.

## Métricas previstas

Cuando se habilite, comenzar con métricas generales:

- visitas;
- páginas consultadas;
- navegación general;
- rendimiento/uso básico proporcionado por la plataforma.

No se deben enviar identificadores personales, contraseñas, progreso individual ni contenido privado de investigación como parámetros de analytics.

## Nota

Este documento refleja el estado real del proyecto y no declara Analytics como operativo hasta que exista una validación técnica y de producción.
