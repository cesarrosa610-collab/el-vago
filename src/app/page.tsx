import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import GlobalNav from './GlobalNav';

const artwork: Record<string, string> = {
  'EV-EXP-001': '/exp-001-habitacion.svg',
  'EV-EXP-002': '/exp-002-llamada.svg',
  'EV-EXP-003': '/exp-003-cuarto.svg',
  'EV-EXP-004': '/exp-004-archivo.svg',
  'EV-EXP-006': '/exp-006-habitacion.svg',
};

export default async function Home() {
  const user = await currentUser();

  const activeInvestigation = user
    ? await prisma.investigation.findFirst({
        where: { userId: user.id, status: { not: 'COMPLETED' } },
        include: { expediente: true },
        orderBy: { id: 'asc' },
      })
    : null;

  const exps = await prisma.expediente.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'asc' },
    include: { evidence: true },
  });

  const featured = exps.find((e) => e.code === 'EV-EXP-001') ?? null;

  const featuredInvestigation =
    user && featured
      ? await prisma.investigation.findUnique({
          where: {
            userId_expedienteId: {
              userId: user.id,
              expedienteId: featured.id,
            },
          },
        })
      : null;

  const featuredArtwork = featured ? artwork[featured.code] ?? '/exp-001-habitacion.svg' : null;

  return (
    <main className="wrap homePage">
      <GlobalNav />

      <section className="hero homeHero">
        <div className="homeHeroBackdrop" aria-hidden="true">
          <img src="/hero-puerta-317.svg" alt="" />
          <span className="heroScanline" />
        </div>

        <div className="homeHeroCopy">
          <div className="homeBrandLockup">
            <span className="homeBrand">EL VAG<span>O</span></span>
            <small>HISTORIAS DE FICCIÓN. PREGUNTAS SIN RESPUESTA.</small>
          </div>
          <p className="eyebrow">EXPEDIENTES INTERACTIVOS</p>
          <h1>Misterios que tienes que resolver.</h1>
          <p className="lead">
            Una historia de ficción. Una habitación. Preguntas que no dejan de aparecer.
          </p>
          <div className="homeHeroActions">
            {featured && (
              <Link className="btn heroPrimary" href={`/expedientes/${featured.slug}`}>
                <span aria-hidden="true">▶</span> Ver ahora
              </Link>
            )}
            <Link className="btn secondary heroSecondary" href="/explorar">
              Explorar casos
            </Link>
          </div>
          <div className="heroDots" aria-hidden="true">
            <i className="active" /><i /><i /><i /><i />
          </div>
        </div>
      </section>

      {user && activeInvestigation ? (
        <section className="homeSection continueInvestigation">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">TU INVESTIGACIÓN</p>
              <h2>Continúa donde te quedaste.</h2>
            </div>
            <p className="muted">{Math.round(activeInvestigation.progress)}% completado</p>
          </div>
          <div className="card continueCard">
            <span className="tag">{activeInvestigation.expediente.code}</span>
            <h2>{activeInvestigation.expediente.title}</h2>
            <p className="muted">Sigue investigando para descubrir la verdad.</p>
            <div className="bar" aria-label={`Progreso ${Math.round(activeInvestigation.progress)}%`}>
              <i style={{ width: `${Math.min(100, Math.max(0, activeInvestigation.progress))}%` }} />
            </div>
            <Link className="btn" href={`/expedientes/${activeInvestigation.expediente.slug}`}>
              Continuar investigación
            </Link>
          </div>
        </section>
      ) : null}

      {featured && featuredArtwork && (
        <section className="featuredCase">
          <div className="featuredCopy">
            <p className="eyebrow">EXPEDIENTE PRINCIPAL</p>
            <span className="featuredBadge">DESTACADO</span>
            <h2>{featured.title}</h2>
            <p className="lead">Un hotel. Una desaparición. Más preguntas que respuestas.</p>
            <div className="caseMeta">
              <span>▣ Ficción interactiva</span>
              <span>6 capítulos</span>
              <span className="difficulty">▮▮▮ Intermedio</span>
            </div>
            <Link className="btn heroBtn" href={`/expedientes/${featured.slug}`}>
              {featuredInvestigation?.status === 'COMPLETED'
                ? 'Revisar expediente'
                : featuredInvestigation
                  ? 'Continuar investigación'
                  : 'Comenzar investigación'}
            </Link>
          </div>

          <div className="featuredVisual" aria-hidden="true">
            <img className="featuredArtwork" src={featuredArtwork} alt="" />
            <div className="sceneGrid" />
            <div className="sceneNoise" />
            <div className="featuredGlow" />
            <div className="featuredDoorMark">317</div>
            <div className="sceneStamp">EXPEDIENTE / 001</div>
          </div>
        </section>
      )}

      <section className="homeSection visualArchive">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">CATÁLOGO</p>
            <h2>El universo de la historia</h2>
          </div>
          <Link className="sectionLink" href="/explorar">Entrar al expediente →</Link>
        </div>

        <div className="homeCaseRail cinematicRail">
          <article className="homeCaseCard realCaseCard cinematicCaseCard">
            <div className="homeCaseVisual cinematicVisual">
              <img src={featuredArtwork ?? '/exp-001-habitacion.svg'} alt="" loading="lazy" />
              <span className="visualVignette" />
              <span className="visualCode">317</span>
            </div>
            <div className="homeCaseBody">
              <span className="tag">EV-EXP-001</span>
              <h3>{featured?.title ?? 'La Habitación 317'}</h3>
              <p>Un hotel. Una desaparición. Un expediente de ficción que todavía guarda preguntas.</p>
              <div className="caseMeta"><span>▣ Ficción interactiva</span><span>6 capítulos</span><span className="difficulty">▮▮▮ Intermedio</span></div>
            </div>
          </article>

          <article className="homeCaseCard atmosphereCard">
            <div className="homeCaseVisual atmosphereVisual">
              <img src="/archivo-visual.svg" alt="" loading="lazy" />
              <span className="visualLabel">ARCHIVO</span>
            </div>
            <div className="homeCaseBody">
              <span className="tag">EVIDENCIAS</span>
              <h3>Todo deja una pista.</h3>
              <p>Documentos, detalles y fragmentos de la historia aparecen a medida que avanzas.</p>
            </div>
          </article>

          <article className="homeCaseCard atmosphereCard">
            <div className="homeCaseVisual atmosphereVisual">
              <img src="/hero-investigacion.svg" alt="" loading="lazy" />
              <span className="visualLabel">INVESTIGACIÓN</span>
            </div>
            <div className="homeCaseBody">
              <span className="tag">EXPERIENCIA</span>
              <h3>Tú decides qué significa.</h3>
              <p>Observa, conecta las piezas y construye tu propia teoría antes del cierre.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="communityBand">
        <div className="communityQuote">
          <span>“</span>
          <p>NO SE TRATA SOLO DE LO QUE VES,<br />SINO DE TODO LO QUE AÚN NO SABES.</p>
          <i />
        </div>
        <div className="communityInvite">
          <p className="eyebrow">ÚNETE A LA COMUNIDAD DE EL VAGO</p>
          <h3>Comparte tus teorías, conecta las pistas y entra en el universo de El Vago.</h3>
          <Link className="btn secondary" href="/comunidad">Entrar a la comunidad</Link>
        </div>
      </section>

      <section className="premiumTeaser">
        <div>
          <p className="eyebrow">EL VAGO PREMIUM</p>
          <h2>Casos más profundos. Nuevas historias.</h2>
          <p className="muted">La experiencia crecerá contigo a medida que el archivo de El Vago se expanda.</p>
        </div>
        <span className="premiumBadge">PRÓXIMAMENTE</span>
      </section>

      <footer className="siteFooter">
        <div>
          <span className="footerBrand">EL VAGO</span>
          <p className="muted">Historias de ficción. Preguntas sin respuesta.</p>
        </div>
        <div className="footerLinks">
          <Link href="/">Inicio</Link>
          <Link href="/explorar">Expedientes</Link>
          <Link href="/multimedia">Multimedia</Link>
          <Link href="/comunidad">Comunidad</Link>
          <Link href="/mi-vago">Mi Vago</Link>
        </div>
        <span className="muted footerCopy">© {new Date().getFullYear()} El Vago</span>
      </footer>
    </main>
  );
}
