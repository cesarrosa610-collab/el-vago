# El Vago — Private Beta RC v2.2

Objetivo: primer entorno real de Beta privada.

## Ruta rápida
1. Copiar `.env.example` a `.env` y cambiar secretos.
2. Levantar PostgreSQL: `docker compose up -d postgres`.
3. Usar `prisma/schema.postgres.prisma` como schema de producción/Beta.
4. Generar Prisma Client y aplicar migraciones con las dependencias instaladas.
5. Ejecutar seed.
6. Ejecutar `npm run beta:check`.
7. Ejecutar `npm run start` después de un build exitoso.

## Importante
SQLite sigue siendo el modo offline de validación. PostgreSQL es el destino de Beta/producción porque el estado persistente no debe depender del filesystem efímero de un hosting serverless.

No incluir `.env` real en Git.
