import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import RightPanel from './RightPanel';
import BottomNav from './BottomNav';
import { useGemPanel } from '../../context/GemPanelContext';
import { useColorThief } from '../../hooks/useColorThief';

const FALLBACK_ACCENT = '232,116,58'; // brand orange #E8743A

export default function Layout({ children }: { children: React.ReactNode }) {
  const { selectedGem, closePanel, toggleUpvote, toggleBookmark } = useGemPanel();

  // YT Music-style ambient colour — computed once here for the WHOLE app shell
  const { rgb } = useColorThief(selectedGem?.image ?? '');
  const accent = rgb.length === 3 ? rgb.join(',') : FALLBACK_ACCENT;

  return (
    <div
      className="flex flex-col h-screen overflow-hidden bg-[#0D0805]"
      style={{ '--accent-rgb': accent } as React.CSSProperties}
    >
      {/* ── Clean app-wide ambient top glow — no smoky or glossy blob shadows ── */}
      <div
        key={selectedGem?.id ?? 'none'}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          animation: 'ambientFade 900ms ease',
          background: `linear-gradient(180deg, rgba(${accent}, 0.12) 0%, rgba(13, 8, 5, 0.95) 45%, #0D0805 100%)`
        }}
      />
      <style>{`
        @keyframes ambientFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        {/* Main content — clean solid dark canvas without smoky or glossy shadows */}
        <main className="relative flex-1 bg-[#120B08] overflow-hidden flex flex-col">
          <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </main>
        {/* RightPanel — frame-level sibling of main, just like Sidebar */}
        <RightPanel
          gem={selectedGem}
          onClose={closePanel}
          isOpen={Boolean(selectedGem)}
          onUpvoteToggle={toggleUpvote}
          onBookmarkToggle={toggleBookmark}
        />
      </div>
      {/* BottomNav — fixed positioned, mobile only */}
      <BottomNav />
    </div>
  );
}
