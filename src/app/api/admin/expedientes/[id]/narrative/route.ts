import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';

type NarrativeType =
  | 'CLUE'
  | 'QUESTION'
  | 'THEORY'
  | 'HYPOTHESIS'
  | 'TIMELINE';

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
          'Solo se puede agregar contenido narrativo a un DRAFT',
      },
      { status: 409 }
    );
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: 'Datos inválidos' },
      { status: 400 }
    );
  }

  const type = body.type as NarrativeType;

  const allowedTypes: NarrativeType[] = [
    'CLUE',
    'QUESTION',
    'THEORY',
    'HYPOTHESIS',
    'TIMELINE',
  ];

  if (!allowedTypes.includes(type)) {
    return NextResponse.json(
      { error: 'Tipo narrativo inválido' },
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

  const narrativeBody =
    typeof body.body === 'string'
      ? body.body.trim()
      : '';

  const unlockAfter = Number(body.unlockAfter);
  const sortOrder = Number(body.sortOrder ?? 0);
  const isCorrect =
    type === 'HYPOTHESIS'
      ? Boolean(body.isCorrect)
      : false;

  if (
    !code ||
    !narrativeBody ||
    !Number.isInteger(unlockAfter) ||
    unlockAfter < 0 ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0
  ) {
    return NextResponse.json(
      {
        error:
          'Código, contenido, unlockAfter y sortOrder válidos son requeridos',
      },
      { status: 400 }
    );
  }

  if (type !== 'QUESTION' && !title) {
    return NextResponse.json(
      { error: 'El título es requerido' },
      { status: 400 }
    );
  }

  try {
    switch (type) {
      case 'CLUE':
        await prisma.clue.create({
          data: {
            expedienteId: id,
            code,
            title,
            description: narrativeBody,
            unlockAfter,
            sortOrder,
            status: 'PUBLISHED',
          },
        });
        break;

      case 'QUESTION':
        await prisma.question.create({
          data: {
            expedienteId: id,
            code,
            text: narrativeBody,
            unlockAfter,
            sortOrder,
            status: 'PUBLISHED',
          },
        });
        break;

      case 'THEORY':
        await prisma.theory.create({
          data: {
            expedienteId: id,
            code,
            title,
            description: narrativeBody,
            unlockAfter,
            sortOrder,
            status: 'PUBLISHED',
          },
        });
        break;

      case 'HYPOTHESIS':
        await prisma.hypothesis.create({
          data: {
            expedienteId: id,
            code,
            title,
            description: narrativeBody,
            isCorrect,
            unlockAfter,
            sortOrder,
            status: 'PUBLISHED',
          },
        });
        break;

      case 'TIMELINE':
        await prisma.timelineEvent.create({
          data: {
            expedienteId: id,
            code,
            label: title,
            description: narrativeBody,
            unlockAfter,
            sortOrder,
            status: 'PUBLISHED',
          },
        });
        break;
    }

    return NextResponse.json(
      { ok: true },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          'No se pudo guardar. Verifica que el código no esté repetido.',
      },
      { status: 409 }
    );
  }
}
