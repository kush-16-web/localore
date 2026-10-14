import { useState, useEffect } from 'react';
import {
  Bookmark,
  Navigation,
  Heart,
  MoreHorizontal,
  MapPin,
  Clock,
  X,
  Check,
} from 'lucide-react';
import { formatDistance } from '../../utils/geo';
import { RoadIcon } from '../common/RoadIcon';
import { NarrationTeaser } from '../GemCard/GemDetails';
import MobileGemSheet from '../GemCard/MobileGemSheet';
import { useColorThief } from '../../hooks/useColorThief';
import type { GemCardData } from '../MasonryGrid';

type RightPanelProps = {
  gem: GemCardData | null;
  onClose: () => void;
  isOpen: boolean;
  onUpvoteToggle?: (id: string | number) => void;
  onLikeGem?: (id: string | number) => void;
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

const FALLBACK_ACCENT = '232,116,58'; // brand orange #E8743A

const CATEGORY_ALTERNATES: Record<string, string[]> = {
  "Scenic viewpoints": [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  ],
  Viewpoint: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  ],
  "Cafés and food": [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
  ],
  Cafés: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
  ],
  "Street food": [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  ],
  "Nature and parks": [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  ],
  Nature: [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
  ],
  "Arts and culture": [
    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80",
  ],
  Heritage: [
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  ],
  "Historic places": [
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
  ],
  Shopping: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
  ],
};

const DEFAULT_ALTERNATES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
];

export default function RightPanel({
  gem,
  onClose,
  isOpen,
  onUpvoteToggle,
  onLikeGem,
  onBookmarkToggle,
}: RightPanelProps) {
  const isMobile = useIsMobile();

  // Dynamic colour extracted from the cover image
  const { rgb, palette } = useColorThief(gem?.image ?? '');
  const accent = rgb.length === 3 ? rgb.join(',') : FALLBACK_ACCENT;
  const accentSoft = palette?.[2]?.length === 3 ? palette[2].join(',') : accent;

  const [activeImage, setActiveImage] = useState<string>(gem?.image ?? '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (gem?.image) {
      setActiveImage(gem.image);
    }
  }, [gem?.id, gem?.image]);

  const directionsUrl = gem?.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${gem.coordinates.lat},${gem.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${gem?.title ?? ''} ${gem?.area ?? ''}`
      )}`;

  const handleShare = async () => {
    if (!gem) return;
    const shareData = {
      title: gem.title,
      text: `Check out ${gem.title} in ${gem.area} on Localore!`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  const distanceText =
    gem?.distanceKm !== undefined ? formatDistance(gem.distanceKm) : null;

  const alternates = gem
    ? CATEGORY_ALTERNATES[gem.category] ?? DEFAULT_ALTERNATES
    : DEFAULT_ALTERNATES;
  const thumbnails = gem ? [gem.image, alternates[0], alternates[1]] : [];

  return (
    <>
      {/* ── Desktop panel — Cinematic Full-Bleed Atmospheric UI ── */}
      <aside
        className={`relative hidden md:block
          h-full flex-shrink-0
          transition-all duration-300 ease-in-out overflow-hidden
          border-l border-[#332010] bg-[#120B08]
          ${isOpen ? 'w-[420px] xl:w-[460px]' : 'w-0'}
        `}
      >
        {/* Subtle ambient wash derived from gem's cover art */}
        <div
          className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse 90% 45% at 50% 15%, rgba(${accent},0.18), transparent 70%), linear-gradient(to bottom, rgba(${accentSoft},0.06), transparent 50%)`,
          }}
        />

        {/* Copy Toast Notification */}
        {copied && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-[#E8743A] text-[#120B08] text-xs font-bold shadow-md flex items-center gap-1.5 animate-in fade-in duration-200">
            <Check size={14} className="stroke-[3]" />
            <span>Link copied to clipboard!</span>
          </div>
        )}

        {/* Scrollable Body Content with Full-Bleed Hero Banner */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-transparent">
          {gem ? (
            <div className="flex flex-col min-h-full">
              {/* ── 1. Full-Bleed Cinematic Hero Banner ── */}
              <div className="relative w-full h-72 shrink-0 overflow-hidden bg-[#180E09]">
                <img
                  src={activeImage}
                  alt={gem.title}
                  className="h-full w-full object-cover transition-all duration-700 scale-[1.02]"
                />
                {/* Top dark vignette for crisp button contrast */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none" />
                
                {/* Smooth dark gradient melting down seamlessly into the panel body */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#120B08] from-15% via-[#120B08]/90 via-45% via-black/30 via-75% to-transparent pointer-events-none" />

                {/* Floating Frosted Top Controls directly over the image */}
                <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onBookmarkToggle?.(gem.id)}
                      aria-label={gem.isBookmarked ? 'Remove from saved' : 'Save gem'}
                      className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer active:scale-90 shadow-none ${
                        gem.isBookmarked
                          ? 'bg-[#E8743A] text-[#120B08] border-[#E8743A]'
                          : 'bg-black/50 text-[#F5E6D0] hover:text-[#E8743A]'
                      }`}
                    >
                      <Bookmark
                        size={16}
                        className={gem.isBookmarked ? 'fill-[#120B08]' : ''}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      aria-label="Share gem"
                      className="grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[#F5E6D0] hover:text-[#E8743A] active:scale-90 transition-all cursor-pointer shadow-none"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close panel"
                    className="grid h-9 w-9 place-items-center cursor-pointer 
                      rounded-full bg-black/50 text-[#F5E6D0] backdrop-blur-md border border-white/20
                      active:scale-90 hover:text-white transition-all shadow-none"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Pill Badges floating on lower portion of Hero */}
                <div className="absolute left-5 bottom-3.5 z-10 flex items-center gap-2">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white/95 border border-white/20 flex items-center gap-1.5 shadow-md">
                    <MapPin size={12} className="text-[#E8743A]" />
                    {gem.category}
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white/95 border border-white/20 flex items-center gap-1.5 shadow-md">
                    <MapPin size={12} className="text-[#E8743A]" />
                    {gem.area}
                  </span>
                </div>
              </div>

              {/* ── 2. Unified Content Details ── */}
              <div className="px-5 pt-3 pb-8 space-y-4">
                {/* Title */}
                <h1
                  style={{
                    color: '#FFFFFF',
                    margin: 0,
                    fontFamily: "'Syne', sans-serif",
                  }}
                  className="text-2xl sm:text-[26px] font-bold !text-white leading-tight tracking-tight drop-shadow-sm"
                >
                  {gem.title}
                </h1>

                {/* Stats Row: Heart Upvotes, Road Icon for Distance, Clock for Hours */}
                <div className="flex items-center gap-5 text-xs sm:text-sm text-[#F5E6D0] pt-0.5">
                  <button
                    type="button"
                    onClick={() => onUpvoteToggle?.(gem.id)}
                    className="flex items-center gap-1.5 font-semibold text-[#F5E6D0] hover:text-[#E8743A] cursor-pointer active:scale-95 transition-transform"
                  >
                    <Heart
                      size={16}
                      className={
                        gem.isUpvoted
                          ? 'fill-[#E8743A] text-[#E8743A]'
                          : 'fill-white/20 text-white'
                      }
                    />
                    <span>{gem.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-1.5 font-medium text-white/80">
                    <RoadIcon className="w-4 h-4 text-[#E8743A] shrink-0" />
                    <span>
                      {distanceText ??
                        (gem.distanceKm !== undefined
                          ? formatDistance(gem.distanceKm)
                          : 'Nearby')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-semibold text-[#E8743A]">
                    <Clock size={15} className="text-[#E8743A] shrink-0" />
                    <span>{gem.hours || 'Hours not listed'}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm leading-relaxed text-[#D8C2B0]">
                  {gem.description}
                </p>

                {/* ── 3. 3 Photo Thumbnails Row ── */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {thumbnails.map((thumbUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(thumbUrl)}
                      className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border transition-all cursor-pointer group active:scale-95 ${
                        activeImage === thumbUrl
                          ? 'border-[#E8743A] ring-2 ring-[#E8743A]/60 scale-[1.02]'
                          : 'border-white/15 opacity-80 hover:opacity-100 hover:scale-[1.02]'
                      }`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`Photo ${idx + 1}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>

                {/* ── 4. Primary CTA: Get Directions Button (Clean, NO glossy shadow) ── */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#E8743A] hover:bg-[#D4622A] text-[#120B08] font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all no-underline cursor-pointer shadow-none"
                >
                  <Navigation size={17} className="fill-[#120B08]" />
                  <span>Get Directions</span>
                </a>

                {/* ── 5. Location & Interactive Map Embed ── */}
                <div className="rounded-2xl border border-white/10 bg-[#160E0A]/90 backdrop-blur-md overflow-hidden">
                  <div className="p-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5E6D0]">
                      <MapPin size={12} className="text-[#E8743A]" />
                      <span className="truncate max-w-[200px]">{gem.title}</span>
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#E8743A] hover:underline flex items-center gap-1 font-medium no-underline"
                    >
                      <span>Open Map</span>
                      <Navigation size={10} />
                    </a>
                  </div>
                  <div className="h-40 w-full">
                    <iframe
                      title={`Mini map of ${gem.title}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        gem.coordinates
                          ? `${gem.coordinates.lat},${gem.coordinates.lng}`
                          : `${gem.title}, ${gem.area}`
                      )}&z=15&output=embed`}
                      className="h-full w-full border-0 pointer-events-none"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* ── 6. Submitter Attribution ── */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E8743A] text-xs font-bold text-[#120B08]">
                    {gem.authorInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#F5E6D0] truncate">
                      {gem.author}
                    </p>
                    <p className="text-[10px] text-[#8B654A]">
                      Local Explorer · Submitted this spot
                    </p>
                  </div>
                </div>

                {/* ── 7. Voice Narration Teaser ── */}
                <NarrationTeaser />
              </div>
            </div>
          ) : (
            <p className="text-[#6B4830] text-sm text-center mt-20 px-6">
              Select a gem to view its details.
            </p>
          )}
        </div>
      </aside>

      {/* ── Mobile bottom sheet — Peek + Expanded (Screens 3 & 4) ───── */}
      {isMobile && (
        <MobileGemSheet
          gem={gem}
          isOpen={isOpen}
          onClose={onClose}
          onUpvoteToggle={onUpvoteToggle}
          onLikeGem={onLikeGem}
          onBookmarkToggle={onBookmarkToggle}
          accent={accent}
          accentSoft={accentSoft}
        />
      )}
    </>
  );
}
