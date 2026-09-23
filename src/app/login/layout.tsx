import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Inicia sesión en El Vago para continuar tus investigaciones.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: false },
  openGraph: {
    url: 'https://el-vago.vercel.app/login',
    title: 'Entrar | El Vago',
    description: 'Inicia sesión en El Vago para continuar tus investigaciones.',
  },
  twitter: {
    title: 'Entrar | El Vago',
    description: 'Inicia sesión en El Vago para continuar tus investigaciones.',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
