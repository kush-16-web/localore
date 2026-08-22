import { createContext, useContext, useState } from "react";
import { initialGems, type GemCardData } from "../components/MasonryGrid";

// ── Types ────────────────────────────────────────────────────────────────────
type GemPanelContextValue = {
  gems: GemCardData[];
  selectedGem: GemCardData | null;
  openPanel: (gem: GemCardData) => void;
  closePanel: () => void;
  toggleUpvote: (id: number) => void;
  toggleBookmark: (id: number) => void;
};

// ── Context ───────────────────────────────────────────────────────────────────
const GemPanelContext = createContext<GemPanelContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function GemPanelProvider({ children }: { children: React.ReactNode }) {
  const [gems, setGems] = useState<GemCardData[]>(initialGems);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Derived so the panel always shows fresh data after upvote/save
  const selectedGem = gems.find((g) => g.id === selectedId) ?? null;

  const openPanel = (gem: GemCardData) => setSelectedId(gem.id);
  const closePanel = () => setSelectedId(null);

  const toggleUpvote = (id: number) => {
    setGems((prev) =>
      prev.map((gem) => {
        if (gem.id !== id) return gem;
        const isUpvoted = !gem.isUpvoted;
        return { ...gem, isUpvoted, upvotes: isUpvoted ? gem.upvotes + 1 : gem.upvotes - 1 };
      })
    );
  };

  const toggleBookmark = (id: number) => {
    setGems((prev) =>
      prev.map((gem) =>
        gem.id === id ? { ...gem, isBookmarked: !gem.isBookmarked } : gem
      )
    );
  };

  return (
    <GemPanelContext.Provider
      value={{
        gems,
        selectedGem,
        openPanel,
        closePanel,
        toggleUpvote,
        toggleBookmark,
      }}
    >
      {children}
    </GemPanelContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useGemPanel(): GemPanelContextValue {
  const ctx = useContext(GemPanelContext);
  if (!ctx) throw new Error("useGemPanel must be used inside <GemPanelProvider>");
  return ctx;
}
