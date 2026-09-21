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

const sections = [
  { id: 'Evidencias', kicker: '01', label: 'Evidencias' },
  { id: 'Pistas', kicker: '02', label: 'Pistas' },
  { id: 'Preguntas', kicker: '03', label: 'Preguntas' },
  { id: 'Teorías', kicker: '04', label: 'Teorías' },
  { id: 'Hipótesis', kicker: '05', label: 'Hipótesis' },
  { id: 'Timeline', kicker: '06', label: 'Timeline' },
  { id: 'Cierre', kicker: '07', label: 'Cierre' },
];

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
  const total = expediente.evidence.length;
  const found = Math.min(ids.length, total);
  const completion = total ? Math.round((found / total) * 100) : progress;
  const visible = expediente.evidence.filter((e) => e.unlockAfter <= found);
  const nextEvidence = expediente.evidence.find((e) => !discovered.has(e.id));

  const refreshNarrative = async () => {
    try {
      const r = await fetch(`/api/expedientes/${expediente.id}/narrative`, {
        cache: 'no-store',
      });
      if (!r.ok) return;

      const data = await r.json();

      setNarrative({
        clues: Array.isArray(data.clues) ? data.clues : [],
        questions: Array.isArray(data.questions) ? data.questions : [],
        theories: Array.isArray(data.theories) ? data.theories : [],
        hypotheses: Array.isArray(data.hypotheses) ? data.hypotheses : [],
        timeline: Array.isArray(data.timeline) ? data.timeline : [],
        conclusion: data.conclusion,
      });

      if (data.conclusion?.completed === true) {
        setStatus('COMPLETED');
        setProgress(100);
      }
    } catch {
      setMessage('No se pudo actualizar el contenido narrativo.');
    }
  };

  useEffect(() => {
    if (status !== 'NOT_STARTED') refreshNarrative();
  }, [status, ids.length]);

  async function start() {
    setBusy(true);
    setMessage('');

    try {
      const r = await fetch(`/api/expedientes/${expediente.id}/start`, { method: 'POST' });
      const j = await r.json();

      if (r.ok) {
        setProgress(j.progress);
        setStatus(j.status);
        setMessage('Expediente abierto. La investigación comienza ahora.');
      } else {
        setMessage(j.error || 'No se pudo iniciar.');
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
        { method: 'POST' }
      );
      const j = await r.json();

      if (r.ok) {
        setIds(j.discoveredIds);
        setProgress(j.progress);
        setStatus(j.status);
        setTab('Evidencias');
        setMessage(
          j.newlyDiscovered
            ? `Hallazgo ${e.code} incorporado al expediente.`
            : 'Esta evidencia ya estaba en tu expediente.'
        );
      } else {
        setMessage(j.error || 'No se pudo descubrir.');
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
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ hypothesisId: id }),
        }
      );
      const j = await r.json();

      if (r.ok) {
        setProgress(j.progress);
        setStatus(j.status);
        setMessage('Hipótesis registrada. El expediente está listo para su cierre.');
        await refreshNarrative();
        setTab('Cierre');
      } else {
        setMessage(j.error || 'No se pudo seleccionar.');
      }
    } catch {
      setMessage('No se pudo registrar la hipótesis.');
    } finally {
      setBusy(false);
    }
  }

  const caseArtwork =
    expediente.code === 'EV-EXP-001'
      ? '/exp-001-habitacion.svg'
      : expediente.code === 'EV-EXP-003'
        ? '/exp-003-cuarto.svg'
        : expediente.code === 'EV-EXP-004'
          ? '/exp-004-archivo.svg'
          : expediente.code === 'EV-EXP-006'
            ? '/exp-006-habitacion.svg'
            : '/exp-002-llamada.svg';

  const isTabUnlocked = (section: string) => {
    if (section === 'Evidencias') return true;
    if (section === 'Cierre') return narrative.conclusion?.completed === true;
    if (status === 'COMPLETED') return true;
    if (section === 'Pistas') return narrative.clues.length > 0;
    if (section === 'Preguntas') return narrative.questions.length > 0;
    if (section === 'Teorías') return narrative.theories.length > 0;
    if (section === 'Hipótesis') return found >= total && narrative.hypotheses.length > 0;
    if (section === 'Timeline') return status === 'COMPLETED';
    return false;
  };

  return (
    <main className="casePage">
      {message && (
        <div className="message" role="status">
          <span className="messagePulse" aria-hidden="true" />
          {message}
        </div>
      )}

      <header className="caseHero">
        <div className="caseHeroVisual" aria-hidden="true">
          <img src={caseArtwork} alt="" />
          <span className="caseHeroScan" />
          <span className="caseHeroVignette" />
        </div>

        <div className="caseHeroContent">
          <nav className="nav" aria-label="Navegación de investigación">
            <a className="brand" href="/">EL VAGO</a>
            <div className="navCenter">
              <a className="navLink" href="/">Inicio</a>
              <a className="navLink" href="/explorar">Explorar</a>
              <a className="navLink" href="/mi-vago">Mi Vago</a>
            </div>
            <span className="caseCode">{expediente.code}</span>
          </nav>

          <div className="caseHeroEditorial">
            <p className="eyebrow">EXPEDIENTE · INVESTIGACIÓN DOCUMENTAL</p>
            <div className="caseHeroTitleRow">
              <div>
                <span className="caseHeroSerial">ARCHIVO 001 / ACCESO AUTORIZADO</span>
                <h1>{expediente.title}</h1>
              </div>
              <div className="caseHeroStamp" aria-hidden="true">
                <span>EL VAGO</span>
                <strong>{status === 'COMPLETED' ? 'CERRADO' : 'EN CURSO'}</strong>
              </div>
            </div>

            <p className="lead">{expediente.description}</p>

            <div className="investigationMeter">
              <div className="investigationMeterTop">
                <span>PROGRESO DE INVESTIGACIÓN</span>
                <strong>{status === 'COMPLETED' ? 100 : completion}%</strong>
              </div>
              <div className="bar">
                <i style={{ width: `${Math.min(100, Math.max(0, status === 'COMPLETED' ? 100 : completion))}%` }} />
              </div>
              <div className="investigationMeterBottom">
                <span>{found} de {total} evidencias descubiertas</span>
                <span>{status === 'COMPLETED' ? 'EXPEDIENTE CERRADO' : 'SIGUE LAS PIEZAS'}</span>
              </div>
            </div>

            <div className="caseHeroActions">
              {status === 'NOT_STARTED' ? (
                <button className="btn heroBtn" onClick={start} disabled={busy}>
                  {busy ? 'Abriendo expediente…' : 'Comenzar investigación →'}
                </button>
              ) : nextEvidence ? (
                <button className="btn heroBtn" onClick={() => discover(nextEvidence)} disabled={busy}>
                  {busy ? 'Registrando hallazgo…' : `Investigar ${nextEvidence.code} →`}
                </button>
              ) : status !== 'COMPLETED' && narrative.hypotheses.length ? (
                <button className="btn heroBtn" onClick={() => setTab('Hipótesis')} disabled={busy}>
                  Elegir hipótesis →
                </button>
              ) : null}

              <span className="caseHeroHint">
                {status === 'NOT_STARTED'
                  ? 'Abre el archivo para comenzar.'
                  : status === 'COMPLETED'
                    ? 'Todas las piezas han sido conectadas.'
                    : 'Cada hallazgo puede desbloquear una nueva conexión.'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="investigation">
        <aside className="caseNav">
          <div className="sideTitle">ARCHIVO DE INVESTIGACIÓN</div>
          <div className="caseNavProgress">
            <span>{String(found).padStart(2, '0')}</span>
            <div><i style={{ width: `${completion}%` }} /></div>
            <span>{String(total).padStart(2, '0')}</span>
          </div>

          {sections.map((section) => {
            const unlocked = isTabUnlocked(section.id);
            return (
              <button
                key={section.id}
                className={tab === section.id ? 'active' : ''}
                onClick={() => unlocked && setTab(section.id)}
                disabled={!unlocked}
                title={!unlocked ? 'Completa más hallazgos para desbloquear esta sección' : undefined}
              >
                <span>{section.kicker}</span>
                {section.label}
                {!unlocked && <small>LOCKED</small>}
              </button>
            );
          })}

          <div className="caseNavNote">
            <span>ESTADO</span>
            <strong>{status === 'COMPLETED' ? 'CERRADO' : status === 'IN_PROGRESS' ? 'EN INVESTIGACIÓN' : 'SIN INICIAR'}</strong>
          </div>
        </aside>

        <div className="evidenceArea">
          <div className="evidenceAreaHeader">
            <div>
              <p className="eyebrow">DOSSIER / {sections.find((s) => s.id === tab)?.kicker}</p>
              <h2>{tab}</h2>
            </div>
            <span className="evidenceCounter">{found}/{total}</span>
          </div>

          {tab === 'Evidencias' && (
            <div className="evidenceGrid">
              {visible.map((e) => {
                const isFound = discovered.has(e.id);
                return (
                  <article className={`evidence ${isFound ? 'found' : 'locked'}`} key={e.id}>
                    <div className="evidenceVisual" aria-hidden="true">
                      <span className="evidenceVisualCode">{e.code}</span>
                      <span className="evidenceVisualSignal" />
                      <span className="evidenceVisualCorner" />
                      <span className="evidenceVisualLine" />
                    </div>
                    <div className="evidenceBody">
                      <div className="evidenceTop">
                        <span>{e.code}</span>
                        <span>{isFound ? 'DESCUBIERTA' : 'PENDIENTE'}</span>
                      </div>
                      <h3>{e.title}</h3>
                      {isFound ? (
                        <>
                          <p>{e.description}</p>
                          <div className="foundMark">✓ Hallazgo registrado</div>
                        </>
                      ) : (
                        <>
                          <p className="redacted">Información pendiente de descubrimiento.</p>
                          <button className="btn" onClick={() => discover(e)} disabled={busy}>
                            Investigar evidencia →
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
                <article className="card" key={x.id}>
                  <span className="tag">{x.code}</span>
                  <h3>{x.title}</h3>
                  <p>{x.description}</p>
                </article>
              ))}
              {!narrative.clues.length && <div className="card muted">Todavía no hay conexiones suficientes. Sigue investigando.</div>}
            </div>
          )}

          {tab === 'Preguntas' && (
            <div className="narrativeGrid">
              {narrative.questions.map((x) => (
                <article className="card" key={x.id}>
                  <span className="tag">{x.code}</span>
                  <h3>{x.text}</h3>
                  <p className="muted">No busques la respuesta todavía. Busca la pieza que falta.</p>
                </article>
              ))}
            </div>
          )}

          {tab === 'Teorías' && (
            <div className="narrativeGrid">
              {narrative.theories.map((x) => (
                <article className="card" key={x.id}>
                  <span className="tag">{x.code}</span>
                  <h3>{x.title}</h3>
                  <p>{x.description}</p>
                </article>
              ))}
            </div>
          )}

          {tab === 'Hipótesis' && (
            <div className="narrativeGrid">
              {narrative.hypotheses.map((x) => {
                const selected = narrative.conclusion?.selectedHypothesisId === x.id;
                return (
                  <article className={`card ${selected ? 'found' : ''}`} key={x.id}>
                    <span className="tag">{x.code}</span>
                    <h3>{x.title}</h3>
                    <p>{x.description}</p>
                    {selected && <div className="foundMark">✓ Hipótesis seleccionada</div>}
                    <button
                      className="btn"
                      onClick={() => chooseHypothesis(x.id)}
                      disabled={busy || selected || status === 'COMPLETED'}
                    >
                      {selected ? 'Hipótesis seleccionada' : status === 'COMPLETED' ? 'Investigación cerrada' : 'Elegir esta hipótesis →'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          {tab === 'Timeline' && (
            <div className="narrativeGrid">
              {narrative.timeline.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((x) => (
                <article className="card" key={x.id}>
                  <div className="evidenceTop"><span>{x.code}</span><span>{x.label}</span></div>
                  <h3>{x.label}</h3>
                  <p>{x.description}</p>
                  <p className="muted">Orden {x.sortOrder}</p>
                </article>
              ))}
              {!narrative.timeline.length && <div className="card muted">Todavía no hay eventos suficientes para construir la línea de tiempo.</div>}
            </div>
          )}

          {tab === 'Cierre' && (
            <article className="card conclusion">
              <p className="eyebrow">CIERRE DEL EXPEDIENTE</p>
              <span className="caseHeroSerial">ARCHIVO FINAL / CONCLUSIÓN</span>
              <h2>{narrative.conclusion?.title || 'La investigación aún no está cerrada'}</h2>
              <p>{narrative.conclusion?.description || 'Sigue reuniendo las piezas y selecciona una hipótesis cuando estés listo.'}</p>
              {narrative.conclusion?.completed && (
                <div className="foundMark">✓ Investigación completada · Expediente cerrado</div>
              )}
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
