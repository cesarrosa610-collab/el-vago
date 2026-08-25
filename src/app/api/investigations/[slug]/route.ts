import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { currentUser } from '@/src/lib/auth';
import { canDiscover } from '@/src/lib/security';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { slug } = await params;
  const e = await prisma.expediente.findUnique({ where: { slug }, include: { evidence: { orderBy: { unlockAfter: 'asc' } } } });
  if (!e || e.status !== 'PUBLISHED') return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  const inv = await prisma.investigation.findUnique({ where: { userId_expedienteId: { userId: u.id, expedienteId: e.id } } });
  const discoveries = await prisma.discovery.findMany({ where: { userId: u.id, evidence: { expedienteId: e.id } }, select: { evidenceId: true } });
  const discoveredIds = discoveries.map(x => x.evidenceId);
  const discoveredCount = discoveredIds.length;
  const evidence = e.evidence.map(x => ({
    id: x.id, code: x.code, title: x.title,
    description: canDiscover(x.unlockAfter, discoveredCount) || discoveredIds.includes(x.id) ? x.description : null,
    unlockAfter: x.unlockAfter,
    unlocked: canDiscover(x.unlockAfter, discoveredCount) || discoveredIds.includes(x.id),
    discovered: discoveredIds.includes(x.id),
  }));
  return NextResponse.json({ expediente: { id: e.id, code: e.code, title: e.title, slug: e.slug, description: e.description }, investigation: inv, evidence });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const { slug } = await params;
  const body = await req.json().catch(() => ({}));
  const e = await prisma.expediente.findUnique({ where: { slug }, include: { evidence: true } });
  if (!e || e.status !== 'PUBLISHED') return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  if (body.action === 'start') {
    const inv = await prisma.investigation.upsert({
      where: { userId_expedienteId: { userId: u.id, expedienteId: e.id } },
      update: { status: 'IN_PROGRESS' },
      create: { userId: u.id, expedienteId: e.id, status: 'IN_PROGRESS' }
    });
    return NextResponse.json({ ok: true, investigation: inv });
  }

  if (body.action === 'discover' && typeof body.evidenceId === 'string') {
    const evidence = e.evidence.find(x => x.id === body.evidenceId);
    if (!evidence) return NextResponse.json({ error: 'Evidencia inválida' }, { status: 400 });

    const result = await prisma.$transaction(async tx => {
      const existing = await tx.discovery.findUnique({ where: { userId_evidenceId: { userId: u.id, evidenceId: evidence.id } } });
      if (existing) {
        const inv = await tx.investigation.upsert({
          where: { userId_expedienteId: { userId: u.id, expedienteId: e.id } },
          update: {}, create: { userId: u.id, expedienteId: e.id }
        });
        return { created: false, progress: inv.progress };
      }
      const count = await tx.discovery.count({ where: { userId: u.id, evidence: { expedienteId: e.id } } });
      if (evidence.unlockAfter > count) return { created: false, blocked: true, progress: count / Math.max(e.evidence.length, 1) * 100 };
      await tx.discovery.create({ data: { userId: u.id, evidenceId: evidence.id } });
      const discovered = count + 1;
      const progress = Math.round(discovered / Math.max(e.evidence.length, 1) * 100);
      const inv = await tx.investigation.upsert({
        where: { userId_expedienteId: { userId: u.id, expedienteId: e.id } },
        update: { progress, status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS' },
        create: { userId: u.id, expedienteId: e.id, progress, status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS' }
      });
      return { created: true, progress: inv.progress };
    });
    return NextResponse.json({ ok: true, ...result });
  }

  return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
}
