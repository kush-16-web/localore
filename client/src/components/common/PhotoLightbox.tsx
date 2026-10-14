import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

interface PhotoLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSelectImage?: (imgUrl: string) => void;
}

export default function PhotoLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
  onSelectImage,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragY, setDragY] = useState(0);

  // Tracking references for gesture detection (pointer & touch)
  const dragStartRef = useRef<{
    x: number;
    y: number;
    dist?: number;
    time: number;
  } | null>(null);

  const lastTapRef = useRef<{ time: number; x: number; y: number }>({
    time: 0,
    x: 0,
    y: 0,
  });

  // Reset index when opened with a new initialIndex
  useEffect(() => {
    if (isOpen) {
      const validIndex =
        initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0;
      setCurrentIndex(validIndex);
      setScale(1);
      setPan({ x: 0, y: 0 });
      setDragY(0);
    }
  }, [isOpen, initialIndex, images.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
        setScale(1);
        setPan({ x: 0, y: 0 });
        onSelectImage?.(images[index]);
      }
    },
    [images, onSelectImage]
  );

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    if (currentIndex < images.length - 1) {
      goToIndex(currentIndex + 1);
    } else {
      goToIndex(0);
    }
  }, [currentIndex, images.length, goToIndex]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    } else {
      goToIndex(images.length - 1);
    }
  }, [currentIndex, images.length, goToIndex]);

  // Double-tap to zoom in lightbox (does NOT like the gem)
  const handleDoubleTap = (clientX: number, clientY: number) => {
    if (scale > 1) {
      setScale(1);
      setPan({ x: 0, y: 0 });
    } else {
      const newScale = 2.2;
      const rectW = window.innerWidth;
      const rectH = window.innerHeight;
      const offsetX = (rectW / 2 - clientX) * 0.8;
      const offsetY = (rectH / 2 - clientY) * 0.8;
      setScale(newScale);
      setPan({ x: offsetX, y: offsetY });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  // Pointer event handlers for swipe navigation and downward pull dismiss
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (scale > 1) {
      setPan((prev) => ({
        x: prev.x + dx * 0.5,
        y: prev.y + dy * 0.5,
      }));
      dragStartRef.current.x = e.clientX;
      dragStartRef.current.y = e.clientY;
    } else {
      if (dy > 0 && Math.abs(dy) > Math.abs(dx) * 1.4) {
        setDragY(dy);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const dist = Math.hypot(dx, dy);
    const now = Date.now();

    // Downward swipe to dismiss
    if (dragY > 75) {
      onClose();
      setDragY(0);
      dragStartRef.current = null;
      return;
    }
    setDragY(0);

    // Horizontal swipe between photos
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
      dragStartRef.current = null;
      return;
    }

    // Double tap to zoom
    if (dist < 12) {
      const timeSince = now - lastTapRef.current.time;
      const tapDist = Math.hypot(
        e.clientX - lastTapRef.current.x,
        e.clientY - lastTapRef.current.y
      );
      if (timeSince < 300 && tapDist < 35) {
        lastTapRef.current = { time: 0, x: 0, y: 0 };
        handleDoubleTap(e.clientX, e.clientY);
      } else {
        lastTapRef.current = {
          time: now,
          x: e.clientX,
          y: e.clientY,
        };
      }
    }

    setDragY(0);
    dragStartRef.current = null;
  };

  const handleClose = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Original photo view of ${title}`}
      onClick={(e) => e.stopPropagation()}
      onPointerDownCapture={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[1000] bg-black flex flex-col select-none overflow-hidden touch-none"
      style={{
        transform: dragY > 0 ? `translateY(${dragY}px)` : "none",
        opacity: dragY > 0 ? Math.max(0.3, 1 - dragY / 300) : 1,
        transition:
          dragY === 0 ? "transform 250ms ease, opacity 250ms ease" : "none",
      }}
    >
      {/* ── Top Navigation Bar ──────────────────────────────────────────────── */}
      <header className="relative z-40 px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <button
          type="button"
          onClick={handleClose}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close original photo view"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronLeft size={22} className="stroke-[2.5]" />
        </button>

        {/* Counter and Title */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="text-[11px] text-white/60 truncate max-w-[180px]">
            {title}
          </span>
        </div>

        {/* Zoom Toggle / Close Button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDoubleTap(window.innerWidth / 2, window.innerHeight / 2);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={scale > 1 ? "Zoom out" : "Zoom in"}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
          >
            {scale > 1 ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>
          <button
            type="button"
            onClick={handleClose}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* ── Main Photo Container with Visible Next & Prev Navigation Buttons ── */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex-1 w-full h-full flex items-center justify-center p-2 relative overflow-hidden"
      >
        {/* Previous Image Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Previous photo"
            className="absolute left-3 z-50 grid h-12 w-12 place-items-center rounded-full bg-black/75 text-white ring-2 ring-white/30 hover:bg-black/95 hover:scale-105 active:scale-90 transition-all cursor-pointer shadow-2xl pointer-events-auto"
          >
            <ChevronLeft size={26} className="stroke-[2.5]" />
          </button>
        )}

        {/* Main Image with uncropped aspect ratio */}
        <img
          key={currentIndex}
          src={currentImage}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain pointer-events-none transition-transform will-change-transform"
          style={{
            transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
            transition:
              scale === 1
                ? "transform 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease"
                : "none",
          }}
        />

        {/* Next Image Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Next photo"
            className="absolute right-3 z-50 grid h-12 w-12 place-items-center rounded-full bg-black/75 text-white ring-2 ring-white/30 hover:bg-black/95 hover:scale-105 active:scale-90 transition-all cursor-pointer shadow-2xl pointer-events-auto"
          >
            <ChevronRight size={26} className="stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* ── Bottom Filmstrip Thumbnail Strip & Indicators ──────────────────── */}
      <footer className="relative z-40 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] pt-2 px-4 flex flex-col items-center gap-2.5 bg-gradient-to-t from-black/90 to-transparent">
        {/* Filmstrip Thumbnails Row (Tap to switch image) */}
        <div className="flex items-center justify-center gap-2.5 w-full max-w-sm mx-auto overflow-x-auto py-1 px-2 scrollbar-none">
          {images.map((thumbUrl, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(idx);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={`View photo ${idx + 1}`}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer group active:scale-95 ${
                  isActive
                    ? "border-[#E8743A] ring-2 ring-[#E8743A]/60 scale-105 shadow-xl opacity-100"
                    : "border-white/20 opacity-55 hover:opacity-90"
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Thumb ${idx + 1}`}
                  className="h-full w-full object-cover pointer-events-none group-hover:scale-105 transition-transform"
                />
                <span
                  className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive
                      ? "bg-[#E8743A] text-[#120B08]"
                      : "bg-black/60 text-white/80"
                  }`}
                >
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-[10px] text-white/50 tracking-wider">
          Tap arrows or thumbnails to switch · Double tap to zoom
        </span>
      </footer>
    </div>
  );
}

