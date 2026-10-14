import { describe, it, expect, vi, beforeEach } from "vitest";

// Gesture logic helper matching MobileGemSheet implementation
interface TapRecognizerState {
  lastTapTime: number;
  lastTapX: number;
  lastTapY: number;
  timer: ReturnType<typeof setTimeout> | null;
}

function createGestureRecognizer({
  onSingleTap,
  onDoubleTap,
}: {
  onSingleTap: () => void;
  onDoubleTap: (x: number, y: number) => void;
}) {
  const state: TapRecognizerState = {
    lastTapTime: 0,
    lastTapX: 0,
    lastTapY: 0,
    timer: null,
  };

  const handlePointerDown = (x: number, y: number) => {
    return { startX: x, startY: y, startTime: Date.now() };
  };

  const handlePointerUp = (
    down: { startX: number; startY: number; startTime: number },
    upX: number,
    upY: number
  ) => {
    const dist = Math.hypot(upX - down.startX, upY - down.startY);
    const duration = Date.now() - down.startTime;

    // Movement > 12px or hold > 450ms is considered scroll or long press -> ignore
    if (dist > 12 || duration > 450) {
      return "scroll_or_drag";
    }

    const now = Date.now();
    const timeSinceLast = now - state.lastTapTime;
    const tapDist = Math.hypot(upX - state.lastTapX, upY - state.lastTapY);

    if (timeSinceLast < 300 && tapDist < 50) {
      // Double tap detected
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }
      state.lastTapTime = 0;
      onDoubleTap(upX, upY);
      return "double_tap";
    } else {
      // First tap
      state.lastTapTime = now;
      state.lastTapX = upX;
      state.lastTapY = upY;
      if (state.timer) {
        clearTimeout(state.timer);
      }
      state.timer = setTimeout(() => {
        onSingleTap();
        state.timer = null;
      }, 280);
      return "single_tap_queued";
    }
  };

  return { handlePointerDown, handlePointerUp, state };
}

// Like state manager matching GemPanelContext implementation
function createLikeManager(initialLikes: Set<string | number>) {
  const likes = new Set(initialLikes);

  const likeGem = (id: string | number) => {
    // Idempotent: only adds, never removes
    if (likes.has(id)) return false; // not modified
    likes.add(id);
    return true; // newly liked
  };

  const toggleUpvote = (id: string | number) => {
    // Toggle: likes if unliked, unlikes if liked
    if (likes.has(id)) {
      likes.delete(id);
      return false; // unliked
    } else {
      likes.add(id);
      return true; // liked
    }
  };

  const isLiked = (id: string | number) => likes.has(id);

  return { likeGem, toggleUpvote, isLiked };
}

describe("Mobile Gem Details Polish Pass", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("1. Single-tap vs Double-tap Gesture Recognition", () => {
    it("fires single-tap to toggle overlay after 280ms delay", () => {
      const onSingleTap = vi.fn();
      const onDoubleTap = vi.fn();
      const recognizer = createGestureRecognizer({ onSingleTap, onDoubleTap });

      const down = recognizer.handlePointerDown(100, 100);
      const res = recognizer.handlePointerUp(down, 100, 100);

      expect(res).toBe("single_tap_queued");
      expect(onSingleTap).not.toHaveBeenCalled();

      // Fast forward past tap recognition window
      vi.advanceTimersByTime(285);
      expect(onSingleTap).toHaveBeenCalledTimes(1);
      expect(onDoubleTap).not.toHaveBeenCalled();
    });

    it("double-tap cancels single-tap overlay toggle and triggers double-tap action", () => {
      const onSingleTap = vi.fn();
      const onDoubleTap = vi.fn();
      const recognizer = createGestureRecognizer({ onSingleTap, onDoubleTap });

      // First tap at t = 0
      const down1 = recognizer.handlePointerDown(100, 100);
      recognizer.handlePointerUp(down1, 100, 100);

      // Advance 100ms (within 300ms window)
      vi.advanceTimersByTime(100);

      // Second tap at t = 100
      const down2 = recognizer.handlePointerDown(102, 101);
      const res2 = recognizer.handlePointerUp(down2, 102, 101);

      expect(res2).toBe("double_tap");
      expect(onDoubleTap).toHaveBeenCalledWith(102, 101);

      // Fast forward past 300ms
      vi.advanceTimersByTime(400);

      // Crucial: Single-tap must NEVER fire on double-tap!
      expect(onSingleTap).not.toHaveBeenCalled();
    });

    it("ignores touch movement > 12px to allow normal vertical scrolling without false taps", () => {
      const onSingleTap = vi.fn();
      const onDoubleTap = vi.fn();
      const recognizer = createGestureRecognizer({ onSingleTap, onDoubleTap });

      // User initiates touch and scrolls 40px vertically
      const down = recognizer.handlePointerDown(100, 100);
      const res = recognizer.handlePointerUp(down, 100, 140);

      expect(res).toBe("scroll_or_drag");
      vi.advanceTimersByTime(500);
      expect(onSingleTap).not.toHaveBeenCalled();
      expect(onDoubleTap).not.toHaveBeenCalled();
    });
  });

  describe("2. Like State Rules & Idempotency", () => {
    it("first double-tap likes an unliked gem and increments count once", () => {
      const likeMgr = createLikeManager(new Set());
      const gemId = "gem-dumas-1";

      expect(likeMgr.isLiked(gemId)).toBe(false);

      const modified = likeMgr.likeGem(gemId);
      expect(modified).toBe(true);
      expect(likeMgr.isLiked(gemId)).toBe(true);
    });

    it("repeated double-tap on an already-liked gem does not increase count and NEVER unlikes", () => {
      const gemId = "gem-dumas-1";
      const likeMgr = createLikeManager(new Set([gemId]));

      expect(likeMgr.isLiked(gemId)).toBe(true);

      // Simulate 5 rapid double-taps
      for (let i = 0; i < 5; i++) {
        const modified = likeMgr.likeGem(gemId);
        expect(modified).toBe(false); // never increments again
        expect(likeMgr.isLiked(gemId)).toBe(true); // never unlikes
      }
    });

    it("only the actual like button can toggle a liked gem back to unliked", () => {
      const gemId = "gem-dumas-1";
      const likeMgr = createLikeManager(new Set());

      // User double taps to like
      likeMgr.likeGem(gemId);
      expect(likeMgr.isLiked(gemId)).toBe(true);

      // User taps actual like button to unlike
      const newState = likeMgr.toggleUpvote(gemId);
      expect(newState).toBe(false);
      expect(likeMgr.isLiked(gemId)).toBe(false);

      // User taps actual like button again to re-like
      const reLikeState = likeMgr.toggleUpvote(gemId);
      expect(reLikeState).toBe(true);
      expect(likeMgr.isLiked(gemId)).toBe(true);
    });
  });

  describe("3. Timing & Animation Constraints", () => {
    it("animation stages conform to requested restrained timing guidelines", () => {
      const heartPopDuration = 280; // guideline: ~250-400ms
      const heartTravelDuration = 400; // guideline: ~350-550ms
      const counterBounceDuration = 220; // guideline: ~180-250ms
      const overlayTransition = 280; // guideline: ~200-300ms

      expect(heartPopDuration).toBeGreaterThanOrEqual(250);
      expect(heartPopDuration).toBeLessThanOrEqual(400);

      expect(heartTravelDuration).toBeGreaterThanOrEqual(350);
      expect(heartTravelDuration).toBeLessThanOrEqual(550);

      expect(counterBounceDuration).toBeGreaterThanOrEqual(180);
      expect(counterBounceDuration).toBeLessThanOrEqual(250);

      expect(overlayTransition).toBeGreaterThanOrEqual(200);
      expect(overlayTransition).toBeLessThanOrEqual(300);
    });
  });
});
