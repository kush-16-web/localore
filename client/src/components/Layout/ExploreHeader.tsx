import { PLACE_CATEGORIES } from "../../types/place";
import { useAmbientTheme } from "../../context/AmbientThemeContext";

const CATEGORY_ICONS: Record<string, string> = {
  All: "ti-compass",
  "Cafés and food": "ti-coffee",
  "Nature and parks": "ti-trees",
  "Scenic viewpoints": "ti-eye",
  "Arts and culture": "ti-palette",
  "Historic places": "ti-building-monument",
  "Interesting local attractions": "ti-compass",
};

type ExploreHeaderProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function ExploreHeader({
  activeTab,
  onTabChange,
}: ExploreHeaderProps) {
  const { triggerSurpriseMe, surpriseMeActive } = useAmbientTheme();

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 border-b backdrop-blur-lg shrink-0 transition-colors duration-500"
      style={{
        borderColor: "var(--ambient-border, #332010)",
        backgroundColor: "var(--ambient-surface, #140C08)",
      }}
    >
      {/* Category filter tabs */}
      <div className="flex items-center gap-[6px] overflow-x-auto py-1 scrollbar-none shrink min-w-0">
        {PLACE_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat;
          const icon = CATEGORY_ICONS[cat] || "ti-tag";
          return (
            <button
              key={cat}
              onClick={() => onTabChange(cat)}
              className={`
                flex items-center gap-1.5 px-[13px] py-[6px] rounded-full text-[11px] font-medium
                whitespace-nowrap transition-all duration-150
                border cursor-pointer
                ${
                  isActive
                    ? "bg-[#261A14] text-[#E8743A] border-[#E8743A]/40 shadow-sm"
                    : "text-[#A07050] border-[#3D2A18] hover:bg-[#1C1410] hover:text-[#C8A888]"
                }
              `}
            >
              <i className={`ti ${icon} text-[13px]`} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Surprise Me discovery button */}
      <button
        onClick={triggerSurpriseMe}
        disabled={surpriseMeActive}
        title="Surprise me with a random hidden gem"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap border border-[#E8743A]/40 bg-[#E8743A]/10 text-[#E8743A] hover:bg-[#E8743A]/20 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
      >
        <i
          className={`ti ${
            surpriseMeActive ? "ti-compass animate-spin" : "ti-sparkles"
          } text-xs`}
        />
        <span className="hidden sm:inline">Surprise Me</span>
      </button>
    </div>
  );
}
