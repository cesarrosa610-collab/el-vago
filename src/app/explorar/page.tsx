import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import GlobalNav from '../GlobalNav';

const exploreArtwork: Record<string, string> = {
  'EV-EXP-001': '/exp-001-habitacion.svg',
  'EV-EXP-002': '/exp-002-llamada.svg',
  'EV-EXP-003': '/exp-003-cuarto.svg',
  'EV-EXP-004': '/exp-004-archivo.svg',
  'EV-EXP-006': '/exp-006-habitacion.svg',
};

export default async function Explorar({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? '';

  const exps = await prisma.expediente.findMany({
    where: {
      status: 'PUBLISHED',
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { description: { contains: q } },
              { code: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'asc' },
  });

  const evidenceCounts = await Promise.all(
    exps.map((e) =>
      prisma.evidence.count({
        where: { expedienteId: e.id, status: 'PUBLISHED' },
      })
    )
  );

  return (
    <main className="wrap explorePage">
      <GlobalNav />

      <section className="exploreHero">
        <div className="exploreHeroVisual" aria-hidden="true">
          <img src="/explorar-escena.svg" alt="" />
        </div>
        <div className="exploreHeroCopy">
          <p className="eyebrow">EXPLORAR</p>
          <h1>Entra en la historia.</h1>
          <p className="lead">
            Explora los expedientes publicados y decide qué pista seguir primero.
          </p>
        </div>
      </section>

      <form className="exploreSearch" method="get">
        <input
          className="input"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, código o descripción"
          aria-label="Buscar expedientes"
        />
        <button className="btn" type="submit">
          Buscar
        </button>
        {q && (
          <Link className="btn secondary" href="/explorar">
            Limpiar
          </Link>
        )}
      </form>

      <div className="sectionHead exploreResultsHead">
        <div>
          <p className="eyebrow">EXPEDIENTES</p>
          <h2>{q ? `Resultados para “${q}”` : 'Expedientes publicados'}</h2>
        </div>
        <p className="muted">
          {exps.length} {exps.length === 1 ? 'expediente disponible' : 'expedientes disponibles'}
        </p>
      </div>

      {exps.length ? (
        <div className="grid">
          {exps.map((e, index) => (
            <article className="card exploreCard" key={e.id}>
              <div className="exploreCardVisual" aria-hidden="true">
                <img
                  src={exploreArtwork[e.code] ?? '/archivo-visual.svg'}
                  alt=""
                  loading="lazy"
                />
              </div>
              <div className="exploreCardTop">
                <span className="tag">{e.code}</span>
                <span className="exploreStatus">PUBLICADO</span>
              </div>

              <h2>{e.title}</h2>
              <p className="muted">{e.description}</p>

              <div className="caseMeta">
                <span>
                  {evidenceCounts[index] === 1
                    ? '1 evidencia'
                    : evidenceCounts[index] + ' evidencias'}
                </span>
                <span>Expediente interactivo</span>
              </div>

              <Link className="btn" href={`/expedientes/${e.slug}`}>
                Investigar
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="notice exploreEmpty">
          No encontramos expedientes con esa búsqueda.
        </div>
      )}

      <footer className="siteFooter">
        <div>
          <span className="footerBrand">EL VAGO</span>
          <p className="muted">Historias de ficción. Preguntas sin respuesta.</p>
        </div>
        <div className="footerLinks">
          <Link href="/">Inicio</Link>
          <Link href="/explorar">Explorar</Link>
          <Link href="/multimedia">Multimedia</Link>
          <Link href="/comunidad">Comunidad</Link>
          <Link href="/mi-vago">Mi Vago</Link>
        </div>
        <span className="muted footerCopy">© {new Date().getFullYear()} El Vago</span>
      </footer>
    </main>
  );
}
