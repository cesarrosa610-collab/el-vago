import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

export async function DELETE(
  _: Request,
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
          'Solo se pueden eliminar expedientes DRAFT',
      },
      { status: 409 }
    );
  }

  await prisma.expediente.delete({
    where: { id },
  });

  return NextResponse.json({
    ok: true,
  });
}
