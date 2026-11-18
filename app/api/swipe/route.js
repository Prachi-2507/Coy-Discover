import { NextResponse } from 'next/server';
import { load, save, publicProfile } from '@/lib/db';
export const dynamic = 'force-dynamic';

// POST /api/swipe { profileId, direction: 'like' | 'pass' } -> { match, profile? }
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { profileId, direction } = body || {};
  if (!['like', 'pass'].includes(direction)) {
    return NextResponse.json({ error: 'direction must be "like" or "pass"' }, { status: 400 });
  }
  const db = load();
  const profile = db.profiles.find(p => p.id === profileId);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  if (db.swipes.some(s => s.profileId === profileId)) {
    return NextResponse.json({ error: 'Already swiped' }, { status: 409 });
  }

  const at = new Date().toISOString();
  db.swipes.push({ profileId, direction, at });
  // Match only when mutual: user liked AND profile already liked the user.
  const match = direction === 'like' && profile.likedMe === true;
  if (match) db.matches.push({ profileId, at });
  save(db);

  return NextResponse.json(match ? { match: true, profile: publicProfile(profile) } : { match: false });
}
