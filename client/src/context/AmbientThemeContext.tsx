import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { AmbientPalette, AmbientThemeState, ThemeLevel } from "../types/theme";
import { DEFAULT_AMBIENT_PALETTE } from "../types/theme";
import { useGemPanel } from "./GemPanelContext";
import { useLocationState } from "./LocationContext";
import {
  extractImagePalette,
  derivePaletteFromRgb,
  generateCollectiveCategoryPalette,
} from "../services/ambientThemeService";

interface AmbientThemeContextValue extends AmbientThemeState {
  triggerSurpriseMe: () => void;
  setCategoryTheme: (category: string) => void;
  resetToDefault: () => void;
}

const AmbientThemeContext = createContext<AmbientThemeContextValue | null>(null);

export function AmbientThemeProvider({ children }: { children: ReactNode }) {
  const { places, activeCategory, selectedGem, openPanel } = useGemPanel();
  const { currentLocation } = useLocationState();

  const [level, setLevel] = useState<ThemeLevel>(1);
  const [palette, setPalette] = useState<AmbientPalette>(DEFAULT_AMBIENT_PALETTE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [surpriseMeActive, setSurpriseMeActive] = useState(false);

  // Track async request IDs to prevent stale overwrites
  const currentRequestIdRef = useRef<number>(0);

  // ── CSS Custom Properties Synchronization ──────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ambient-bg", palette.ambientBg);
    root.style.setProperty("--ambient-surface", palette.ambientSurface);
    root.style.setProperty("--ambient-surface-raised", palette.ambientSurfaceRaised);
    root.style.setProperty("--ambient-accent", palette.ambientAccent);
    root.style.setProperty("--ambient-accent-muted", palette.ambientAccentMuted);
    root.style.setProperty("--ambient-border", palette.ambientBorder);
    root.style.setProperty("--ambient-glow", palette.ambientGlow);
    root.style.setProperty("--ambient-text", palette.ambientText);
    root.style.setProperty("--ambient-text-muted", palette.ambientTextMuted);
    root.style.setProperty("--ambient-svg-color", palette.ambientSvgColor);
  }, [palette]);

  // ── Theme Determination Engine (Selected Gem > Category > Default) ─────────
  useEffect(() => {
    const requestId = ++currentRequestIdRef.current;
    
    // Defer transition state to avoid cascading render lint warning
    const rafId = requestAnimationFrame(() => {
      setIsTransitioning(true);
    });

    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 550);

    async function computeTheme() {
      // Level 3 — Individual Gem Theme (Highest Priority)
      if (selectedGem) {
        setLevel(3);
        const extracted = await extractImagePalette(selectedGem.image);
        if (requestId !== currentRequestIdRef.current) return;

        if (extracted.length > 0) {
          const gemPalette = derivePaletteFromRgb(extracted[0], extracted[1] ?? extracted[0]);
          setPalette(gemPalette);
        } else {
          // If image extraction fails (e.g. CORS), gracefully derive from category or default
          if (activeCategory && activeCategory !== "All") {
            const catPal = await generateCollectiveCategoryPalette(
              currentLocation.city,
              activeCategory,
              places
            );
            if (requestId !== currentRequestIdRef.current) return;
            setPalette(catPal);
          } else {
            setPalette(DEFAULT_AMBIENT_PALETTE);
          }
        }
        return;
      }

      // Level 2 — Collective Category Theme
      if (activeCategory && activeCategory !== "All") {
        setLevel(2);
        const catPalette = await generateCollectiveCategoryPalette(
          currentLocation.city,
          activeCategory,
          places
        );
        if (requestId !== currentRequestIdRef.current) return;
        setPalette(catPalette);
        return;
      }

      // Level 1 — Default Localore Theme Baseline
      setLevel(1);
      setPalette(DEFAULT_AMBIENT_PALETTE);
    }

    computeTheme();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(transitionTimer);
    };
  }, [selectedGem, activeCategory, currentLocation.city, places]);

  // ── Surprise Me Integration ────────────────────────────────────────────────
  const triggerSurpriseMe = useCallback(() => {
    if (places.length === 0) return;
    setSurpriseMeActive(true);

    // Pick a random gem from available places
    const randomIdx = Math.floor(Math.random() * places.length);
    const chosenGem = places[randomIdx];

    // Brief exploration motif transition before revealing
    setTimeout(() => {
      setSurpriseMeActive(false);
      openPanel(chosenGem);
    }, 450);
  }, [places, openPanel]);

  const setCategoryTheme = useCallback((_cat: string) => {
    void _cat;
    // Handled reactively via activeCategory
  }, []);

  const resetToDefault = useCallback(() => {
    setLevel(1);
    setPalette(DEFAULT_AMBIENT_PALETTE);
  }, []);

  return (
    <AmbientThemeContext.Provider
      value={{
        level,
        activeCategory: surpriseMeActive ? "Surprise Me" : activeCategory,
        selectedGemId: selectedGem?.id ?? null,
        palette,
        isTransitioning,
        surpriseMeActive,
        triggerSurpriseMe,
        setCategoryTheme,
        resetToDefault,
      }}
    >
      {children}
    </AmbientThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAmbientTheme(): AmbientThemeContextValue {
  const ctx = useContext(AmbientThemeContext);
  if (!ctx) {
    throw new Error("useAmbientTheme must be used within an AmbientThemeProvider");
  }
  return ctx;
}
