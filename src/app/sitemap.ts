import type { MetadataRoute } from 'next';
import { prisma } from '@/src/lib/prisma';

const siteUrl = 'https://el-vago.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const expedientes = await prisma.expediente.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/explorar`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/multimedia`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/comunidad`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const expedienteRoutes: MetadataRoute.Sitemap = expedientes.map((e) => ({
    url: `${siteUrl}/expedientes/${e.slug}`,
    lastModified: e.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...expedienteRoutes];
}
