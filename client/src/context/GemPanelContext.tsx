import { createContext, useContext, useState } from "react";
import { initialGems, type GemCardData } from "../components/MasonryGrid";
import { CURRENT_USER } from "../data/constants";

// Fields the user fills in when sharing a gem — the rest is derived
export type GemDraft = Pick<
  GemCardData,
  "title" | "category" | "area" | "image" | "description" | "hours"
>;

// ── Types ────────────────────────────────────────────────────────────────────
type GemPanelContextValue = {
  gems: GemCardData[];
  selectedGem: GemCardData | null;
  openPanel: (gem: GemCardData) => void;
  closePanel: () => void;
  toggleUpvote: (id: number) => void;
  toggleBookmark: (id: number) => void;
  addGem: (draft: GemDraft) => GemCardData;
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

  const ASPECT_RATIOS = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[16/9]",
  ];

  // Mock-mode persistence — new gems live in state until the backend exists
  const addGem = (draft: GemDraft): GemCardData => {
    const gem: GemCardData = {
      ...draft,
      id: Math.max(0, ...gems.map((g) => g.id)) + 1,
      upvotes: 0,
      author: CURRENT_USER.name,
      authorInitials: CURRENT_USER.initials,
      isBookmarked: false,
      isUpvoted: false,
      aspectRatio:
        ASPECT_RATIOS[Math.floor(Math.random() * ASPECT_RATIOS.length)],
    };
    setGems((prev) => [gem, ...prev]);
    return gem;
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
        addGem,
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
