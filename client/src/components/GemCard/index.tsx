import { useState } from "react"
import { useColorThief } from "../../hooks/useColorThief"
import type { GemCardData } from "../MasonryGrid"

type Props = {
    gem: GemCardData
    onClick?: (gem: GemCardData) => void
}

export default function GemCard({ gem, onClick }: Props) {
    const { css: bgOverlay } = useColorThief(gem.image)
    const [isHover, setHover] = useState(false)



      return (
     <div className="flex flex-col">

  {/* Hero */}
  <div className="relative h-64 flex flex-col justify-center items-center ">
    <img
      src={gem.image}
      alt={gem.title}
      className="w-full h-full object-cover sticky top-0 z-0"
    />

    {/* Gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#120B08] via-[#120B08]/30 to-transparent" />

    {/* Top badges */}
    <div className="absolute top-4 left-4 flex gap-2">
      <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs text-white">
        {gem.category}
      </span>
    </div>

    <div className="absolute top-4 right-4">
      <span className="px-3 py-1 rounded-full bg-[#E8743A] text-[#120B08] text-xs font-semibold flex items-center gap-1">
        <i className="ti ti-map-pin" />
        {gem.area}
      </span>
    </div>

    {/* Bottom Title */}
    <div className="absolute">
      <p className="text-white text-3xl font-['Syne']">
        {gem.title}
      </p>
    </div>
  </div>


  {/* Content */}
  <div className="p-5 flex flex-col gap-5">

    {/* Stats */}
    <div className="flex items-center justify-between">

      <button className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-[#1B120D] border border-[#3D2A18]">
        <i className="ti ti-arrow-big-up text-[#E8743A]" />
        <span className="text-[#F5E6D0]">{gem.upvotes}</span>
      </button>

      <button className="w-11 h-11 rounded-xl cursor-pointer bg-[#1B120D] border border-[#3D2A18]">
        <i className={`ti ${gem.isBookmarked ? "ti-bookmark-filled text-[#E8743A]" : "ti-bookmark text-[#F5E6D0]"}`} />
      </button>

    </div>


    {/* About */}
    <div className="rounded-lg bg-[#1A120D]/60 border border-[#3D2A18] p-4">

      <h3 className="text-sm text-left font-semibold text-[#F5E6D0] mb-3">
        About this Gem
      </h3>

      <p className="text-sm text-left text-[#B88A66] leading-7">
        {gem.description}
      </p>

    </div>


    {/* Info Grid */}

    <div className="grid grid-cols-2 gap-3">

      <div className="rounded-xl flex flex-col justify-center items-center  border border-[#3D2A18] bg-[#1A120D]/60 p-2">

        <div className="text-[#8B654A] text-xs mb-1">
          Best Time
        </div>

        <div className="text-[#F5E6D0] text-xs font-medium flex items-center gap-2">
          <i className="ti ti-clock" />
          {gem.hours}
        </div>

      </div>


      <div className="rounded-xl flex flex-col justify-center items-center  border border-[#3D2A18] bg-[#1A120D]/60">

        <div className="text-[#8B654A] text-xs mb-1">
          Area
        </div>

        <div className="text-[#F5E6D0] text-xs font-medium flex items-center gap-2">
          <i className="ti ti-map-pin" />
          {gem.area}
        </div>

      </div>

    </div>


    {/* Author */}

    <div className="rounded-2xl border border-[#3D2A18] bg-[#1A120D]/60 p-4">

      <div className="text-xs text-[#8B654A] mb-3">
        Submitted by
      </div>

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-full bg-[#E8743A] flex items-center justify-center font-semibold text-[#120B08]">
          KD
        </div>

        <div>

          <div className="text-[#F5E6D0]">
            Karan Dave
          </div>

          <div className="text-xs text-[#8B654A]">
            Local Explorer
          </div>

        </div>

      </div>

    </div>


    {/* Tags */}

    <div>

      <div className="text-sm text-[#8B654A] font-bold mb-2 flex items-center">
        <i className="ti ti-hash"></i> Tags 
      </div>

      <div className="flex flex-wrap gap-2">

        <span className="px-3 py-1 rounded-full bg-[#261A14] text-[#D9A27B] text-xs">
          #StreetFood
        </span>

        <span className="px-3 py-1 rounded-full bg-[#261A14] text-[#D9A27B] text-xs">
          #Dessert
        </span>

        <span className="px-3 py-1 rounded-full bg-[#261A14] text-[#D9A27B] text-xs">
          #LocalFavorite
        </span>

      </div>

    </div>

  </div>


  {/* Sticky Bottom */}

  <div className="sticky bottom-0 p-4 bg-gradient-to-t from-[#120B08] to-transparent">

    <button className="w-full rounded-xl bg-[#E8743A] cursor-pointer  text-[#120B08] font-semibold py-3 hover:opacity-90 transition">
      Open in Maps <i className="ti ti-map"></i>
    </button>

  </div>

</div>
  )
}

