import { useSearchParams } from "react-router-dom";
import { AREAS } from "../../data/constants";

/**
 * Map view — keyless Google embed for now (same trick GemDetails uses).
 * Area chips re-focus the map until the real map SDK lands.
 */
export default function MapPage() {
  // Area lives in the URL so sidebar / profile trail links can deep-link to it
  const [searchParams, setSearchParams] = useSearchParams();
  const activeArea = searchParams.get("area");

  const setActiveArea = (area: string | null) =>
    setSearchParams(area ? { area } : {}, { replace: true });

  const query = activeArea ? `${activeArea}, Surat` : "Surat, Gujarat";

  return (
    <div className="h-full relative overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Map */}
      <iframe
        title="Localore map"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Floating area chips */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center gap-[6px] overflow-x-auto scrollbar-none py-1">
        <button
          onClick={() => setActiveArea(null)}
          className={`
            shrink-0 px-[13px] py-[6px] rounded-full text-[11px] font-medium cursor-pointer
            backdrop-blur-md border transition-all duration-150 active:scale-95
            ${
              activeArea === null
                ? "bg-[#E8743A] text-[#110C08] border-[#E8743A]"
                : "bg-[#110C08]/70 text-[#F5E6D0] border-white/10 hover:bg-[#1C1410]/80"
            }
          `}
        >
          All areas
        </button>
        {AREAS.map((area) => {
          const isActive = activeArea === area.label;
          return (
            <button
              key={area.label}
              onClick={() => setActiveArea(isActive ? null : area.label)}
              className={`
                shrink-0 flex items-center gap-1.5 px-[13px] py-[6px] rounded-full
                text-[11px] font-medium cursor-pointer backdrop-blur-md border
                transition-all duration-150 active:scale-95
                ${
                  isActive
                    ? "bg-[#E8743A] text-[#110C08] border-[#E8743A]"
                    : "bg-[#110C08]/70 text-[#F5E6D0] border-white/10 hover:bg-[#1C1410]/80"
                }
              `}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: area.color }} />
              {area.label}
            </button>
          );
        })}
      </div>

      {/* Hint card */}
      <div className="absolute left-3 bottom-[calc(env(safe-area-inset-bottom)+84px)] md:bottom-4 z-10 max-w-[220px]
        bg-[#110C08]/75 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5">
        <p className="text-[11px] leading-snug text-[#C8A888]">
          <i className="ti ti-map-pin-filled text-[#E8743A] mr-1" />
          {activeArea ? (
            <>Showing gems around <span className="font-semibold text-[#F5E6D0]">{activeArea}</span>.</>
          ) : (
            <>Tap an area to explore its side of the city.</>
          )}
        </p>
      </div>
    </div>
  );
}
