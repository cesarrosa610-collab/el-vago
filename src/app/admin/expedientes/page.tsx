import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

export default async function AdminExpedientes() {
  const u = await currentUser();
  if (!u || u.role !== 'ADMIN') redirect('/');
  const es = await prisma.expediente.findMany({ orderBy: { createdAt: 'asc' }, include: { evidence: true } });

  return (
    <main className="wrap">
      <div className="nav"><Link href="/admin">← CMS</Link><Link className="btn" href="/admin/expedientes/new">Nuevo</Link></div>
      <h1>Expedientes</h1>
      <div className="grid">
        {es.map((e) => (
          <div className="card" key={e.id}>
            <span className="tag">{e.code}</span><h2>{e.title}</h2>
            <p className="muted">Estado: {e.status} · {e.evidence.length} evidencias</p>
            <Link className="btn" href={`/admin/expedientes/${e.id}`}>Administrar</Link>
            {e.status === 'PUBLISHED' && <Link className="btn secondary" href={`/expedientes/${e.slug}`}>Abrir</Link>}
          </div>
        ))}
      </div>
    </main>
  );
}
