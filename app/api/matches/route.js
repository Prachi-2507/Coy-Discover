import { NextResponse } from 'next/server';
import { load, publicProfile } from '@/lib/db';
export const dynamic = 'force-dynamic';

// GET /api/matches — mutual matches only, newest first
export async function GET() {
  const db = load();
  const matches = [...db.matches].reverse()
    .map(m => {
      const p = db.profiles.find(x => x.id === m.profileId);
      return p ? { ...publicProfile(p), matchedAt: m.at } : null;
    })
    .filter(Boolean);
  return NextResponse.json({ matches });
}
