import { NextResponse } from 'next/server';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: 'Datos inválidos' },
      { status: 400 }
    );
  }

  const title = String(body.title ?? '').trim();
  const description = String(body.description ?? '').trim();
  const category = String(body.category ?? '').trim();
  const difficulty = String(body.difficulty ?? '').trim();
  const conclusionTitle = String(
    body.conclusionTitle ?? ''
  ).trim();
  const conclusion = String(body.conclusion ?? '').trim();

  if (
    !title ||
    !description ||
    !category ||
    !difficulty
  ) {
    return NextResponse.json(
      {
        error:
          'Título, descripción, categoría y dificultad son obligatorios',
      },
      { status: 400 }
    );
  }

  const expediente = await prisma.expediente.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
    },
  });

  if (!expediente) {
    return NextResponse.json(
      { error: 'Expediente no encontrado' },
      { status: 404 }
    );
  }

  if (expediente.status !== 'DRAFT') {
    return NextResponse.json(
      {
        error:
          'Solo se pueden editar expedientes DRAFT',
      },
      { status: 409 }
    );
  }

  const updated = await prisma.expediente.update({
    where: { id },
    data: {
      title,
      description,
      category,
      difficulty,
      conclusionTitle: conclusionTitle || null,
      conclusion: conclusion || null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      conclusionTitle: true,
      conclusion: true,
    },
  });

  return NextResponse.json({
    ok: true,
    expediente: updated,
  });
}
