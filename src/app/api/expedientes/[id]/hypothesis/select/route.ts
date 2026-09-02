import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const { hypothesisId } = await req.json();

  if (!hypothesisId) {
    return NextResponse.json({ error: 'Hipótesis requerida' }, { status: 400 });
  }

  const investigation = await prisma.investigation.findUnique({
    where: {
      userId_expedienteId: {
        userId: user.id,
        expedienteId: id,
      },
    },
  });

  if (!investigation) {
    return NextResponse.json({ error: 'Investigación no iniciada' }, { status: 409 });
  }

  if (investigation.status === 'COMPLETED') {
    return NextResponse.json({ error: 'La investigación ya está cerrada' }, { status: 409 });
  }

  const found = await prisma.discovery.count({
    where: {
      userId: user.id,
      evidence: {
        expedienteId: id,
      },
    },
  });

  const h = await prisma.hypothesis.findFirst({
    where: {
      id: hypothesisId,
      expedienteId: id,
      unlockAfter: { lte: found },
    },
  });

  if (!h) {
    return NextResponse.json({ error: 'Hipótesis no disponible' }, { status: 404 });
  }

  const updated = await prisma.investigation.update({
    where: { id: investigation.id },
    data: { selectedHypothesisId: h.id },
  });

  return NextResponse.json({
    ok: true,
    selectedHypothesisId: updated.selectedHypothesisId,
    completed: updated.status === 'COMPLETED',
    correct: updated.status === 'COMPLETED' ? h.isCorrect : null,
  });
}
