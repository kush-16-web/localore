import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, X, ZoomIn, ZoomOut } from "lucide-react";

interface PhotoLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function PhotoLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragY, setDragY] = useState(0);

  // Touch tracking references
  const touchStartRef = useRef<{
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
      setCurrentIndex(initialIndex);
      setScale(1);
      setPan({ x: 0, y: 0 });
      setDragY(0);
    }
  }, [isOpen, initialIndex]);

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

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [currentIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [currentIndex]);

  // Handle double-tap to zoom in lightbox (does NOT like the gem)
  const handleDoubleTap = (clientX: number, clientY: number) => {
    if (scale > 1) {
      // Zoom out to normal
      setScale(1);
      setPan({ x: 0, y: 0 });
    } else {
      // Zoom in to 2.2x centered around tap point
      const newScale = 2.2;
      const rect = window.innerWidth;
      const rectH = window.innerHeight;
      const offsetX = (rect / 2 - clientX) * 0.8;
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

  // Touch event handlers for swiping, pinch-to-zoom, and swipe-down-to-dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      touchStartRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        dist,
        time: Date.now(),
      };
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    if (e.touches.length === 2 && touchStartRef.current.dist) {
      // Pinch to zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      const ratio = currentDist / touchStartRef.current.dist;
      const newScale = Math.min(Math.max(scale * ratio, 1), 3.5);
      setScale(newScale);
      touchStartRef.current.dist = currentDist;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const dy = touch.clientY - touchStartRef.current.y;
      const dx = touch.clientX - touchStartRef.current.x;

      // If zoomed in: pan the image
      if (scale > 1) {
        setPan((prev) => ({
          x: prev.x + dx * 0.5,
          y: prev.y + dy * 0.5,
        }));
        touchStartRef.current.x = touch.clientX;
        touchStartRef.current.y = touch.clientY;
      } else {
        // If not zoomed: check for downward swipe to dismiss
        if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
          setDragY(dy);
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const now = Date.now();

    if (e.changedTouches.length === 1 && scale === 1) {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Check for swipe-down to dismiss
      if (dragY > 90) {
        onClose();
        setDragY(0);
        touchStartRef.current = null;
        return;
      }
      setDragY(0);

      // Horizontal swipe between photos
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) {
          handleNext();
        } else {
          handlePrev();
        }
        touchStartRef.current = null;
        return;
      }

      // Check double tap to zoom in lightbox
      if (dist < 15) {
        const timeSince = now - lastTapRef.current.time;
        const tapDist = Math.hypot(
          touch.clientX - lastTapRef.current.x,
          touch.clientY - lastTapRef.current.y
        );
        if (timeSince < 300 && tapDist < 40) {
          lastTapRef.current = { time: 0, x: 0, y: 0 };
          handleDoubleTap(touch.clientX, touch.clientY);
        } else {
          lastTapRef.current = {
            time: now,
            x: touch.clientX,
            y: touch.clientY,
          };
        }
      }
    }

    setDragY(0);
    touchStartRef.current = null;
  };

  const handleClose = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Original photo view of ${title}`}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[1000] bg-black flex flex-col select-none overflow-hidden touch-none"
      style={{
        transform: dragY > 0 ? `translateY(${dragY}px)` : "none",
        opacity: dragY > 0 ? Math.max(0.3, 1 - dragY / 300) : 1,
        transition: dragY === 0 ? "transform 250ms ease, opacity 250ms ease" : "none",
      }}
    >
      {/* ── Top Navigation Bar ──────────────────────────────────────────────── */}
      <header className="relative z-30 px-4 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={handleClose}
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
            aria-label={scale > 1 ? "Zoom out" : "Zoom in"}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
          >
            {scale > 1 ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* ── Main Photo Container (Original uncropped aspect ratio) ──────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex-1 w-full h-full flex items-center justify-center p-2 relative overflow-hidden"
      >
        <img
          src={currentImage}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain pointer-events-none transition-transform will-change-transform"
          style={{
            transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
            transition: scale === 1 ? "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          }}
        />
      </div>

      {/* ── Bottom Dot Indicators & Swipe Hint ─────────────────────────────── */}
      <footer className="relative z-30 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] pt-2 flex flex-col items-center gap-2 bg-gradient-to-t from-black/80 to-transparent">
        {/* Dot Indicators */}
        <div className="flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setScale(1);
                setPan({ x: 0, y: 0 });
              }}
              aria-label={`Go to photo ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-[#E8743A]"
                  : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] text-white/50 tracking-wider">
          Swipe down to exit · Double tap to zoom
        </span>
      </footer>
    </div>
  );
}
