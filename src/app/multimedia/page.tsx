import Link from 'next/link';
import GlobalNav from '../GlobalNav';

export default function Multimedia() {
  return (
    <main className="wrap">
      <GlobalNav />
      <section className="hero multimediaHero">
        <div className="multimediaHeroVisual" aria-hidden="true">
          <img src="/archivo-visual.svg" alt="" />
          <span className="mediaPlay"><i /></span>
        </div>
        <div className="multimediaHeroCopy">
          <p className="eyebrow">ARCHIVO MULTIMEDIA</p>
          <h1>Mira, escucha y descubre.</h1>
          <p className="lead">
            Una capa audiovisual para entrar en cada historia desde otra perspectiva.
          </p>
        </div>
      </section>

      <section className="mediaFeature">
        <div>
          <p className="eyebrow">PIEZA DESTACADA</p>
          <h2>La Llamada de las 03:17</h2>
          <p className="muted">Una futura pieza audiovisual reunirá imágenes, registros y sonido del expediente.</p>
        </div>
        <div className="mediaTimeline" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </section>

      <section className="grid landingGrid">
        <article className="card mediaCard">
          <span className="tag">VIDEOS</span>
          <h2>Historias en movimiento.</h2>
          <p className="muted">Trailers, reconstrucciones y piezas documentales.</p>
          <span className="muted">CONTENIDO EN PREPARACIÓN</span>
        </article>
        <article className="card mediaCard">
          <span className="tag">AUDIOS</span>
          <h2>Escucha las pistas.</h2>
          <p className="muted">Testimonios, llamadas y piezas sonoras vinculadas a cada expediente.</p>
          <span className="muted">CONTENIDO EN PREPARACIÓN</span>
        </article>
        <article className="card mediaCard">
          <span className="tag">GALERÍA</span>
          <h2>Observa cada detalle.</h2>
          <p className="muted">Fotografías, documentos y material visual de cada investigación.</p>
          <span className="muted">CONTENIDO EN PREPARACIÓN</span>
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
