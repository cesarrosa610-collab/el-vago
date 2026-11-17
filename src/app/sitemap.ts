import type { MetadataRoute } from 'next';
import { prisma } from '@/src/lib/prisma';

// Sitemap data depends on PostgreSQL, so resolve it at request time rather
// than during the Vercel build (which must not require a live database).
export const dynamic = 'force-dynamic';

const siteUrl = 'https://el-vago.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/explorar`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/multimedia`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/comunidad`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const expedientes = await prisma.expediente.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const expedienteRoutes: MetadataRoute.Sitemap = expedientes.map((e) => ({
    url: `${siteUrl}/expedientes/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...expedienteRoutes];
}
