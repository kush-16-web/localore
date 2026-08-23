import { Link, useSearchParams } from "react-router-dom";
import MasonryGrid from "../../components/MasonryGrid";
import { useGemPanel } from "../../context/GemPanelContext";
import { CURRENT_USER, areaColor } from "../../data/constants";

type ProfileTab = "gems" | "saved";

export default function Profile() {
  const { gems, openPanel, toggleUpvote, toggleBookmark } = useGemPanel();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab: ProfileTab =
    searchParams.get("tab") === "saved" ? "saved" : "gems";

  const setTab = (next: ProfileTab) => {
    // "gems" is the default — keep the URL clean for it
    setSearchParams(next === "saved" ? { tab: "saved" } : {});
  };

  const myGems = gems.filter((g) => g.author === CURRENT_USER.name);
  const savedGems = gems.filter((g) => g.isBookmarked);

  const totalUpvotes = myGems.reduce((sum, g) => sum + g.upvotes, 0);
  const areasCovered = [...new Set(myGems.map((g) => g.area))];

  const shownGems = tab === "gems" ? myGems : savedGems;

  return (
    <div className="h-full flex flex-col overflow-hidden font-['DM_Sans',sans-serif]">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-[#120B08]">
        {/* ── Identity block ─────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-5 pt-7 md:pt-10">
          {/* Avatar + stats — stacked on phone like IG, side-by-side on desktop */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-5 md:gap-10">
            {/* Story-style gradient ring built from area colours */}
            <div
              className="p-[3px] rounded-full shrink-0"
              style={{
                background:
                  "conic-gradient(from 210deg, #E8743A, #F5C842, #2ABFCC, #9B8FCC, #E8743A)",
              }}
            >
              <div
                className={`
                  w-[84px] h-[84px] md:w-[104px] md:h-[104px] rounded-full p-[3px]
                  bg-[#140C08] grid place-items-center
                `}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#3D2A18] to-[#261A14] grid place-items-center text-[#E8743A] text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {CURRENT_USER.initials}
                </div>
              </div>
            </div>

            {/* Boxed stat row on mobile (IG pattern), plain on desktop */}
            <div className="w-full md:w-auto grid grid-cols-3 md:flex md:gap-10 border border-[#332010] md:border-none rounded-2xl md:rounded-none py-3.5 md:py-0 divide-x divide-[#332010] md:divide-none">
              {[
                { value: myGems.length, label: "Gems" },
                { value: totalUpvotes, label: "Upvotes" },
                { value: areasCovered.length, label: "Areas" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center px-2 md:px-0 min-w-[72px]">
                  <span className="text-lg md:text-xl font-bold text-[#F5E6D0]" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {stat.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8B654A] mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Name / handle / bio */}
          <div className="mt-5 text-center md:text-left">
            <h1
              className="flex items-center justify-center md:justify-start gap-1.5 text-xl md:text-2xl font-bold text-[#F5E6D0]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {CURRENT_USER.name}
              <i className="ti ti-diamond-filled text-[13px] text-[#E8743A]" title="Gem curator" />
            </h1>
            <p className="text-[13px] text-[#8B654A] mt-0.5">{CURRENT_USER.handle}</p>
            <p className="text-[13px] leading-relaxed text-[#C8A888] mt-2.5 max-w-md mx-auto md:mx-0">
              {CURRENT_USER.bio}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full border border-[#332010] bg-[#1C1410] text-[11px] text-[#C8A888]">
              <i className="ti ti-map-pin text-[12px] text-[#E8743A]" />
              {CURRENT_USER.city}
            </span>
          </div>

          {/* ── Gem trail — areas this explorer has contributed to ────────── */}
          {areasCovered.length > 0 && (
            <div className="mt-6 pb-5 border-b border-[#332010]/70">
              <p className="text-[10px] text-left font-bold tracking-[0.10em] uppercase text-[#A07050] mb-2.5">
                Gem Trail
              </p>
              <div className="flex flex-wrap gap-2">
                {areasCovered.map((area) => {
                  const count = myGems.filter((g) => g.area === area).length;
                  return (
                    <Link
                      key={area}
                      to={`/map?area=${encodeURIComponent(area)}`}
                      className="
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                        bg-[#1C1410] border border-[#332010] no-underline
                        hover:border-[#A07050]/40 transition-colors duration-150
                      "
                      title={`See ${area} on the map`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: areaColor(area) }}
                      />
                      <span className="text-[11px] text-[#C8A888]">{area}</span>
                      <span className="text-[9px] text-[#6B4830]">×{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Tabs — sticky under scroll while grid flows beneath ─────────── */}
        <div className="sticky top-0 z-20 mt-4 bg-[#140C08]/95 backdrop-blur-xl border-y border-[#332010] mx-auto">
          <div className="flex">
            {(
              [
                { key: "gems", label: "Gems", icon: "ti-diamond", count: myGems.length },
                { key: "saved", label: "Saved", icon: "ti-bookmark", count: savedGems.length },
              ] as const
            ).map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer
                    text-[12px] font-semibold tracking-wide uppercase transition-all duration-150
                    border-b-2 -mb-px
                    ${
                      isActive
                        ? "text-[#E8743A] border-[#E8743A]"
                        : "text-[#6B4830] border-transparent hover:text-[#A07050]"
                    }
                  `}
                >
                  <i className={`ti ${isActive ? `${t.icon}-filled` : t.icon} text-[15px]`} />
                  {t.label}
                  <span className={`text-[10px] font-medium ${isActive ? "text-[#E8743A]/80" : "text-[#6B4830]/70"}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ─────────────────────────────────────────────────── */}
        {shownGems.length > 0 ? (
          <MasonryGrid
            gems={shownGems}
            onGemSelect={openPanel}
            onBookmarkToggle={toggleBookmark}
            onUpvoteToggle={toggleUpvote}
          />
        ) : tab === "gems" ? (
          <ProfileEmptyState
            icon="ti-diamond"
            title="No gems shared yet"
            hint="Know a hidden spot the city should know about?"
            ctaLabel="Share your first gem"
            ctaTo="/create-gem"
          />
        ) : (
          <ProfileEmptyState
            icon="ti-bookmark"
            title="Nothing saved yet"
            hint="Tap the bookmark on any gem to keep it here."
            ctaLabel="Explore gems"
            ctaTo="/"
          />
        )}
      </div>
    </div>
  );
}

function ProfileEmptyState({
  icon,
  title,
  hint,
  ctaLabel,
  ctaTo,
}: {
  icon: string;
  title: string;
  hint: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-10 pb-24">
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#3D2A18] rounded-2xl bg-[#110C08] px-6">
        <i className={`ti ${icon} text-4xl text-[#6B4830] mb-3`} />
        <p className="text-sm font-semibold text-[#C8A888]" style={{ fontFamily: "'Syne', sans-serif" }}>
          {title}
        </p>
        <p className="text-xs text-[#6B4830] mt-1.5 mb-5">{hint}</p>
        <Link
          to={ctaTo}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-[10px] no-underline
            bg-[#E8743A] hover:bg-[#D4622A] text-[#110C08] text-[12px] font-semibold
            transition-all duration-150 active:scale-95
          "
        >
          <i className="ti ti-plus text-[14px]" />
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
