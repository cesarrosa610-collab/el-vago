import Link from 'next/link';
import { prisma } from '@/src/lib/prisma';
import GlobalNav from './GlobalNav';

export default async function Home() {
  

  const exps = await prisma.expediente.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'asc' },
    include: { evidence: true },
  });

  const featured = exps[0];
  const others = exps.slice(1);

  return (

  <main className="wrap homePage">
    <GlobalNav />

 


            
              
      <section className="hero homeHero">
        <p className="eyebrow">EXPEDIENTES INTERACTIVOS</p>

        <h1>Misterios que tienes que resolver.</h1>

        <p className="lead">
          Investiga, conecta evidencias y descubre la verdad.
        </p>
      </section>

      {featured && (
        <section className="featuredCase">
          <div className="featuredCopy">
            <p className="eyebrow">EXPEDIENTE DESTACADO</p>

            <span className="tag">{featured.code}</span>

            <h2>{featured.title}</h2>

            <p className="lead">{featured.description}</p>

            <div className="caseMeta">
              <span>{featured.evidence.length} evidencias</span>
              <span>Investigación interactiva</span>
            </div>

            <Link
              className="btn heroBtn"
              href={`/expedientes/${featured.slug}`}
            >
              Comenzar investigación
            </Link>
          </div>

          <div className="featuredVisual" aria-hidden="true">
            <div className="featuredGlow" />
            <span>EL VAGO</span>
            <strong>{featured.code}</strong>
          </div>
        </section>
      )}

      <section className="homeSection">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">CATÁLOGO</p>
            <h2>Más misterios por resolver</h2>
          </div>

          <p className="muted">
            Elige un expediente y sigue las pistas.
          </p>
        </div>

        <div className="grid">
          {(others.length ? others : exps).map((e) => (
            <div className="card" key={e.id}>
              <span className="tag">{e.code}</span>

              <h2>{e.title}</h2>

              <p className="muted">{e.description}</p>

              <p className="muted">
                {e.evidence.length} evidencias
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
    </main>
  );
}
