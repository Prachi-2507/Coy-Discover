# Coy — Discover tab

Next.js 14 (App Router) + API routes, JSON-file persistence (`data/db.json`, auto-created on first request).

## Run
    npm install
    npm run dev   # http://localhost:3000 (use mobile view in devtools for drag gestures)

## API
- `GET /api/feed` — unswiped profiles (never includes like info)
- `POST /api/swipe` `{profileId, direction: "like"|"pass"}` → `{match, profile?}`
- `GET /api/matches` — mutual matches
- `POST /api/reset` — restore seed data (demo helper)

## Privacy
`likedMe` exists only in server-side data and is stripped by `publicProfile()`. The feed order is shuffled
so it can't leak who liked you. A match is only created and returned when the like is mutual.
Delete `data/db.json` (or call `/api/reset`) to restart the demo. 10 of 30 seeded profiles have liked you.
