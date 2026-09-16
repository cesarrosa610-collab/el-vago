import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

import EvidenceForm from './EvidenceForm';
import EditEvidenceForm from './EditEvidenceForm';
import NarrativeForm from './NarrativeForm';
import NarrativeDeleteButton from './NarrativeDeleteButton';
import PublishButton from './PublishButton';
import DeleteDraftButton from './DeleteDraftButton';
import ArchiveButton from './ArchiveButton';
import EditExpedienteForm from './EditExpedienteForm';

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
          { sortOrder: 'asc' },
          { unlockAfter: 'asc' },
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

      {expediente.status === 'DRAFT' && (
        <EditExpedienteForm
          expediente={{
            id: expediente.id,
            code: expediente.code,
            slug: expediente.slug,
            title: expediente.title,
            description: expediente.description,
            category: expediente.category,
            difficulty: expediente.difficulty,
            conclusionTitle: expediente.conclusionTitle,
            conclusion: expediente.conclusion,
          }}
        />
      )}

      <section
        className="stack"
        style={{ marginTop: 24 }}
      >

        {/* ========================= */}
        {/* EVIDENCIAS */}
        {/* ========================= */}

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

                {expediente.status === 'DRAFT' && (
                  <EditEvidenceForm
                    expedienteId={expediente.id}
                    evidence={{
                      id: e.id,
                      code: e.code,
                      title: e.title,
                      description: e.description,
                      unlockAfter: e.unlockAfter,
                    }}
                  />
                )}
              </article>
            ))}
          </div>

          {expediente.status === 'DRAFT' && (
            <EvidenceForm
              expedienteId={expediente.id}
            />
          )}
        </div>


        {/* ========================= */}
        {/* MOTOR NARRATIVO */}
        {/* ========================= */}

        <div className="card">
          <h2>Motor narrativo</h2>

          <p className="muted">
            Administra las piezas narrativas del
            expediente y define cuándo se desbloquean.
          </p>

          <div className="grid">

            {/* ========================= */}
            {/* PISTAS */}
            {/* ========================= */}

            <article className="card">
              <span className="tag">
                PISTAS
              </span>

              <h3>
                {expediente.clues.length}
              </h3>

              {expediente.clues.map((x) => (
                <div key={x.id}>
                  <p className="muted">
                    {x.code} · {x.title} ·
                    desbloqueo {x.unlockAfter}
                  </p>

                  {expediente.status === 'DRAFT' && (
                    <NarrativeDeleteButton
                      expedienteId={expediente.id}
                      itemId={x.id}
                      type="CLUE"
                      code={x.code}
                    />
                  )}
                </div>
              ))}
            </article>


            {/* ========================= */}
            {/* PREGUNTAS */}
            {/* ========================= */}

            <article className="card">
              <span className="tag">
                PREGUNTAS
              </span>

              <h3>
                {expediente.questions.length}
              </h3>

              {expediente.questions.map((x) => (
                <div key={x.id}>
                  <p className="muted">
                    {x.code} · {x.text} ·
                    desbloqueo {x.unlockAfter}
                  </p>

                  {expediente.status === 'DRAFT' && (
                    <NarrativeDeleteButton
                      expedienteId={expediente.id}
                      itemId={x.id}
                      type="QUESTION"
                      code={x.code}
                    />
                  )}
                </div>
              ))}
            </article>


            {/* ========================= */}
            {/* TEORÍAS */}
            {/* ========================= */}

            <article className="card">
              <span className="tag">
                TEORÍAS
              </span>

              <h3>
                {expediente.theories.length}
              </h3>

              {expediente.theories.map((x) => (
                <div key={x.id}>
                  <p className="muted">
                    {x.code} · {x.title} ·
                    desbloqueo {x.unlockAfter}
                  </p>

                  {expediente.status === 'DRAFT' && (
                    <NarrativeDeleteButton
                      expedienteId={expediente.id}
                      itemId={x.id}
                      type="THEORY"
                      code={x.code}
                    />
                  )}
                </div>
              ))}
            </article>


            {/* ========================= */}
            {/* HIPÓTESIS */}
            {/* ========================= */}

            <article className="card">
              <span className="tag">
                HIPÓTESIS
              </span>

              <h3>
                {expediente.hypotheses.length}
              </h3>

              {expediente.hypotheses.map((x) => (
                <div key={x.id}>
                  <p className="muted">
                    {x.code} · {x.title} ·
                    desbloqueo {x.unlockAfter}
                  </p>

                  {expediente.status === 'DRAFT' && (
                    <NarrativeDeleteButton
                      expedienteId={expediente.id}
                      itemId={x.id}
                      type="HYPOTHESIS"
                      code={x.code}
                    />
                  )}
                </div>
              ))}
            </article>


            {/* ========================= */}
            {/* TIMELINE */}
            {/* ========================= */}

            <article className="card">
              <span className="tag">
                TIMELINE
              </span>

              <h3>
                {expediente.timelineEvents.length}
              </h3>

              {expediente.timelineEvents.map((x) => (
                <div key={x.id}>
                  <p className="muted">
                    {x.code} · {x.label} ·
                    orden {x.sortOrder} ·
                    desbloqueo {x.unlockAfter}
                  </p>

                  {expediente.status === 'DRAFT' && (
                    <NarrativeDeleteButton
                      expedienteId={expediente.id}
                      itemId={x.id}
                      type="TIMELINE"
                      code={x.code}
                    />
                  )}
                </div>
              ))}
            </article>

          </div>


          {/* ========================= */}
          {/* FORMULARIO NARRATIVO */}
          {/* ========================= */}

          {expediente.status === 'DRAFT' && (
            <NarrativeForm
              expedienteId={expediente.id}
            />
          )}
        </div>


        {/* ========================= */}
        {/* ADMINISTRACIÓN DRAFT */}
        {/* ========================= */}

        {expediente.status === 'DRAFT' && (
          <div className="card">
            <h2>Zona de administración</h2>

            <p className="muted">
              Este expediente aún no está publicado.
              Puedes publicarlo cuando esté listo o
              eliminarlo de forma segura.
            </p>

            <div className="nav">
              <PublishButton
                expedienteId={expediente.id}
              />

              <DeleteDraftButton
                expedienteId={expediente.id}
              />
            </div>
          </div>
        )}


        {/* ========================= */}
        {/* ADMINISTRACIÓN PUBLICADO */}
        {/* ========================= */}

        {expediente.status === 'PUBLISHED' && (
          <div className="card">
            <h2>Zona de administración</h2>

            <p className="muted">
              Este expediente está publicado.
              Puedes archivarlo para retirarlo de la
              vista pública sin eliminarlo.
            </p>

            <ArchiveButton
              expedienteId={expediente.id}
            />
          </div>
        )}


        {/* ========================= */}
        {/* ADMINISTRACIÓN ARCHIVADO */}
        {/* ========================= */}

        {expediente.status === 'ARCHIVED' && (
          <div className="card">
            <h2>Zona de administración</h2>

            <p className="muted">
              Este expediente está archivado y no
              aparece públicamente. Puedes restaurarlo
              para volver a publicarlo.
            </p>

            <PublishButton
              expedienteId={expediente.id}
            />
          </div>
        )}

      </section>
    </main>
  );
}
