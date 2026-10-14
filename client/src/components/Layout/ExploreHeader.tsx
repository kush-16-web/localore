import { PLACE_CATEGORIES } from "../../types/place";

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
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-2.5 border-b border-[#261810] bg-[#140C08] shrink-0">
      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none shrink-0 w-full">
        {PLACE_CATEGORIES.map((cat) => {
          const isActive = activeTab === cat;
          const icon = CATEGORY_ICONS[cat] || "ti-tag";
          return (
            <button
              key={cat}
              onClick={() => onTabChange(cat)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                whitespace-nowrap transition-all duration-150 cursor-pointer
                ${
                  isActive
                    ? "bg-[#2D180E] text-[#FF8D54] border border-[#E8743A] font-semibold shadow-sm"
                    : "bg-[#1A120E] text-[#D8C7B8] border border-[#352317] hover:bg-[#241913] hover:text-white hover:border-[#4D3222]"
                }
              `}
            >
              <i className={`ti ${icon} text-[13px] ${isActive ? "text-[#FF8D54]" : "text-[#A89080]"}`} />
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
