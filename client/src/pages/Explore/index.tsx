import { useState } from "react";
import MasonryGrid, { type GemCardData, initialGems } from "../../components/MasonryGrid";
import ExploreHeader from "../../components/Layout/ExploreHeader";
import { useGemPanel } from "../../context/GemPanelContext";

export default function Explore() {
  // ── Gem data & interactions ──────────────────────────────────────────────
  const [gems, setGems] = useState<GemCardData[]>(initialGems);
  const [activeTab, setActiveTab] = useState("All");

  // selectedGem lives in context — Layout renders the panel
  const { openPanel } = useGemPanel();

  const handleBookmarkToggle = (id: number) => {
    setGems(prev =>
      prev.map(gem =>
        gem.id === id ? { ...gem, isBookmarked: !gem.isBookmarked } : gem
      )
    );
  };

  const handleUpvoteToggle = (id: number) => {
    setGems(prev =>
      prev.map(gem => {
        if (gem.id !== id) return gem;
        const isUpvoted = !gem.isUpvoted;
        return { ...gem, isUpvoted, upvotes: isUpvoted ? gem.upvotes + 1 : gem.upvotes - 1 };
      })
    );
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredGems =
    activeTab === "All"
      ? gems
      : gems.filter(g => g.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="h-full flex flex-col overflow-hidden ">
      {/* Sticky filter header */}
      <ExploreHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-[#120B08]">
        <MasonryGrid
          gems={filteredGems}
          onGemSelect={openPanel}
          onBookmarkToggle={handleBookmarkToggle}
          onUpvoteToggle={handleUpvoteToggle}
        />
      </div>
    </div>
  );
}
