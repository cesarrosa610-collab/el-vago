# El Vago — Private Beta deployment

## Ruta
GitHub -> Vercel -> Prisma/PostgreSQL -> Preview -> navegador real.

## Vercel
1. Importar el repositorio.
2. Añadir `DATABASE_URL` en Preview y Production.
3. Vercel ejecutará `npm run vercel-build`.
4. Probar `/api/health` y luego el flujo completo de La Habitación 317.

## Nota
Para esta Private Beta se usa `prisma db push` durante el build para reducir fricción inicial. Antes de producción pública debe sustituirse por migraciones versionadas (`prisma migrate deploy`).

## No subir
Nunca subir `.env`, contraseñas, tokens ni DATABASE_URL real.
