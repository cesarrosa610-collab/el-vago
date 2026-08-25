import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { prisma } from './prisma';
const COOKIE='elvago_session';
const DAYS=30;
function token(){return crypto.randomBytes(32).toString('hex')}
export async function currentUser(){
  const c=(await cookies()).get(COOKIE)?.value; if(!c)return null;
  const s=await prisma.session.findUnique({where:{token:c},include:{user:true}});
  if(!s)return null;
  if(s.expiresAt < new Date()){await prisma.session.delete({where:{id:s.id}}).catch(()=>{});return null;}
  return s.user;
}
export async function setUser(id:string){
  const t=token(); const expiresAt=new Date(Date.now()+DAYS*86400000);
  await prisma.session.create({data:{token:t,userId:id,expiresAt}});
  (await cookies()).set(COOKIE,t,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:DAYS*86400});
}
export async function clearUser(){
  const c=(await cookies()).get(COOKIE)?.value;
  if(c) await prisma.session.deleteMany({where:{token:c}});
  (await cookies()).delete(COOKIE);
}
