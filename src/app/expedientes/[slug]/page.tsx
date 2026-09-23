import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import InvestigationClient from './InvestigationClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const expediente = await prisma.expediente.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, description: true, slug: true },
  });

  if (!expediente) {
    return { title: 'Expediente no encontrado', robots: { index: false, follow: false } };
  }

  return {
    title: expediente.title,
    description: expediente.description,
    alternates: { canonical: `/expedientes/${expediente.slug}` },
    openGraph: {
      url: `https://el-vago.vercel.app/expedientes/${expediente.slug}`,
      title: `${expediente.title} | El Vago`,
      description: expediente.description,
    },
    twitter: {
      title: `${expediente.title} | El Vago`,
      description: expediente.description,
    },
  };
}

export default async function ExpedientePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const expediente=await prisma.expediente.findFirst({
    where:{slug,status:'PUBLISHED'},
    include:{
      evidence:{
        where:{status:'PUBLISHED'},
        orderBy:{code:'asc'}
      }
    }
  });
  if(!expediente) notFound();
  const user=await currentUser();
  if(!user) redirect('/login');
  const investigation=await prisma.investigation.findUnique({where:{userId_expedienteId:{userId:user.id,expedienteId:expediente.id}}}).catch(()=>null);
  const discoveries=await prisma.discovery.findMany({where:{userId:user.id,evidence:{expedienteId:expediente.id,status:'PUBLISHED'}},select:{evidenceId:true}});
  return <InvestigationClient expediente={expediente} initialProgress={investigation?.progress ?? 0} initialStatus={investigation?.status ?? 'NOT_STARTED'} discoveredIds={discoveries.map(x=>x.evidenceId)} />;
}
