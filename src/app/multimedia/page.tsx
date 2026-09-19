import Link from 'next/link';
import GlobalNav from '../GlobalNav';

export default function Multimedia() {
  return (
    <main className="wrap">
      <GlobalNav />
      <section className="hero multimediaHero">
        <div className="multimediaHeroVisual" aria-hidden="true">
          <img src="/exp-001-habitacion.svg" alt="" />
          <span className="mediaPlay"><i /></span>
        </div>
        <div className="multimediaHeroCopy">
          <p className="eyebrow">ARCHIVO MULTIMEDIA</p>
          <h1>Mira, escucha y descubre.</h1>
          <p className="lead">
            Una capa audiovisual para entrar en el universo de ficción desde otra perspectiva.
          </p>
        </div>
      </section>

      <section className="mediaFeature">
        <div>
          <p className="eyebrow">PIEZA DESTACADA</p>
          <h2>La Habitación 317</h2>
          <p className="muted">La pieza audiovisual de La Habitación 317 reúne imágenes, registros y sonido del expediente.</p>
        </div>
        <div className="mediaTimeline" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </section>

      <section className="grid landingGrid">
        <article className="card mediaCard">
          <span className="tag">VIDEOS</span>
          <h2>Historias en movimiento.</h2>
          <p className="muted">Trailers, reconstrucciones y piezas narrativas de ficción.</p>
          <span className="muted">FORMATO NARRATIVO</span>
        </article>
        <article className="card mediaCard">
          <span className="tag">AUDIOS</span>
          <h2>Escucha las pistas.</h2>
          <p className="muted">Testimonios, llamadas y piezas sonoras vinculadas a cada expediente.</p>
          <span className="muted">DISEÑO SONORO</span>
        </article>
        <article className="card mediaCard">
          <span className="tag">GALERÍA</span>
          <h2>Observa cada detalle.</h2>
          <p className="muted">Fotografías, documentos y material visual de cada investigación.</p>
          <span className="muted">ARCHIVO VISUAL</span>
        </article>
      </section>

      <section className="premiumTeaser">
        <div>
          <p className="eyebrow">EL VAGO</p>
          <h2>Todo misterio deja algo que ver.</h2>
          <p className="muted">El archivo multimedia crecerá junto con la historia. Mientras tanto, puedes comenzar la investigación.</p>
        </div>
        <Link className="btn" href="/explorar">Explorar expedientes</Link>
      </section>

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
        </div>
        <span className="muted footerCopy">© {new Date().getFullYear()} El Vago</span>
      </footer>
    </main>
  );
}
