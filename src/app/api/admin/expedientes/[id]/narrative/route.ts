import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

const TYPES = new Set([
  'CLUE',
  'QUESTION',
  'THEORY',
  'HYPOTHESIS',
  'TIMELINE',
]);

export async function POST(
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
  const body = await req.json().catch(() => ({}));

  const type = typeof body.type === 'string' ? body.type : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const text = typeof body.body === 'string' ? body.body.trim() : '';

  const unlockAfter = Number.isInteger(body.unlockAfter)
    ? body.unlockAfter
    : Number.parseInt(String(body.unlockAfter ?? '0'), 10);

  const sortOrder = Number.isInteger(body.sortOrder)
    ? body.sortOrder
    : Number.parseInt(String(body.sortOrder ?? '0'), 10);

  const isCorrect = Boolean(body.isCorrect);

  if (!TYPES.has(type)) {
    return NextResponse.json(
      { error: 'Tipo narrativo inválido' },
      { status: 400 }
    );
  }

  if (!code || !Number.isInteger(unlockAfter) || unlockAfter < 0) {
    return NextResponse.json(
      {
        error: 'Código y unlockAfter válido son requeridos',
      },
      { status: 400 }
    );
  }

  if (type === 'QUESTION') {
    if (!text) {
      return NextResponse.json(
        { error: 'La pregunta es requerida' },
        { status: 400 }
      );
    }
  } else if (!title || !text) {
    return NextResponse.json(
      {
        error: 'Título y descripción son requeridos',
      },
      { status: 400 }
    );
  }

  if (
    type === 'TIMELINE' &&
    (!Number.isInteger(sortOrder) || sortOrder < 0)
  ) {
    return NextResponse.json(
      { error: 'sortOrder inválido' },
      { status: 400 }
    );
  }

  const expediente = await prisma.expediente.findUnique({
    where: { id },
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
          'Solo se puede editar contenido narrativo de un DRAFT',
      },
      { status: 409 }
    );
  }

  try {
    let item;

    switch (type) {
      case 'CLUE':
        item = await prisma.clue.create({
          data: {
            expedienteId: id,
            code,
            title,
            description: text,
            unlockAfter,
          },
        });
        break;

      case 'QUESTION':
        item = await prisma.question.create({
          data: {
            expedienteId: id,
            code,
            text,
            unlockAfter,
          },
        });
        break;

      case 'THEORY':
        item = await prisma.theory.create({
          data: {
            expedienteId: id,
            code,
            title,
            description: text,
            unlockAfter,
          },
        });
        break;

      case 'HYPOTHESIS':
        item = await prisma.hypothesis.create({
          data: {
            expedienteId: id,
            code,
            title,
            description: text,
            unlockAfter,
            isCorrect,
          },
        });
        break;

      case 'TIMELINE':
        item = await prisma.timelineEvent.create({
          data: {
            expedienteId: id,
            code,
            label: title,
            description: text,
            sortOrder,
            unlockAfter,
          },
        });
        break;
    }

    return NextResponse.json(
      {
        ok: true,
        item,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          'El código ya existe para este tipo de contenido',
      },
      { status: 409 }
    );
  }
}
