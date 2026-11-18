
import { NextResponse } from 'next/server';
import { reset } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is disabled in production.' },
      { status: 403 }
    );
  }

  reset();

  return NextResponse.json({ ok: true });
}
