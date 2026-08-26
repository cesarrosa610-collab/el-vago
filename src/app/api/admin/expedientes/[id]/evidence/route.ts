import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const unlockAfter = Number.isInteger(body.unlockAfter)
    ? body.unlockAfter
    : Number.parseInt(String(body.unlockAfter ?? '0'), 10);

  if (!code || !title || !description || !Number.isInteger(unlockAfter) || unlockAfter < 0) {
    return NextResponse.json({ error: 'Código, título, descripción y unlockAfter válido son requeridos' }, { status: 400 });
  }

  const expediente = await prisma.expediente.findUnique({ where: { id } });
  if (!expediente) return NextResponse.json({ error: 'Expediente no encontrado' }, { status: 404 });
  if (expediente.status !== 'DRAFT') return NextResponse.json({ error: 'Solo se pueden editar evidencias de un DRAFT' }, { status: 409 });

  try {
    const evidence = await prisma.evidence.create({
      data: { expedienteId: id, code, title, description, unlockAfter },
    });
    return NextResponse.json({ ok: true, evidence }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'El código de evidencia ya existe' }, { status: 409 });
  }
}
