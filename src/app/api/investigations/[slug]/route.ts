import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const e = await prisma.expediente.findUnique({
    where: { slug },
    include: {
      evidence: {
        where: {
          status: 'PUBLISHED',
          unlockAfter: 0,
        },
        orderBy: { unlockAfter: 'asc' },
      },
    },
  });

  if (!e || e.status !== 'PUBLISHED') {
    return NextResponse.json(
      { error: 'No encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: e.id,
    code: e.code,
    title: e.title,
    slug: e.slug,
    description: e.description,
    category: e.category,
    difficulty: e.difficulty,
    evidence: e.evidence.map(x => ({
      id: x.id,
      code: x.code,
      title: x.title,
      unlockAfter: x.unlockAfter,
      description: x.description,
    })),
  });
}
