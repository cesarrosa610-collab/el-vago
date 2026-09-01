import Link from 'next/link';
import GlobalNav from '../GlobalNav';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

export default async function MiVago() {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="wrap homePage">
        <GlobalNav />

        <section className="hero homeHero">
          <p className="eyebrow">MI VAGO</p>

          <h1>Tu investigación, siempre contigo.</h1>

          <p className="lead">
            Inicia sesión para ver tus expedientes, progreso y casos completados.
          </p>

          <Link className="btn" href="/login">
            Entrar
          </Link>
        </section>
      </main>
    );
  }

  const investigations = await prisma.investigation.findMany({
    where: { userId: user.id },
    orderBy: { id: 'asc' },
    include: {
      expediente: {
        include: { evidence: true },
      },
    },
  });

  const completed = investigations.filter(
    (item) => item.status === 'COMPLETED'
  );

  const active = investigations.filter(
    (item) => item.status !== 'COMPLETED'
  );

  return (
    <main className="wrap homePage">
      <GlobalNav />

      <section className="hero homeHero">
        <p className="eyebrow">MI VAGO</p>

        <h1>Tu investigación, siempre contigo.</h1>

        <p className="lead">
          Continúa donde te quedaste y revisa los misterios que ya resolviste.
        </p>
      </section>

      <section className="homeSection">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">EN INVESTIGACIÓN</p>
            <h2>Casos en curso</h2>
          </div>

          <p className="muted">{active.length} activos</p>
        </div>

        {active.length ? (
          <div className="grid">
            {active.map((item) => (
              <article className="card" key={item.id}>
                <div className="exploreCardTop">
                  <span className="tag">{item.expediente.code}</span>
                  <span className="exploreStatus">EN CURSO</span>
                </div>

                <h2>{item.expediente.title}</h2>

                <p className="muted">
                  {item.expediente.description}
                </p>

                <div className="caseMeta">
                  <span>Progreso {Math.round(item.progress)}%</span>
                  <span>{item.expediente.evidence.length} evidencias</span>
                </div>

                <div
                  className="bar"
                  aria-label={`Progreso ${Math.round(item.progress)}%`}
                >
                  <i
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, item.progress)
                      )}%`,
                    }}
                  />
                </div>

                <Link
                  className="btn"
                  href={`/expedientes/${item.expediente.slug}`}
                >
                  Continuar investigación
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="notice exploreEmpty">
            Aún no tienes investigaciones en curso.{' '}
            <Link href="/explorar">Explorar expedientes</Link>
          </div>
        )}
      </section>

      <section className="homeSection">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">HISTORIAL</p>
            <h2>Casos completados</h2>
          </div>

          <p className="muted">
            {completed.length} completados
          </p>
        </div>

        {completed.length ? (
          <div className="grid">
            {completed.map((item) => (
              <article className="card" key={item.id}>
                <div className="exploreCardTop">
                  <span className="tag">{item.expediente.code}</span>
                  <span className="exploreStatus">COMPLETADO</span>
                </div>

                <h2>{item.expediente.title}</h2>

                <p className="muted">
                  Investigación completada.
                </p>

                <Link
                  className="btn secondary"
                  href={`/expedientes/${item.expediente.slug}`}
                >
                  Revisar expediente
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="notice exploreEmpty">
            Tus casos completados aparecerán aquí.
          </div>
        )}
      </section>
    </main>
  );
}
