import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import { canDiscover } from '@/src/lib/security';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    );
  }

  const { id } = await params;

  let body: { hypothesisId?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Solicitud inválida' },
      { status: 400 }
    );
  }

  const hypothesisId = body.hypothesisId;

  if (!hypothesisId) {
    return NextResponse.json(
      { error: 'Hipótesis requerida' },
      { status: 400 }
    );
  }

  const expediente = await prisma.expediente.findFirst({
    where: { id, status: 'PUBLISHED' },
    select: { id: true },
  });

  if (!expediente) {
    return NextResponse.json(
      { error: 'Expediente no disponible' },
      { status: 404 }
    );
  }

  const investigation =
    await prisma.investigation.findUnique({
      where: {
        userId_expedienteId: {
          userId: user.id,
          expedienteId: id,
        },
      },
    });

  if (!investigation) {
    return NextResponse.json(
      { error: 'Investigación no iniciada' },
      { status: 409 }
    );
  }

  if (investigation.status === 'COMPLETED') {
    return NextResponse.json(
      { error: 'La investigación ya está cerrada' },
      { status: 409 }
    );
  }

  if (investigation.selectedHypothesisId) {
    return NextResponse.json(
      { error: 'Ya existe una hipótesis seleccionada' },
      { status: 409 }
    );
  }

  const found = await prisma.discovery.count({
    where: {
      userId: user.id,
      evidence: {
        expedienteId: id,
        status: 'PUBLISHED',
      },
    },
  });

  const totalEvidence = await prisma.evidence.count({
    where: {
      expedienteId: id,
      status: 'PUBLISHED',
    },
  });

  if (found < totalEvidence) {
    return NextResponse.json(
      { error: 'Debes descubrir todas las evidencias antes de cerrar la investigación' },
      { status: 409 }
    );
  }

  const h = await prisma.hypothesis.findFirst({
    where: {
      id: hypothesisId,
      expedienteId: id,
      status: 'PUBLISHED',
      unlockAfter: {
        lte: found,
      },
    },
  });

  if (!h || !canDiscover(h.unlockAfter, found)) {
    return NextResponse.json(
      { error: 'Hipótesis no disponible' },
      { status: 404 }
    );
  }

  const updated = await prisma.investigation.update({
    where: {
      id: investigation.id,
    },
    data: {
      selectedHypothesisId: h.id,
      status: 'COMPLETED',
      progress: 100,
    },
  });

  return NextResponse.json({
    ok: true,
    selectedHypothesisId:
      updated.selectedHypothesisId,
    completed: true,
    progress: 100,
    status: 'COMPLETED',
  });
}
