# El Vago — V2.1 Audiovisual Specification

**Estado:** Desarrollo aislado / no afecta V2 estable
**Base:** main (V2 funcional congelada)
**Rama:** v2.1-audiovisual

## Objetivo
Incorporar una capa audiovisual narrativa reutilizable sin alterar la lógica de investigación estable.

## Principios
- El video es evidencia narrativa, no decoración.
- Cada pieza audiovisual debe desbloquearse según el progreso existente.
- Nunca revelar la validez de una hipótesis antes de la selección.
- La reproducción no debe impedir continuar si el usuario no puede reproducir audio/video.
- Mobile-first y compatible con iPhone.
- No depender de material con copyright no autorizado.
- Los videos iniciales podrán ser placeholders seguros hasta cargar producción final.

## Modelo audiovisual
Cada escena audiovisual tendrá:
- id
- expedienteId
- orden
- título
- descripción
- tipo: INTRO | EVIDENCE | CLUE | RECONSTRUCTION | OUTRO
- src
- poster
- duración opcional
- requisito de desbloqueo
- estado publicado

## Flujo piloto — EV-EXP-001
1. INTRO — presentación cinematográfica del caso.
2. EVIDENCE 01 — incidente / contexto.
3. EVIDENCE 02 — material de pasillo.
4. CLUE — pieza que refuerza una pista sin resolverla.
5. RECONSTRUCTION — material previo a hipótesis.
6. OUTRO — cierre después de completar investigación.

## Integración
La capa audiovisual debe leer el progreso ya existente y no duplicar la máquina narrativa. Se implementará como componente reutilizable dentro de InvestigationClient.

## Seguridad
- URLs y metadatos públicos no deben exponer respuestas de hipótesis.
- Assets no sensibles pueden estar en public.
- Contenido privado o condicionado debe respetar la autenticación existente.
- No incluir secretos ni credenciales en código.

## Rendimiento
- Poster obligatorio.
- Carga diferida cuando sea posible.
- Evitar autoplay con sonido.
- Preload controlado.
- Fallback visual si el video falla.

## CMS futuro
La arquitectura debe permitir asociar piezas audiovisuales a un expediente desde CMS en una iteración posterior, sin hardcodear cada historia.

## Criterio de aceptación V2.1
- V2 estable permanece intacta.
- EV-EXP-001 puede mostrar piezas audiovisuales en puntos definidos.
- Progreso existente continúa funcionando.
- Mobile funciona correctamente.
- Video fallido no rompe la investigación.
- No se revela información de hipótesis prematuramente.
- Build/typecheck y pruebas existentes continúan pasando.
