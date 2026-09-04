import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

export async function GET(
  _: Request,
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

  const expediente = await prisma.expediente.findFirst({
    where: {
      id,
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      conclusionTitle: true,
      conclusion: true,
    },
  });

  if (!expediente) {
    return NextResponse.json(
      { error: 'No encontrado' },
      { status: 404 }
    );
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
    return NextResponse.json(
      { error: 'Investigación no iniciada' },
      { status: 409 }
    );
  }

  const found = await prisma.discovery.count({
    where: {
      userId: user.id,
      evidence: {
        expedienteId: id,
      },
    },
  });

  const [clues, questions, theories, hypotheses, timeline] =
    await Promise.all([
      prisma.clue.findMany({
        where: {
          expedienteId: id,
          status: 'PUBLISHED',
          unlockAfter: { lte: found },
        },
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      }),

      prisma.question.findMany({
        where: {
          expedienteId: id,
          status: 'PUBLISHED',
          unlockAfter: { lte: found },
        },
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      }),

      prisma.theory.findMany({
        where: {
          expedienteId: id,
          status: 'PUBLISHED',
          unlockAfter: { lte: found },
        },
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      }),

      prisma.hypothesis.findMany({
        where: {
          expedienteId: id,
          status: 'PUBLISHED',
          unlockAfter: { lte: found },
        },
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      }),

      prisma.timelineEvent.findMany({
        where: {
          expedienteId: id,
          status: 'PUBLISHED',
          unlockAfter: { lte: found },
        },
        orderBy: [
          { unlockAfter: 'asc' },
          { sortOrder: 'asc' },
        ],
      }),
    ]);

  return NextResponse.json({
    clues,
    questions,
    theories,
    hypotheses: hypotheses.map(({ isCorrect, ...h }) => h),
    timeline,
    conclusion: {
      title:
        investigation.status === 'COMPLETED'
          ? expediente.conclusionTitle
          : null,

      description:
        investigation.status === 'COMPLETED'
          ? expediente.conclusion
          : null,

      selectedHypothesisId:
        investigation.selectedHypothesisId ?? null,

      completed:
        investigation.status === 'COMPLETED',
    },
  });
}
