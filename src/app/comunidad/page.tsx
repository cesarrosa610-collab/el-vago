import Link from 'next/link';
import GlobalNav from '../GlobalNav';

export default function Comunidad() {
  return (
    <main className="wrap">
      <GlobalNav />
      <section className="hero communityHero">
        <div className="communityHeroVisual" aria-hidden="true"><img src="/comunidad-escena.svg" alt="" /></div>
        <div className="communityHeroCopy">
        <p className="eyebrow">COMUNIDAD</p>
        <h1>La historia también se investiga en comunidad.</h1>
        <p className="lead">
          Un espacio para compartir teorías, debatir pistas y descubrir nuevas formas de interpretar cada expediente.
        </p>
        </div>
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
          <h2>Descubre otras perspectivas.</h2>
          <p className="muted">Compara interpretaciones y descubre cómo otros investigadores conectan las mismas pistas.</p>
          <span className="muted">PRÓXIMAMENTE</span>
        </article>
      </section>

      <section className="premiumTeaser">
        <div>
          <p className="eyebrow">EL VAGO</p>
          <h2>Cada pista puede abrir una teoría.</h2>
          <p className="muted">Estamos preparando este espacio para que cada misterio pueda abrir nuevas conversaciones.</p>
        </div>
        <Link className="btn" href="/explorar">Entrar en la historia</Link>
      </section>

      <footer className="siteFooter">
        <div>
          <span className="footerBrand">EL VAGO</span>
          <p className="muted">Historias reales · Misterios sin respuesta.</p>
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
