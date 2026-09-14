import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const u = await currentUser();

  if (!u || u.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 403 }
    );
  }

  const { id } = await params;

  const e = await prisma.expediente.findUnique({
    where: { id },
  });

  if (!e) {
    return NextResponse.json(
      { error: 'No encontrado' },
      { status: 404 }
    );
  }

  if (e.status !== 'PUBLISHED') {
    return NextResponse.json(
      { error: 'El expediente no está publicado' },
      { status: 409 }
    );
  }

  const r = await prisma.expediente.update({
    where: { id },
    data: {
      status: 'ARCHIVED',
    },
  });

  return NextResponse.json({
    ok: true,
    expediente: r,
  });
}
