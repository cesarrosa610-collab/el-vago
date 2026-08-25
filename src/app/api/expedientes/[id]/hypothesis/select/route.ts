import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { id } = await params;
  const { hypothesisId } = await req.json();
  if (!hypothesisId) return NextResponse.json({ error: 'Hipótesis requerida' }, { status: 400 });
  const h = await prisma.hypothesis.findFirst({ where: { id: hypothesisId, expedienteId: id, unlockAfter: { lte: await prisma.discovery.count({ where: { userId: user.id, evidence: { expedienteId: id } } }) } } });
  if (!h) return NextResponse.json({ error: 'Hipótesis no disponible' }, { status: 404 });
  const investigation = await prisma.investigation.findUnique({ where: { userId_expedienteId: { userId: user.id, expedienteId: id } } });
  if (!investigation) return NextResponse.json({ error: 'Investigación no iniciada' }, { status: 409 });
  const completed = h.isCorrect === true;

const updated = await prisma.investigation.update({
  where: { id: investigation.id },
  data: {
    selectedHypothesisId: h.id,
    status: completed ? 'COMPLETED' : 'IN_PROGRESS',
    progress: completed ? 100 : investigation.progress
  }
});

return NextResponse.json({
  ok: true,
  selectedHypothesisId: updated.selectedHypothesisId,
  completed,
  correct: h.isCorrect
});
}
