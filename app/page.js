'use client';
import { useState } from 'react';
import Discover from '@/components/Discover';

export default function Page() {
  const [tab, setTab] = useState('discover');
  return (
    <div className="app">
      <main className="content">
        {tab === 'home' ? <div /> : <Discover />}
      </main>
      <nav className="tabbar">
        <button className={tab === 'home' ? 'on' : ''} onClick={() => setTab('home')}>🏠<span>Home</span></button>
        <button className={tab === 'discover' ? 'on' : ''} onClick={() => setTab('discover')}>🔥<span>Discover</span></button>
      </nav>
    </div>
  );
}
