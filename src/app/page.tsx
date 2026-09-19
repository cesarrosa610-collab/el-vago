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

  const featured =
    exps.find((e) => e.code === 'EV-EXP-001') ??
    exps[0];

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

  const readyCount = exps.length;
  const upcomingCards = [
    { title: 'Próximo expediente', text: 'Una nueva investigación está siendo preparada.', label: 'EN PREPARACIÓN' },
    { title: 'Próximo expediente', text: 'Nuevas pistas, nuevos documentos y otra historia por descubrir.', label: 'PRÓXIMAMENTE' },
    { title: 'Próximo expediente', text: 'El archivo continúa creciendo.', label: 'PRÓXIMAMENTE' },
  ];

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
            <small>HISTORIAS REALES. PREGUNTAS SIN RESPUESTA.</small>
          </div>
          <p className="eyebrow">EXPEDIENTES INTERACTIVOS</p>
          <h1>Misterios que tienes que resolver.</h1>
          <p className="lead">
            Casos impactantes. Misterios sin resolver. Historias que te harán ver el mundo de otra forma.
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
              <span>▣ Documental</span>
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
            <h2>Nuevos expedientes</h2>
          </div>
          <Link className="sectionLink" href="/explorar">Ver todos →</Link>
        </div>

        <div className="homeCaseRail">
          <article className="homeCaseCard realCaseCard">
            <div className="homeCaseVisual">
              <img src={featuredArtwork ?? '/exp-001-habitacion.svg'} alt="" loading="lazy" />
            </div>
            <div className="homeCaseBody">
              <span className="tag">EV-EXP-001</span>
              <h3>{featured?.title ?? 'La Habitación 317'}</h3>
              <p>Un hotel. Una desaparición. Un expediente que todavía guarda preguntas.</p>
              <div className="caseMeta"><span>▣ Documental</span><span className="difficulty">▮▮▮ Intermedio</span></div>
            </div>
          </article>

          {upcomingCards.map((card, index) => (
            <article className="homeCaseCard upcomingCase" key={index}>
              <div className={`homeCaseVisual upcomingVisual upcomingVisual${index + 1}`}>
                <span>{index === 0 ? 'ARCHIVO' : index === 1 ? 'EVIDENCIA' : 'INVESTIGACIÓN'}</span>
              </div>
              <div className="homeCaseBody">
                <span className="tag">{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <div className="caseMeta"><span>Contenido en preparación</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="communityBand">
        <div className="communityQuote">
          <span>“</span>
          <p>NO SE TRATA SOLO DE LO QUE PASÓ,<br />SINO DE TODO LO QUE AÚN NO SABEMOS.</p>
          <i />
        </div>
        <div className="communityInvite">
          <p className="eyebrow">ÚNETE A LA COMUNIDAD DE EL VAGO</p>
          <h3>Comparte tus teorías, descubre nuevas perspectivas y sé parte de la investigación.</h3>
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
          <p className="muted">Historias reales. Preguntas sin respuesta.</p>
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
