import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import GemDetails, { GemActions, GemMap, NarrationTeaser } from '../GemCard/GemDetails';
import { useAmbientTheme } from '../../context/AmbientThemeContext';
import CategoryAtmosphere from '../Atmosphere/CategoryAtmosphere';
import type { GemCardData } from '../MasonryGrid';

type RightPanelProps = {
  gem: GemCardData | null;
  onClose: () => void;
  isOpen: boolean;
  onUpvoteToggle?: (id: string | number) => void;
  onBookmarkToggle?: (id: string | number) => void;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function RightPanel({ gem, onClose, isOpen, onUpvoteToggle, onBookmarkToggle }: RightPanelProps) {
  const isMobile = useIsMobile();
  const { palette } = useAmbientTheme();

  const primaryRgbStr = palette.primaryRgb.join(',');
  const secondaryRgbStr = palette.secondaryRgb.join(',');

  return (
    <>
      {/* ── Desktop panel — Level 3 Immersive Gem Atmosphere ───────────────── */}
      <aside
        className={`relative hidden md:block
          h-full flex-shrink-0
          transition-all duration-300 ease-in-out overflow-hidden border-l border-white/10
          ${isOpen ? 'w-[400px] xl:w-[460px]' : 'w-0'}
        `}
        style={{
          backgroundColor: 'var(--ambient-surface-raised, #1C1410)',
        }}
      >
        {/* Subtle Ambient Glow and Category SVG Artwork */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(120% 60% at 50% 0%, rgba(${primaryRgbStr}, 0.28), transparent 70%)`,
          }}
        />

        {gem && <CategoryAtmosphere category={gem.category} variant="panel" />}

        {/* Floating close */}
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="absolute right-5 top-5 z-20 grid h-9 w-9 place-items-center cursor-pointer 
            rounded-full bg-black/40 text-[#F5E6D0] backdrop-blur-md ring-1 ring-white/10
            active:scale-90 hover:text-[#cd5a0e] transition-all"
        >
          <i className="ti ti-x text-lg" />
        </button>

        <div className="relative h-full flex flex-col">
          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-transparent">
            {gem ? (
              <div className="px-6 pt-16 pb-6 space-y-6">
                {/* Big cover art */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]">
                  <img src={gem.image} alt={gem.title} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-lg bg-black/45 px-2.5 py-1 text-[11px] font-medium text-[#F5E6D0] backdrop-blur-md">
                    {gem.category}
                  </span>
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-[#E8743A] px-2.5 py-1 text-[11px] font-bold text-[#120B08] shadow-md">
                    <i className="ti ti-map-pin text-[11px]" />
                    {gem.area}
                  </span>
                </div>

                {/* Title + meta */}
                <div>
                  <h2
                    className="text-[24px] font-bold leading-tight text-[#F5E6D0]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {gem.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#A07050]">
                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 backdrop-blur-sm">
                      <i className="ti ti-clock text-[#E8743A]" />
                      {gem.hours}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 backdrop-blur-sm">
                      <i className="ti ti-heart text-[#E8743A]" />
                      {gem.upvotes}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-7 text-[#C8A888]">{gem.description}</p>

                {/* Voice narration — coming soon */}
                <NarrationTeaser />

                {/* Map */}
                <GemMap gem={gem} />
              </div>
            ) : (
              <p className="text-[#6B4830] text-sm text-center mt-16 px-6">
                Select a gem to view its details.
              </p>
            )}
          </div>

          {/* Pinned action bar */}
          {gem && (
            <div className="relative shrink-0 border-t border-white/10 bg-[#120B08]/80 backdrop-blur-xl px-5 py-3">
              <GemActions gem={gem} onUpvoteToggle={onUpvoteToggle} onBookmarkToggle={onBookmarkToggle} />
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile bottom sheet ───────────────────────────────────────── */}
      <Drawer.Root open={isOpen && isMobile} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[998] md:hidden" />

          <Drawer.Content
            className="fixed inset-x-0 bottom-0 z-[999] md:hidden
              h-[92dvh] outline-none rounded-t-3xl border-t border-white/15
              shadow-[0_-16px_50px_rgba(0,0,0,0.7)]
              flex flex-col overflow-hidden transition-colors duration-500"
            style={{
              backgroundColor: 'var(--ambient-surface-raised, #1C1410)',
            }}
          >
            {/* Dynamic ambient wash for mobile drawer */}
            {gem && (
              <>
                <div
                  className="absolute inset-x-0 top-0 h-[60%] pointer-events-none transition-all duration-700"
                  style={{
                    background: `linear-gradient(to bottom, rgba(${primaryRgbStr}, 0.38), rgba(${secondaryRgbStr}, 0.12) 60%, transparent)`
                  }}
                />
                <CategoryAtmosphere category={gem.category} variant="panel" />
              </>
            )}

            {/* Drag handle */}
            <div className="relative z-10 shrink-0 flex justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
              <div className="h-1.5 w-11 rounded-full bg-white/30" />
            </div>

            <Drawer.Title className="sr-only">{gem?.title}</Drawer.Title>

            {/* Floating close */}
            {/* <button
              onClick={onClose}
              aria-label="Close panel"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center
                rounded-full bg-black/40 text-[#F5E6D0] backdrop-blur-md ring-1 ring-white/10
                active:scale-90 hover:text-[#cd5a0e] transition-all"
            >
              <i className="ti ti-x text-lg" />
            </button> */}

            {/* Scrollable body */}
            <div className="relative z-10 flex-1 overflow-y-auto overscroll-y-contain px-5 pt-3 pb-8 space-y-5 scrollbar-none">
              {gem && <GemDetails gem={gem} />}
            </div>

            {/* Pinned action bar — thumb zone */}
            {gem && (
              <div
                className="relative z-10 shrink-0 border-t border-white/10 bg-[#120B08]/80 backdrop-blur-xl
                  px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
              >
                <div className="mx-auto max-w-md">
                  <GemActions gem={gem} onUpvoteToggle={onUpvoteToggle} onBookmarkToggle={onBookmarkToggle} />
                </div>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
