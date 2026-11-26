import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXPECTED_BRANCH = 'br-weathered-morning-avxi748p';
const EXPECTED_GIT_BRANCH = 'fix/ev001-hypothesis-conclusion-consistency';

export async function GET() {
  if (
    process.env.VERCEL_ENV !== 'preview' ||
    process.env.VERCEL_GIT_COMMIT_REF !== EXPECTED_GIT_BRANCH
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const raw = process.env.DATABASE_URL;
    if (!raw) {
      return NextResponse.json({ ok: false, databaseConfigured: false }, { status: 503 });
    }

    const parsed = new URL(raw);
    const qaTargetMatch = parsed.hostname.includes(EXPECTED_BRANCH);
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      databaseConnected: true,
      qaTargetMatch,
      databaseName: parsed.pathname.slice(1),
    });
  } catch {
    return NextResponse.json(
      { ok: false, databaseConnected: false, qaTargetMatch: false },
      { status: 503 },
    );
  }
}
