'use client';
import { useEffect, useMemo, useState } from 'react';

type Evidence={id:string;code:string;title:string;description:string;unlockAfter:number};
type Narrative={clues:any[];questions:any[];theories:any[];hypotheses:any[];timeline:any[];conclusion?:{title:string|null;description:string|null;selectedHypothesisId:string|null;completed:boolean}};
type Props={expediente:{id:string;code:string;title:string;description:string;conclusionTitle?:string|null;conclusion?:string|null;evidence:Evidence[]};initialProgress:number;initialStatus:string;discoveredIds:string[]};

export default function InvestigationClient({expediente,initialProgress,initialStatus,discoveredIds}:Props){
 const [ids,setIds]=useState(discoveredIds),[progress,setProgress]=useState(initialProgress),[status,setStatus]=useState(initialStatus),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [tab,setTab]=useState('Evidencias');
 const [narrative,setNarrative]=useState<Narrative>({clues:[],questions:[],theories:[],hypotheses:[],timeline:[]});
 const discovered=useMemo(()=>new Set(ids),[ids]);
 const visible=expediente.evidence.filter(e=>e.unlockAfter<=ids.length);
 const refreshNarrative=async()=>{const r=await fetch(`/api/expedientes/${expediente.id}/narrative`);if(r.ok)setNarrative(await r.json())};
 useEffect(()=>{if(status!=='NOT_STARTED') refreshNarrative()},[status,ids.length]);
 async function start(){setBusy(true);setMessage('');const r=await fetch(`/api/expedientes/${expediente.id}/start`,{method:'POST'});const j=await r.json();if(r.ok){setProgress(j.progress);setStatus(j.status);setMessage('Expediente abierto. La investigación comienza ahora.')}else setMessage(j.error||'No se pudo iniciar');setBusy(false)}
 async function discover(e:Evidence){setBusy(true);setMessage('');const r=await fetch(`/api/expedientes/${expediente.id}/evidence/${e.id}/discover`,{method:'POST'});const j=await r.json();if(r.ok){setIds(j.discoveredIds);setProgress(j.progress);setStatus(j.status);setMessage(j.newlyDiscovered?'Hallazgo registrado. Una nueva conexión puede haberse abierto.':'Esta evidencia ya estaba en tu expediente.')}else setMessage(j.error||'No se pudo descubrir');setBusy(false)}
 async function chooseHypothesis(id:string){setBusy(true);const r=await fetch(`/api/expedientes/${expediente.id}/hypothesis/select`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({hypothesisId:id})});const j=await r.json();if(r.ok){setMessage('Hipótesis registrada. Tu teoría ha quedado incorporada al expediente.');await refreshNarrative();}
 const nav=['Evidencias','Pistas','Preguntas','Teorías','Hipótesis','Timeline','Cierre'];

const isTabUnlocked=(x:string)=>{
  if(x==='Evidencias') return true;
  if(x==='Pistas') return narrative.clues.length>0;
  if(x==='Preguntas') return narrative.questions.length>0;
  if(x==='Teorías') return narrative.theories.length>0;
  if(x==='Hipótesis') return narrative.hypotheses.length>0;
  if(x==='Timeline') return narrative.timeline.length>0;
  if(x==='Cierre') return narrative.conclusion?.completed===true;
  return false;
};
 return <main className="casePage"><header className="caseHero"><div className="nav"><a className="brand" href="/">EL VAGO</a><span className="caseCode">{expediente.code}</span></div><p className="eyebrow">EXPEDIENTE · INVESTIGACIÓN</p><h1>{expediente.title}</h1><p className="lead">{expediente.description}</p><div className="caseMeta"><span>Investigación {Math.round(progress)}%</span><span>{status==='COMPLETED'?'Caso cerrado':'Hay piezas que todavía no encajan'}</span></div><div className="bar"><i style={{width:`${progress}%`}}/></div>{status==='NOT_STARTED'&&<button className="btn heroBtn" onClick={start} disabled={busy}>{busy?'Abriendo expediente…':'Comenzar investigación'}</button>}</header>
<section className="investigation"><aside className="caseNav"><div className="sideTitle">ARCHIVO</div>{nav.map(x=>{
  const unlocked=isTabUnlocked(x);
  return (
    <button
      key={x}
      className={tab===x?'active':''}
      onClick={()=>unlocked&&setTab(x)}
      disabled={!unlocked}
      title={!unlocked?'Completa más hallazgos para desbloquear esta sección':undefined}
    >
      {x}
      {!unlocked&&' 🔒'}
    </button>
  );
})}</aside><div className="evidenceArea">
 {tab==='Evidencias'&&<div className="evidenceGrid">{visible.map(e=>{const found=discovered.has(e.id);return <article className={`evidence ${found?'found':'locked'}`} key={e.id}><div className="evidenceTop"><span>{e.code}</span><span>{found?'DESCUBIERTA':'PENDIENTE'}</span></div><h3>{e.title}</h3>{found?<><p>{e.description}</p><div className="foundMark">✓ Hallazgo registrado</div></>:<><p className="redacted">Información pendiente de descubrimiento.</p><button className="btn" onClick={()=>discover(e)} disabled={busy}>Investigar evidencia</button></>}</article>})}</div>}
 {tab==='Pistas'&&<div className="narrativeGrid">{narrative.clues.map(x=><article className="card" key={x.id}><span className="tag">{x.code}</span><h3>{x.title}</h3><p>{x.description}</p></article>)}{!narrative.clues.length&&<div className="card muted">Todavía no hay conexiones suficientes. Sigue investigando.</div>}</div>}
 {tab==='Preguntas'&&<div className="narrativeGrid">{narrative.questions.map(x=><article className="card" key={x.id}><span className="tag">{x.code}</span><h3>{x.text}</h3><p className="muted">No busques la respuesta todavía. Busca la pieza que falta.</p></article>)}</div>}
 {tab==='Teorías'&&<div className="narrativeGrid">{narrative.theories.map(x=><article className="card" key={x.id}><span className="tag">{x.code}</span><h3>{x.title}</h3><p>{x.description}</p></article>)}</div>}
 {tab==='Hipótesis'&&<div className="narrativeGrid">{narrative.hypotheses.map(x=><article className="card" key={x.id}><span className="tag">{x.code}</span><h3>{x.title}</h3><p>{x.description}</p><button className="btn" onClick={()=>chooseHypothesis(x.id)} disabled={busy}>Elegir esta hipótesis</button></article>)}</div>}
 {tab==='Timeline'&&<div className="timeline">{narrative.timeline.map(x=><article className="timelineItem" key={x.id}><span>{x.label}</span><div><b>{x.code}</b><p>{x.description}</p></div></article>)}</div>}
 {tab==='Cierre'&&<article className="card conclusion"><p className="eyebrow">CIERRE DEL EXPEDIENTE</p><h2>{narrative.conclusion?.title || 'La investigación aún no está cerrada'}</h2><p>{narrative.conclusion?.description || 'Sigue reuniendo las piezas y selecciona una hipótesis cuando estés listo.'}</p>{narrative.conclusion?.completed&&<div className="foundMark">✓ Investigación completada</div>}</article>}
 </div></section></main>
}
