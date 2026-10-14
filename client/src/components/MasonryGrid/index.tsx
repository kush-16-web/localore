import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import { formatDistance } from "../../utils/geo";

import type { UnifiedPlace } from "../../types/place";

export type GemCardData = UnifiedPlace;

export const initialGems: GemCardData[] = [
  {
    id: 1,
    title: "Rander Kulfi & Coco Corner",
    category: "Street food",
    area: "Rander",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    description: "Tucked away in the narrow lanes of Rander, this legendary spot serves the most rich, creamy, hand-churned mango kulfi and thick chocolate coco in Surat. Best visited after 9 PM.",
    upvotes: 184,
    author: "Aarav Shah",
    authorInitials: "AS",
    hours: "6 PM - 11:50 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[3/4]",
    source: "demo",
    coordinates: { lat: 21.2052, lng: 72.8023 },
  },
  {
    id: 2,
    title: "Dumas Dark Sand Sunset",
    category: "Viewpoint",
    area: "Piplod",
    image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1000&q=80",
    description: "Skip the main crowded beach and head 1.5km north. There is a quiet inlet where you can see the sun dip into the Arabian Sea, painting the sky in deep purples and oranges.",
    upvotes: 320,
    author: "Pooja Patel",
    authorInitials: "PP",
    hours: "Open 24/7",
    isBookmarked: true,
    isUpvoted: true,
    aspectRatio: "aspect-[16/9]",
    source: "demo",
    coordinates: { lat: 21.1352, lng: 72.7154 },
  },
  {
    id: 3,
    title: "Dutch & English Cemeteries",
    category: "Heritage",
    area: "Nanpura",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
    description: "Dating back to the 17th century, these grand mausoleums look like forgotten castles. The architectural details tell the rich history of Surat's ancient trade port era.",
    upvotes: 95,
    author: "Vikram Nair",
    authorInitials: "VN",
    hours: "9 AM - 6 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[4/5]",
    source: "demo",
    coordinates: { lat: 21.1923, lng: 72.8188 },
  },
  {
    id: 4,
    title: "Gopi Talav Quiet Steps",
    category: "Quiet spots",
    area: "Limbayat",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80",
    description: "While Gopi Talav is usually popular, the eastern steps near the old wishing well remain beautifully quiet in the early mornings.",
    upvotes: 142,
    author: "Karan Dave",
    authorInitials: "KD",
    hours: "6 AM - 10 AM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[3/2]",
    source: "demo",
    coordinates: { lat: 21.1856, lng: 72.8423 },
  },
  {
    id: 5,
    title: "Sarthana River Canopy",
    category: "Nature",
    area: "Vesu",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
    description: "A hidden dense forest trail along the Tapi riverbank. Huge banyan trees form a natural green canopy that blocks out all city noise. Spot peacocks if you go early!",
    upvotes: 215,
    author: "Diya Mehta",
    authorInitials: "DM",
    hours: "7 AM - 5 PM",
    isBookmarked: true,
    isUpvoted: false,
    aspectRatio: "aspect-square",
    source: "demo",
    coordinates: { lat: 21.1524, lng: 72.7752 },
  },
  {
    id: 6,
    title: "Chowk Bazaar Locho Hub",
    category: "Street food",
    area: "Nanpura",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    description: "The legendary oil-free surti locho served piping hot with green chutney, sev, and a huge dollop of butter. Always ask for the special garlic seasoning topping!",
    upvotes: 289,
    author: "Amit Roy",
    authorInitials: "AR",
    hours: "7 AM - 1 PM",
    isBookmarked: false,
    isUpvoted: true,
    aspectRatio: "aspect-[4/3]",
    source: "demo",
    coordinates: { lat: 21.1965, lng: 72.8211 },
  },
  {
    id: 7,
    title: "The Old City Fort Ruins",
    category: "Heritage",
    area: "Nanpura",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
    description: "Step inside the historic Mughal fortress walls. Very few visitors know about the small exhibition gallery inside showing ancient maps of Surat.",
    upvotes: 110,
    author: "Riya Kapoor",
    authorInitials: "RK",
    hours: "10 AM - 5 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[3/4]",
    source: "demo",
    coordinates: { lat: 21.1982, lng: 72.8194 },
  },
  {
    id: 8,
    title: "Tapi Riverfront Quiet Deck",
    category: "Quiet spots",
    area: "Adajan",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
    description: "A wooden deck overlooking the river, hidden behind a popular cafe. It's the perfect spot to read a book or write, accompanied only by the soft sound of waves.",
    upvotes: 176,
    author: "Samir Gohel",
    authorInitials: "SG",
    hours: "Open 24/7",
    isBookmarked: true,
    isUpvoted: false,
    aspectRatio: "aspect-[16/10]",
    source: "demo",
    coordinates: { lat: 21.1932, lng: 72.7981 },
  },
  {
    id: 9,
    title: "Suvali Black Sand Beach",
    category: "Viewpoint",
    area: "Adajan",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "A secluded beach featuring volcanic black sand, located about 25 km from the city. Almost completely deserted during weekdays, offering clean air and total peace.",
    upvotes: 253,
    author: "Nisha Vyas",
    authorInitials: "NV",
    hours: "6 AM - 7 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[4/5]",
    source: "demo",
    coordinates: { lat: 21.1685, lng: 72.7445 },
  },
  {
    id: 10,
    title: "Tapi Sunset Kayak Nook",
    category: "Nature",
    area: "Vesu",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
    description: "Behind the boating club fence there's a small concrete slip where local kayakers launch. Golden hour here turns the whole river molten orange. Ask for Bhailal bhai if the gate is shut.",
    upvotes: 64,
    author: "Raj Joshi",
    authorInitials: "RJ",
    hours: "5 PM - 7 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[3/4]",
    source: "demo",
    coordinates: { lat: 21.1554, lng: 72.7782 },
  },
  {
    id: 11,
    title: "Old Mill Lane Archive Wall",
    category: "Heritage",
    area: "Piplod",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=600&q=80",
    description: "A crumbling textile mill wall covered in hand-painted trade signs from the 1940s. Best light is mid-morning. The chai cart across the street has been there just as long.",
    upvotes: 38,
    author: "Raj Joshi",
    authorInitials: "RJ",
    hours: "11 AM - 4 PM",
    isBookmarked: true,
    isUpvoted: false,
    aspectRatio: "aspect-square",
    source: "demo",
    coordinates: { lat: 21.1685, lng: 72.7845 },
  }
];

type MasonryGridProps = {
  gems: GemCardData[];
  emptyMessage?: string;
  emptyHint?: string;
  onGemSelect?: (gem: GemCardData) => void;
  onBookmarkToggle?: (id: string | number) => void;
  onUpvoteToggle?: (id: string | number) => void;
};

const GAP_MOBILE = 12; // tighter gap on phone — matches app-style feeds
const GAP_DESKTOP = 24;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function useColumnCount(containerRef: React.RefObject<HTMLDivElement | null>, isMobile: boolean) {
  const [cols, setCols] = useState(2);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Measure the GRID's real width (it shrinks when RightPanel opens),
    // not the window — ~300px per card keeps content comfortable.
    // Phones always stay Pinterest-style 2-column.
    const calc = (w: number) => {
      if (isMobile) return 2;
      return Math.min(4, Math.max(1, Math.floor((w + GAP_DESKTOP) / (300 + GAP_DESKTOP))));
    };

    const update = () => setCols(calc(el.offsetWidth));
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, isMobile]);

  return cols;
}

/* ───────────────────────── Mobile Card ─────────────────────────
   Image-forward, thumb-friendly. Description lives in the panel,
   not on the card — keeps the grid scannable, app-feed style. */
function MobileGemCard({
  gem,
  onSelect,
  onBookmark,
  onUpvote,
}: {
  gem: GemCardData;
  onSelect: () => void;
  onBookmark: (e: React.MouseEvent) => void;
  onUpvote: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="rounded-2xl bg-[#1C1410]/80 backdrop-blur-md border border-[#332010]/80 overflow-hidden flex flex-col active:scale-[0.98] transition-all duration-150 cursor-pointer"
      onClick={onSelect}
    >
      <div className={`relative overflow-hidden bg-[#110C08] ${gem.aspectRatio}`}>
        <img
          src={gem.image}
          alt={gem.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        <span className="absolute top-2 left-2 bg-[#110C08]/50 backdrop-blur-md text-[#F5E6D0] text-[9px] font-medium px-2 py-[3px] rounded-md z-20">
          {gem.category}
        </span>

        {/* Bookmark sits on the image — thumb-reachable, doesn't compete with title/stats below */}
        <button
          onClick={onBookmark}
          className={`absolute top-2 right-2 z-20 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md text-[14px] transition-all duration-150 active:scale-90 ${
            gem.isBookmarked
              ? "bg-[#E8743A] text-[#110C08]"
              : "bg-[#110C08]/50 text-[#F5E6D0]"
          }`}
        >
          <i className={`ti ${gem.isBookmarked ? "ti-bookmark-filled" : "ti-bookmark"}`} />
        </button>

        <span className="absolute bottom-2 left-2 bg-[#110C08]/65 backdrop-blur-md text-[#F5E6D0] text-[9px] font-medium px-2 py-[3px] rounded-md z-20 flex items-center gap-1">
          <i className="ti ti-map-pin text-[10px] text-[#E8743A]" />
          <span>{gem.area}</span>
          {gem.distanceKm !== undefined && (
            <span className="text-[#E8743A] font-semibold">· {formatDistance(gem.distanceKm)}</span>
          )}
        </span>

        {gem.source === "osm" && (
          <span className="absolute bottom-2 right-2 bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[8px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-md z-20">
            OSM
          </span>
        )}
        {gem.source === "demo" && (
          <span className="absolute bottom-2 right-2 bg-amber-950/70 border border-amber-500/30 text-amber-300 text-[8px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-md z-20">
            Demo
          </span>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-1.5">
        <h3 className="text-[13px] font-semibold text-[#F5E6D0] leading-snug font-['Syne',sans-serif] line-clamp-2">
          {gem.title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 shrink-0 rounded-full bg-[#3D2A18] border border-[#A07050]/20 flex items-center justify-center text-[8px] font-bold text-[#F5E6D0] font-['Syne',sans-serif]">
              {gem.authorInitials}
            </div>
            <span className="text-[9px] text-[#A07050] truncate">{gem.author}</span>
          </div>

          <button
            onClick={onUpvote}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold shrink-0 transition-all duration-150 active:scale-90 ${
              gem.isUpvoted ? "text-[#E8743A]" : "text-[#A07050]"
            }`}
          >
            <i className={`ti ${gem.isUpvoted ? "ti-heart-filled" : "ti-heart"} text-[13px]`} />
            <span>{gem.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Desktop Card ─────────────────────────
   Unchanged from before — richer card with inline description. */
function DesktopGemCard({
  gem,
  onSelect,
  onBookmark,
  onUpvote,
}: {
  gem: GemCardData;
  onSelect: () => void;
  onBookmark: (e: React.MouseEvent) => void;
  onUpvote: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="rounded-2xl bg-[#1C120E]/80 backdrop-blur-md border border-[#3D2A18]
        hover:border-[#E8743A]/40 hover:shadow-[0_12px_24px_-10px_rgba(232,116,58,0.15)]
        transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
      onClick={onSelect}
    >
      <div className={`relative overflow-hidden bg-[#110C08] ${gem.aspectRatio}`}>
        <img
          src={gem.image}
          alt={gem.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />

        <span className="absolute top-3 left-3 bg-[#110C08]/40 backdrop-blur-md text-[#F5E6D0] text-[12px] font-medium px-2.5 py-[4px] rounded-lg z-20">
          {gem.category}
        </span>

        <span className="absolute top-3 right-3 bg-[#E8743A] text-[#110C08] text-[12px] font-bold px-2.5 py-[4px] rounded-lg flex items-center gap-1.5 z-20 shadow-md">
          <i className="ti ti-map-pin text-[11px]" />
          {gem.area}
        </span>

        {gem.distanceKm !== undefined && (
          <span className="absolute bottom-3 left-3 bg-[#110C08]/75 backdrop-blur-md text-[#E8743A] text-[11px] font-semibold px-2 py-0.5 rounded-md z-20 flex items-center gap-1 border border-[#E8743A]/30">
            <i className="ti ti-map-pin text-[10px]" />
            {formatDistance(gem.distanceKm)}
          </span>
        )}

        {gem.source === "osm" && (
          <span className="absolute bottom-3 right-3 bg-[#110C08]/75 backdrop-blur-md text-emerald-400 text-[10px] font-medium px-2 py-0.5 rounded-md z-20 border border-emerald-500/30">
            OpenStreetMap
          </span>
        )}
        {gem.source === "demo" && (
          <span className="absolute bottom-3 right-3 bg-[#110C08]/75 backdrop-blur-md text-amber-400 text-[10px] font-medium px-2 py-0.5 rounded-md z-20 border border-amber-500/30">
            Surat Demo
          </span>
        )}
      </div>

      <div className="p-4.5 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[16px] font-semibold text-[#F5E6D0] group-hover:text-[#E8743A] transition-colors duration-200 leading-snug font-['Syne',sans-serif]">
            {gem.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-[#A07050]">
            <span className="flex items-center gap-1">
              <i className="ti ti-clock text-[11px]" />
              {gem.hours}
            </span>
          </div>
        </div>

        <p className="text-[12.5px] text-[#A07050]/90 leading-relaxed font-normal">
          {gem.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#332010] mt-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#3D2A18] border border-[#A07050]/20 flex items-center justify-center text-[10px] font-bold text-[#F5E6D0] font-['Syne',sans-serif]">
              {gem.authorInitials}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-[#C8A888]">By {gem.author}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onUpvote}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all duration-150 ${
                gem.isUpvoted
                  ? "bg-[#E8743A]/15 text-[#E8743A] border-[#E8743A]/30"
                  : "bg-[#110C08] text-[#A07050] border-[#3D2A18] hover:text-[#F5E6D0] hover:border-[#A07050]/40"
              }`}
            >
              <i className={`ti ${gem.isUpvoted ? "ti-heart-filled" : "ti-heart"} text-[13px]`} />
              <span>{gem.upvotes}</span>
            </button>

            <button
              onClick={onBookmark}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border text-[13px] cursor-pointer transition-all duration-150 ${
                gem.isBookmarked
                  ? "bg-[#261A14] text-[#E8743A] border-[#E8743A]/30"
                  : "bg-[#110C08] text-[#A07050] border-[#3D2A18] hover:text-[#F5E6D0] hover:border-[#A07050]/40"
              }`}
            >
              <i className={`ti ${gem.isBookmarked ? "ti-bookmark-filled" : "ti-bookmark"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MasonryGrid({ gems, emptyMessage, emptyHint, onGemSelect, onBookmarkToggle, onUpvoteToggle }: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const isMobile = useIsMobile();
  const columns = useColumnCount(containerRef, isMobile);
  const gap = isMobile ? GAP_MOBILE : GAP_DESKTOP;

  const [colWidth, setColWidth] = useState(0);
  const [positions, setPositions] = useState<Record<string | number, { top: number; left: number }>>({});
  const [containerHeight, setContainerHeight] = useState(0);
  const [ready, setReady] = useState(false);

  const isInitialLayoutRef = useRef(true);

  // When gems change (e.g. category change or navigation), reset layout animation to prevent sliding
  useEffect(() => {
    isInitialLayoutRef.current = true;
  }, [gems]);

  const recalcLayout = useCallback(() => {
    const container = containerRef.current;
    if (!container || columns <= 0) return;

    const containerWidth = container.offsetWidth;
    const width = (containerWidth - gap * (columns - 1)) / columns;
    const colHeights = new Array(columns).fill(0);
    const newPositions: Record<string | number, { top: number; left: number }> = {};

    gems.forEach((gem) => {
      const el = itemRefs.current.get(gem.id);
      if (!el) return;
      const height = el.offsetHeight;

      let shortest = 0;
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < colHeights[shortest]) shortest = i;
      }

      newPositions[gem.id] = { top: colHeights[shortest], left: shortest * (width + gap) };
      colHeights[shortest] += height + gap;
    });

    setColWidth(width);
    setPositions(newPositions);
    setContainerHeight(Math.max(0, ...colHeights) - gap);
    setReady(true);

    const timer = setTimeout(() => {
      isInitialLayoutRef.current = false;
    }, 60);
    return () => clearTimeout(timer);
  }, [gems, columns, gap]);

  // Switching mobile/desktop swaps the mounted card entirely — reset before remeasuring
  useEffect(() => {
    setReady(false);
    isInitialLayoutRef.current = true;
  }, [isMobile]);

  useLayoutEffect(() => {
    recalcLayout();
  }, [recalcLayout]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => recalcLayout());
    ro.observe(container);
    return () => ro.disconnect();
  }, [recalcLayout]);

  const handleBookmark = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle?.(id);
  };

  const handleUpvote = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvoteToggle?.(id);
  };

  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <div className={`w-full font-['DM_Sans',sans-serif] text-left px-3 sm:px-4 pt-4 ${isMobile ? "pb-[calc(env(safe-area-inset-bottom)+84px)]" : "pb-4"}`}>
      {gems.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#3D2A18] rounded-2xl bg-[#110C08]">
          <i className="ti ti-search text-3xl text-[#6B4830] mb-2" />
          <p className="text-sm text-[#A07050]">{emptyMessage ?? "No gems found in this category."}</p>
          {emptyHint && (
            <p className="text-xs text-[#6B4830] mt-1.5 px-6">{emptyHint}</p>
          )}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: containerHeight > 0 ? containerHeight : undefined }}
        >
          {gems.map((gem) => {
            const pos = positions[gem.id];
            const CardComponent = isMobile ? MobileGemCard : DesktopGemCard;
            const allowAnimation = !isInitialLayoutRef.current && ready && !prefersReducedMotion;
            return (
              <div
                key={gem.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(gem.id, el);
                  else itemRefs.current.delete(gem.id);
                }}
                className="absolute"
                style={{
                  width: colWidth || undefined,
                  transform: pos ? `translate3d(${pos.left}px, ${pos.top}px, 0)` : undefined,
                  visibility: ready && pos ? "visible" : "hidden",
                  opacity: ready && pos ? 1 : 0,
                  transition: allowAnimation ? "transform 200ms ease" : "none",
                }}
              >
                <CardComponent
                  gem={gem}
                  onSelect={() => onGemSelect?.(gem)}
                  onBookmark={(e) => handleBookmark(gem.id, e)}
                  onUpvote={(e) => handleUpvote(gem.id, e)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}