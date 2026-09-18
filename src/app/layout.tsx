import type { Metadata } from 'next';
import './style.css';

export const metadata: Metadata = {
  title: 'El Vago — Expedientes interactivos',
  description:
    'Investiga misterios, conecta evidencias y descubre la verdad en los expedientes interactivos de El Vago.',
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
