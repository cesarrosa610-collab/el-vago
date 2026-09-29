import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import GlobalNav from './GlobalNav';

const artwork: Record<string,string> = {
  'EV-EXP-001':'/door-317.jpg',
  'EV-EXP-002':'/exp-002-llamada.svg',
  'EV-EXP-003':'/exp-003-cuarto.svg',
  'EV-EXP-004':'/exp-004-archivo.svg',
  'EV-EXP-006':'/exp-006-habitacion.svg',
};

export default async function Home(){
  const user=await currentUser();
  const exps=await prisma.expediente.findMany({
    where:{status:'PUBLISHED'}, orderBy:{createdAt:'asc'}, include:{evidence:true}
  });
  const byCode=(code:string)=>exps.find(e=>e.code===code)??null;
  const featured=byCode('EV-EXP-001');
  const hrefFor=(code:string)=>{const e=byCode(code);return e?'/expedientes/'+e.slug:'/explorar';};

  return <main className="wrap homePage">
    <GlobalNav />

    {/* HERO — BLOQUE VISUAL CONSERVADO */}
    <section className="preservedHero">
      <div className="preservedHeroBg" />
      <div className="preservedHeroCopy">
        <p className="preservedEyebrow">— &nbsp;EXPEDIENTES INTERACTIVOS</p>
        <h1>Misterios<br/>que <em>tienes</em><br/><em>que resolver.</em></h1>
        <p className="preservedSub">Entra al expediente. Observa las evidencias.<br/>Conecta las pistas y descubre lo que realmente ocurrió.</p>
        <div className="preservedActions">
          {featured && <Link className="preservedPrimary" href={hrefFor('EV-EXP-001')}>→ &nbsp; Comenzar investigación</Link>}
          <Link className="preservedSecondary" href="/explorar">Explorar expedientes</Link>
        </div>
        <div className="preservedDots"><b/><i/><i/><i/><i/></div>
      </div>
    </section>

    {/* EVIDENCIA + INVESTIGACIÓN */}
    <section className="storyModules">
      <Link className="storyModule" href={hrefFor('EV-EXP-004')}>
        <div className="storyVisual archiveVisual"><img src={artwork['EV-EXP-004']} alt=""/></div>
        <div className="storyBody"><p>EVIDENCIAS</p><h2>Todo deja una pista.</h2><span>Documentos, detalles y fragmentos de la historia aparecen a medida que avanzas.</span></div>
      </Link>
      <Link className="storyModule" href={hrefFor('EV-EXP-002')}>
        <div className="storyVisual callVisual"><img src={artwork['EV-EXP-002']} alt=""/></div>
        <div className="storyBody"><p>EXPERIENCIA</p><h2>Tú decides qué significa.</h2><span>Observa, conecta las piezas y construye tu propia teoría antes del cierre.</span></div>
      </Link>
    </section>

    {/* UNIVERSO PRINCIPAL */}
    <section className="universeSection">
      <div className="universeHead">
        <p>— &nbsp;EXPEDIENTE PRINCIPAL</p>
        <h2>El universo de la historia</h2>
        <span>Una investigación que se descubre pieza por pieza.</span>
      </div>
      <Link className="universeCard" href={hrefFor('EV-EXP-001')}>
        <div className="universeInfo">
          <small>EXPEDIENTE / 001</small>
          <h3>La Habitación 317</h3>
          <p>Un hotel. Una desaparición. Una historia que todavía guarda preguntas.</p>
          <strong>ENTRAR AL EXPEDIENTE →</strong>
        </div>
        <div className="universeImage"><img src={artwork['EV-EXP-001']} alt=""/></div>
      </Link>
    </section>

    {/* CASOS */}
    <section className="caseSection">
      <div className="sectionKicker">— &nbsp;MÁS EXPEDIENTES</div>
      <div className="caseHeading"><h2>Historias que todavía<br/><em>no tienen una sola respuesta.</em></h2><Link href="/explorar">Ver todos →</Link></div>
      <div className="caseGrid">
        {['EV-EXP-001','EV-EXP-002','EV-EXP-003'].map((code,i)=>{
          const e=byCode(code); if(!e) return null;
          return <Link className="caseCard" href={hrefFor(code)} key={code}>
            <div className="caseCardImage"><img src={artwork[code]} alt=""/></div>
            <div className="caseCardBody"><small>EXPEDIENTE / 00{i+1}</small><h3>{e.title}</h3><p>{i===0?'Una puerta. Una habitación. Una cronología que no coincide.':i===1?'Una llamada apareció donde no debía.':'La última pista desapareció antes de ser archivada.'}</p><b>ABRIR EXPEDIENTE →</b></div>
          </Link>
        })}
      </div>
    </section>

    {/* COMUNIDAD */}
    <section className="communityFinal">
      <div className="communityQuote">“NO SE TRATA SOLO DE LO QUE VES,<br/>SINO DE TODO LO QUE AÚN NO SABES.”</div>
      <div className="communityRule"/>
      <p>— &nbsp;ÚNETE A LA COMUNIDAD DE EL VAGO</p>
      <h2>Comparte tus teorías, conecta las pistas y<br/>entra en el universo de El Vago.</h2>
      <Link href="/comunidad">Entrar a la comunidad</Link>
    </section>

    {/* PREMIUM */}
    <section className="premiumFinal">
      <p>— &nbsp;EL VAGO PREMIUM</p>
      <h2>Casos más profundos.<br/>Nuevas historias.</h2>
      <span>La experiencia crecerá contigo a medida que el archivo de El Vago se expanda.</span>
      <strong>PRÓXIMAMENTE</strong>
    </section>

    <footer className="finalFooter">
      <div><strong>EL VAGO</strong><span>Historias reales. Preguntas abiertas. Tu propia teoría.</span><small>© {new Date().getFullYear()} El Vago</small></div>
      <nav><Link href="/explorar">EXPEDIENTES</Link><Link href="/multimedia">MULTIMEDIA</Link><Link href="/comunidad">COMUNIDAD</Link><Link href="/mi-vago">MI VAGO</Link></nav>
    </footer>
  </main>;
}
