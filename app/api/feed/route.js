import { NextResponse } from 'next/server';
import { load, publicProfile } from '@/lib/db';
export const dynamic = 'force-dynamic';

// GET /api/feed — profiles not yet swiped on (no like info exposed)
export async function GET() {
  const db = load();
  const swiped = new Set(db.swipes.map(s => s.profileId));
  return NextResponse.json({ profiles: db.profiles.filter(p => !swiped.has(p.id)).map(publicProfile) });
}
