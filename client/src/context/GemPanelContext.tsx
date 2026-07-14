import { createContext, useContext, useState } from "react";
import type { GemCardData } from "../components/MasonryGrid";

// ── Types ────────────────────────────────────────────────────────────────────
type GemPanelContextValue = {
  selectedGem: GemCardData | null;
  openPanel: (gem: GemCardData) => void;
  closePanel: () => void;
};

// ── Context ───────────────────────────────────────────────────────────────────
const GemPanelContext = createContext<GemPanelContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function GemPanelProvider({ children }: { children: React.ReactNode }) {
  const [selectedGem, setSelectedGem] = useState<GemCardData | null>(null);

  return (
    <GemPanelContext.Provider
      value={{
        selectedGem,
        openPanel: (gem) => setSelectedGem(gem),
        closePanel: () => setSelectedGem(null),
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
