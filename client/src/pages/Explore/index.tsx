import { useState } from "react";
import MasonryGrid from "../../components/MasonryGrid";
import ExploreHeader from "../../components/Layout/ExploreHeader";
import { useGemPanel } from "../../context/GemPanelContext";

export default function Explore() {
  // ── Gem data lives in context — shared with the RightPanel ───────────────
  const { gems, openPanel, toggleUpvote, toggleBookmark } = useGemPanel();
  const [activeTab, setActiveTab] = useState("All");

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
          onBookmarkToggle={toggleBookmark}
          onUpvoteToggle={toggleUpvote}
        />
      </div>
    </div>
  );
}
