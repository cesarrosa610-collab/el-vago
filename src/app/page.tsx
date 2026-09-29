import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import GlobalNav from './GlobalNav';

const artwork: Record<string, string> = {
  'EV-EXP-001': '/door-317.jpg',
  'EV-EXP-002': '/exp-002-llamada.svg',
  'EV-EXP-003': '/exp-003-cuarto.svg',
  'EV-EXP-004': '/exp-004-archivo.svg',
  'EV-EXP-006': '/exp-006-habitacion.svg',
};

export default async function Home() {
  const user = await currentUser();

  const activeInvestigation = user
    ? await prisma.investigation.findFirst({
        where: { userId: user.id, status: { not: 'COMPLETED' }, expediente: { status: 'PUBLISHED' } },
        include: { expediente: true },
        orderBy: { id: 'asc' },
      })
    : null;

  const exps = await prisma.expediente.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'asc' },
    include: { evidence: true },
  });

  const byCode = (code: string) => exps.find((e) => e.code === code) ?? null;
  const featured = byCode('EV-EXP-001');
  const callCase = byCode('EV-EXP-002');
  const lastRecord = byCode('EV-EXP-003');

  const hrefFor = (code: string) => {
    const item = byCode(code);
    return item ? `/expedientes/${item.slug}` : '/explorar';
  };

  return (
    <main className="wrap homePage">
      <GlobalNav />

      <section className="masterHero">
        <div className="masterHeroGlow" aria-hidden="true" />
        <div className="masterHeroCopy">
          <p className="masterEyebrow">EXPEDIENTE #001&nbsp; • &nbsp;CASO ABIERTO</p>
          <h1>LA HABITACIÓN 317</h1>
          <p className="masterHeroSub">Una puerta. Una habitación. Una noche que nadie logra explicar.</p>
          <div className="masterHeroActions">
            {featured && (
              <Link className="masterPrimary" href={`/expedientes/${featured.slug}`}>
                ABRIR EXPEDIENTE
              </Link>
            )}
            <Link className="masterSecondary" href={`/explorar`}>Ver las pistas →</Link>
          </div>
          <p className="masterMeta">MISTERIO&nbsp; / &nbsp;INVESTIGACIÓN&nbsp; / &nbsp;08:42 MIN</p>
          <div className="masterDivider" />
        </div>

        <div className="masterDoor" aria-hidden="true">
          <div className="masterDoorFrame">
            <div className="masterDoorImage">
              <img src="/door-317.jpg" alt="" />
              <span className="masterDoorNumber">317</span>
              <span className="masterDoorHandle" />
            </div>
          </div>
        </div>
      </section>

      {user && activeInvestigation ? (
        <section className="masterContinue">
          <span>CONTINÚA TU INVESTIGACIÓN</span>
          <strong>{activeInvestigation.expediente.title}</strong>
          <em>{Math.round(activeInvestigation.progress)}% completado</em>
          <Link href={`/expedientes/${activeInvestigation.expediente.slug}`}>Continuar →</Link>
        </section>
      ) : null}

      <section className="masterCases">
        <div className="masterSectionHead">
          <div>
            <h2>EXPEDIENTES DESTACADOS</h2>
            <p>Casos documentados para explorar, conectar pistas y formar tu propia teoría.</p>
          </div>
        </div>

        <div className="masterCaseGrid">
          <Link className="masterCase" href={hrefFor('EV-EXP-001')}>
            <div className="masterCaseImage">
              <img src={artwork['EV-EXP-001']} alt="" />
              <span className="masterImageLight" />
              <span className="masterImageShadow" />
            </div>
            <div className="masterCaseBody">
              <span className="masterCaseNo">001</span>
              <h3>LA HABITACIÓN 317</h3>
              <p>Una puerta cerrada y una cronología que no coincide.</p>
              <div><b>MISTERIO</b><span>ABRIR →</span></div>
            </div>
          </Link>

          <Link className="masterCase" href={hrefFor('EV-EXP-002')}>
            <div className="masterCaseImage">
              <img src={artwork['EV-EXP-002']} alt="" />
              <span className="masterImageLight" />
              <span className="masterImageShadow" />
            </div>
            <div className="masterCaseBody">
              <span className="masterCaseNo">002</span>
              <h3>LA LLAMADA DE LAS 03:17</h3>
              <p>Una grabación que apareció donde no debía.</p>
              <div><b>INEXPLICABLE</b><span>ABRIR →</span></div>
            </div>
          </Link>

          <Link className="masterCase" href={hrefFor('EV-EXP-003')}>
            <div className="masterCaseImage">
              <img src={artwork['EV-EXP-003']} alt="" />
              <span className="masterImageLight" />
              <span className="masterImageShadow" />
            </div>
            <div className="masterCaseBody">
              <span className="masterCaseNo">003</span>
              <h3>EL ÚLTIMO REGISTRO</h3>
              <p>La última pista desapareció antes de ser archivada.</p>
              <div><b>INVESTIGACIÓN</b><span>ABRIR →</span></div>
            </div>
          </Link>
        </div>
      </section>

      <section className="masterNarrative">
        <div className="masterNarrativeCopy">
          <p>NO SOLO MIRAS. INVESTIGAS.</p>
          <h2>Cada pista cambia lo que creías saber.</h2>
          <span>Desbloquea testimonios, conecta evidencias, revisa la línea de tiempo y construye hipótesis antes de descubrir el expediente completo.</span>
        </div>
        <div className="masterPills" aria-label="Elementos de investigación">
          <span>PISTAS</span>
          <span>PREGUNTAS</span>
          <span>TEORÍAS</span>
          <span>TIMELINE</span>
        </div>
      </section>

      <section className="masterEntry">
        <h2>MÁS FORMAS DE ENTRAR AL VAGO</h2>
        <div className="masterEntryGrid">
          <Link href="/multimedia" className="masterEntryCard">
            <h3>MULTIMEDIA</h3>
            <p>Videos, audios y fragmentos para ampliar cada historia.</p>
            <b>EXPLORAR →</b>
          </Link>
          <Link href="/comunidad" className="masterEntryCard">
            <h3>COMUNIDAD</h3>
            <p>Comparte teorías, conecta pistas y descubre otras perspectivas.</p>
            <b>EXPLORAR →</b>
          </Link>
          <Link href="/mi-vago" className="masterEntryCard">
            <h3>MI VAGO</h3>
            <p>Tu progreso, expedientes guardados y actividad reciente.</p>
            <b>EXPLORAR →</b>
          </Link>
        </div>
      </section>

      <footer className="masterFooter">
        <div>
          <strong>EL VAGO</strong>
          <p>Historias reales. Preguntas abiertas. Tu propia teoría.</p>
          <small>© {new Date().getFullYear()} El Vago</small>
        </div>
        <nav>
          <Link href="/explorar">EXPLORE</Link>
          <Link href="/explorar">EXPEDIENTES</Link>
          <Link href="/multimedia">MULTIMEDIA</Link>
          <Link href="/comunidad">COMUNIDAD</Link>
          <Link href="/mi-vago">PREMIUM</Link>
        </nav>
      </footer>
    </main>
  );
}
