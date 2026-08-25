import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';
import { setUser } from '@/src/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  await setUser(u.id);
  return NextResponse.json({ ok: true });
}
