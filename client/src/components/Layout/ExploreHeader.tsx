import { PLACE_CATEGORIES } from "../../types/place";
import { useAmbientTheme } from "../../context/AmbientThemeContext";

const CATEGORY_ICONS: Record<string, string> = {
  All: "ti-compass",
  "Cafés and food": "ti-coffee",
  "Nature and parks": "ti-trees",
  "Scenic viewpoints": "ti-eye",
  "Arts and culture": "ti-palette",
  "Historic places": "ti-building-monument",
  "Interesting local attractions": "ti-sparkles",
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
      className="flex items-center justify-between gap-3 px-4 py-2.5 border-b shrink-0 transition-colors duration-500"
      style={{
        backgroundColor: "var(--ambient-surface, #140C08)",
        borderColor: "var(--ambient-border, #261810)",
      }}
    >
      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none shrink min-w-0">
        {PLACE_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat;
          const icon = CATEGORY_ICONS[cat] || "ti-tag";
          return (
            <button
              key={cat}
              onClick={() => onTabChange(cat)}
              style={
                isActive
                  ? {
                      borderColor: "var(--ambient-accent, #E8743A)",
                      color: "var(--ambient-accent, #FF8D54)",
                      backgroundColor: "var(--ambient-surface-raised, #2D180E)",
                    }
                  : undefined
              }
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                whitespace-nowrap transition-all duration-150 cursor-pointer
                ${
                  isActive
                    ? "border font-semibold shadow-sm"
                    : "bg-[#1A120E] text-[#D8C7B8] border border-[#352317] hover:bg-[#241913] hover:text-white hover:border-[#4D3222]"
                }
              `}
            >
              <i
                className={`ti ${icon} text-[13px] ${
                  isActive ? "text-[inherit]" : "text-[#A89080]"
                }`}
              />
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-[#E8743A]/40 bg-[#E8743A]/10 text-[#E8743A] hover:bg-[#E8743A]/20 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
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
