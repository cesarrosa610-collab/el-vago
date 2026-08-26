import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import EvidenceForm from './EvidenceForm';
import PublishButton from './PublishButton';

export default async function AdminExpedientePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user || user.role !== 'ADMIN') redirect('/');

  const { id } = await params;
  const expediente = await prisma.expediente.findUnique({
    where: { id },
    include: { evidence: { orderBy: { unlockAfter: 'asc' } } },
  });
  if (!expediente) notFound();

  return (
    <main className="wrap">
      <div className="nav">
        <Link href="/admin/expedientes">← Expedientes</Link>
        {expediente.status === 'PUBLISHED' && <Link className="btn secondary" href={`/expedientes/${expediente.slug}`}>Abrir expediente</Link>}
      </div>
      <p className="eyebrow">CMS · EXPEDIENTE</p>
      <h1>{expediente.title}</h1>
      <p className="muted">{expediente.code} · Estado: <strong>{expediente.status}</strong></p>

      <section className="stack" style={{ marginTop: 24 }}>
        <div className="card">
          <h2>Evidencias</h2>
          <p className="muted">Agrega las piezas que el jugador irá descubriendo. <code>unlockAfter</code> indica cuántos hallazgos previos necesita el jugador.</p>
          <div className="grid">
            {expediente.evidence.map((e) => (
              <article className="card" key={e.id}>
                <span className="tag">{e.code}</span>
                <h3>{e.title}</h3>
                <p className="muted">{e.description}</p>
                <small className="muted">Desbloqueo: {e.unlockAfter}</small>
              </article>
            ))}
          </div>
          <EvidenceForm expedienteId={expediente.id} />
        </div>

        {expediente.status === 'DRAFT' && (
          <div className="card">
            <h2>Publicar</h2>
            <p className="muted">El expediente debe tener al menos una evidencia antes de publicarse.</p>
            <PublishButton expedienteId={expediente.id} />
          </div>
        )}
      </section>
    </main>
  );
}
