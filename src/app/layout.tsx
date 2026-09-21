import type { Metadata } from 'next';
import './style.css';

const siteUrl = 'https://el-vago.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'El Vago — Historias reales y misterios',
    template: '%s | El Vago',
  },
  description:
    'Historias reales, misterios y expedientes documentales para observar las evidencias, conectar las pistas y descubrir qué ocurrió.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_SV',
    url: siteUrl,
    siteName: 'El Vago',
    title: 'El Vago — Expedientes interactivos',
    description:
      'Investiga misterios, conecta evidencias y descubre la verdad en los expedientes interactivos de El Vago.',
  },
  twitter: {
    card: 'summary',
    title: 'El Vago — Expedientes interactivos',
    description:
      'Investiga misterios, conecta evidencias y descubre la verdad en los expedientes interactivos de El Vago.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
