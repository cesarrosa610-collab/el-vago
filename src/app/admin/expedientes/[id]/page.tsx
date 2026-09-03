import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import EvidenceForm from './EvidenceForm';
import NarrativeForm from './NarrativeForm';
import PublishButton from './PublishButton';
import DeleteDraftButton from './DeleteDraftButton';
export default async function AdminExpedientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const { id } = await params;

  const expediente = await prisma.expediente.findUnique({
    where: { id },
    include: {
      evidence: {
        orderBy: {
          unlockAfter: 'asc',
        },
      },
      clues: {
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      },
      questions: {
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      },
      theories: {
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      },
      hypotheses: {
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      },
      timelineEvents: {
        orderBy: [
          { sortOrder: 'asc' },
          { unlockAfter: 'asc' },
        ],
      },
    },
  });

  if (!expediente) {
    notFound();
  }

  return (
    <main className="wrap">
      <div className="nav">
        <Link href="/admin/expedientes">
          ← Expedientes
        </Link>

        {expediente.status === 'PUBLISHED' && (
          <Link
            className="btn secondary"
            href={`/expedientes/${expediente.slug}`}
          >
            Abrir expediente
          </Link>
        )}
      </div>

      <p className="eyebrow">
        CMS · EXPEDIENTE
      </p>

      <h1>{expediente.title}</h1>

      <p className="muted">
        {expediente.code} · Estado:{' '}
        <strong>{expediente.status}</strong>
      </p>

      <section
        className="stack"
        style={{ marginTop: 24 }}
      >
        <div className="card">
          <h2>Evidencias</h2>

          <p className="muted">
            Piezas que el jugador descubre durante
            la investigación.
          </p>

          <div className="grid">
            {expediente.evidence.map((e) => (
              <article
                className="card"
                key={e.id}
              >
                <span className="tag">
                  {e.code}
                </span>

                <h3>{e.title}</h3>

                <p className="muted">
                  {e.description}
                </p>

                <small className="muted">
                  Desbloqueo: {e.unlockAfter}
                </small>
              </article>
            ))}
          </div>

          {expediente.status === 'DRAFT' && (
            <EvidenceForm
              expedienteId={expediente.id}
            />
          )}
        </div>

        <div className="card">
          <h2>Motor narrativo</h2>

          <p className="muted">
            Administra las piezas narrativas del
            expediente y define cuándo se desbloquean.
          </p>

          <div className="grid">
            <article className="card">
              <span className="tag">
                PISTAS
              </span>

              <h3>
                {expediente.clues.length}
              </h3>

              {expediente.clues.map((x) => (
                <p
                  className="muted"
                  key={x.id}
                >
                  {x.code} · {x.title} ·
                  desbloqueo {x.unlockAfter}
                </p>
              ))}
            </article>

            <article className="card">
              <span className="tag">
                PREGUNTAS
              </span>

              <h3>
                {expediente.questions.length}
              </h3>

              {expediente.questions.map((x) => (
                <p
                  className="muted"
                  key={x.id}
                >
                  {x.code} · {x.text} ·
                  desbloqueo {x.unlockAfter}
                </p>
              ))}
            </article>

            <article className="card">
              <span className="tag">
                TEORÍAS
              </span>

              <h3>
                {expediente.theories.length}
              </h3>

              {expediente.theories.map((x) => (
                <p
                  className="muted"
                  key={x.id}
                >
                  {x.code} · {x.title} ·
                  desbloqueo {x.unlockAfter}
                </p>
              ))}
            </article>

            <article className="card">
              <span className="tag">
                HIPÓTESIS
              </span>

              <h3>
                {expediente.hypotheses.length}
              </h3>

              {expediente.hypotheses.map((x) => (
                <p
                  className="muted"
                  key={x.id}
                >
                  {x.code} · {x.title} ·
                  desbloqueo {x.unlockAfter}
                </p>
              ))}
            </article>

            <article className="card">
              <span className="tag">
                TIMELINE
              </span>

              <h3>
                {expediente.timelineEvents.length}
              </h3>

              {expediente.timelineEvents.map((x) => (
                <p
                  className="muted"
                  key={x.id}
                >
                  {x.code} · {x.label} ·
                  orden {x.sortOrder} ·
                  desbloqueo {x.unlockAfter}
                </p>
              ))}
            </article>
          </div>

          {expediente.status === 'DRAFT' && (
            <NarrativeForm
              expedienteId={expediente.id}
            />
          )}
        </div>

        {expediente.status === 'DRAFT' && (
  <div className="card">
    <h2>Zona de administración</h2>

    <p className="muted">
      Este expediente aún no está publicado.
      Puedes eliminarlo de forma segura.
    </p>

    <DeleteDraftButton
      expedienteId={expediente.id}
    />
  </div>
)}
