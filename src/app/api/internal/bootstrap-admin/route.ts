import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'cesarrosa610@gmail.com';

export async function POST(req: Request) {
  const expected = process.env.ADMIN_BOOTSTRAP_TOKEN;
  const supplied = req.headers.get('x-admin-bootstrap-token') ?? '';
  if (!expected || supplied.length !== expected.length) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  if (diff !== 0) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length < 20) return NextResponse.json({ error: 'Credencial temporal inválida' }, { status: 400 });

  try {
    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (existing) return NextResponse.json({ error: 'La cuenta ya existe; no se modificó' }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email: ADMIN_EMAIL, passwordHash, role: 'ADMIN' } });
    return NextResponse.json({ ok: true, email: ADMIN_EMAIL, role: 'ADMIN' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'No fue posible crear la cuenta' }, { status: 500 });
  }
}
