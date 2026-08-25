import {NextResponse} from 'next/server';
import {prisma} from '@/src/lib/prisma'; import {currentUser} from '@/src/lib/auth';
export async function GET(){const u=await currentUser();if(!u||u.role!=='ADMIN')return NextResponse.json({error:'No autorizado'},{status:403});const data=await prisma.expediente.findMany({orderBy:{createdAt:'asc'},include:{evidence:true}});return NextResponse.json(data)}
export async function POST(req:Request){
 const u=await currentUser(); if(!u||u.role!=='ADMIN')return NextResponse.json({error:'No autorizado'},{status:403});
 const b=await req.json(); if(!b.code||!b.title||!b.slug||!b.description)return NextResponse.json({error:'Campos requeridos'},{status:400});
 try{const e=await prisma.expediente.create({data:{code:b.code.trim(),title:b.title.trim(),slug:b.slug.trim(),description:b.description.trim(),category:b.category||'Misterio',difficulty:b.difficulty||'MEDIUM',status:'DRAFT'}});return NextResponse.json({ok:true,expediente:e},{status:201})}
 catch{return NextResponse.json({error:'code o slug ya existe'},{status:409})}
}
