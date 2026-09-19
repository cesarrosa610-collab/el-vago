import { redirect } from 'next/navigation';
import { currentUser } from '@/src/lib/auth';
import Link from 'next/link';

export default async function Admin() {
  const u = await currentUser();
  if (!u || u.role !== 'ADMIN') redirect('/');

  return (
    <main className="wrap adminPage">
      <div className="adminHeader">
        <h1>CMS El Vago</h1>
        <p className="muted">Centro de administración de contenido.</p>
      </div>

      <div className="grid">
        <div className="card adminCard">
          <h2>Expedientes</h2>
          <p>Crear, revisar, publicar y administrar casos.</p>
          <Link className="btn" href="/admin/expedientes">Abrir</Link>
        </div>
      </div>
    </main>
  );
}
