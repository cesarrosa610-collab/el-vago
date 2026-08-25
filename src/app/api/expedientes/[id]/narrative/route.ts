import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
 const u=await currentUser(); if(!u)return NextResponse.json({error:'No autenticado'},{status:401});
 const {id}=await params;
 const exists=await prisma.expediente.findFirst({where:{id,status:'PUBLISHED'}}); if(!exists)return NextResponse.json({error:'No encontrado'},{status:404});
 const investigation=await prisma.investigation.findUnique({where:{userId_expedienteId:{userId:u.id,expedienteId:id}}});
 const found=await prisma.discovery.count({where:{userId:u.id,evidence:{expedienteId:id}}});
 const [clues,questions,theories,hypotheses,timeline]=await Promise.all([
  prisma.clue.findMany({where:{expedienteId:id,unlockAfter:{lte:found}},orderBy:{unlockAfter:'asc'}}),
  prisma.question.findMany({where:{expedienteId:id,unlockAfter:{lte:found}},orderBy:{unlockAfter:'asc'}}),
  prisma.theory.findMany({where:{expedienteId:id,unlockAfter:{lte:found}},orderBy:{unlockAfter:'asc'}}),
  prisma.hypothesis.findMany({where:{expedienteId:id,unlockAfter:{lte:found}},orderBy:{unlockAfter:'asc'}}),
  prisma.timelineEvent.findMany({where:{expedienteId:id,unlockAfter:{lte:found}},orderBy:{sortOrder:'asc'}})
 ]);
 return NextResponse.json({clues,questions,theories,hypotheses:hypotheses.map(({isCorrect,...h})=>h),timeline,conclusion:{title:investigation?.status==='COMPLETED'?exists.conclusionTitle:null,description:investigation?.status==='COMPLETED'?exists.conclusion:null,selectedHypothesisId:investigation?.selectedHypothesisId??null,completed:investigation?.status==='COMPLETED'}});
}
