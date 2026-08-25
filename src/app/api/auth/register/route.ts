import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';
import { setUser } from '@/src/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return NextResponse.json({ error: 'Email o contraseña inválidos' }, { status: 400 });
  try {
    const u = await prisma.user.create({ data: { email, passwordHash: await bcrypt.hash(password, 10) } });
    await setUser(u.id);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Email ya registrado' }, { status: 409 });
  }
}
