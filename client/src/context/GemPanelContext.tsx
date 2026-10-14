import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { UnifiedPlace } from "../types/place";
import { useLocationState } from "./LocationContext";
import {
  fetchNearbyPlaces,
  getSuratDemoGems,
} from "../services/placesService";
import { CURRENT_USER } from "../data/constants";

export type GemDraft = Pick<
  UnifiedPlace,
  "title" | "category" | "area" | "image" | "description" | "hours"
>;

// ── Types ────────────────────────────────────────────────────────────────────
interface GemPanelContextValue {
  places: UnifiedPlace[];
  gems: UnifiedPlace[]; // Alias for backward compatibility
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  selectedGem: UnifiedPlace | null;
  openPanel: (gem: UnifiedPlace) => void;
  closePanel: () => void;
  toggleUpvote: (id: string | number) => void;
  toggleBookmark: (id: string | number) => void;
  addGem: (draft: GemDraft) => UnifiedPlace;
  isLoadingPlaces: boolean;
  placesError: string | null;
  refreshPlaces: () => Promise<void>;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

const GemPanelContext = createContext<GemPanelContextValue | null>(null);

export function GemPanelProvider({ children }: { children: ReactNode }) {
  const { currentLocation } = useLocationState();

  // Category filter
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  // User submitted community gems persisted in localStorage
  const [communityGems, setCommunityGems] = useState<UnifiedPlace[]>(() => {
    try {
      const stored = localStorage.getItem("localore_community_gems");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Upvoted and bookmarked place IDs persisted in localStorage
  const [upvotedIds, setUpvotedIds] = useState<Set<string | number>>(() => {
    try {
      const stored = localStorage.getItem("localore_upvoted_ids");
      return stored ? new Set(JSON.parse(stored)) : new Set([2, 6]);
    } catch {
      return new Set([2, 6]);
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string | number>>(() => {
    try {
      const stored = localStorage.getItem("localore_bookmarked_ids");
      return stored ? new Set(JSON.parse(stored)) : new Set([2, 5]);
    } catch {
      return new Set([2, 5]);
    }
  });

  // Fetched external places
  const [externalPlaces, setExternalPlaces] = useState<UnifiedPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [placesError, setPlacesError] = useState<string | null>(null);

  // Demo mode: on by default when browsing Surat, otherwise off
  const isSurat = currentLocation.city.toLowerCase() === "surat";
  const [demoMode, setDemoMode] = useState<boolean>(true);

  // Load external places whenever location or category changes
  const loadPlaces = useCallback(async () => {
    setIsLoadingPlaces(true);
    setPlacesError(null);

    try {
      const results = await fetchNearbyPlaces(
        currentLocation.coordinates,
        activeCategory,
        7500
      );
      setExternalPlaces(results);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load places nearby.";
      setPlacesError(msg);
      setExternalPlaces([]);
    } finally {
      setIsLoadingPlaces(false);
    }
  }, [currentLocation.coordinates, activeCategory]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  // Combine places:
  // If in Surat and demoMode is active, include Surat Demo Gems.
  // Include user submitted community gems for the current area.
  // Include real worldwide places from OpenStreetMap.
  const allPlaces = useMemo(() => {
    const list: UnifiedPlace[] = [];

    // Surat Demo Gems (only when in Surat and demoMode enabled)
    if (isSurat && demoMode) {
      const demoGems = getSuratDemoGems();
      list.push(...demoGems);
    }

    // Community submitted gems
    list.push(...communityGems);

    // OpenStreetMap places
    list.push(...externalPlaces);

    // Merge upvotes and bookmark states
    return list.map((place) => {
      const isUpvoted = upvotedIds.has(place.id);
      const isBookmarked = bookmarkedIds.has(place.id);
      return {
        ...place,
        isUpvoted,
        isBookmarked,
        upvotes: place.upvotes + (isUpvoted && place.source === "osm" ? 1 : 0),
      };
    });
  }, [isSurat, demoMode, communityGems, externalPlaces, upvotedIds, bookmarkedIds]);

  const selectedGem = allPlaces.find((p) => p.id === selectedId) ?? null;

  const openPanel = (gem: UnifiedPlace) => setSelectedId(gem.id);
  const closePanel = () => setSelectedId(null);

  const toggleUpvote = (id: string | number) => {
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(
          "localore_upvoted_ids",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleBookmark = (id: string | number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(
          "localore_bookmarked_ids",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  const ASPECT_RATIOS = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[16/9]",
  ];

  const addGem = (draft: GemDraft): UnifiedPlace => {
    const newGem: UnifiedPlace = {
      ...draft,
      id: `community-${Date.now()}`,
      coordinates: currentLocation.coordinates,
      source: "community",
      upvotes: 1,
      author: CURRENT_USER.name,
      authorInitials: CURRENT_USER.initials,
      isBookmarked: false,
      isUpvoted: true,
      aspectRatio:
        ASPECT_RATIOS[Math.floor(Math.random() * ASPECT_RATIOS.length)],
      tags: ["#CommunityGem", `#${draft.category.replace(/\s+/g, "")}`],
    };

    setCommunityGems((prev) => {
      const next = [newGem, ...prev];
      try {
        localStorage.setItem("localore_community_gems", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    return newGem;
  };

  return (
    <GemPanelContext.Provider
      value={{
        places: allPlaces,
        gems: allPlaces,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        selectedGem,
        openPanel,
        closePanel,
        toggleUpvote,
        toggleBookmark,
        addGem,
        isLoadingPlaces,
        placesError,
        refreshPlaces: loadPlaces,
        demoMode,
        setDemoMode,
      }}
    >
      {children}
    </GemPanelContext.Provider>
  );
}

export function useGemPanel(): GemPanelContextValue {
  const ctx = useContext(GemPanelContext);
  if (!ctx) {
    throw new Error("useGemPanel must be used inside <GemPanelProvider>");
  }
  return ctx;
}
