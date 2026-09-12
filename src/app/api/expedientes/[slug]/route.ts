import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import { canDiscover } from '@/src/lib/security';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const u = await currentUser();

  if (!u) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    );
  }

  const { slug } = await params;
  const body = await req.json().catch(() => ({}));

  const e = await prisma.expediente.findUnique({
    where: { slug },
    include: {
      evidence: true,
    },
  });

  if (!e || e.status !== 'PUBLISHED') {
    return NextResponse.json(
      { error: 'No encontrado' },
      { status: 404 }
    );
  }

  const investigation = await prisma.investigation.findUnique({
    where: {
      userId_expedienteId: {
        userId: u.id,
        expedienteId: e.id,
      },
    },
  });

  if (body.action === 'start') {
    if (investigation?.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'La investigación ya está cerrada' },
        { status: 409 }
      );
    }

    const inv = await prisma.investigation.upsert({
      where: {
        userId_expedienteId: {
          userId: u.id,
          expedienteId: e.id,
        },
      },
      update: {},
      create: {
        userId: u.id,
        expedienteId: e.id,
        status: 'IN_PROGRESS',
      },
    });

    return NextResponse.json({
      ok: true,
      investigation: inv,
    });
  }

  if (
    body.action === 'discover' &&
    typeof body.evidenceId === 'string'
  ) {
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

    const evidence = e.evidence.find(
      x => x.id === body.evidenceId
    );

    if (!evidence) {
      return NextResponse.json(
        { error: 'Evidencia inválida' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async tx => {
      const existing = await tx.discovery.findUnique({
        where: {
          userId_evidenceId: {
            userId: u.id,
            evidenceId: evidence.id,
          },
        },
      });

      const count = await tx.discovery.count({
        where: {
          userId: u.id,
          evidence: {
            expedienteId: e.id,
          },
        },
      });

      if (existing) {
        return {
          created: false,
          progress: investigation.progress,
          status: investigation.status,
        };
      }

      if (!canDiscover(evidence.unlockAfter, count)) {
        return {
          created: false,
          blocked: true,
          progress: Math.round(
            count / Math.max(e.evidence.length, 1) * 100
          ),
          status: investigation.status,
        };
      }

      await tx.discovery.create({
        data: {
          userId: u.id,
          evidenceId: evidence.id,
        },
      });

      const discovered = count + 1;

      const progress = Math.round(
        discovered / Math.max(e.evidence.length, 1) * 100
      );

      const status =
        progress >= 100
          ? 'COMPLETED'
          : 'IN_PROGRESS';

      const inv = await tx.investigation.update({
        where: {
          id: investigation.id,
        },
        data: {
          progress,
          status,
        },
      });

      return {
        created: true,
        progress: inv.progress,
        status: inv.status,
      };
    });

    return NextResponse.json({
      ok: true,
      ...result,
    });
  }

  return NextResponse.json(
    { error: 'Acción inválida' },
    { status: 400 }
  );
}
