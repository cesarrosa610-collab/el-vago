'use client';

import { useEffect, useMemo, useState } from 'react';

type Evidence = {
  id: string;
  code: string;
  title: string;
  description: string;
  unlockAfter: number;
};

type TimelineEvent = {
  id: string;
  code: string;
  label: string;
  description: string;
  sortOrder: number;
  unlockAfter: number;
};

type Narrative = {
  clues: any[];
  questions: any[];
  theories: any[];
  hypotheses: any[];
  timeline: TimelineEvent[];
  conclusion?: {
    title: string | null;
    description: string | null;
    selectedHypothesisId: string | null;
    completed: boolean;
  };
};

type Props = {
  expediente: {
    id: string;
    code: string;
    title: string;
    description: string;
    conclusionTitle?: string | null;
    conclusion?: string | null;
    evidence: Evidence[];
  };
  initialProgress: number;
  initialStatus: string;
  discoveredIds: string[];
};

export default function InvestigationClient({
  expediente,
  initialProgress,
  initialStatus,
  discoveredIds,
}: Props) {
  const [ids, setIds] = useState(discoveredIds);
  const [progress, setProgress] = useState(initialProgress);
  const [status, setStatus] = useState(initialStatus);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const [tab, setTab] = useState('Evidencias');

  const [narrative, setNarrative] = useState<Narrative>({
    clues: [],
    questions: [],
    theories: [],
    hypotheses: [],
    timeline: [],
  });

  const discovered = useMemo(() => new Set(ids), [ids]);

  const visible = expediente.evidence.filter(
    (e) => e.unlockAfter <= ids.length
  );

  const refreshNarrative = async () => {
    try {
      const r = await fetch(
        `/api/expedientes/${expediente.id}/narrative`,
        {
          cache: 'no-store',
        }
      );

      if (!r.ok) {
        return;
      }

      const data = await r.json();

      setNarrative({
        clues: Array.isArray(data.clues) ? data.clues : [],
        questions: Array.isArray(data.questions)
          ? data.questions
          : [],
        theories: Array.isArray(data.theories)
          ? data.theories
          : [],
        hypotheses: Array.isArray(data.hypotheses)
          ? data.hypotheses
          : [],
        timeline: Array.isArray(data.timeline)
          ? data.timeline
          : [],
        conclusion: data.conclusion,
      });
    } catch {
      setMessage('No se pudo actualizar el contenido narrativo.');
    }
  };

  useEffect(() => {
    if (status !== 'NOT_STARTED') {
      refreshNarrative();
    }
  }, [status, ids.length]);

  async function start() {
    setBusy(true);
    setMessage('');

    try {
      const r = await fetch(
        `/api/expedientes/${expediente.id}/start`,
        {
          method: 'POST',
        }
      );

      const j = await r.json();

      if (r.ok) {
        setProgress(j.progress);
        setStatus(j.status);
        setMessage(
          'Expediente abierto. La investigación comienza ahora.'
        );
      } else {
        setMessage(j.error || 'No se pudo iniciar');
      }
    } catch {
      setMessage('No se pudo iniciar la investigación.');
    } finally {
      setBusy(false);
    }
  }

  async function discover(e: Evidence) {
    setBusy(true);
    setMessage('');

    try {
      const r = await fetch(
        `/api/expedientes/${expediente.id}/evidence/${e.id}/discover`,
        {
          method: 'POST',
        }
      );

      const j = await r.json();

      if (r.ok) {
        setIds(j.discoveredIds);
        setProgress(j.progress);
        setStatus(j.status);

        setMessage(
          j.newlyDiscovered
            ? 'Hallazgo registrado. Una nueva conexión puede haberse abierto.'
            : 'Esta evidencia ya estaba en tu expediente.'
        );
      } else {
        setMessage(j.error || 'No se pudo descubrir');
      }
    } catch {
      setMessage('No se pudo registrar el hallazgo.');
    } finally {
      setBusy(false);
    }
  }

  async function chooseHypothesis(id: string) {
    setBusy(true);
    setMessage('');

    try {
      const r = await fetch(
        `/api/expedientes/${expediente.id}/hypothesis/select`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            hypothesisId: id,
          }),
        }
      );

      const j = await r.json();

      if (r.ok) {
        setMessage(
          'Hipótesis registrada. Tu teoría ha quedado incorporada al expediente.'
        );

        await refreshNarrative();
      } else {
        setMessage(j.error || 'No se pudo seleccionar');
      }
    } catch {
      setMessage('No se pudo registrar la hipótesis.');
    } finally {
      setBusy(false);
    }
  }

  const caseArtwork =
    expediente.code === 'EV-EXP-003'
      ? '/exp-003-cuarto.svg'
      : expediente.code === 'EV-EXP-004'
        ? '/exp-004-archivo.svg'
        : expediente.code === 'EV-EXP-006'
          ? '/exp-006-habitacion.svg'
          : '/exp-002-llamada.svg';

  const nav = [
    'Evidencias',
    'Pistas',
    'Preguntas',
    'Teorías',
    'Hipótesis',
    'Timeline',
    'Cierre',
  ];

  const isTabUnlocked = (x: string) => {
    if (x === 'Evidencias') return true;

    if (x === 'Cierre') {
      return narrative.conclusion?.completed === true;
    }

    if (status === 'COMPLETED') {
      return true;
    }

    if (x === 'Pistas') {
      return narrative.clues.length > 0;
    }

    if (x === 'Preguntas') {
      return narrative.questions.length > 0;
    }

    if (x === 'Teorías') {
      return narrative.theories.length > 0;
    }

    if (x === 'Hipótesis') {
      return narrative.hypotheses.length > 0;
    }

    if (x === 'Timeline') {
      return narrative.timeline.length > 0;
    }

    return false;
  };

  return (
    <main className="casePage">
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      <header className="caseHero">
        <div className="caseHeroVisual" aria-hidden="true">
          <img src={caseArtwork} alt="" />
          <span className="caseHeroScan" />
        </div>
        <div className="caseHeroContent">
        <nav
          className="nav"
          aria-label="Navegación de investigación"
        >
          <a className="brand" href="/">
            EL VAGO
          </a>

          <div className="navCenter">
            <a className="navLink" href="/">
              Inicio
            </a>

            <a
              className="navLink"
              href="/explorar"
            >
              Explorar
            </a>

            <a
              className="navLink"
              href="/mi-vago"
            >
              Mi Vago
            </a>
          </div>

          <span className="caseCode">
            {expediente.code}
          </span>
        </nav>

        <p className="eyebrow">
          EXPEDIENTE · INVESTIGACIÓN
        </p>

        <h1>{expediente.title}</h1>

        <p className="lead">
          {expediente.description}
        </p>

        <div className="caseMeta">
          <span>
            Investigación {Math.round(progress)}%
          </span>

          <span>
            {status === 'COMPLETED'
              ? 'Caso cerrado'
              : 'Hay piezas que todavía no encajan'}
          </span>
        </div>

        <div className="bar">
          <i
            style={{
              width: `${Math.min(
                100,
                Math.max(0, progress)
              )}%`,
            }}
          />
        </div>

        {status === 'NOT_STARTED' && (
          <button
            className="btn heroBtn"
            onClick={start}
            disabled={busy}
          >
            {busy
              ? 'Abriendo expediente…'
              : 'Comenzar investigación'}
          </button>
        )}
        </div>
      </header>

      <section className="investigation">
        <aside className="caseNav">
          <div className="sideTitle">
            ARCHIVO
          </div>

          {nav.map((x) => {
            const unlocked =
              isTabUnlocked(x);

            return (
              <button
                key={x}
                className={
                  tab === x ? 'active' : ''
                }
                onClick={() =>
                  unlocked && setTab(x)
                }
                disabled={!unlocked}
                title={
                  !unlocked
                    ? 'Completa más hallazgos para desbloquear esta sección'
                    : undefined
                }
              >
                {x}
                {!unlocked && ' 🔒'}
              </button>
            );
          })}
        </aside>

        <div className="evidenceArea">
          {tab === 'Evidencias' && (
            <div className="evidenceGrid">
              {visible.map((e) => {
                const found =
                  discovered.has(e.id);

                return (
                  <article
                    className={`evidence ${
                      found ? 'found' : 'locked'
                    }`}
                    key={e.id}
                  >
                    <div className="evidenceVisual" aria-hidden="true">
                      <span className="evidenceVisualCode">{e.code}</span>
                      <span className="evidenceVisualSignal" />
                      <span className="evidenceVisualCorner" />
                    </div>
                    <div className="evidenceBody">
                    <div className="evidenceTop">
                      <span>
                        {e.code}
                      </span>

                      <span>
                        {found
                          ? 'DESCUBIERTA'
                          : 'PENDIENTE'}
                      </span>
                    </div>

                    <h3>{e.title}</h3>

                    {found ? (
                      <>
                        <p>
                          {e.description}
                        </p>

                        <div className="foundMark">
                          ✓ Hallazgo registrado
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="redacted">
                          Información pendiente de descubrimiento.
                        </p>

                        <button
                          className="btn"
                          onClick={() =>
                            discover(e)
                          }
                          disabled={busy}
                        >
                          Investigar evidencia
                        </button>
                      </>
                    )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {tab === 'Pistas' && (
            <div className="narrativeGrid">
              {narrative.clues.map((x) => (
                <article
                  className="card"
                  key={x.id}
                >
                  <span className="tag">
                    {x.code}
                  </span>

                  <h3>{x.title}</h3>

                  <p>
                    {x.description}
                  </p>
                </article>
              ))}

              {!narrative.clues.length && (
                <div className="card muted">
                  Todavía no hay conexiones suficientes.
                  Sigue investigando.
                </div>
              )}
            </div>
          )}

          {tab === 'Preguntas' && (
            <div className="narrativeGrid">
              {narrative.questions.map((x) => (
                <article
                  className="card"
                  key={x.id}
                >
                  <span className="tag">
                    {x.code}
                  </span>

                  <h3>{x.text}</h3>

                  <p className="muted">
                    No busques la respuesta todavía.
                    Busca la pieza que falta.
                  </p>
                </article>
              ))}
            </div>
          )}

          {tab === 'Teorías' && (
            <div className="narrativeGrid">
              {narrative.theories.map((x) => (
                <article
                  className="card"
                  key={x.id}
                >
                  <span className="tag">
                    {x.code}
                  </span>

                  <h3>{x.title}</h3>

                  <p>
                    {x.description}
                  </p>
                </article>
              ))}
            </div>
          )}

          {tab === 'Hipótesis' && (
            <div className="narrativeGrid">
              {narrative.hypotheses.map((x) => {
                const selected =
                  narrative.conclusion
                    ?.selectedHypothesisId ===
                  x.id;

                return (
                  <article
                    className={`card ${
                      selected ? 'found' : ''
                    }`}
                    key={x.id}
                  >
                    <span className="tag">
                      {x.code}
                    </span>

                    <h3>{x.title}</h3>

                    <p>
                      {x.description}
                    </p>

                    {selected && (
                      <div className="foundMark">
                        ✓ Hipótesis seleccionada
                      </div>
                    )}

                    <button
                      className="btn"
                      onClick={() =>
                        chooseHypothesis(x.id)
                      }
                      disabled={
                        busy ||
                        selected ||
                        status === 'COMPLETED'
                      }
                    >
                      {selected
                        ? 'Hipótesis seleccionada'
                        : status === 'COMPLETED'
                          ? 'Investigación cerrada'
                          : 'Elegir esta hipótesis'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          {tab === 'Timeline' && (
            <div className="narrativeGrid">
              {narrative.timeline
                .slice()
                .sort(
                  (a, b) =>
                    a.sortOrder -
                    b.sortOrder
                )
                .map((x) => (
                  <article
                    className="card"
                    key={x.id}
                  >
                    <div className="evidenceTop">
                      <span>
                        {x.code}
                      </span>

                      <span>
                        {x.label}
                      </span>
                    </div>

                    <h3>
                      {x.label}
                    </h3>

                    <p>
                      {x.description}
                    </p>

                    <p className="muted">
                      Orden {x.sortOrder}
                    </p>
                  </article>
                ))}

              {!narrative.timeline.length && (
                <div className="card muted">
                  Todavía no hay eventos suficientes
                  para construir la línea de tiempo.
                </div>
              )}
            </div>
          )}

          {tab === 'Cierre' && (
            <article className="card conclusion">
              <p className="eyebrow">
                CIERRE DEL EXPEDIENTE
              </p>

              <h2>
                {narrative.conclusion?.title ||
                  'La investigación aún no está cerrada'}
              </h2>

              <p>
                {narrative.conclusion
                  ?.description ||
                  'Sigue reuniendo las piezas y selecciona una hipótesis cuando estés listo.'}
              </p>

              {narrative.conclusion?.completed && (
                <div className="foundMark">
                  ✓ Investigación completada
                </div>
              )}
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
