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

  return (
    <div
      className="flex flex-col h-screen overflow-hidden text-[#F5E6D0] transition-colors duration-500 ease-in-out"
      style={{
        backgroundColor: "var(--ambient-bg, #120B08)",
      }}
    >
      {/* ── App-wide dynamic atmospheric top tint — clean gradient, no smoky blobs ── */}
      <div
        key={`ambient-${level}-${activeCategory}-${selectedGem?.id ?? 'none'}`}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[45vh] -z-10 transition-all duration-700 ease-in-out opacity-80"
        style={{
          background: `linear-gradient(180deg, rgba(${primaryRgbStr}, 0.22) 0%, transparent 100%)`
        }}
      />

      {/* Category-specific SVG Atmosphere Artwork (Level 2 & Level 3) */}
      <CategoryAtmosphere category={activeCategory} variant="background" />

      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        {/* Main content — transitions smoothly with ambient background */}
        <main
          className="relative flex-1 overflow-hidden transition-colors duration-500 ease-in-out flex flex-col"
          style={{
            backgroundColor: "var(--ambient-bg, #140C08)",
          }}
        >
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
