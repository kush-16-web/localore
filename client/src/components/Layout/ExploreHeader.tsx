import { PLACE_CATEGORIES, type CityLocation } from "../../types/place";

const CATEGORY_ICONS: Record<string, string> = {
  All: "ti-compass",
  "Cafés and food": "ti-coffee",
  "Nature and parks": "ti-trees",
  "Scenic viewpoints": "ti-eye",
  "Arts and culture": "ti-palette",
  "Historic places": "ti-building-monument",
  "Interesting local attractions": "ti-sparkles",
};

const CATEGORY_SHORT_NAMES: Record<string, string> = {
  All: "All",
  "Cafés and food": "Cafés",
  "Nature and parks": "Nature",
  "Scenic viewpoints": "Viewpoints",
  "Arts and culture": "Culture",
  "Historic places": "Historic",
  "Interesting local attractions": "Attractions",
};

export interface ExploreHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentLocation: CityLocation;
  isDetectingLocation: boolean;
  onRequestDeviceLocation: () => void;
  onOpenCityModal: () => void;
  isSurat?: boolean;
  demoMode?: boolean;
  onToggleDemoMode?: () => void;
}

const formatLocationTitle = (loc: CityLocation): string => {
  if (loc.isLiveGps) {
    if (loc.city) {
      return `${loc.city}${loc.region ? `, ${loc.region}` : loc.country ? `, ${loc.country}` : ""}`;
    }
    return loc.displayName || "My Location";
  }
  if (loc.city) {
    return `${loc.city}${loc.region ? `, ${loc.region}` : loc.country ? `, ${loc.country}` : ""}`;
  }
  if (loc.displayName) {
    const parts = loc.displayName.split(",").map((p) => p.trim());
    return parts.slice(0, 2).join(", ");
  }
  return "Select location";
};

export default function ExploreHeader({
  activeTab,
  onTabChange,
  currentLocation,
  isDetectingLocation,
  onRequestDeviceLocation,
  onOpenCityModal,
  isSurat,
  demoMode,
  onToggleDemoMode,
}: ExploreHeaderProps) {
  const locationTitle = formatLocationTitle(currentLocation);

  return (
    <div className="px-4 pt-3.5 pb-2.5 bg-[#120B08]/90 backdrop-blur-md border-b border-white/[0.06] shrink-0 space-y-3 font-['DM_Sans',sans-serif]">
      {/* ── Row 1: Location Info & Near Me Action ────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Location Pin & City */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onOpenCityModal}
            aria-label="Open city selector"
            className="w-8 h-8 rounded-full bg-[#1C1410] hover:bg-[#281A12] border border-[#3D2A18] hover:border-[#E8743A]/60 flex items-center justify-center shrink-0 transition-colors cursor-pointer group active:scale-95"
          >
            <i className="ti ti-map-pin text-[#E8743A] text-base group-hover:scale-110 transition-transform" />
          </button>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <strong className="text-sm font-bold text-[#F5E6D0] truncate tracking-wide">
                {locationTitle}
              </strong>
              {currentLocation.isLiveGps && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"
                  title="Live GPS location"
                />
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <button
                type="button"
                onClick={onOpenCityModal}
                className="flex items-center gap-1 text-[11px] text-[#A07050] hover:text-[#E8743A] transition-colors cursor-pointer group"
              >
                <span>Change location</span>
                <i className="ti ti-chevron-down text-[10px] group-hover:translate-y-0.5 transition-transform" />
              </button>

              {isSurat && onToggleDemoMode && (
                <button
                  type="button"
                  onClick={onToggleDemoMode}
                  title={`Developer Demo Mode: ${demoMode ? "ON" : "OFF"}`}
                  className={`text-[10px] px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    demoMode
                      ? "text-[#E8743A]/90 bg-[#E8743A]/10 border border-[#E8743A]/25"
                      : "text-[#6B4830] hover:text-[#A07050]"
                  }`}
                >
                  demo {demoMode ? "on" : "off"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Near Me Action Pill */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onRequestDeviceLocation}
            disabled={isDetectingLocation}
            className={`
              flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
              transition-all active:scale-95 cursor-pointer shadow-sm
              ${
                currentLocation.isLiveGps
                  ? "bg-[#E8743A]/15 border border-[#E8743A]/50 text-[#E8743A] hover:bg-[#E8743A]/25"
                  : "bg-[#E8743A] hover:bg-[#D4622A] text-[#120B08]"
              }
              ${isDetectingLocation ? "opacity-75 cursor-wait" : ""}
            `}
          >
            <i
              className={`ti ${
                isDetectingLocation ? "ti-loader animate-spin" : "ti-crosshair"
              } text-sm`}
            />
            <span>{isDetectingLocation ? "Locating..." : "Near me"}</span>
            {currentLocation.isLiveGps && !isDetectingLocation && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"
                title="Live GPS active"
              />
            )}
          </button>
        </div>
      </div>

      {/* ── Row 2: Category Filter Horizontal Scroll ────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-4 px-4">
        {PLACE_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat;
          const icon = CATEGORY_ICONS[cat] || "ti-tag";
          const shortLabel = CATEGORY_SHORT_NAMES[cat] || cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onTabChange(cat)}
              className={`
                flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium
                whitespace-nowrap transition-all duration-150 border cursor-pointer active:scale-95
                ${
                  isActive
                    ? "bg-[#261A14] text-[#E8743A] border-[#E8743A]/50 ring-1 ring-[#E8743A]/20 shadow-sm"
                    : "bg-transparent text-[#A07050] border-[#3D2A18] hover:bg-[#1C1410] hover:text-[#C8A888]"
                }
              `}
            >
              <i className={`ti ${icon} text-xs`} />
              <span>{shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
