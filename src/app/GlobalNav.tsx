import Link from 'next/link';
import { headers } from 'next/headers';
import { currentUser } from '@/src/lib/auth';

export default async function GlobalNav() {
  const user = await currentUser();
  const pathname = (await headers()).get('x-pathname') ?? '';

  return (
    <nav className="nav globalNav masterNav" aria-label="Navegación principal">
      <Link className="brand brandLockup" href="/">
        <strong>EL VAG<span>O</span></strong>
        <small>Historias que no te dejan dormir.</small>
      </Link>

      <div className="navCenter">
        <Link className={`navLink ${pathname.startsWith('/explorar') ? 'active' : ''}`} href="/explorar">EXPLORE</Link>
        <Link className={`navLink ${pathname.startsWith('/expedientes/') ? 'active' : ''}`} href="/explorar">EXPEDIENTES</Link>
        <Link className={`navLink ${pathname.startsWith('/multimedia') ? 'active' : ''}`} href="/multimedia">MULTIMEDIA</Link>
        <Link className={`navLink ${pathname.startsWith('/comunidad') ? 'active' : ''}`} href="/comunidad">COMUNIDAD</Link>
      </div>

      <div className="navActions">
        <Link className="navIcon" href="/explorar" aria-label="Buscar expedientes" title="Buscar expedientes">⌕</Link>
        {user ? (
          <>
            <span className="navProfile" aria-hidden="true">{user.email.slice(0, 1).toUpperCase()}</span>
            {user.role === 'ADMIN' && <Link className="btn secondary navCms" href="/admin">CMS</Link>}
            <form action="/api/auth/logout" method="post">
              <button className="btn secondary navLogout" type="submit">Salir</button>
            </form>
          </>
        ) : (
          <>
            <Link className="navProfile" href="/login" aria-label="Entrar" title="Entrar">→</Link>
            <Link className="btn navRegister" href="/register">Crear cuenta</Link>
          </>
        )}
        <Link className="masterPremium" href="/mi-vago">PREMIUM</Link>
      </div>
    </nav>
  );
}
