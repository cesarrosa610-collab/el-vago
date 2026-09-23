import type { Metadata } from 'next';
import Link from 'next/link';
import GlobalNav from '../GlobalNav';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

export const metadata: Metadata = {
  title: 'Mi Vago',
  description: 'Revisa tus investigaciones, progreso y expedientes completados en El Vago.',
  alternates: { canonical: '/mi-vago' },
  openGraph: {
    url: 'https://el-vago.vercel.app/mi-vago',
    title: 'Mi Vago | El Vago',
    description: 'Revisa tus investigaciones, progreso y expedientes completados en El Vago.',
  },
  twitter: {
    title: 'Mi Vago | El Vago',
    description: 'Revisa tus investigaciones, progreso y expedientes completados en El Vago.',
  },
};

export default async function MiVago() {
  const user = await currentUser();
  if (!user) {
    return (
      <main className="wrap homePage miVagoPage">
        <GlobalNav />
        <section className="hero homeHero miVagoHero">
          <div className="miVagoHeroVisual" aria-hidden="true"><img src="/exp-001-habitacion.svg" alt="" /></div>
          <div className="miVagoHeroCopy"><p className="eyebrow">MI VAGO</p><h1>Tu investigación, siempre contigo.</h1><p className="lead">Inicia sesión para continuar tus investigaciones y revisar tu progreso en El Vago.</p><Link className="btn" href="/login">Entrar</Link></div>
        </section>
        <footer className="siteFooter"><div><span className="footerBrand">EL VAGO</span><p className="muted">Historias reales · Misterios sin respuesta.</p></div><div className="footerLinks"><Link href="/">Inicio</Link><Link href="/explorar">Explorar</Link><Link href="/multimedia">Multimedia</Link><Link href="/comunidad">Comunidad</Link><Link href="/mi-vago">Mi Vago</Link></div><span className="muted footerCopy">© {new Date().getFullYear()} El Vago</span></footer>
      </main>
    );
  }
  const investigations = await prisma.investigation.findMany({
    where: { userId: user.id, expediente: { status: 'PUBLISHED' } },
    orderBy: { id: 'asc' },
    include: { expediente: { include: { evidence: true } } },
  });
  const completed = investigations.filter((item) => item.status === 'COMPLETED');
  const active = investigations.filter((item) => item.status !== 'COMPLETED');
  return (
    <main className="wrap homePage miVagoPage">
      <GlobalNav />
      <section className="hero homeHero miVagoHero">
        <div className="miVagoHeroVisual" aria-hidden="true"><img src="/exp-001-habitacion.svg" alt="" /></div>
        <div className="miVagoHeroCopy"><p className="eyebrow">MI VAGO</p><h1>Tu investigación, siempre contigo.</h1><p className="lead">Continúa donde te quedaste y revisa tus investigaciones y descubrimientos.</p></div>
      </section>
      <section className="homeSection"><div className="sectionHead"><div><p className="eyebrow">EN INVESTIGACIÓN</p><h2>Investigación en curso</h2></div><p className="muted">{active.length} activa</p></div>
        {active.length ? <div className="grid">{active.map((item) => <article className="card" key={item.id}><div className="exploreCardTop"><span className="tag">{item.expediente.code}</span><span className="exploreStatus">EN CURSO</span></div><h2>{item.expediente.title}</h2><p className="muted">{item.expediente.description}</p><div className="caseMeta"><span>Progreso {Math.round(item.progress)}%</span><span>{item.expediente.evidence.length} evidencias</span></div><div className="bar" aria-label={`Progreso ${Math.round(item.progress)}%`}><i style={{width:`${Math.min(100,Math.max(0,item.progress))}%`}} /></div><Link className="btn" href={`/expedientes/${item.expediente.slug}`}>Continuar investigación</Link></article>)}</div> : <div className="notice exploreEmpty">No tienes investigaciones en curso. <Link href="/explorar">Explorar expedientes</Link></div>}
      </section>
      <section className="homeSection"><div className="sectionHead"><div><p className="eyebrow">HISTORIAL</p><h2>Investigación completada</h2></div><p className="muted">{completed.length} completada</p></div>
        {completed.length ? <div className="grid">{completed.map((item) => <article className="card" key={item.id}><div className="exploreCardTop"><span className="tag">{item.expediente.code}</span><span className="exploreStatus">COMPLETADO</span></div><h2>{item.expediente.title}</h2><p className="muted">Investigación completada.</p><Link className="btn secondary" href={`/expedientes/${item.expediente.slug}`}>Revisar expediente</Link></article>)}</div> : <div className="notice exploreEmpty">Cuando completes la investigación, aquí podrás volver a revisar lo descubierto.</div>}
      </section>
      <footer className="siteFooter"><div><span className="footerBrand">EL VAGO</span><p className="muted">Historias reales · Misterios sin respuesta.</p></div><div className="footerLinks"><Link href="/">Inicio</Link><Link href="/explorar">Explorar</Link><Link href="/multimedia">Multimedia</Link><Link href="/comunidad">Comunidad</Link></div><span className="muted footerCopy">© {new Date().getFullYear()} El Vago</span></footer>
    </main>
  );
}
