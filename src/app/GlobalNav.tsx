import Link from 'next/link';
import { currentUser } from '@/src/lib/auth';

export default async function GlobalNav() {
  const user = await currentUser();

  return (
    <nav className="nav globalNav" aria-label="Navegación principal">
      <Link className="brand brandLockup" href="/">
        <strong>EL VAG<span>O</span></strong>
        <small>HISTORIAS DE FICCIÓN. PREGUNTAS SIN RESPUESTA.</small>
      </Link>

      <div className="navCenter">
        <Link className="navLink active" href="/">Inicio</Link>
        <Link className="navLink" href="/explorar">Expedientes</Link>
        <Link className="navLink" href="/multimedia">Multimedia</Link>
        <Link className="navLink" href="/comunidad">Comunidad</Link>
        <Link className="navLink" href="/mi-vago">Mi Vago</Link>
      </div>

      <div className="navActions">
        <Link className="navIcon" href="/explorar" aria-label="Buscar expedientes" title="Buscar expedientes">⌕</Link>
        <span className="navIcon navBell" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg></span>
        {user ? (
          <>
            <span className="navProfile" aria-hidden="true">{user.email.slice(0, 1).toUpperCase()}</span>
            {user.role === 'ADMIN' && <Link className="btn secondary navCms" href="/admin">CMS</Link>}
            <form action="/api/auth/logout" method="post">
              <button className="btn secondary navLogout">Salir</button>
            </form>
          </>
        ) : (
          <>
            <Link className="navProfile" href="/login" aria-label="Entrar" title="Entrar">→</Link>
            <Link className="btn navRegister" href="/register">Crear cuenta</Link>
          </>
        )}
      </div>
    </nav>
  );
}
