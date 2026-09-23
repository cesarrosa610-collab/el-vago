import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Inicia sesión en El Vago para continuar tus investigaciones.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
