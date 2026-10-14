import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import InteractiveMap from "../../components/Map/InteractiveMap";
import { useGemPanel } from "../../context/GemPanelContext";
import { useLocationState } from "../../context/LocationContext";
import { AREAS } from "../../data/constants";

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeArea = searchParams.get("area");

  const { places, selectedGem, openPanel } = useGemPanel();
  const { currentLocation, openCityModal } = useLocationState();

  const isSurat = currentLocation.city.toLowerCase() === "surat";

  // Derive distinct areas from current places or fall back to default AREAS for Surat
  const availableAreas = useMemo(() => {
    if (isSurat) {
      return AREAS.map((a) => a.label);
    }
    const distinct = new Set<string>();
    places.forEach((p) => {
      if (p.area && p.area !== "Local Spot") {
        distinct.add(p.area);
      }
    });
    return Array.from(distinct).slice(0, 8);
  }, [places, isSurat]);

  const setActiveArea = (area: string | null) =>
    setSearchParams(area ? { area } : {}, { replace: true });

  const filteredPlaces = useMemo(() => {
    if (!activeArea) return places;
    return places.filter(
      (p) => p.area.toLowerCase() === activeArea.toLowerCase()
    );
  }, [places, activeArea]);

  // Center on selected gem if one is selected, else city center
  const mapCenter = useMemo(() => {
    if (selectedGem?.coordinates) {
      return selectedGem.coordinates;
    }
    if (filteredPlaces.length > 0 && activeArea) {
      return filteredPlaces[0].coordinates;
    }
    return currentLocation.coordinates;
  }, [selectedGem, filteredPlaces, activeArea, currentLocation.coordinates]);

  return (
    <div className="h-full relative overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Real Interactive Leaflet Map */}
      <InteractiveMap
        center={mapCenter}
        places={filteredPlaces}
        selectedPlace={selectedGem}
        onSelectPlace={openPanel}
        radiusMeters={7500}
      />

      {/* Floating area chips */}
      {availableAreas.length > 0 && (
        <div className="absolute top-3 inset-x-3 z-10 flex items-center gap-[6px] overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveArea(null)}
            className={`
              shrink-0 px-[13px] py-[6px] rounded-full text-[11px] font-medium cursor-pointer
              backdrop-blur-md border transition-all duration-150 active:scale-95
              ${
                activeArea === null
                  ? "bg-[#E8743A] text-[#110C08] border-[#E8743A] shadow-md"
                  : "bg-[#110C08]/80 text-[#F5E6D0] border-white/10 hover:bg-[#1C1410]"
              }
            `}
          >
            All spots ({places.length})
          </button>
          {availableAreas.map((area) => {
            const isActive = activeArea === area;
            return (
              <button
                key={area}
                onClick={() => setActiveArea(isActive ? null : area)}
                className={`
                  shrink-0 flex items-center gap-1.5 px-[13px] py-[6px] rounded-full
                  text-[11px] font-medium cursor-pointer backdrop-blur-md border
                  transition-all duration-150 active:scale-95
                  ${
                    isActive
                      ? "bg-[#E8743A] text-[#110C08] border-[#E8743A] shadow-md"
                      : "bg-[#110C08]/80 text-[#F5E6D0] border-white/10 hover:bg-[#1C1410]"
                  }
                `}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8743A] shrink-0" />
                {area}
              </button>
            );
          })}
        </div>
      )}

      {/* Floating hint card */}
      <div className="absolute left-3 bottom-[calc(env(safe-area-inset-bottom)+84px)] md:bottom-4 z-10 max-w-[260px]
        bg-[#110C08]/85 backdrop-blur-md border border-white/10 rounded-2xl px-3.5 py-3 shadow-xl">
        <p className="text-[11px] leading-snug text-[#C8A888]">
          <i className="ti ti-map-pin-filled text-[#E8743A] mr-1" />
          {activeArea ? (
            <>
              Showing spots in <span className="font-semibold text-[#F5E6D0]">{activeArea}</span>.
            </>
          ) : (
            <>
              Exploring <span className="font-semibold text-[#F5E6D0]">{currentLocation.city}</span> ({places.length} places mapped).
            </>
          )}
        </p>
        <p className="text-[10px] text-[#8B654A] mt-1">
          Tap any pin to view place details and directions.
        </p>
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={openCityModal}
            className="text-[10px] text-[#E8743A] hover:text-[#FFA070] transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            title="Change city"
          >
            <i className="ti ti-world text-[11px]" />
            Change City
          </button>
        </div>
      </div>
    </div>
  );
}
