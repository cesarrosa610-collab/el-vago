import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import GlobalNav from './GlobalNav';

const artwork: Record<string, string> = {
  'EV-EXP-001': '/door-317.jpg',
  'EV-EXP-002': '/exp-002-llamada.svg',
  'EV-EXP-003': '/exp-003-cuarto.svg',
  'EV-EXP-004': '/exp-004-archivo.svg',
};

export default async function Home() {
  const user = await currentUser();
  const exps = await prisma.expediente.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'asc' },
    include: { evidence: true },
  });

  const byCode = (code: string) => exps.find((e) => e.code === code) ?? null;
  const featured = byCode('EV-EXP-001');
  const hrefFor = (code: string) => {
    const e = byCode(code);
    return e ? '/expedientes/' + e.slug : '/explorar';
  };

  const archiveCodes = ['EV-EXP-004', 'EV-EXP-002', 'EV-EXP-003'];
  const archiveItems = archiveCodes.filter((code) => byCode(code));

  return (
    <main id="top" className="v3Page">
      <GlobalNav />

      <section className="v3Hero">
        <div className="v3HeroMedia" aria-hidden="true">
          <img src="/door-317.jpg" alt="" />
          <div className="v3HeroShade" />
          <div className="v3HeroNumber">317</div>
          <div className="v3DoorMark">HABITACIÓN<br /><b>317</b></div>
        </div>

        <div className="v3HeroContent">
          <div className="v3Kicker"><span /> EXPEDIENTES INTERACTIVOS</div>
          <h1>Misterios que<br /><i>tienes que resolver.</i></h1>
          <p>Entra al expediente. Observa las evidencias. Conecta las pistas y descubre lo que realmente ocurrió.</p>
          <div className="v3Actions">
            {featured && <Link href={hrefFor('EV-EXP-001')} className="v3Primary">Comenzar investigación <span>↗</span></Link>}
            <Link href="/explorar" className="v3Secondary">Explorar expedientes</Link>
          </div>
          <div className="v3HeroMeta">
            <span>EXPEDIENTE 001</span><span>INVESTIGACIÓN DOCUMENTAL</span><span>5 EVIDENCIAS</span>
          </div>
        </div>
      </section>

      <section className="v3Intro">
        <div>
          <span className="v3Index">UNIVERSO 001</span>
          <h2>El universo de<br /><i>la historia.</i></h2>
        </div>
        <p>Una investigación documental construida para descubrirse pieza por pieza. Aquí nada está puesto por accidente.</p>
      </section>

      <section className="v3Feature">
        <div className="v3FeatureImage">
          <img src="/door-317.jpg" alt="Puerta de la habitación 317" />
          <span className="v3EvidenceLabel">EVIDENCIA · 001</span>
          <span className="v3Stamp">ARCHIVO EL VAGO</span>
        </div>
        <div className="v3FeatureCopy">
          <span className="v3SmallRed">EV · EXP · 001</span>
          <h3>La Habitación<br /><i>317</i></h3>
          <p>Un hotel. Una desaparición. Evidencias que todavía guardan preguntas.</p>
          <div className="v3Facts">
            <span><b>01</b> Investigación documental</span>
            <span><b>02</b> 5 evidencias</span>
            <span><b>03</b> Nivel intermedio</span>
          </div>
          <Link href={hrefFor('EV-EXP-001')} className="v3TextLink">Abrir expediente <span>→</span></Link>
        </div>
      </section>

      <section className="v3Triad">
        <article className="v3Panel v3PanelDark">
          <span className="v3PanelNo">02 / EVIDENCIAS</span>
          <div className="v3PanelImage"><img src="/exp-004-archivo.svg" alt="" /></div>
          <div><h3>Todo deja<br /><i>una pista.</i></h3><p>Documentos, detalles y fragmentos de la historia aparecen a medida que avanzas.</p></div>
          <Link href={hrefFor('EV-EXP-004')}>Explorar evidencias <span>↗</span></Link>
        </article>
        <article className="v3Panel v3PanelPhoto">
          <span className="v3PanelNo">03 / EXPERIENCIA</span>
          <div className="v3PanelImage"><img src="/exp-002-llamada.svg" alt="" /></div>
          <div><h3>Tú decides<br /><i>qué significa.</i></h3><p>Observa, conecta las piezas y construye tu propia teoría antes del cierre.</p></div>
          <Link href={hrefFor('EV-EXP-002')}>Entrar a la investigación <span>↗</span></Link>
        </article>
        <article className="v3Panel v3PanelArchive">
          <span className="v3PanelNo">04 / ARCHIVO</span>
          <div className="v3ArchiveVisual"><span>EL VAGO</span><strong>ARCHIVO<br />RESTRINGIDO</strong><b>EV-EXP</b></div>
          <div><h3>La verdad<br /><i>también se archiva.</i></h3><p>Casos, documentos y materiales que amplían el universo de cada expediente.</p></div>
          <Link href="/explorar">Ver el archivo <span>↗</span></Link>
        </article>
      </section>

      <section className="v3Cases">
        <div className="v3SectionHead">
          <div><span className="v3Index">ARCHIVO 002 — 004</span><h2>Más historias.<br /><i>Más preguntas.</i></h2></div>
          <Link href="/explorar">Ver todos los expedientes →</Link>
        </div>
        <div className={`v3CaseGrid v3CaseGrid--${archiveItems.length}`}>
          {archiveItems.map((code, i) => {
            const e = byCode(code);
            if (!e) return null;
            return (
              <Link className="v3Case" href={hrefFor(code)} key={code}>
                <div className="v3CaseMedia"><img src={artwork[code]} alt="" /><span>EXPEDIENTE / 00{i + 2}</span><b>ABRIR ↗</b></div>
                <div className="v3CaseBody"><h3>{e.title}</h3><p>{i === 0 ? 'Una puerta. Una habitación. Una cronología que no coincide.' : i === 1 ? 'Una llamada apareció donde no debía.' : 'La última pista desapareció antes de ser archivada.'}</p></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="v3Community">
        <div className="v3CommunityImage"><div className="v3RedGlow" /><div className="v3Silhouette" /></div>
        <div className="v3CommunityCopy">
          <span className="v3SmallRed">COMUNIDAD EL VAGO</span>
          <blockquote>“No se trata solo de lo que ves,<br /><i>sino de todo lo que aún no sabes.</i>”</blockquote>
          <p>Comparte tus teorías, conecta las pistas y entra en el universo de El Vago.</p>
          <Link href="/comunidad" className="v3Primary">Entrar a la comunidad <span>↗</span></Link>
        </div>
      </section>

      <section className="v3Premium">
        <span className="v3Index">EL VAGO / PREMIUM</span>
        <h2>El archivo<br /><i>continúa.</i></h2>
        <p>Nuevos expedientes, historias más profundas y materiales exclusivos para quienes quieren seguir investigando.</p>
        <Link href="/mi-vago">Descubrir Mi Vago →</Link>
      </section>

      <footer className="v3Footer">
        <div><strong>EL VAGO</strong><span>Historias reales · Misterios · Formato documental</span><small>© 2026 El Vago</small></div>
        <nav><Link href="/explorar">Explorar</Link><Link href="/multimedia">Multimedia</Link><Link href="/comunidad">Comunidad</Link><Link href="/mi-vago">Mi Vago</Link></nav>
      </footer>
    </main>
  );
}
