const categories = ["All", "Viewpoint", "Nature", "Street food", "Heritage", "Quiet spots"];

type ExploreHeaderProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function ExploreHeader({ activeTab, onTabChange }: ExploreHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-3 border-b border-[#332010] bg-[#0D0906]/80 backdrop-blur-lg shrink-0">
      {/* Title + subtitle */}
      <div>
        <h2
          className="text-2xl font-semibold text-[#F5E6D0] tracking-wide"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Explore Local Gems
        </h2>
        <p className="text-xs text-[#A07050] mt-1">
          Discover hidden spots curated by locals, from quiet nature walks to legendary street food stalls.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-[6px] overflow-x-auto py-1 scrollbar-none shrink-0">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => onTabChange(cat)}
              className={`
                px-[13px] py-[6px] rounded-full text-[11px] font-medium
                whitespace-nowrap transition-all duration-150
                border cursor-pointer
                ${
                  isActive
                    ? "bg-[#261A14] text-[#E8743A] border-[#E8743A]/40"
                    : "text-[#A07050] border-[#3D2A18] hover:bg-[#1C1410] hover:text-[#C8A888]"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
