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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-3 border-b border-[#332010]/60 bg-[#140C08]/30 backdrop-blur-md shrink-0">
      {/* Category filter tabs */}
      <div className="flex items-center gap-[6px] overflow-x-auto py-1 scrollbar-none shrink-0 w-full">
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
    </div>
  );
}
