import {NextResponse} from 'next/server';
import {prisma} from '@/src/lib/prisma';
import {currentUser} from '@/src/lib/auth';
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){const u=await currentUser();if(!u)return NextResponse.json({error:'No autenticado'},{status:401});const {id}=await params;const e=await prisma.expediente.findFirst({where:{id,status:'PUBLISHED'}});if(!e)return NextResponse.json({error:'Expediente no disponible'},{status:404});const i=await prisma.investigation.upsert({where:{userId_expedienteId:{userId:u.id,expedienteId:id}},update:{},create:{userId:u.id,expedienteId:id}});return NextResponse.json({ok:true,progress:i.progress,status:i.status});}
