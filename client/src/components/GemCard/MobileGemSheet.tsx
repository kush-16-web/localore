import React, { useState, useEffect, useRef } from "react";
import {
  Bookmark,
  Navigation,
  Heart,
  MoreHorizontal,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronDown,
  Check,
  Maximize2,
} from "lucide-react";
import { formatDistance } from "../../utils/geo";
import { RoadIcon } from "../common/RoadIcon";
import PhotoLightbox from "../common/PhotoLightbox";
import type { GemCardData } from "../MasonryGrid";

export type MobileGemSheetProps = {
  gem: GemCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onUpvoteToggle?: (id: string | number) => void;
  onLikeGem?: (id: string | number) => void;
  onBookmarkToggle?: (id: string | number) => void;
  accent: string;
  accentSoft: string;
};

// Curated high quality alternate photos tailored by category
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
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
];

interface HeartAnimState {
  id: number;
  x: number;
  y: number;
  destX: number;
  destY: number;
  step: "pop" | "travel";
}

export default function MobileGemSheet({
  gem,
  isOpen,
  onClose,
  onUpvoteToggle,
  onLikeGem,
  onBookmarkToggle,
  accent,
  accentSoft,
}: MobileGemSheetProps) {
  const [prevGemId, setPrevGemId] = useState<string | number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [heartAnim, setHeartAnim] = useState<HeartAnimState | null>(null);
  const [isLikeBouncing, setIsLikeBouncing] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Lightbox state for true original uncropped photo view
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  // Sheet pull-to-dismiss drag state
  const [sheetDragY, setSheetDragY] = useState(0);
  const dragTouchStartRef = useRef<{ y: number; time: number } | null>(null);

  // References for gesture recognition on hero
  const pointerDownRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({
    time: 0,
    x: 0,
    y: 0,
  });
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timers for double-tap heart animation
  const animTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimer3Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Element references
  const likeBtnRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Synchronize state when gem changes
  if (gem && gem.id !== prevGemId) {
    setPrevGemId(gem.id);
    setSelectedImage(null);
    setIsOverlayVisible(true);
    setIsDescriptionExpanded(false);
    setIsLightboxOpen(false);
    setSheetDragY(0);
  }

  const activeImage = selectedImage ?? gem?.image ?? "";

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      if (animTimer1Ref.current) clearTimeout(animTimer1Ref.current);
      if (animTimer2Ref.current) clearTimeout(animTimer2Ref.current);
      if (animTimer3Ref.current) clearTimeout(animTimer3Ref.current);
    };
  }, []);

  if (!isOpen || !gem) return null;

  const directionsUrl = gem.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${gem.coordinates.lat},${gem.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${gem.title} ${gem.area}`
      )}`;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
        // clipboard unavailable
      }
    }
  };

  const distanceText =
    gem.distanceKm !== undefined ? formatDistance(gem.distanceKm) : null;

  // Build 3 thumbnails: primary image + 2 curated category photos
  const alternates =
    CATEGORY_ALTERNATES[gem.category] ?? DEFAULT_ALTERNATES;
  const thumbnails = [gem.image, alternates[0], alternates[1]];

  // ── Pull-to-Dismiss Gesture Handling ─────────────────────────────────────
  const handleSheetDragStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragTouchStartRef.current = { y: touch.clientY, time: Date.now() };
  };

  const handleSheetDragMove = (e: React.TouchEvent) => {
    if (!dragTouchStartRef.current) return;
    const currentY = e.touches[0].clientY;
    const dy = currentY - dragTouchStartRef.current.y;
    // Allow dragging down only
    if (dy > 0) {
      setSheetDragY(dy);
    }
  };

  const handleSheetDragEnd = () => {
    if (!dragTouchStartRef.current) return;
    if (sheetDragY > 110) {
      onClose();
    }
    setSheetDragY(0);
    dragTouchStartRef.current = null;
  };

  // Also allow pull-to-dismiss when scrolling up at top of scroll container
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  // ── Trigger Double-Tap Like & Smooth Heart Animation ──────────────────────
  const triggerDoubleTapLike = (clientX: number, clientY: number) => {
    // 1. Idempotent like: only like if currently unliked
    if (!gem.isUpvoted) {
      if (onLikeGem) {
        onLikeGem(gem.id);
      } else if (onUpvoteToggle) {
        onUpvoteToggle(gem.id);
      }
    }

    // 2. Measure destination like counter position
    let destX = clientX;
    let destY = clientY + 160;
    if (likeBtnRef.current) {
      const rect = likeBtnRef.current.getBoundingClientRect();
      destX = rect.left + rect.width / 2;
      destY = rect.top + rect.height / 2;
    }

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      setIsLikeBouncing(true);
      setTimeout(() => setIsLikeBouncing(false), 200);
      return;
    }

    // 3. Orchestrate smooth, playful heart animation (no box shadow)
    if (animTimer1Ref.current) clearTimeout(animTimer1Ref.current);
    if (animTimer2Ref.current) clearTimeout(animTimer2Ref.current);
    if (animTimer3Ref.current) clearTimeout(animTimer3Ref.current);

    const animId = Date.now();
    setHeartAnim({
      id: animId,
      x: clientX,
      y: clientY,
      destX,
      destY,
      step: "pop",
    });

    // Step 2: Travel towards destination counter after soft scale pop
    animTimer1Ref.current = setTimeout(() => {
      setHeartAnim((prev) =>
        prev?.id === animId ? { ...prev, step: "travel" } : prev
      );
    }, 320);

    // Step 3: Land at counter with bounce
    animTimer2Ref.current = setTimeout(() => {
      setHeartAnim(null);
      setIsLikeBouncing(true);
    }, 760);

    // Step 4: Settle counter bounce
    animTimer3Ref.current = setTimeout(() => {
      setIsLikeBouncing(false);
    }, 1020);
  };

  // ── Hero Pointer Gesture (Single Tap vs Double Tap vs Scroll) ─────────────
  const handleHeroPointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    pointerDownRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handleHeroPointerUp = (e: React.PointerEvent) => {
    if (!pointerDownRef.current) return;
    const dx = e.clientX - pointerDownRef.current.x;
    const dy = e.clientY - pointerDownRef.current.y;
    const dist = Math.hypot(dx, dy);
    const duration = Date.now() - pointerDownRef.current.time;
    pointerDownRef.current = null;

    // Ignore if finger moved > 12px or held > 450ms (drag/scroll or long press)
    if (dist > 12 || duration > 450) {
      return;
    }

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current.time;
    const tapDist = Math.hypot(
      e.clientX - lastTapRef.current.x,
      e.clientY - lastTapRef.current.y
    );

    if (timeSinceLastTap < 300 && tapDist < 50) {
      // Double tap detected -> Like gem and play smooth heart animation
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapRef.current = { time: 0, x: 0, y: 0 };
      triggerDoubleTapLike(e.clientX, e.clientY);
    } else {
      // First tap -> Queue single tap overlay toggle
      lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }
      singleTapTimerRef.current = setTimeout(() => {
        setIsOverlayVisible((prev) => !prev);
        singleTapTimerRef.current = null;
      }, 280);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={gem.title}
        className="fixed inset-0 z-[999] md:hidden bg-[#120B08] font-['DM_Sans',sans-serif] flex flex-col overflow-hidden select-none"
        style={{
          transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : "none",
          transition: sheetDragY === 0 ? "transform 280ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      >
        <style>{`
          @keyframes mobileHeartPopSmooth {
            0% { transform: translate(-50%, -50%) scale(0) rotate(-6deg); opacity: 0; }
            45% { transform: translate(-50%, -50%) scale(1.22) rotate(2deg); opacity: 1; }
            75% { transform: translate(-50%, -50%) scale(0.98) rotate(-1deg); }
            100% { transform: translate(-50%, -50%) scale(1.05) rotate(0deg); opacity: 1; }
          }
          @keyframes mobileCounterBounce {
            0% { transform: scale(1); }
            35% { transform: scale(1.35); color: #E8743A; }
            70% { transform: scale(0.94); }
            100% { transform: scale(1); }
          }
          @keyframes mobileScrollBounce {
            0%, 100% { transform: translateY(0); opacity: 0.65; }
            50% { transform: translateY(4px); opacity: 1; }
          }
          .anim-heart-pop-smooth {
            animation: mobileHeartPopSmooth 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .anim-counter-bounce {
            animation: mobileCounterBounce 240ms ease-out forwards;
          }
          .anim-scroll-hint {
            animation: mobileScrollBounce 2s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .anim-heart-pop-smooth, .anim-counter-bounce, .anim-scroll-hint {
              animation: none !important;
              transition: none !important;
            }
          }
        `}</style>

        {/* ── Persistent Fixed Parallax Hero Image Layer ───────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <img
            src={activeImage}
            alt={gem.title}
            className="h-full w-full object-cover transition-transform duration-75 select-none"
            style={{
              transform: `translateY(${Math.min(scrollY * 0.35, 160)}px) scale(1.04)`,
            }}
          />

          {/* Gradients: Fully fade out in Clean View so photo is 100% bright & pristine */}
          {/* Top gradient for button readability */}
          <div
            className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/80 via-black/35 to-transparent transition-opacity duration-300 ${
              isOverlayVisible ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Bottom dark gradient fading up into content surface */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#120B08] from-15% via-[#120B08]/75 via-45% to-transparent transition-opacity duration-300 ${
              isOverlayVisible ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Ambient ColorThief tint */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 mix-blend-screen ${
              isOverlayVisible ? "opacity-25" : "opacity-0"
            }`}
            style={{
              background: `radial-gradient(circle at 50% 40%, rgba(${accent}, 0.85), rgba(${accentSoft}, 0.3) 55%, transparent 80%)`,
            }}
          />
        </div>

        {/* ── Top Drag-to-Dismiss Handle ────────────────────────────────────── */}
        <div
          onTouchStart={handleSheetDragStart}
          onTouchMove={handleSheetDragMove}
          onTouchEnd={handleSheetDragEnd}
          className="relative z-50 shrink-0 flex justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing w-full"
          title="Drag down to close"
        >
          <div className="h-1.5 w-12 rounded-full bg-white/35 hover:bg-white/50 transition-colors" />
        </div>

        {/* ── Floating Header Navigation Bar ───────────────────────────────── */}
        <header className="relative z-40 px-4 pt-1 pb-2 flex items-center justify-between pointer-events-none">
          {/* Close / Back Circle Button (Always visible even in clean view) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/55 backdrop-blur-md ring-1 ring-white/20 text-[#F5E6D0] hover:text-white active:scale-90 transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft size={22} className="stroke-[2.5]" />
          </button>

          {/* Right Action Icons: Expand (Lightbox), Bookmark, Share */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Expand / True Original Lightbox Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const idx = thumbnails.indexOf(activeImage);
                setLightboxInitialIndex(idx >= 0 ? idx : 0);
                setIsLightboxOpen(true);
              }}
              aria-label="View original full photo"
              title="View original uncropped photo"
              className="grid h-10 w-10 place-items-center rounded-full bg-black/55 backdrop-blur-md ring-1 ring-white/20 text-[#F5E6D0] hover:text-white active:scale-90 transition-all cursor-pointer shadow-lg"
            >
              <Maximize2 size={17} />
            </button>

            {/* Bookmark Button (fades with overlay) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle?.(gem.id);
              }}
              aria-label={gem.isBookmarked ? "Remove from saved" : "Save gem"}
              className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur-md ring-1 ring-white/20 transition-all cursor-pointer active:scale-90 shadow-lg ${
                gem.isBookmarked
                  ? "bg-[#E8743A] text-[#120B08] ring-[#E8743A]"
                  : "bg-black/55 text-[#F5E6D0] hover:text-[#E8743A]"
              } ${isOverlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <Bookmark
                size={18}
                className={gem.isBookmarked ? "fill-[#120B08]" : ""}
              />
            </button>

            {/* Share Button (fades with overlay) */}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share gem"
              className={`grid h-10 w-10 place-items-center rounded-full bg-black/55 backdrop-blur-md ring-1 ring-white/20 text-[#F5E6D0] hover:text-white active:scale-90 transition-all cursor-pointer shadow-lg ${
                isOverlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        {/* Copy Toast Notification */}
        {copied && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#E8743A] text-[#120B08] text-xs font-bold shadow-2xl flex items-center gap-1.5 animate-in fade-in duration-200">
            <Check size={14} className="stroke-[3]" />
            <span>Link copied to clipboard!</span>
          </div>
        )}

        {/* ── Traveling Double-Tap Heart Animation Layer (Clean, No Box Shadow) ─ */}
        {heartAnim && (
          <div
            key={heartAnim.id}
            className="pointer-events-none fixed z-50 will-change-transform"
            style={{
              left: heartAnim.step === "travel" ? heartAnim.destX : heartAnim.x,
              top: heartAnim.step === "travel" ? heartAnim.destY : heartAnim.y,
              transition:
                heartAnim.step === "travel"
                  ? "left 440ms cubic-bezier(0.16, 1, 0.3, 1), top 440ms cubic-bezier(0.16, 1, 0.3, 1), transform 440ms cubic-bezier(0.16, 1, 0.3, 1), opacity 440ms ease-out"
                  : "none",
              transform:
                heartAnim.step === "travel"
                  ? "translate(-50%, -50%) scale(0.35)"
                  : "translate(-50%, -50%) scale(1)",
              opacity: heartAnim.step === "travel" ? 0.9 : 1,
            }}
          >
            <div className={heartAnim.step === "pop" ? "anim-heart-pop-smooth" : ""}>
              <Heart
                size={heartAnim.step === "travel" ? 36 : 64}
                className="stroke-white stroke-[2]"
                style={{
                  fill: `rgb(${accent})`,
                }}
              />
            </div>
          </div>
        )}

        {/* ── Single Continuous Vertical Scroll Surface ─────────────────────── */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-y-contain scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* 1. Cinematic Hero Section (Takes ~82% of viewport height) */}
          <section
            onPointerDown={handleHeroPointerDown}
            onPointerUp={handleHeroPointerUp}
            className="relative w-full h-[82dvh] min-h-[520px] max-h-[820px] overflow-hidden flex flex-col justify-end cursor-pointer touch-pan-y"
            aria-label="Gem Hero Photo (Single tap for clean view, double tap to like)"
          >
            {/* Hero Overlay Content (Strictly Left-Aligned) */}
            <div
              className={`relative z-20 px-5 sm:px-6 pb-6 flex flex-col items-start text-left max-w-md mx-auto w-full transition-all duration-300 ${
                isOverlayVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              {/* Gem Title (Strictly left-aligned with matching font styling) */}
              <h1
                style={{
                  color: "#FFFFFF",
                  fontFamily: "'Syne', sans-serif",
                }}
                className="text-2xl sm:text-3xl font-bold !text-white leading-tight tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] text-left w-full"
              >
                {gem.title}
              </h1>

              {/* Tags Row (Category & Area Badges, Left-aligned) */}
              <div className="flex flex-wrap items-center justify-start gap-2 mt-2.5 w-full">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-medium text-white/95 shadow-md">
                  <MapPin size={12} className="text-[#E8743A]" />
                  {gem.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-medium text-white/95 shadow-md">
                  <MapPin size={12} className="text-[#E8743A]" />
                  {gem.area}
                </span>
              </div>

              {/* Stats Row (Heart/Likes, RoadIcon Distance, Hours, Left-aligned) */}
              <div className="flex items-center justify-start gap-5 text-xs sm:text-sm text-[#F5E6D0] mt-3 pt-0.5 w-full">
                {/* Like Button */}
                <button
                  ref={likeBtnRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvoteToggle?.(gem.id);
                  }}
                  aria-label={gem.isUpvoted ? "Unlike gem" : "Like gem"}
                  className="flex items-center gap-1.5 font-semibold text-[#F5E6D0] hover:text-[#E8743A] cursor-pointer active:scale-95 transition-transform"
                >
                  <Heart
                    size={17}
                    className={`transition-all duration-200 ${
                      isLikeBouncing ? "anim-counter-bounce" : ""
                    } ${
                      gem.isUpvoted
                        ? "fill-[#E8743A] text-[#E8743A]"
                        : "fill-white/20 text-white"
                    }`}
                  />
                  <span
                    className={`transition-all duration-200 ${
                      isLikeBouncing ? "anim-counter-bounce" : ""
                    }`}
                  >
                    {gem.upvotes}
                  </span>
                </button>

                {/* Distance with RoadIcon */}
                <div className="flex items-center gap-1.5 font-medium text-white/85">
                  <RoadIcon className="w-4 h-4 text-[#E8743A] shrink-0" />
                  <span>
                    {distanceText ??
                      (gem.distanceKm !== undefined
                        ? formatDistance(gem.distanceKm)
                        : "Nearby")}
                  </span>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-1.5 font-semibold text-[#E8743A]">
                  <Clock size={15} className="text-[#E8743A]" />
                  <span>{gem.hours || "Open 24/7"}</span>
                </div>
              </div>

              {/* Subtle Scroll Down Indicator */}
              <div className="flex items-center justify-center gap-1.5 pt-4 text-[11px] font-medium tracking-wide text-white/50 anim-scroll-hint pointer-events-none w-full">
                <span>Scroll for details</span>
                <ChevronDown size={14} className="stroke-[2.5]" />
              </div>
            </div>
          </section>

          {/* ── 2. Continuous Scroll Detail Content (Slides over hero with parallax) ── */}
          <div
            className={`relative z-20 px-5 sm:px-6 pt-3 pb-32 max-w-md mx-auto w-full space-y-6 transition-opacity duration-300 ${
              isOverlayVisible
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Section: About */}
            <section className="space-y-2 text-left">
              <h2 className="text-xs uppercase font-bold tracking-widest text-[#E8743A]">
                About
              </h2>
              <div className="text-sm leading-relaxed text-[#D8C2B0] font-normal">
                <p>
                  {isDescriptionExpanded || gem.description.length <= 160
                    ? gem.description
                    : `${gem.description.slice(0, 160)}...`}
                </p>
                {gem.description.length > 160 && (
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="mt-1 text-xs font-bold text-[#E8743A] hover:underline cursor-pointer"
                  >
                    {isDescriptionExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            </section>

            {/* Section: Photos Gallery (3 Thumbnails) */}
            <section className="space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase font-bold tracking-widest text-[#E8743A]">
                  Photos
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const idx = thumbnails.indexOf(activeImage);
                    setLightboxInitialIndex(idx >= 0 ? idx : 0);
                    setIsLightboxOpen(true);
                  }}
                  className="text-[11px] text-[#E8743A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span>View Original</span>
                  <Maximize2 size={11} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {thumbnails.map((thumbUrl, idx) => {
                  const isActive = activeImage === thumbUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(thumbUrl)}
                      aria-label={`View photo ${idx + 1}`}
                      className={`relative aspect-[16/11] w-full overflow-hidden rounded-xl border transition-all cursor-pointer group active:scale-95 ${
                        isActive
                          ? "border-[#E8743A] ring-2 ring-[#E8743A]/60 shadow-lg"
                          : "border-white/15 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section: Location & Map */}
            <section className="space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase font-bold tracking-widest text-[#E8743A]">
                  Location & Map
                </h2>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#E8743A] hover:underline flex items-center gap-1 font-semibold no-underline"
                >
                  <span>Open Map</span>
                  <Navigation size={11} />
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#160E0A]/90 overflow-hidden shadow-lg">
                <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs text-[#F5E6D0]">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <MapPin size={13} className="text-[#E8743A] shrink-0" />
                    <span className="truncate">{gem.area}</span>
                  </div>
                  {gem.coordinates && (
                    <span className="text-[11px] text-[#A68A75] font-mono shrink-0">
                      {gem.coordinates.lat.toFixed(3)},{" "}
                      {gem.coordinates.lng.toFixed(3)}
                    </span>
                  )}
                </div>
                <div className="h-36 w-full">
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
            </section>

            {/* Section: Visiting Tips (Only if real data exists) */}
            {(gem as unknown as { tips?: string }).tips && (
              <section className="space-y-2 text-left">
                <h2 className="text-xs uppercase font-bold tracking-widest text-[#E8743A]">
                  Visiting Tips
                </h2>
                <p className="text-sm leading-relaxed text-[#D8C2B0]">
                  {(gem as unknown as { tips: string }).tips}
                </p>
              </section>
            )}

            {/* Section: Submitter Community Attribution */}
            <section className="pt-2 text-left">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8743A] text-xs font-bold text-[#120B08] shadow-md">
                  {gem.authorInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#F5E6D0] truncate">
                    {gem.author}
                  </p>
                  <p className="text-[11px] text-[#A68A75]">
                    Local Explorer · Submitted this spot
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── 3. Sticky Bottom Action: Get Directions (Hides in clean view) ── */}
        <footer
          className={`shrink-0 p-4 bg-gradient-to-t from-[#120B08] via-[#120B08]/95 to-transparent backdrop-blur-md pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] border-t border-white/10 z-40 transition-all duration-300 ${
            isOverlayVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12 pointer-events-none"
          }`}
        >
          <div className="max-w-md mx-auto w-full">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#E8743A] hover:bg-[#D4622A] text-[#120B08] font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all no-underline shadow-none cursor-pointer"
            >
              <Navigation size={18} className="fill-[#120B08]" />
              <span>Get Directions</span>
            </a>
          </div>
        </footer>
      </div>

      {/* ── Fullscreen Uncropped Photo Lightbox ──────────────────────────────── */}
      <PhotoLightbox
        images={thumbnails}
        initialIndex={lightboxInitialIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={gem.title}
      />
    </>
  );
}
