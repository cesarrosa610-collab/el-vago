import Link from 'next/link';
import { currentUser } from '@/src/lib/auth';

export default async function GlobalNav() {
  const user = await currentUser();

  return (
    <nav className="nav globalNav" aria-label="Navegación principal">
      <Link className="brand" href="/">
        EL VAGO
      </Link>

      <div className="navCenter">
        <Link className="navLink" href="/">
          Inicio
        </Link>

        <Link className="navLink" href="/explorar">
          Explorar
        </Link>

        <span className="navLink navDisabled">
          Multimedia
        </span>

        <span className="navLink navDisabled">
          Comunidad
        </span>
      </div>

      <div className="navActions">
        {user ? (
          <>
            <span className="muted navUser">{user.email}</span>

            <Link className="navLink" href="/mi-vago">
  Mi Vago
</Link>

            {user.role === 'ADMIN' && (
              <Link className="btn secondary" href="/admin">
                CMS
              </Link>
            )}

            <form action="/api/auth/logout" method="post">
              <button className="btn secondary">
                Salir
              </button>
            </form>
          </>
        ) : (
          <>
            <Link className="btn secondary" href="/login">
              Entrar
            </Link>

            <Link className="btn" href="/register">
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
