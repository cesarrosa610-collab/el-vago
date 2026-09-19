import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import GlobalNav from './GlobalNav';

export default async function Home() {
  const user = await currentUser();

  const activeInvestigation = user
    ? await prisma.investigation.findFirst({
        where: {
          userId: user.id,
          status: { not: 'COMPLETED' },
        },
        include: {
          expediente: true,
        },
        orderBy: {
          id: 'asc',
        },
      })
    : null;

  const exps = await prisma.expediente.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'asc' },
    include: { evidence: true },
  });

  const featured = exps[0];

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

  const others = exps.slice(1);

  return (
    <main className="wrap homePage">
      <GlobalNav />

      <section className="hero homeHero">
        <div className="homeHeroBackdrop" aria-hidden="true">
          <img src="/hero-puerta-317.svg" alt="" />
          <span className="heroScanline" />
        </div>

        <div className="homeHeroCopy">
          <p className="eyebrow">EXPEDIENTES INTERACTIVOS</p>

          <h1>Misterios que tienes que resolver.</h1>

        <p className="lead">
          Investiga, conecta evidencias y descubre la verdad.
        </p>
        </div>
      </section>

      {user && activeInvestigation ? (
        <section className="homeSection">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">TU INVESTIGACIÓN</p>
              <h2>Continúa donde te quedaste.</h2>
            </div>

            <p className="muted">
              {Math.round(activeInvestigation.progress)}% completado
            </p>
          </div>

          <div className="card">
            <span className="tag">
              {activeInvestigation.expediente.code}
            </span>

            <h2>{activeInvestigation.expediente.title}</h2>

            <p className="muted">
              Sigue investigando para descubrir la verdad.
            </p>

            <div
              className="bar"
              aria-label={`Progreso ${Math.round(
                activeInvestigation.progress
              )}%`}
            >
              <i
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, activeInvestigation.progress)
                  )}%`,
                }}
              />
            </div>

            <Link
              className="btn"
              href={`/expedientes/${activeInvestigation.expediente.slug}`}
            >
              Continuar investigación
            </Link>
          </div>
        </section>
      ) : user ? (
        <section className="homeSection">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">MI VAGO</p>
              <h2>Comienza tu primera investigación.</h2>
            </div>
          </div>

          <div className="notice exploreEmpty">
            Elige un expediente para comenzar tu primera investigación.{' '}
            <Link href="/explorar">Explorar expedientes</Link>
          </div>
        </section>
      ) : null}

      {featured && (
        <section className="featuredCase">
          <div className="featuredCopy">
            <p className="eyebrow">EXPEDIENTE DESTACADO</p>

            <span className="tag">{featured.code}</span>

            <h2>{featured.title}</h2>

            <p className="lead">{featured.description}</p>

            <div className="caseMeta">
              <span>{featured.evidence.length === 1 ? '1 evidencia' : featured.evidence.length + ' evidencias'}</span>
              <span>Investigación interactiva</span>
            </div>

            <Link
              className="btn heroBtn"
              href={`/expedientes/${featured.slug}`}
            >
              {featuredInvestigation?.status === 'COMPLETED'
                ? 'Revisar expediente'
                : featuredInvestigation
                  ? 'Continuar investigación'
                  : 'Comenzar investigación'}
            </Link>
          </div>

          <div className="featuredVisual" aria-hidden="true">
            <img className="featuredArtwork" src="/exp-001-habitacion.svg" alt="" />
            <div className="sceneGrid" />
            <div className="sceneNoise" />
            <div className="featuredGlow" />
            <div className="evidenceCard evidenceCardPhone">
              <span>REGISTRO</span>
              <b>03:17</b>
              <small>LLAMADA ENTRANTE</small>
            </div>
            <div className="evidenceCard evidenceCardFile">
              <span>EXP-002</span>
              <b>SEÑAL</b>
              <i /><i /><i />
            </div>
            <div className="sceneScan" />
            <div className="sceneStamp">EVIDENCIA / 002</div>
          </div>
        </section>
      )}

      <section className="homeSection visualArchive">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">CATÁLOGO</p>
            <h2>Más misterios por resolver</h2>
          </div>

          <p className="muted">
            Elige un expediente y sigue las pistas.
          </p>
        </div>

        <div className="catalogIntroVisual" aria-hidden="true">
          <img src="/archivo-visual.svg" alt="" />
        </div>

        <div className="grid">
          {(others.length ? others : exps).map((e) => (
            <div className="card" key={e.id}>
              <span className="tag">{e.code}</span>

              <h2>{e.title}</h2>

              <p className="muted">{e.description}</p>

              <p className="muted">
                {e.evidence.length === 1 ? '1 evidencia' : e.evidence.length + ' evidencias'}
              </p>

              <Link
                className="btn"
                href={`/expedientes/${e.slug}`}
              >
                Investigar
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="premiumTeaser">
        <div>
          <p className="eyebrow">EL VAGO PREMIUM</p>

          <h2>Casos más profundos. Nuevas historias.</h2>

          <p className="muted">
            Una experiencia de investigación pensada para quedarse.
          </p>
        </div>

        <span className="premiumBadge">PRÓXIMAMENTE</span>
      </section>

      <footer className="siteFooter">
        <div>
          <span className="footerBrand">EL VAGO</span>
          <p className="muted">Misterios que tienes que resolver.</p>
        </div>
        <div className="footerLinks">
          <Link href="/">Inicio</Link>
          <Link href="/explorar">Explorar</Link>
          <Link href="/multimedia">Multimedia</Link>
          <Link href="/comunidad">Comunidad</Link>
        </div>
        <span className="muted footerCopy">© {new Date().getFullYear()} El Vago</span>
      </footer>
    </main>
  );
}
