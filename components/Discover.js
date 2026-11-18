'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const THRESHOLD = 110;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Shows the photo; falls back to a gradient with the initial if it fails to load.
function Img({ p }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="ph">{p.name[0]}</div>;
  return <img src={p.photo} alt={p.name} draggable={false} onError={() => setFailed(true)} />;
}

function Photo({ p }) {
  return (
    <>
      <Img p={p} />
      <div className="info">
        <h2>{p.name}, {p.age}</h2>
        <div className="city">📍 {p.city}</div>
        <p>{p.bio}</p>
        <div className="chips">{p.interests.map(i => <span key={i}>{i}</span>)}</div>
      </div>
    </>
  );
}

export default function Discover() {
  const [view, setView] = useState('swipe');
  const [feed, setFeed] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchProfile, setMatchProfile] = useState(null);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exit, setExit] = useState(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState(false);
  const startX = useRef(0);
  const loadFeed = useCallback(async () => {
    setError(false);
    try {
      const r = await fetch('/api/feed', { cache: 'no-store' });
      if (!r.ok) throw new Error('feed failed');
      setFeed((await r.json()).profiles);
    } catch {
      setError(true);
    }
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      const r = await fetch('/api/matches', { cache: 'no-store' });
      if (!r.ok) throw new Error('matches failed');
      setMatches((await r.json()).matches);
    } catch {
      setToast("Couldn't load matches.");
      setTimeout(() => setToast(''), 2000);
    }
  }, []);
  useEffect(() => { loadFeed(); }, [loadFeed]);
  useEffect(() => { if (view === 'matches') loadMatches(); }, [view, loadMatches]);

  const top = feed && feed[0];
  const next = feed && feed[1];

  const swipe = useCallback(async (dir) => {
    if (exit || !top || matchProfile) return;
    setExit(dir);
    const id = top.id;
    const [res] = await Promise.all([
      fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: id, direction: dir }),
      }).then(async r => ({ status: r.status, ok: r.ok, data: await r.json() })).catch(() => null),
      sleep(280),
    ]);
    if (!res || (!res.ok && res.status !== 409)) {
      setExit(null); setDx(0);
      setToast('Something went wrong. Try again.');
      setTimeout(() => setToast(''), 2000);
      return;
    }
    setFeed(f => f.filter(p => p.id !== id));
    setExit(null); setDx(0);
    if (res.data.match) setMatchProfile(res.data.profile);
  }, [exit, top, matchProfile]);

  // Keyboard support on desktop
  useEffect(() => {
    const h = e => {
      if (view !== 'swipe') return;
      if (e.key === 'ArrowRight') swipe('like');
      if (e.key === 'ArrowLeft') swipe('pass');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [swipe, view]);

  const onDown = e => { if (exit) return; setDragging(true); startX.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = e => { if (dragging) setDx(e.clientX - startX.current); };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dx) > THRESHOLD) swipe(dx > 0 ? 'like' : 'pass'); else setDx(0);
  };

  const eff = exit === 'like' ? 700 : exit === 'pass' ? -700 : dx;
  const cardStyle = {
    transform: `translateX(${eff}px) rotate(${eff / 20}deg)`,
    transition: dragging ? 'none' : 'transform .28s ease-out',
  };
  const likeOp = Math.min(Math.max(eff / THRESHOLD, 0), 1);
  const nopeOp = Math.min(Math.max(-eff / THRESHOLD, 0), 1);

  return (
    <div className="discover">
      <div className="subtabs">
        <button className={view === 'swipe' ? 'on' : ''} onClick={() => setView('swipe')}>Swipe</button>
        <button className={view === 'matches' ? 'on' : ''} onClick={() => setView('matches')}>Matches</button>
      </div>

      {view === 'swipe' && (
        <>
          <div className="stack">
            {feed === null && !error && <div className="empty">Loading…</div>}
            {feed === null && error && (
              <div className="empty">
                <div className="big">😕</div>
                <h3>Couldn't load profiles</h3>
                <p>Check your connection and try again.</p>
                <button className="primary retry" onClick={loadFeed}>Retry</button>
              </div>
            )}
            {next && <div className="card behind" key={next.id}><Photo p={next} /></div>}
                 {feed && feed.length === 0 && (
  <div className="empty">
    <div className="big">💌</div>
    <h3>You're all caught up!</h3>
    <p>You've viewed all available profiles.</p>
  </div>
)} 
            {top && (
              <div key={top.id} className="card" style={cardStyle}
                onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
                <Photo p={top} />
                <div className="stamp like" style={{ opacity: likeOp }}>LIKE</div>
                <div className="stamp nope" style={{ opacity: nopeOp }}>PASS</div>
              </div>
            )}
          </div>
          {top && (
            <div className="actions">
              <button className="act pass" onClick={() => swipe('pass')} aria-label="Pass">✕</button>
              <button className="act like" onClick={() => swipe('like')} aria-label="Like">♥</button>
            </div>
          )}
        </>
      )}

      {view === 'matches' && (
        <div className="matches">
          {matches.length === 0 ? (
            <div className="empty"><div className="big">💌</div><h3>No matches yet</h3><p>Matches appear only when you both like each other.</p></div>
          ) : matches.map(m => (
            <div className="mrow" key={m.id}>
             <Img p={m} />
              <div><b>{m.name}, {m.age}</b><div className="city">📍 {m.city}</div></div>
            </div>
          ))}
        </div>
      )}

      {matchProfile && (
        <div className="overlay">
          <h1>It's a match!</h1>
          <img src={matchProfile.photo} alt={matchProfile.name} />
          <p>You and {matchProfile.name} liked each other.</p>
          <button className="primary" onClick={() => setMatchProfile(null)}>Keep swiping</button>
          <button className="link" onClick={() => { setMatchProfile(null); setView('matches'); }}>View matches</button>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
