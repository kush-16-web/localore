import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import RightPanel from './RightPanel';
import BottomNav from './BottomNav';
import { useGemPanel } from '../../context/GemPanelContext';
import { useColorThief } from '../../hooks/useColorThief';

const FALLBACK_ACCENT = '232,116,58'; // brand orange #E8743A

export default function Layout({ children }: { children: React.ReactNode }) {
  const { selectedGem, closePanel, toggleUpvote, likeGem, toggleBookmark } = useGemPanel();

  // YT Music-style ambient colour — computed once here for the WHOLE app shell
  const { rgb, palette } = useColorThief(selectedGem?.image ?? '');
  const accent = rgb.length === 3 ? rgb.join(',') : FALLBACK_ACCENT;
  const accentSoft = palette?.[2]?.length === 3 ? palette[2].join(',') : accent;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0D0805]">
      {/* ── App-wide ambient wash — sits behind every surface ── */}
      <div
        key={selectedGem?.id ?? 'none'}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          animation: 'ambientFade 900ms ease',
          background: `
            radial-gradient(120% 90% at 20% 0%, rgba(${accent},0.12), transparent 60%),
            radial-gradient(100% 80% at 85% 5%, rgba(${accentSoft},0.10), transparent 65%),
            radial-gradient(90% 70% at 50% 25%, rgba(${accent},0.08), transparent 70%),
            linear-gradient(to bottom, rgba(${accent},0.05), transparent 75%)`
        }}
      />
      <style>{`
        @keyframes ambientFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <Header accent={accent} accentSoft={accentSoft} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar accent={accent} accentSoft={accentSoft} />
        {/* Main content — subtle low-contrast ambient illumination (20-30% intensity) */}
        <main className="relative flex-1 bg-[#100A06]/40 backdrop-blur-xl overflow-hidden flex flex-col">
          {/* Dedicated main content dynamic color wash with lowered contrast */}
          <div
            key={`main-ambient-${selectedGem?.id ?? 'none'}`}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              animation: 'ambientFade 900ms ease',
              background: `
                radial-gradient(100% 70% at 50% 0%, rgba(${accent},0.09), transparent 75%),
                radial-gradient(85% 65% at 20% 35%, rgba(${accentSoft},0.07), transparent 70%),
                radial-gradient(80% 60% at 80% 55%, rgba(${accent},0.06), transparent 65%),
                linear-gradient(to bottom, rgba(${accent},0.04), transparent 55%)
              `
            }}
          />
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
          onLikeGem={likeGem}
          onBookmarkToggle={toggleBookmark}
        />
      </div>
      {/* BottomNav — fixed positioned, mobile only */}
      <BottomNav />
    </div>
  );
}
