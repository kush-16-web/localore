import { useState, useMemo } from "react";
import MasonryGrid from "../../components/MasonryGrid";
import ExploreHeader from "../../components/Layout/ExploreHeader";
import CitySelectorModal from "../../components/CitySelector/CitySelectorModal";
import { useGemPanel } from "../../context/GemPanelContext";
import { useLocationState } from "../../context/LocationContext";
import type { UnifiedPlace } from "../../types/place";

// Category aliases for demo compatibility
function matchesCategory(placeCat: string, activeCat: string): boolean {
  if (activeCat === "All") return true;
  const p = placeCat.toLowerCase();
  const a = activeCat.toLowerCase();
  if (p === a) return true;

  if (a.includes("food") || a.includes("café")) {
    return p.includes("food") || p.includes("café") || p.includes("restaurant");
  }
  if (a.includes("nature") || a.includes("park")) {
    return p.includes("nature") || p.includes("park") || p.includes("quiet");
  }
  if (a.includes("viewpoint")) {
    return p.includes("viewpoint") || p.includes("sunset") || p.includes("scenic");
  }
  if (a.includes("historic")) {
    return p.includes("heritage") || p.includes("historic") || p.includes("monument");
  }
  if (a.includes("arts") || a.includes("culture")) {
    return p.includes("arts") || p.includes("culture") || p.includes("museum");
  }
  if (a.includes("attractions")) {
    return p.includes("attraction") || p.includes("adventures");
  }

  return false;
}

export default function Explore() {
  const {
    places,
    searchQuery,
    activeCategory,
    setActiveCategory,
    openPanel,
    toggleUpvote,
    toggleBookmark,
    isLoadingPlaces,
    placesError,
    refreshPlaces,
    demoMode,
    setDemoMode,
  } = useGemPanel();

  const {
    currentLocation,
    requestDeviceLocation,
    isDetectingLocation,
  } = useLocationState();

  const [cityModalOpen, setCityModalOpen] = useState(false);

  const isSurat = currentLocation.city.toLowerCase() === "surat";
  const query = searchQuery.trim().toLowerCase();

  // Filter and score places
  const filteredPlaces = useMemo(() => {
    return places
      .filter((place) => matchesCategory(place.category, activeCategory))
      .map((place, index) => {
        if (!query) return { place, score: 0, index };

        const title = place.title.toLowerCase();
        const tags = (place.tags ?? []).join(" ").toLowerCase();
        const category = place.category.toLowerCase();
        const area = place.area.toLowerCase();
        const description = place.description.toLowerCase();
        const other = `${place.hours} ${place.author}`.toLowerCase();
        const fields = [title, tags, category, area, description, other];
        const queryTerms = query.split(/\s+/).filter(Boolean);
        let score = 0;

        if (title === query) score += 1000;
        else if (title.startsWith(query)) score += 800;
        else if (title.includes(query)) score += 650;
        if (tags.includes(query)) score += 500;
        if (category.includes(query)) score += 400;
        if (area.includes(query)) score += 350;
        if (description.includes(query)) score += 250;
        if (other.includes(query)) score += 100;

        if (queryTerms.length > 1) {
          queryTerms.forEach((term) => {
            if (title.includes(term)) score += 120;
            else if (tags.includes(term)) score += 90;
            else if (category.includes(term) || area.includes(term)) score += 70;
            else if (description.includes(term)) score += 40;
            else if (fields.some((field) => field.includes(term))) score += 15;
          });
        }

        return { place, score, index };
      })
      .filter(({ score }) => !query || score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map(({ place }) => place);
  }, [places, activeCategory, query]);

  return (
    <div className="h-full flex flex-col overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Category filter tabs */}
      <ExploreHeader
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
      />

      {/* Discovery banner / Location info bar */}
      <div
        className="px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2.5 text-xs transition-colors duration-500"
        style={{
          backgroundColor: "var(--ambient-surface, #140C08)",
          borderColor: "var(--ambient-border, #261810)",
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Interactive location selector pill */}
          <button
            type="button"
            onClick={() => setCityModalOpen(true)}
            style={{
              backgroundColor: "var(--ambient-surface-raised, #1C1410)",
              borderColor: "var(--ambient-border, #382417)",
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[#F5E6D0] transition-colors cursor-pointer group shadow-sm hover:border-[var(--ambient-accent,#E8743A)]"
            title="Click to search or change city"
          >
            <i className="ti ti-map-pin text-[var(--ambient-accent,#E8743A)] text-sm group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-xs tracking-wide">{currentLocation.displayName}</span>
            <i className="ti ti-chevron-down text-[11px] text-[#A89080] group-hover:text-[#F5E6D0] transition-colors" />
          </button>
          <span className="text-[#A89080] text-xs hidden sm:inline">
            · {filteredPlaces.length} places found
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Prominent Explore Near Me button if not yet on live GPS */}
          {!currentLocation.isLiveGps && (
            <button
              onClick={() => requestDeviceLocation()}
              disabled={isDetectingLocation}
              style={{
                backgroundColor: "var(--ambient-accent, #E8743A)",
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#120B08] font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <i
                className={`ti ${
                  isDetectingLocation ? "ti-loader animate-spin" : "ti-crosshair"
                }`}
              />
              <span>{isDetectingLocation ? "Locating..." : "Explore near me"}</span>
            </button>
          )}

          {/* Surat Demo Mode toggle if in Surat */}
          {isSurat && (
            <button
              onClick={() => setDemoMode(!demoMode)}
              style={
                demoMode
                  ? {
                      borderColor: "var(--ambient-accent, #E8743A)",
                      color: "var(--ambient-accent, #FF8D54)",
                      backgroundColor: "var(--ambient-surface-raised, #2D180E)",
                    }
                  : {
                      backgroundColor: "var(--ambient-surface-raised, #1C1410)",
                      borderColor: "var(--ambient-border, #382417)",
                    }
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                demoMode
                  ? "font-medium"
                  : "text-[#D8C7B8] hover:text-white"
              }`}
            >
              <i className="ti ti-sparkles" />
              <span>Demo Mode: {demoMode ? "ON" : "OFF"}</span>
            </button>
          )}

          {/* Refresh button */}
          <button
            onClick={() => refreshPlaces()}
            disabled={isLoadingPlaces}
            title="Refresh places"
            style={{
              backgroundColor: "var(--ambient-surface-raised, #1C1410)",
              borderColor: "var(--ambient-border, #382417)",
            }}
            className="w-8 h-8 rounded-full border text-[#D8C7B8] hover:text-[#F5E6D0] flex items-center justify-center cursor-pointer transition-colors"
          >
            <i className={`ti ti-refresh ${isLoadingPlaces ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Scrollable grid area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-transparent">
        {/* Error banner if network/provider failed */}
        {placesError && (
          <div className="m-4 p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ti ti-info-circle text-base text-amber-400" />
              <span>{placesError} Showing available cached or local spots.</span>
            </div>
            <button
              onClick={() => refreshPlaces()}
              className="px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800/60 text-amber-100 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton state */}
        {isLoadingPlaces && places.length === 0 ? (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-[#332010] bg-[#1A110B]/60 p-3 space-y-3"
              >
                <div className="w-full h-44 rounded-xl bg-[#281810]/70" />
                <div className="h-4 bg-[#281810]/70 rounded-md w-3/4" />
                <div className="h-3 bg-[#281810]/50 rounded-md w-1/2" />
                <div className="flex justify-between pt-2">
                  <div className="h-6 w-16 bg-[#281810]/70 rounded-full" />
                  <div className="h-6 w-12 bg-[#281810]/70 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MasonryGrid
            gems={filteredPlaces as unknown as UnifiedPlace[]}
            emptyMessage={
              query
                ? `No places found for “${searchQuery.trim()}” in ${currentLocation.city}.`
                : `No places found for “${activeCategory}” in ${currentLocation.city}.`
            }
            emptyHint="Try switching to another category, expanding your search, or pick a different city."
            onGemSelect={openPanel}
            onBookmarkToggle={toggleBookmark}
            onUpvoteToggle={toggleUpvote}
          />
        )}
      </div>

      <CitySelectorModal
        isOpen={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
      />
    </div>
  );
}
