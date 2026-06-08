import { useState } from "react"
import { useColorThief } from "../../hooks/useColorThief"
import type { GemCardData } from "../MasonryGrid"

type Props = {
    gem: GemCardData
    onClick?: (gem: GemCardData) => void
}

export default function GemCard({ gem, onClick }: Props) {
    const { css: bgOverlay, loading: colourLoading } = useColorThief(gem.image)
    const [isHover, setHover] = useState(false)

    const handleClick = () => {
        if (onClick) onClick(gem)
    }

      return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden border border-[#96683d] hover:border-[#E8743A]/40 transition-all duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onClick?.(gem)}
    >

      {/* ── Image container ── */}
      <div className="relative aspect-[4/3] bg-[#110C08]">
        {/* real image */}
        <img
          src={gem.image}
          alt={gem.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* ── Category badge (always visible) ── */}
        <span className="absolute top-3 left-3 bg-[#110C08]/40 backdrop-blur-md text-[#F5E6D0] text-[10px] font-medium px-2.5 py-[4px] rounded-lg border border-[#3D2A18] z-20">
          {gem.category}
        </span>

        {/* ── Area badge (always visible) ── */}
        <span className="absolute top-3 right-3 bg-[#E8743A] text-[#110C08] text-[10px] font-bold px-2.5 py-[4px] rounded-lg flex items-center gap-1.5 z-20">
          <i className="ti ti-map-pin text-[11px]" />
          {gem.area}
        </span>

        {/* ── Dark overlay on hover (optional) ── */}
        <div
          className={`
            absolute inset-0 transition-opacity duration-300
            ${isHover ? "bg-black/40 opacity-100" : "opacity-0"}
          `}
        />
      </div>

      {/* ── Body (title, description, actions) ── */}
      <div className="p-4 flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-[16px] font-semibold text-[#F5E6D0] group-hover:text-[#E8743A] transition-colors duration-200 font-['Syne',sans-serif]">
          {gem.title}
        </h3>

        {/* Optional description (you can hide on very small cards) */}
        <p className="text-[12px] text-[#A07050]/90 line-clamp-2">
          {gem.description}
        </p>

        {/* Action bar – up‑vote & bookmark */}
        <div className="flex items-center gap-2 mt-2">
          {/* Up‑vote button */}
          <button
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-semibold
              ${gem.isUpvoted
                ? "bg-[#E8743A]/15 text-[#E8743A] border-[#E8743A]/30"
                : "bg-[#110C08] text-[#A07050] border-[#3D2A18] hover:text-[#F5E6D0] hover:border-[#A07050]/40"}
            `}
            // onClick handler would toggle up‑vote (state lives in parent)
          >
            <i className={`ti ${gem.isUpvoted ? "ti-arrow-big-up-filled" : "ti-arrow-big-up"}`} />
            <span>{gem.upvotes}</span>
          </button>

          {/* Bookmark button */}
          <button
            className={`
              w-7 h-7 flex items-center justify-center rounded-lg border text-[13px]
              ${gem.isBookmarked
                ? "bg-[#261A14] text-[#E8743A] border-[#E8743A]/30"
                : "bg-[#110C08] text-[#A07050] border-[#3D2A18] hover:text-[#F5E6D0] hover:border-[#A07050]/40"}
            `}
          >
            <i className={`ti ${gem.isBookmarked ? "ti-bookmark-filled" : "ti-bookmark"}`} />
          </button>
        </div>
      </div>

      {/* ── Background colour overlay (behind the body) ── */}
      {/* Show once the colour is ready – use the CSS string from the hook */}
      {bgOverlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: bgOverlay,          // rgba(r,g,b,0.6)
            backdropFilter: "blur(20px)",
          }}
        />
      )}
    </div>
  )
}

