import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import RightPanel from './RightPanel';
import BottomNav from './BottomNav';
import { useGemPanel } from '../../context/GemPanelContext';
import { useAmbientTheme } from '../../context/AmbientThemeContext';
import CategoryAtmosphere from '../Atmosphere/CategoryAtmosphere';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { selectedGem, closePanel, toggleUpvote, toggleBookmark } = useGemPanel();
  const { palette, activeCategory, level } = useAmbientTheme();

  const primaryRgbStr = palette.primaryRgb.join(',');
  const secondaryRgbStr = palette.secondaryRgb.join(',');

  return (
    <div
      className="flex flex-col h-screen overflow-hidden text-[#F5E6D0] transition-colors duration-500 ease-in-out"
      style={{
        backgroundColor: "var(--ambient-bg, #120B08)",
      }}
    >
      {/* ── App-wide dynamic ambient wash — Level 1 / Level 2 / Level 3 ── */}
      <div
        key={`ambient-${level}-${activeCategory}-${selectedGem?.id ?? 'none'}`}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[65vh] -z-10 transition-all duration-700 ease-in-out"
        style={{
          background: `
            radial-gradient(125% 90% at 20% 0%, rgba(${primaryRgbStr}, 0.28), transparent 65%),
            radial-gradient(100% 80% at 85% 5%, rgba(${secondaryRgbStr}, 0.18), transparent 65%),
            linear-gradient(to bottom, rgba(${primaryRgbStr}, 0.08), transparent)`
        }}
      />

      {/* Category-specific SVG Atmosphere Artwork (Level 2 & Level 3) */}
      <CategoryAtmosphere category={activeCategory} variant="background" />

      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        {/* Main content — transitions smoothly with ambient background */}
        <main
          className="flex-1 overflow-hidden transition-colors duration-500 ease-in-out"
          style={{
            backgroundColor: "var(--ambient-bg, #140C08)",
          }}
        >
          {children}
        </main>
        {/* RightPanel / BottomSheet — frame-level sibling of main */}
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
