import { useState } from "react";
import MasonryGrid from "../../components/MasonryGrid";
import ExploreHeader from "../../components/Layout/ExploreHeader";
import { useGemPanel } from "../../context/GemPanelContext";

export default function Explore() {
  // ── Gem data lives in context — shared with the RightPanel ───────────────
  const { gems, searchQuery, openPanel, toggleUpvote, toggleBookmark } = useGemPanel();
  const [activeTab, setActiveTab] = useState("All");

  // Title matches lead; related metadata and descriptions keep useful results discoverable.
  const query = searchQuery.trim().toLowerCase();
  const filteredGems = gems
    .filter((gem) => activeTab === "All" || gem.category.toLowerCase() === activeTab.toLowerCase())
    .map((gem, index) => {
      if (!query) return { gem, score: 0, index };

      const title = gem.title.toLowerCase();
      const tags = (gem.tags ?? []).join(" ").toLowerCase();
      const category = gem.category.toLowerCase();
      const area = gem.area.toLowerCase();
      const description = gem.description.toLowerCase();
      const other = `${gem.hours} ${gem.author}`.toLowerCase();
      const fields = [title, tags, category, area, description, other];
      const queryTerms = query.split(/\s+/).filter(Boolean);
      let score = 0;

      if (title === query) score += 1000;
      else if (title.startsWith(query)) score += 800;
      else if (title.includes(query)) score += 650;
      if (tags.includes(query)) score += 500;
      if (category.includes(query)) score += 400;
      if (area.includes(query)) score += 350;
      if (description.includes(query)) score += 250;
      if (other.includes(query)) score += 100;

      if (queryTerms.length > 1) {
        queryTerms.forEach((term) => {
          if (title.includes(term)) score += 120;
          else if (tags.includes(term)) score += 90;
          else if (category.includes(term) || area.includes(term)) score += 70;
          else if (description.includes(term)) score += 40;
          else if (fields.some((field) => field.includes(term))) score += 15;
        });
      }

      return { gem, score, index };
    })
    .filter(({ score }) => !query || score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ gem }) => gem);

  return (
    <div className="h-full flex flex-col overflow-hidden ">
      {/* Sticky filter header */}
      <ExploreHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-[#120B08]">
        <MasonryGrid
          gems={filteredGems}
          emptyMessage={query ? `No gems found for “${searchQuery.trim()}”.` : undefined}
          emptyHint={query ? "Try another place, category, or detail." : undefined}
          onGemSelect={openPanel}
          onBookmarkToggle={toggleBookmark}
          onUpvoteToggle={toggleUpvote}
        />
      </div>
    </div>
  );
}
