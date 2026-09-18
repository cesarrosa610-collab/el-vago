import Link from 'next/link';
import GlobalNav from '../GlobalNav';

export default function Multimedia() {
  return (
    <main className="wrap">
      <GlobalNav />
      <section className="hero">
        <p className="eyebrow">MULTIMEDIA</p>
        <h1>Mira, escucha y descubre.</h1>
        <p className="lead">
          Aquí reuniremos videos, audios y galerías relacionadas con nuestros expedientes.
        </p>
      </section>

      <section className="grid landingGrid">
        <article className="card">
          <span className="tag">VIDEOS</span>
          <h2>Historias en movimiento.</h2>
          <p className="muted">Contenido audiovisual relacionado con cada misterio.</p>
          <span className="muted">PRÓXIMAMENTE</span>
        </article>
        <article className="card">
          <span className="tag">AUDIOS</span>
          <h2>Escucha las pistas.</h2>
          <p className="muted">Audios, testimonios y piezas sonoras para ampliar la investigación.</p>
          <span className="muted">PRÓXIMAMENTE</span>
        </article>
        <article className="card">
          <span className="tag">GALERÍA</span>
          <h2>Observa cada detalle.</h2>
          <p className="muted">Imágenes y material visual para explorar cada historia.</p>
          <span className="muted">PRÓXIMAMENTE</span>
        </article>
      </section>

      <section className="premiumTeaser">
        <div>
          <p className="eyebrow">EL VAGO</p>
          <h2>Todo misterio deja algo que ver.</h2>
          <p className="muted">Mientras preparamos esta sección, puedes comenzar una investigación.</p>
        </div>
        <Link className="btn" href="/explorar">Explorar expedientes</Link>
      </section>
    </main>
  );
}
