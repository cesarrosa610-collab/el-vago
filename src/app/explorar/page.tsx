import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import GlobalNav from '../GlobalNav';

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
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { code: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'asc' },
    include: { evidence: true },
  });

  return (
    <main className="wrap explorePage">
      
   <GlobalNav />
        <p className="eyebrow">EXPLORAR</p>

        <h1>Encuentra tu próximo misterio.</h1>

        <p className="lead">
          Busca entre los expedientes publicados y elige dónde comenzar.
        </p>
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
          <h2>
            {q ? `Resultados para “${q}”` : 'Todos los expedientes'}
          </h2>
        </div>

        <p className="muted">{exps.length} disponibles</p>
      </div>

      {exps.length ? (
        <div className="grid">
          {exps.map((e) => (
            <article className="card exploreCard" key={e.id}>
              <div className="exploreCardTop">
                <span className="tag">{e.code}</span>
                <span className="exploreStatus">PUBLICADO</span>
              </div>

              <h2>{e.title}</h2>

              <p className="muted">{e.description}</p>

              <div className="caseMeta">
                <span>{e.evidence.length} evidencias</span>
                <span>Expediente interactivo</span>
              </div>

              <Link
                className="btn"
                href={`/expedientes/${e.slug}`}
              >
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
    </main>
  );
}
