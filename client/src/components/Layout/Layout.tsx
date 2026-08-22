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
  const { rgb, palette } = useColorThief(selectedGem?.image ?? '');
  const accent = rgb.length === 3 ? rgb.join(',') : FALLBACK_ACCENT;
  const accentSoft = palette?.[2]?.length === 3 ? palette[2].join(',') : accent;

  return (
    <div className="flex flex-col h-screen">
      {/* ── App-wide ambient wash — sits behind every surface ── */}
      <div
        key={selectedGem?.id ?? 'none'}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] -z-10"
        style={{
          animation: 'ambientFade 900ms ease',
          background: `
            radial-gradient(120% 90% at 20% 0%, rgba(${accent},0.34), transparent 60%),
            radial-gradient(100% 80% at 85% 5%, rgba(${accentSoft},0.22), transparent 65%),
            linear-gradient(to bottom, rgba(${accent},0.14), transparent)`
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
        {/* Main content — shrinks naturally when RightPanel is open */}
        <main className="flex-1 bg-[#140C08]/85 overflow-hidden">
          {children}
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
