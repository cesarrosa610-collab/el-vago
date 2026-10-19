import type { Metadata } from 'next';
import Link from 'next/link';
import GlobalNav from '../GlobalNav';

export const metadata: Metadata = {
  title: 'Multimedia',
  description: 'Explora el archivo multimedia de El Vago: videos, audios y material visual vinculado a los expedientes.',
  alternates: { canonical: '/multimedia' },
  openGraph: {
    url: 'https://el-vago.vercel.app/multimedia',
    title: 'Multimedia | El Vago',
    description: 'Explora el archivo multimedia de El Vago: videos, audios y material visual vinculado a los expedientes.',
  },
  twitter: {
    title: 'Multimedia | El Vago',
    description: 'Explora el archivo multimedia de El Vago: videos, audios y material visual vinculado a los expedientes.',
  },
};

export default function Multimedia() {
  return (
    <main className="wrap">
      <GlobalNav />
      <section className="hero multimediaHero">
        <div className="multimediaHeroVisual" aria-hidden="true"><img src="https://images.unsplash.com/photo-1780247594959-7d5e35157592?auto=format&fit=crop&fm=jpg&q=84&w=1400" alt="" /><span className="mediaPlay"><i /></span></div>
        <div className="multimediaHeroCopy">
          <p className="eyebrow">ARCHIVO MULTIMEDIA</p><h1>Mira, escucha y descubre.</h1>
          <p className="lead">Una capa audiovisual para entrar en el universo del expediente desde otra perspectiva.</p>
        </div>
      </section>
      <section className="card ev001VideoSection" aria-labelledby="ev001-video-title" style={{ margin: '24px 0', padding: 'clamp(16px, 3vw, 28px)' }}>
        <p className="eyebrow">EV-001 · PIEZA AUDIOVISUAL</p>
        <h2 id="ev001-video-title">La Habitación 317 — Video oficial</h2>
        <p className="muted">Reproduce aquí la pieza audiovisual del expediente, con su música y diseño sonoro.</p>
        <video controls playsInline preload="metadata" poster="/door-317.jpg" aria-label="Video EV-001 La Habitación 317" style={{ display: 'block', width: '100%', maxHeight: '75vh', aspectRatio: '16 / 9', objectFit: 'contain', margin: '16px 0', background: '#050505', border: '1px solid #252a2d', borderRadius: 10 }}>
          <source src="/ev001-habitacion-317-v10.mp4" type="video/mp4" />
          Tu navegador no puede reproducir este video. <a href="/ev001-habitacion-317-v10.mp4">Abrir el archivo de video</a>.
        </video>
        <p className="muted">Si el reproductor no carga, <a href="/ev001-habitacion-317-v10.mp4" target="_blank" rel="noreferrer">abre el video directamente</a>.</p>
        <Link className="btn" href="/expedientes/la-habitacion-317">Abrir expediente</Link>
      </section>
      <section className="mediaFeature"><div><p className="eyebrow">PIEZA DESTACADA</p><h2>La Habitación 317</h2><p className="muted">La experiencia audiovisual de La Habitación 317 está diseñada para reunir imágenes, registros y sonido del expediente.</p></div><div className="mediaTimeline" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div></section>

      <section className="card ev001VideoSection" aria-labelledby="ev001-video-title">
        <p className="eyebrow">EV-001 · PIEZA AUDIOVISUAL</p>
        <h2 id="ev001-video-title">La Habitación 317 — Video oficial</h2>
        <p className="muted">Reproducción de la pieza audiovisual del expediente. Usa los controles para reproducir el video y escuchar el diseño sonoro.</p>
        <video
          className="ev001VideoPlayer"
          controls
          playsInline
          preload="metadata"
          poster="/door-317.jpg"
          aria-label="Video EV-001 La Habitación 317"
        >
          <source src="/El_Vago_EV001_Melodia_HD_Impacto_Eco_v10%20(3).mp4" type="video/mp4" />
          Tu navegador no puede reproducir este video. <a href="/El_Vago_EV001_Melodia_HD_Impacto_Eco_v10%20(3).mp4">Abrir el archivo de video</a>.
        </video>
        <p className="muted ev001VideoHelp">Si no inicia, <a href="/El_Vago_EV001_Melodia_HD_Impacto_Eco_v10%20(3).mp4" target="_blank" rel="noreferrer">abre el video directamente</a>.</p>
        <Link className="btn" href="/expedientes/la-habitacion-317">Volver al expediente</Link>
      </section>

      <section className="grid landingGrid">
        <article className="card mediaCard"><span className="tag">VIDEOS</span><h2>Historias en movimiento.</h2><p className="muted">Reconstrucciones y piezas documentales vinculadas a cada expediente.</p><span className="muted">FORMATO DOCUMENTAL</span></article>
        <article className="card mediaCard"><span className="tag">AUDIOS</span><h2>Escucha las pistas.</h2><p className="muted">Testimonios, llamadas y piezas sonoras vinculadas a cada expediente.</p><span className="muted">DISEÑO SONORO</span></article>
        <article className="card mediaCard"><span className="tag">GALERÍA</span><h2>Observa cada detalle.</h2><p className="muted">Fotografías, documentos y material visual de cada investigación.</p><span className="muted">ARCHIVO VISUAL</span></article>
      </section>
      <section className="premiumTeaser"><div><p className="eyebrow">EL VAGO</p><h2>Todo misterio deja algo que ver.</h2><p className="muted">El archivo multimedia crecerá junto con la historia. Mientras tanto, puedes comenzar la investigación.</p></div><Link className="btn" href="/explorar">Entrar en la historia</Link></section>
      <footer className="siteFooter"><div><span className="footerBrand">EL VAGO</span><p className="muted">Historias reales · Misterios sin respuesta.</p></div><div className="footerLinks"><Link href="/">Inicio</Link><Link href="/explorar">Explorar</Link><Link href="/multimedia">Multimedia</Link><Link href="/comunidad">Comunidad</Link><Link href="/mi-vago">Mi Vago</Link></div><span className="muted footerCopy">© {new Date().getFullYear()} El Vago</span></footer>
      <style jsx>{`
        .ev001VideoSection { margin: 1.25rem 0; padding: clamp(1rem, 3vw, 2rem); }
        .ev001VideoPlayer { display: block; width: 100%; max-height: 75vh; aspect-ratio: 16 / 9; object-fit: contain; margin: 1rem 0; background: #050505; border: 1px solid rgba(255,255,255,.14); border-radius: 10px; }
        .ev001VideoHelp { margin-bottom: 1rem; }
        .ev001VideoHelp a { color: #ff3038; text-decoration: underline; }
      `}</style>
    </main>
  );
}
