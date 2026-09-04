import { NextResponse } from 'next/server';
import { currentUser } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      evidenceId: string;
    }>;
  }
) {
  const user = await currentUser();

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 403 }
    );
  }

  const { id, evidenceId } = await params;

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: 'Datos inválidos' },
      { status: 400 }
    );
  }

  const code =
    typeof body.code === 'string'
      ? body.code.trim()
      : '';

  const title =
    typeof body.title === 'string'
      ? body.title.trim()
      : '';

  const description =
    typeof body.description === 'string'
      ? body.description.trim()
      : '';

  const unlockAfter = Number.isInteger(
    body.unlockAfter
  )
    ? body.unlockAfter
    : Number.parseInt(
        String(body.unlockAfter ?? '0'),
        10
      );

  if (
    !code ||
    !title ||
    !description ||
    !Number.isInteger(unlockAfter) ||
    unlockAfter < 0
  ) {
    return NextResponse.json(
      {
        error:
          'Código, título, descripción y unlockAfter válido son requeridos',
      },
      { status: 400 }
    );
  }

  const expediente =
    await prisma.expediente.findUnique({
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
          'Solo se pueden editar evidencias de un DRAFT',
      },
      { status: 409 }
    );
  }

  const evidence =
    await prisma.evidence.findFirst({
      where: {
        id: evidenceId,
        expedienteId: id,
      },
      select: {
        id: true,
      },
    });

  if (!evidence) {
    return NextResponse.json(
      { error: 'Evidencia no encontrada' },
      { status: 404 }
    );
  }

  try {
    const updated =
      await prisma.evidence.update({
        where: {
          id: evidenceId,
        },
        data: {
          code,
          title,
          description,
          unlockAfter,
        },
      });

    return NextResponse.json({
      ok: true,
      evidence: updated,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          'No se pudo actualizar la evidencia. Verifica que el código no esté repetido.',
      },
      { status: 409 }
    );
  }
}
