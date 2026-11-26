import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const u = await currentUser();

  if (!u) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id } = await params;

  const exists = await prisma.expediente.findFirst({
    where: { id, status: 'PUBLISHED' },
  });

  if (!exists) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const investigation = await prisma.investigation.findUnique({
    where: {
      userId_expedienteId: {
        userId: u.id,
        expedienteId: id,
      },
    },
  });

  const found = await prisma.discovery.count({
    where: {
      userId: u.id,
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

  const allEvidenceFound = found >= totalEvidence;
  const completed = investigation?.status === 'COMPLETED';

  const [
    clues,
    questions,
    theories,
    hypotheses,
    timeline,
    selectedHypothesis,
  ] = await Promise.all([
    prisma.clue.findMany({
      where: {
        expedienteId: id,
        status: 'PUBLISHED',
        unlockAfter: { lte: found },
      },
      orderBy: { unlockAfter: 'asc' },
    }),

    prisma.question.findMany({
      where: {
        expedienteId: id,
        status: 'PUBLISHED',
        unlockAfter: { lte: found },
      },
      orderBy: { unlockAfter: 'asc' },
    }),

    prisma.theory.findMany({
      where: {
        expedienteId: id,
        status: 'PUBLISHED',
        unlockAfter: { lte: found },
      },
      orderBy: { unlockAfter: 'asc' },
    }),

    allEvidenceFound
      ? prisma.hypothesis.findMany({
          where: {
            expedienteId: id,
            status: 'PUBLISHED',
            unlockAfter: { lte: found },
          },
          orderBy: { unlockAfter: 'asc' },
        })
      : Promise.resolve([]),

    completed
      ? prisma.timelineEvent.findMany({
          where: {
            expedienteId: id,
            status: 'PUBLISHED',
            unlockAfter: { lte: found },
          },
          orderBy: { sortOrder: 'asc' },
        })
      : Promise.resolve([]),

    completed && investigation?.selectedHypothesisId
      ? prisma.hypothesis.findFirst({
          where: {
            id: investigation.selectedHypothesisId,
            expedienteId: id,
            status: 'PUBLISHED',
          },
          select: {
            id: true,
            code: true,
            title: true,
            isCorrect: true,
          },
        })
      : Promise.resolve(null),
  ]);

  // Only reveal whether the player's selection was correct after completion.
  // The canonical case conclusion remains the authoritative final explanation.
  const selectedWrongHypothesis =
    completed && selectedHypothesis && !selectedHypothesis.isCorrect;

  const conclusionTitle = selectedWrongHypothesis
    ? 'Hipótesis descartada'
    : exists.conclusionTitle || 'Investigación cerrada';

  const conclusionDescription = selectedWrongHypothesis
    ? `Tu selección —${selectedHypothesis.code}: ${selectedHypothesis.title}— no explica todas las evidencias. La conclusión del expediente es: ${exists.conclusion || 'La investigación queda resuelta con las evidencias reunidas.'}`
    : exists.conclusion ||
      'Has completado la investigación y reunido las piezas del expediente.';

  return NextResponse.json({
    clues,
    questions,
    theories,
    hypotheses: hypotheses.map(({ isCorrect, ...h }) => h),
    timeline,
    conclusion: {
      title: completed ? conclusionTitle : null,
      description: completed ? conclusionDescription : null,
      selectedHypothesisId: investigation?.selectedHypothesisId ?? null,
      completed,
    },
  });
}
