import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear cuenta',
  description: 'Crea tu cuenta de El Vago para guardar tu progreso y continuar tus investigaciones.',
  alternates: { canonical: '/register' },
  robots: { index: false, follow: false },
  openGraph: {
    url: 'https://el-vago.vercel.app/register',
    title: 'Crear cuenta | El Vago',
    description: 'Crea tu cuenta de El Vago para guardar tu progreso y continuar tus investigaciones.',
  },
  twitter: {
    title: 'Crear cuenta | El Vago',
    description: 'Crea tu cuenta de El Vago para guardar tu progreso y continuar tus investigaciones.',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
