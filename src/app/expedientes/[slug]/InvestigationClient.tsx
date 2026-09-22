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
  const nextEvidence = expediente.evidence.find(
    (e) => !discovered.has(e.id) && e.unlockAfter <= found
  );

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
        goToSection('Cierre');
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

  const goToSection = (section: string) => {
    setTab(section);
    window.requestAnimationFrame(() => {
      document.querySelector('.evidenceArea')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

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
    <main className="casePage">\n
        <style>{`
          .caseHero{
            min-height:680px;
            border-radius:0 0 34px 34px;
            border-bottom:1px solid #292d30;
            background:#050607;
            box-shadow:0 35px 110px rgba(0,0,0,.42);
          }
          .caseHeroVisual{inset:0;opacity:1}
          .caseHeroVisual img{
            width:100%;height:100%;object-fit:cover;
            opacity:.46;
            filter:grayscale(.82) contrast(1.18) brightness(.68);
            transform:scale(1.035);
            animation:vagoHeroDrift 18s ease-in-out infinite alternate;
          }
          .caseHeroVisual:after{
            content:"";position:absolute;inset:0;
            background:
              radial-gradient(circle at 78% 40%,rgba(229,9,20,.14),transparent 24%),
              linear-gradient(90deg,#050607 0%,rgba(5,6,7,.9) 34%,rgba(5,6,7,.45) 66%,rgba(5,6,7,.62) 100%),
              linear-gradient(0deg,#050607 0%,transparent 48%,rgba(0,0,0,.22) 100%);
          }
          .caseHeroVignette{
            position:absolute;inset:0;
            background:radial-gradient(circle at center,transparent 35%,rgba(0,0,0,.42) 100%);
            pointer-events:none;
          }
          .caseHeroScan{z-index:4}
          .caseHeroContent{padding:0 34px 72px;max-width:1280px}
          .caseHeroContent>.nav{
            min-height:72px;
            border-bottom:1px solid rgba(255,255,255,.08);
            background:rgba(5,6,7,.42);
            backdrop-filter:blur(12px);
            padding:16px 18px;
            border-radius:0 0 14px 14px;
          }
          .caseHeroEditorial{max-width:1040px;padding:108px 4% 0}
          .caseHeroSerial{
            display:inline-block;
            color:#8e969b;
            font-size:10px;
            font-weight:800;
            letter-spacing:.18em;
            text-transform:uppercase;
          }
          .caseHeroTitleRow{
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:38px;
          }
          .caseHeroTitleRow h1{
            margin:14px 0 20px;
            font-size:clamp(52px,7vw,94px);
            line-height:.86;
            letter-spacing:-.065em;
            text-wrap:balance;
          }
          .caseHeroStamp{
            flex:0 0 auto;
            margin-top:22px;
            min-width:142px;
            padding:14px 16px;
            border:1px solid rgba(229,9,20,.62);
            color:#e50914;
            background:rgba(7,7,7,.54);
            box-shadow:0 0 30px rgba(229,9,20,.08);
            transform:rotate(2deg);
            display:grid;
            gap:5px;
            text-align:center;
          }
          .caseHeroStamp span{font-size:9px;letter-spacing:.2em;font-weight:800}
          .caseHeroStamp strong{font-size:13px;letter-spacing:.14em}
          .caseHeroEditorial>.lead{font-size:18px;line-height:1.65;color:#d1d6d9;max-width:700px}
          .investigationMeter{
            margin-top:32px;
            max-width:760px;
            padding:18px 20px;
            border:1px solid #2a2f32;
            border-radius:12px;
            background:rgba(8,10,11,.72);
            box-shadow:0 18px 50px rgba(0,0,0,.25);
            backdrop-filter:blur(10px);
          }
          .investigationMeterTop,.investigationMeterBottom{
            display:flex;justify-content:space-between;gap:18px;
            align-items:center;
            font-size:10px;letter-spacing:.13em;
            text-transform:uppercase;
          }
          .investigationMeterTop{color:#8e969b;margin-bottom:10px}
          .investigationMeterTop strong{color:#fff;font-size:14px}
          .investigationMeter .bar{height:5px;background:#25292c}
          .investigationMeter .bar i{box-shadow:0 0 18px rgba(229,9,20,.55)}
          .investigationMeterBottom{color:#687075;margin-top:9px}
          .investigationMeterBottom span:last-child{color:#e50914}
          .caseHeroActions{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:25px}
          .caseHeroHint{font-size:11px;color:#899196;letter-spacing:.03em}
          .caseNavProgress{
            display:grid;grid-template-columns:28px 1fr 28px;gap:8px;align-items:center;
            padding:12px 16px 16px;color:#70787d;font-size:9px;font-weight:800;letter-spacing:.12em;
          }
          .caseNavProgress>div{height:3px;background:#24282b;overflow:hidden}
          .caseNavProgress i{display:block;height:100%;background:#e50914;box-shadow:0 0 12px rgba(229,9,20,.5)}
          .caseNavNote{
            margin:12px 14px 14px;padding:12px;border-top:1px solid #202427;
            display:grid;gap:5px;color:#666;font-size:9px;letter-spacing:.15em;
          }
          .caseNavNote strong{color:#aeb4b7;font-size:10px}
          .evidenceAreaHeader{
            display:flex;justify-content:space-between;align-items:end;gap:20px;
            margin-bottom:22px;padding-bottom:16px;border-bottom:1px solid #202427;
          }
          .evidenceAreaHeader h2{
            margin:6px 0 0;font-size:clamp(32px,4vw,52px);
            letter-spacing:-.045em;font-weight:900;
          }
          .evidenceCounter{
            min-width:68px;padding:10px 12px;border:1px solid #3a2427;
            color:#e50914;background:rgba(229,9,20,.04);
            font-size:12px;font-weight:900;letter-spacing:.1em;text-align:center;
          }
          .evidenceVisualLine{
            position:absolute;left:0;right:0;top:50%;height:1px;
            background:linear-gradient(90deg,transparent,#e50914,transparent);
            opacity:.55;animation:vagoLine 3.5s ease-in-out infinite;
          }
          .evidence{box-shadow:0 18px 55px rgba(0,0,0,.28)}
          .evidence:hover{transform:translateY(-6px);border-color:#4b292d;box-shadow:0 25px 65px rgba(0,0,0,.38)}
          .evidenceBody{min-height:245px}
          .message{
            position:relative;z-index:30;
            max-width:1240px;margin:12px auto -12px;
            border:1px solid #2b3033;border-left:3px solid #e50914;
            background:rgba(12,14,15,.94);box-shadow:0 14px 35px rgba(0,0,0,.3);
            backdrop-filter:blur(10px);
          }
          .messagePulse{
            display:inline-block;width:6px;height:6px;margin-right:9px;
            border-radius:50%;background:#e50914;box-shadow:0 0 12px rgba(229,9,20,.7);
            animation:vagoPulse 1.8s ease-in-out infinite;vertical-align:1px;
          }
          @media(max-width:760px){
            .caseHero{min-height:640px;border-radius:0 0 20px 20px}
            .caseHeroContent{padding:0 16px 46px}
            .caseHeroContent>.nav{min-height:0;padding:12px 10px}
            .caseHeroEditorial{padding:74px 6px 0}
            .caseHeroTitleRow{display:block}
            .caseHeroTitleRow h1{font-size:clamp(43px,12vw,60px);margin:11px 0 16px}
            .caseHeroStamp{display:inline-grid;margin:2px 0 18px;transform:rotate(-1deg);min-width:124px;padding:10px 12px}
            .caseHeroEditorial>.lead{font-size:15px;line-height:1.55}
            .investigationMeter{margin-top:22px;padding:15px 14px}
            .investigationMeterBottom{font-size:8px;gap:8px}
            .caseHeroActions{align-items:stretch;flex-direction:column}
            .caseHeroActions .btn{width:100%}
            .caseHeroHint{text-align:center;line-height:1.4}
            .caseNavProgress{padding:10px 12px 12px}
            .evidenceAreaHeader{align-items:center;margin-bottom:18px}
            .evidenceCounter{min-width:58px}
            .evidenceBody{min-height:0}
            .evidenceVisual{height:132px}
            .message{margin:8px 12px -8px}
          }

          .evidenceArea{position:relative;scroll-margin-top:28px}
          .dossierRail{position:absolute;left:-18px;top:0;bottom:0;width:1px;background:linear-gradient(#e50914,rgba(229,9,20,.04) 65%,transparent);opacity:.45}
          .dossierRail span{position:sticky;top:30%;display:block;width:5px;height:42px;margin-left:-2px;background:#e50914;box-shadow:0 0 18px rgba(229,9,20,.55)}
          .dossierEvidence,.dossierCard{position:relative;overflow:hidden}
          .dossierEvidence:before,.dossierCard:before{content:"";position:absolute;top:0;left:0;width:28%;height:1px;background:linear-gradient(90deg,#e50914,transparent);opacity:.7}
          .dossierEvidence:after,.dossierCard:after{content:"";position:absolute;right:14px;top:14px;width:22px;height:22px;border-top:1px solid rgba(255,255,255,.08);border-right:1px solid rgba(255,255,255,.08);pointer-events:none}
          .caseNav button{transition:background .2s ease,border-color .2s ease,transform .2s ease}
          .caseNav button.active{box-shadow:inset 3px 0 #e50914,0 10px 30px rgba(0,0,0,.16)}
          .caseNav button:not(:disabled):hover{transform:translateX(3px)}
          .dossierConclusion{min-height:430px;background:radial-gradient(circle at 80% 25%,rgba(229,9,20,.08),transparent 30%),linear-gradient(145deg,#101010,#080808)}

          .investigation{align-items:start}
          .caseNav{position:sticky;top:22px;align-self:start;max-height:calc(100vh - 44px);overflow:auto;scrollbar-width:thin}
          .caseNav::-webkit-scrollbar{width:4px}
          .caseNav::-webkit-scrollbar-thumb{background:#34383b}
          .evidenceGrid,.narrativeGrid{position:relative}
          .evidenceGrid:before,.narrativeGrid:before{
            content:"ARCHIVO / REGISTRO";
            display:block;
            margin:0 0 12px 2px;
            color:#51585d;
            font-size:8px;
            font-weight:900;
            letter-spacing:.22em;
          }
          .dossierEvidence{background:linear-gradient(145deg,#111314 0%,#0a0b0c 72%)}
          .dossierEvidence.found{border-color:#31373a}
          .dossierEvidence.locked{filter:saturate(.72)}
          .dossierEvidence.locked .evidenceVisual{opacity:.72}
          .dossierEvidence .evidenceVisualCode{font-size:11px;letter-spacing:.16em}
          .dossierEvidence .evidenceTop span:last-child{letter-spacing:.14em}
          .dossierEvidence.found .evidenceTop span:last-child{color:#e50914}
          .dossierCard{background:linear-gradient(145deg,#111314,#090a0b);min-height:220px}
          .dossierCard h3{letter-spacing:-.025em}
          .dossierCard .tag{border-color:#3b2427}
          .dossierCard.found{box-shadow:0 20px 55px rgba(0,0,0,.34),inset 0 1px rgba(229,9,20,.18)}
          .foundMark{letter-spacing:.09em;text-transform:uppercase}
          .dossierConclusion:before{width:48%;height:2px}
          @media(max-width:900px){
            .caseNav{position:relative;top:auto;max-height:none;overflow:visible}
          }
          @media(max-width:760px){
            .caseNav{display:block;padding-bottom:4px}
            .caseNav .sideTitle{margin-bottom:8px}
            .caseNavProgress{display:none}
            .caseNav>button{
              display:inline-flex;width:auto;min-width:max-content;margin-right:5px;
              padding:10px 12px;border:1px solid #252a2d;border-radius:999px;
              background:#0c0e0f;white-space:nowrap;
            }
            .caseNav>button.active{background:#171012;border-color:#57282d;box-shadow:inset 0 -2px #e50914}
            .caseNav>button small{display:none}
            .caseNav{overflow-x:auto;white-space:nowrap;scrollbar-width:none}
            .caseNav::-webkit-scrollbar{display:none}
            .caseNavNote{margin-top:10px}
            .evidenceGrid:before,.narrativeGrid:before{margin-top:4px}
          }

          .caseHeroEditorial{position:relative}
          .caseHeroEditorial:before{
            content:"DOSSIER / ACTIVE FILE";
            position:absolute;right:4%;top:86px;
            color:#444b50;font-size:8px;font-weight:900;letter-spacing:.22em;
            writing-mode:vertical-rl;transform:rotate(180deg);
          }
          .investigationMeter{position:relative;overflow:hidden}
          .investigationMeter:after{
            content:"";position:absolute;top:0;bottom:0;left:34%;
            width:1px;background:rgba(255,255,255,.045);
          }
          .evidenceVisual{background:radial-gradient(circle at 72% 28%,rgba(229,9,20,.12),transparent 22%),linear-gradient(145deg,#171a1b,#090a0b)}
          .evidenceVisualSignal{box-shadow:0 0 0 3px rgba(229,9,20,.05),0 0 24px rgba(229,9,20,.18)}
          .dossierEvidence.found .evidenceVisual{filter:contrast(1.08) brightness(1.04)}
          .dossierEvidence.locked .evidenceVisual:after{
            content:"ACCESO RESTRINGIDO";position:absolute;inset:auto 12px 12px;
            color:#70777b;font-size:8px;font-weight:900;letter-spacing:.18em;
            border-top:1px solid #34383a;padding-top:8px;
          }
          .dossierCard .muted{color:#737b80}
          .narrativeGrid .card{transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}
          .narrativeGrid .card:hover{transform:translateY(-4px);border-color:#3b3032;box-shadow:0 22px 55px rgba(0,0,0,.3)}
          .conclusion{display:flex;flex-direction:column;justify-content:center}
          .dossierConclusion .foundMark{margin-top:24px;padding:14px 16px;border:1px solid #3d2629;background:rgba(229,9,20,.045)}
          @media(max-width:760px){
            .caseHeroEditorial:before{display:none}
            .investigationMeter:after{display:none}
            .dossierConclusion{min-height:360px}
          }

          .caseHero{isolation:isolate}
          .caseHeroVisual:before{
            content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
            background:repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(255,255,255,.012) 4px);
            mix-blend-mode:screen;
          }
          .caseHeroContent>.nav{position:relative;z-index:8}
          .caseHeroContent>.nav:after{
            content:"SECURE CHANNEL";position:absolute;right:18px;bottom:5px;
            color:#454c50;font-size:6px;font-weight:900;letter-spacing:.2em;
          }
          .caseHeroStamp:after{
            content:"";position:absolute;inset:-5px;border:1px solid rgba(229,9,20,.12);
            transform:rotate(-1deg);pointer-events:none;
          }
          .caseHeroStamp{position:relative}
          .investigationMeterTop strong{font-variant-numeric:tabular-nums}
          .investigationMeter .bar i{position:relative;overflow:hidden}
          .investigationMeter .bar i:after{
            content:"";position:absolute;inset:0;
            background:linear-gradient(90deg,transparent,rgba(255,255,255,.32),transparent);
            animation:vagoMeterSweep 2.8s linear infinite;
          }
          .evidenceAreaHeader{position:relative}
          .evidenceAreaHeader:after{
            content:"FIELD NOTES";position:absolute;right:0;bottom:5px;
            color:#363d41;font-size:7px;font-weight:900;letter-spacing:.22em;
          }
          .dossierEvidence .evidenceVisual{border-bottom:1px solid rgba(255,255,255,.05)}
          .dossierEvidence.found .evidenceVisual:before{
            content:"VERIFIED";position:absolute;right:12px;top:12px;z-index:3;
            color:#e50914;border:1px solid rgba(229,9,20,.35);padding:5px 7px;
            font-size:7px;font-weight:900;letter-spacing:.16em;background:rgba(5,6,7,.65);
          }
          .dossierCard{backdrop-filter:blur(4px)}
          .dossierCard:before{opacity:.9}
          .dossierConclusion{position:relative}
          .dossierConclusion:after{
            content:"END OF FILE";position:absolute;right:22px;bottom:20px;
            color:#353b3f;font-size:7px;font-weight:900;letter-spacing:.24em;
          }
          .caseHeroContent{position:relative;z-index:5}
          .caseHeroSerial:after{
            content:"";display:inline-block;width:32px;height:1px;margin:0 10px 3px;
            background:#e50914;box-shadow:0 0 10px rgba(229,9,20,.45)
          }
          .caseHeroTitleRow h1{max-width:820px}
          .caseHeroTitleRow h1::selection,.lead::selection{background:#e50914;color:#fff}
          .caseHeroActions .heroBtn{min-width:230px}
          .investigation{position:relative}
          .investigation:before{
            content:"";position:absolute;left:50%;top:0;width:1px;height:100%;
            background:linear-gradient(transparent,#1b1e20 12%,#1b1e20 88%,transparent);
            opacity:.35;pointer-events:none;
          }
          .caseNav{z-index:6}
          .caseNav .sideTitle{display:flex;align-items:center;gap:9px}
          .caseNav .sideTitle:before{content:"";width:18px;height:1px;background:#e50914}
          .evidenceAreaHeader .eyebrow{margin-bottom:0}
          .evidenceCounter{box-shadow:inset 0 0 22px rgba(229,9,20,.035)}
          .dossierEvidence .evidenceBody{position:relative}
          .dossierEvidence .evidenceBody:after{
            content:"PIEZA / REGISTRO";position:absolute;right:0;bottom:0;
            color:#353b3f;font-size:7px;font-weight:900;letter-spacing:.2em;
          }
          .dossierCard .tag{font-weight:900;letter-spacing:.16em}
          .dossierCard p{line-height:1.72}
          @media(max-width:900px){
            .investigation:before{display:none}
          }
          @media(max-width:760px){
            .caseHeroTitleRow h1{max-width:none}
            .caseHeroActions .heroBtn{min-width:0}
            .dossierEvidence .evidenceBody:after{display:none}
          }

          .caseHeroEditorial .eyebrow{display:flex;align-items:center;gap:10px}
          .caseHeroEditorial .eyebrow:before{content:"01";color:#e50914;font-weight:900}
          .caseHeroEditorial .eyebrow:after{content:"";width:42px;height:1px;background:#2d3235}
          .caseHeroHint{max-width:390px}
          .caseNavNote strong{letter-spacing:.12em}
          .evidenceGrid{counter-reset:archive-card}
          .dossierEvidence{counter-increment:archive-card}
          .dossierEvidence .evidenceTop:before{
            content:"PIEZA " counter(archive-card,decimal-leading-zero);
            color:#4d5559;font-size:7px;letter-spacing:.16em;margin-right:auto;
          }
          .dossierEvidence .evidenceTop{display:flex;align-items:center;gap:10px}
          .dossierEvidence .evidenceTop span:first-child{margin-left:0}
          .dossierEvidence .evidenceTop span:last-child{margin-left:auto}
          .dossierCard .evidenceTop{padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.05)}
          .dossierCard h3{margin-top:18px}
          .dossierConclusion .caseHeroSerial{color:#697176}
          @media(max-width:760px){
            .caseHeroEditorial .eyebrow:before{content:"01 /"}
            .caseHeroEditorial .eyebrow:after{width:24px}
            .dossierEvidence .evidenceTop:before{font-size:6px}
          }

          .caseHeroContent>.nav .caseCode{
            position:relative;padding-left:13px;font-variant-numeric:tabular-nums;
          }
          .caseHeroContent>.nav .caseCode:before{
            content:"";position:absolute;left:0;top:50%;width:5px;height:5px;
            transform:translateY(-50%);border-radius:50%;background:#e50914;
            box-shadow:0 0 10px rgba(229,9,20,.7);
          }
          .caseHeroEditorial .lead{position:relative;padding-left:16px}
          .caseHeroEditorial .lead:before{
            content:"";position:absolute;left:0;top:7px;bottom:7px;width:2px;background:#e50914;
            box-shadow:0 0 12px rgba(229,9,20,.3);
          }
          .caseHeroActions .heroBtn{box-shadow:0 12px 34px rgba(229,9,20,.16)}
          .caseHeroActions .heroBtn:hover{box-shadow:0 18px 45px rgba(229,9,20,.24)}
          .dossierEvidence .foundMark{border-top:1px solid rgba(229,9,20,.15);padding-top:12px}
          .dossierEvidence.locked .btn{border-color:#33383b;color:#b3b9bc}
          .dossierEvidence.locked .btn:hover{border-color:#e50914;color:#fff}
          .dossierCard .btn{margin-top:16px}
          .dossierConclusion h2{font-size:clamp(34px,5vw,64px);letter-spacing:-.05em;line-height:.95}
          .dossierConclusion p{max-width:760px}
          @media(max-width:760px){
            .caseHeroEditorial .lead{padding-left:12px}
            .caseHeroContent>.nav .caseCode{font-size:8px}
            .dossierConclusion h2{font-size:clamp(32px,10vw,48px)}
          }

          .caseHeroVisual img{will-change:transform}
          .caseHeroScan{opacity:.6}
          .caseHeroContent>.nav .brand{letter-spacing:.2em}
          .caseHeroContent>.nav .navLink{position:relative}
          .caseHeroContent>.nav .navLink:after{
            content:"";position:absolute;left:0;right:100%;bottom:-7px;height:1px;background:#e50914;
            transition:right .25s ease;
          }
          .caseHeroContent>.nav .navLink:hover:after{right:0}
          .investigationMeterTop span{font-weight:800}
          .investigationMeterBottom span:first-child{font-variant-numeric:tabular-nums}
          .evidenceVisual{position:relative}
          .evidenceVisual:after{
            content:"";position:absolute;inset:0;pointer-events:none;
            background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.035) 50%,transparent 70%);
            transform:translateX(-100%);transition:transform .8s ease;
          }
          .dossierEvidence:hover .evidenceVisual:after{transform:translateX(100%)}
          .dossierCard .tag{display:inline-flex;align-items:center;min-height:24px}
          .dossierCard .tag:before{
            content:"";width:4px;height:4px;margin-right:7px;border-radius:50%;background:#e50914;
          }
          .dossierConclusion .eyebrow{color:#e50914}

          .caseHeroEditorial{max-width:1080px}
          .caseHeroEditorial .eyebrow{margin-bottom:13px}
          .caseHeroTitleRow{align-items:flex-end}
          .caseHeroStamp{margin-bottom:6px}
          .caseHeroActions{min-height:48px}
          .caseHeroActions .heroBtn{position:relative;overflow:hidden}
          .caseHeroActions .heroBtn:before{
            content:"";position:absolute;top:0;bottom:0;left:-45%;width:35%;
            background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
            transform:skewX(-18deg);transition:left .65s ease;
          }
          .caseHeroActions .heroBtn:hover:before{left:125%}
          .evidenceArea{min-width:0}
          .evidenceAreaHeader h2{text-transform:none}
          .evidenceGrid{grid-auto-rows:minmax(0,1fr)}
          .dossierEvidence .evidenceBody{display:flex;flex-direction:column}
          .dossierEvidence .evidenceBody>p{flex:1}
          .dossierEvidence .evidenceBody .btn{align-self:flex-start}
          .dossierEvidence .foundMark{margin-top:14px}
          .dossierCard{display:flex;flex-direction:column}
          .dossierCard .btn{align-self:flex-start}
          .dossierCard .foundMark{margin-top:auto}
          @media(max-width:760px){
            .caseHeroTitleRow{align-items:flex-start}
            .caseHeroStamp{margin-bottom:18px}
            .caseHeroActions{min-height:0}
            .dossierEvidence .evidenceBody .btn,.dossierCard .btn{align-self:stretch}
          }

          .caseHeroEditorial .lead{font-weight:450}
          .caseHeroActions .caseHeroHint:before{content:"↳";color:#e50914;margin-right:7px}
          .caseNav{border-color:#24282b}
          .caseNav button{position:relative}
          .caseNav button.active:after{
            content:"ACTIVE";position:absolute;right:12px;top:50%;transform:translateY(-50%);
            color:#5d6468;font-size:6px;font-weight:900;letter-spacing:.18em;
          }
          .caseNav button:disabled{cursor:not-allowed}
          .evidenceAreaHeader{min-height:74px}
          .evidenceAreaHeader .evidenceCounter{font-variant-numeric:tabular-nums}
          .dossierEvidence .evidenceVisual{min-height:150px}
          .dossierEvidence .evidenceVisualCode{font-variant-numeric:tabular-nums}
          .dossierEvidence h3,.dossierCard h3{font-weight:850}
          .dossierEvidence p,.dossierCard p{color:#b9c0c3}
          .dossierEvidence .redacted{
            color:#626a6e;letter-spacing:.04em;font-size:12px;
          }
          .dossierConclusion{overflow:hidden}
          .dossierConclusion .caseHeroSerial{margin-bottom:12px}
          @media(max-width:760px){
            .caseNav button.active:after{display:none}
            .evidenceAreaHeader{min-height:0}
            .dossierEvidence .evidenceVisual{min-height:132px}
          }

          .caseHeroEditorial .lead{max-width:760px}
          .caseHeroActions{position:relative}
          .caseHeroActions:before{
            content:"FIELD ACTION";position:absolute;left:0;top:-13px;
            color:#42494d;font-size:6px;font-weight:900;letter-spacing:.22em;
          }
          .caseNav .sideTitle{letter-spacing:.2em}
          .caseNavProgress{border-bottom:1px solid #1e2224}
          .caseNavNote{position:relative}
          .caseNavNote:before{
            content:"";position:absolute;left:0;top:0;width:24px;height:1px;background:#e50914;
          }
          .evidenceAreaHeader h2{font-weight:900}
          .evidenceGrid{gap:22px}
          .narrativeGrid{gap:22px}
          .dossierEvidence,.dossierCard{border-radius:10px}
          .dossierEvidence .evidenceBody{padding:22px}
          .dossierCard{padding:24px}
          .dossierCard h3{line-height:1.05}
          .dossierConclusion{padding:clamp(26px,5vw,54px)}
          @media(max-width:760px){
            .caseHeroActions:before{top:-10px}
            .dossierEvidence .evidenceBody{padding:18px}
            .dossierCard{padding:19px}
            .evidenceGrid,.narrativeGrid{gap:15px}
          }
          .timelineGrid{position:relative;display:grid;gap:0;padding:10px 0 18px}
          .timelineGrid:before{content:"";position:absolute;left:19px;top:16px;bottom:18px;width:1px;background:linear-gradient(#e50914,rgba(229,9,20,.28) 70%,rgba(229,9,20,0));box-shadow:0 0 14px rgba(229,9,20,.12)}
          .timelineEntry{position:relative;padding:0 0 28px 58px}
          .timelineEntry:last-child{padding-bottom:4px}
          .timelineNode{position:absolute;left:12px;top:18px;width:15px;height:15px;border:1px solid #e50914;border-radius:50%;background:#090a0b;box-shadow:0 0 0 5px rgba(229,9,20,.055),0 0 18px rgba(229,9,20,.22)}
          .timelineNode:after{content:"";position:absolute;left:4px;top:4px;width:5px;height:5px;border-radius:50%;background:#e50914}
          .timelineEntry:nth-child(even) .timelineNode{border-color:#596166;box-shadow:0 0 0 5px rgba(255,255,255,.025)}
          .timelineEntry:nth-child(even) .timelineNode:after{background:#596166}
          .timelineCard{min-height:0;padding:22px 24px;background:linear-gradient(145deg,#111314,#090a0b);border:1px solid #252a2d;border-radius:10px;box-shadow:0 18px 48px rgba(0,0,0,.24);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
          .timelineCard:hover{transform:translateX(5px);border-color:#3f292d;box-shadow:0 24px 58px rgba(0,0,0,.32)}
          .timelineMeta{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px;color:#697176;font-size:8px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}
          .timelineMeta strong{color:#e50914;font-variant-numeric:tabular-nums}
          .timelineCard h3{margin:0 0 9px;font-size:clamp(20px,2.2vw,29px);letter-spacing:-.025em}
          .timelineCard p{margin:0;color:#b9c0c3;line-height:1.65}
          .timelineCard .timelineOrder{margin-top:14px;color:#555d62;font-size:8px;letter-spacing:.16em;text-transform:uppercase}
          @media(max-width:760px){
            .timelineGrid:before{left:13px}
            .timelineEntry{padding-left:40px;padding-bottom:20px}
            .timelineNode{left:6px;top:16px;width:14px;height:14px}
            .timelineNode:after{left:4px;top:4px;width:4px;height:4px}
            .timelineCard{padding:18px 17px}
            .timelineMeta{font-size:7px;gap:8px}
            .timelineCard h3{font-size:21px}
          }

          .investigationJourney{
            display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:0;margin:0 0 28px;padding:14px 10px;
            border:1px solid #24292c;background:linear-gradient(180deg,#0d0f10,#090a0b);
            box-shadow:0 18px 50px rgba(0,0,0,.22);overflow:hidden;
          }
          .journeyStep{
            position:relative;min-width:0;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px;
            padding:10px 9px;border:0;border-right:1px solid #1e2224;background:transparent;color:#5d666b;
            text-align:left;cursor:pointer;transition:background .2s ease,color .2s ease,transform .2s ease;
          }
          .journeyStep:last-child{border-right:0}
          .journeyStep:after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:2px;background:transparent;transition:background .2s ease,box-shadow .2s ease}
          .journeyNumber{font-size:8px;font-weight:900;letter-spacing:.12em;color:#444b4f}
          .journeyLabel{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px;font-weight:800;letter-spacing:.07em;text-transform:uppercase}
          .journeyState{font-size:8px;color:#41484c}
          .journeyStep.active{color:#fff;background:rgba(229,9,20,.055)}
          .journeyStep.active:after{background:#e50914;box-shadow:0 0 14px rgba(229,9,20,.45)}
          .journeyStep.active .journeyNumber,.journeyStep.active .journeyState{color:#e50914}
          .journeyStep.completed .journeyState{color:#9ea6aa}
          .journeyStep.locked{opacity:.55;cursor:not-allowed}
          .journeyStep:not(:disabled):hover{background:#121516;color:#d9dddf;transform:translateY(-1px)}
          .dossierCard.selectedHypothesis{border-color:#e50914;box-shadow:0 0 0 1px rgba(229,9,20,.16),0 24px 60px rgba(0,0,0,.34),inset 0 0 40px rgba(229,9,20,.035)}
          .hypothesisBadge{display:inline-flex;align-items:center;gap:7px;margin:0 0 12px;padding:6px 8px;border:1px solid #55262b;background:rgba(229,9,20,.05);color:#e50914;font-size:7px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}
          .hypothesisBadge i{width:5px;height:5px;border-radius:50%;background:#e50914;box-shadow:0 0 10px rgba(229,9,20,.7)}
          @media(max-width:900px){
            .investigationJourney{grid-template-columns:repeat(7,minmax(112px,1fr));overflow-x:auto;scrollbar-width:none}
            .investigationJourney::-webkit-scrollbar{display:none}
          }
          @media(max-width:760px){
            .investigationJourney{margin:0 -2px 20px;padding:9px 7px;border-radius:9px}
            .journeyStep{grid-template-columns:auto 1fr auto;padding:9px 10px}
            .journeyLabel{font-size:8px}.journeyState{font-size:7px}
          }

          .closureMeta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;margin:30px 0 0;border:1px solid #252a2d;background:#252a2d}
          .closureMetaItem{padding:15px 16px;background:#0b0c0d;display:grid;gap:5px}
          .closureMetaItem span{color:#555d62;font-size:7px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
          .closureMetaItem strong{color:#e2e5e6;font-size:12px;letter-spacing:.04em}
          .closureSeal{display:inline-flex;align-items:center;gap:9px;margin-top:22px;padding:9px 12px;border:1px solid #54262b;color:#e50914;background:rgba(229,9,20,.045);font-size:8px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}
          .closureSeal i{width:6px;height:6px;border-radius:50%;background:#e50914;box-shadow:0 0 12px rgba(229,9,20,.65)}
          @media(max-width:760px){
            .closureMeta{grid-template-columns:1fr}
            .closureMetaItem{padding:13px 14px}
          }

          @media(prefers-reduced-motion:reduce){
            .evidenceVisual:after{display:none}
          }
          @media(prefers-reduced-motion:reduce){
            .caseHeroVisual img,.evidenceVisualLine,.messagePulse{animation:none}
          }
        `}</style>

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
                <button className="btn heroBtn" onClick={() => goToSection('Hipótesis')} disabled={busy}>
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
                onClick={() => unlocked && goToSection(section.id)}
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

        <div className="evidenceArea" id="dossier">\n          <div className="dossierRail" aria-hidden="true"><span /></div>
          <div className="investigationJourney" aria-label="Progreso de la investigación">
            {sections.map((section, index) => {
              const unlocked = isTabUnlocked(section.id);
              const active = tab === section.id;
              const completed =
                section.id === 'Evidencias' ? found >= total :
                section.id === 'Pistas' ? narrative.questions.length > 0 :
                section.id === 'Preguntas' ? narrative.theories.length > 0 :
                section.id === 'Teorías' ? narrative.hypotheses.length > 0 :
                section.id === 'Hipótesis' ? narrative.conclusion?.completed === true :
                section.id === 'Timeline' ? status === 'COMPLETED' :
                section.id === 'Cierre' ? narrative.conclusion?.completed === true :
                false;
              return (
                <button
                  key={section.id}
                  className={'journeyStep ' + (active ? 'active ' : '') + (completed ? 'completed ' : '') + (!unlocked ? 'locked' : '')}
                  onClick={() => unlocked && goToSection(section.id)}
                  disabled={!unlocked}
                  aria-current={active ? 'step' : undefined}
                  title={!unlocked ? 'Se desbloquea al avanzar en la investigación' : section.label}
                >
                  <span className="journeyNumber">{section.kicker}</span>
                  <span className="journeyLabel">{section.label}</span>
                  <span className="journeyState">{completed ? '✓' : unlocked ? '●' : '—'}</span>
                </button>
              );
            })}
          </div>

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
                  <article className={`evidence dossierEvidence ${isFound ? 'found' : 'locked'}`} key={e.id}>
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
                <article className="card dossierCard" key={x.id}>
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
                  <article className={`card dossierCard ${selected ? 'found selectedHypothesis' : ''}`} key={x.id}>
                    {selected && <div className="hypothesisBadge"><i aria-hidden="true" /> SELECCIÓN REGISTRADA</div>}
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
            <div className="timelineGrid">
              {narrative.timeline.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((x) => (
                <article className="timelineEntry" key={x.id}>
                  <span className="timelineNode" aria-hidden="true" />
                  <div className="timelineCard">
                    <div className="timelineMeta"><span>{x.code}</span><strong>REGISTRO {String(x.sortOrder).padStart(2, '0')}</strong></div>
                    <h3>{x.label}</h3>
                    <p>{x.description}</p>
                    <p className="timelineOrder">Evento documentado · secuencia {x.sortOrder}</p>
                  </div>
                </article>
              ))}
              {!narrative.timeline.length && <div className="card muted">Todavía no hay eventos suficientes para construir la línea de tiempo.</div>}
            </div>
          )}

          {tab === 'Cierre' && (
            <article className="card conclusion dossierConclusion">
              <p className="eyebrow">CIERRE DEL EXPEDIENTE</p>
              <span className="caseHeroSerial">ARCHIVO FINAL / CONCLUSIÓN</span>
              <h2>{narrative.conclusion?.title || 'La investigación aún no está cerrada'}</h2>
              <p>{narrative.conclusion?.description || 'Sigue reuniendo las piezas y selecciona una hipótesis cuando estés listo.'}</p>
              {narrative.conclusion?.completed && (
                <>
                  <div className="closureSeal"><i aria-hidden="true" /> ARCHIVO VERIFICADO · CIERRE AUTORIZADO</div>
                  <div className="closureMeta" aria-label="Resumen del expediente">
                    <div className="closureMetaItem"><span>Evidencias</span><strong>{found} / {total} descubiertas</strong></div>
                    <div className="closureMetaItem"><span>Hipótesis</span><strong>Selección registrada</strong></div>
                    <div className="closureMetaItem"><span>Estado</span><strong>Expediente cerrado</strong></div>
                  </div>
                </>
              )}
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
