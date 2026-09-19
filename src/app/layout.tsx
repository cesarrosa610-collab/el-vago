import type { Metadata } from 'next';
import './style.css';
import { Analytics } from '@vercel/analytics/react';

const siteUrl = 'https://el-vago.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'El Vago — Expedientes interactivos',
    template: '%s | El Vago',
  },
  description:
    'Investiga misterios, conecta evidencias y descubre la verdad en los expedientes interactivos de El Vago.',
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
      <body>{children}<Analytics /></body>
    </html>
  );
}
