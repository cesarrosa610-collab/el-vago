import Link from 'next/link';
import GlobalNav from '../GlobalNav';

export default function Comunidad() {
  return (
    <main className="wrap">
      <GlobalNav />
      <section className="hero">
        <p className="eyebrow">COMUNIDAD</p>
        <h1>Investiga. Comparte. Conecta.</h1>
        <p className="lead">
          Un espacio para compartir teorías, debatir pistas y descubrir nuevas formas de resolver los expedientes.
        </p>
      </section>

      <section className="grid landingGrid">
        <article className="card">
          <span className="tag">TEORÍAS</span>
          <h2>Comparte tus teorías.</h2>
          <p className="muted">Publica tus hipótesis y explica qué pistas te llevaron hasta ellas.</p>
          <span className="muted">PRÓXIMAMENTE</span>
        </article>
        <article className="card">
          <span className="tag">PISTAS</span>
          <h2>Debate las evidencias.</h2>
          <p className="muted">Conversa con otros investigadores sobre las pistas de cada expediente.</p>
          <span className="muted">PRÓXIMAMENTE</span>
        </article>
        <article className="card">
          <span className="tag">INVESTIGADORES</span>
          <h2>Encuentra otros investigadores.</h2>
          <p className="muted">Descubre nuevas perspectivas y sigue las investigaciones que más te interesen.</p>
          <span className="muted">PRÓXIMAMENTE</span>
        </article>
      </section>

      <section className="premiumTeaser">
        <div>
          <p className="eyebrow">EL VAGO</p>
          <h2>La investigación también se comparte.</h2>
          <p className="muted">Estamos preparando este espacio para que cada misterio pueda abrir nuevas conversaciones.</p>
        </div>
        <Link className="btn" href="/explorar">Explorar expedientes</Link>
      </section>
    </main>
  );
}
