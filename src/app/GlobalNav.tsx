import Link from 'next/link';
import { headers } from 'next/headers';
import { currentUser } from '@/src/lib/auth';

export default async function GlobalNav() {
  const user = await currentUser();
  const pathname = (await headers()).get('x-pathname') ?? '';

  return (
    <header className="v3Nav">
      <Link className="v3Brand" href="/">
        <strong><span className="v3BrandWord">EL VAG</span><span className="v3BrandO">O</span></strong>
        <small>HISTORIAS REALES · MISTERIOS · FORMATO DOCUMENTAL</small>
      </Link>
      <nav className="v3NavLinks" aria-label="Navegación principal">
        <Link className={pathname === '/' ? 'active' : ''} href="/">Inicio</Link>
        <Link className={pathname.startsWith('/explorar') || pathname.startsWith('/expedientes') ? 'active' : ''} href="/explorar">Explorar</Link>
        <Link className={pathname.startsWith('/multimedia') ? 'active' : ''} href="/multimedia">Multimedia</Link>
        <Link className={pathname.startsWith('/comunidad') ? 'active' : ''} href="/comunidad">Comunidad</Link>
        <Link className={pathname.startsWith('/mi-vago') ? 'active' : ''} href="/mi-vago">Mi Vago</Link>
      </nav>
      <div className="v3NavActions">
        <Link className="v3Search" href="/explorar" aria-label="Buscar">⌕</Link>
        {user ? (
          <>
            <span className="v3Avatar">{user.email.slice(0, 1).toUpperCase()}</span>
            {user.role === 'ADMIN' && <Link className="v3NavButton" href="/admin">CMS</Link>}
            <form action="/api/auth/logout" method="post"><button className="v3NavButton" type="submit">Salir</button></form>
          </>
        ) : (
          <Link className="v3Avatar" href="/login" aria-label="Entrar">→</Link>
        )}
      </div>
    </header>
  );
}
