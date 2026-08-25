import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import InvestigationClient from './InvestigationClient';

export default async function ExpedientePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const expediente=await prisma.expediente.findFirst({where:{slug,status:'PUBLISHED'},include:{evidence:{orderBy:{code:'asc'}}}});
  if(!expediente) notFound();
  const user=await currentUser();
  if(!user) redirect('/login');
  const investigation=await prisma.investigation.findUnique({where:{userId_expedienteId:{userId:user.id,expedienteId:expediente.id}}}).catch(()=>null);
  const discoveries=await prisma.discovery.findMany({where:{userId:user.id,evidence:{expedienteId:expediente.id}},select:{evidenceId:true}});
  return <InvestigationClient expediente={expediente} initialProgress={investigation?.progress ?? 0} initialStatus={investigation?.status ?? 'NOT_STARTED'} discoveredIds={discoveries.map(x=>x.evidenceId)} />;
}
