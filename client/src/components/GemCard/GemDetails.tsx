import type { GemCardData } from "../MasonryGrid"

/** Keyless Google Maps embed using coordinates or place name. */
export function GemMap({ gem, className = "h-52" }: { gem: GemCardData; className?: string }) {
  const query = gem.coordinates
    ? `${gem.coordinates.lat},${gem.coordinates.lng}`
    : `${gem.title}, ${gem.area}`;

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#F5E6D0]">
          <i className="ti ti-map-pin text-[#E8743A]" />
          Location & Map
        </h3>
        {gem.coordinates && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${gem.coordinates.lat},${gem.coordinates.lng}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-[#E8743A] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Directions</span>
            <i className="ti ti-arrow-up-right text-xs" />
          </a>
        )}
      </div>
      <div className={`${className} w-full overflow-hidden rounded-2xl ring-1 ring-white/10`}>
        <iframe
          title={`Map of ${gem.title}`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {gem.address && (
        <p className="mt-2 text-xs text-[#A07050]">
          📍 {gem.address}
        </p>
      )}
      {gem.website && (
        <p className="mt-1 text-xs">
          <a
            href={gem.website}
            target="_blank"
            rel="noreferrer"
            className="text-[#E8743A] hover:underline flex items-center gap-1"
          >
            <i className="ti ti-world text-xs" />
            <span>Visit Website</span>
          </a>
        </p>
      )}
    </section>
  )
}

/** Placeholder for the future voice-narration feature. */
export function NarrationTeaser() {
  return (
    <section className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 opacity-80">
      <div className="flex items-center gap-2 mb-1.5">
        <i className="ti ti-microphone text-[#E8743A]" />
        <h3 className="text-sm font-semibold text-[#F5E6D0]">Voice Narration</h3>
        <span className="ml-auto rounded-full bg-[#E8743A]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#E8743A]">
          Soon
        </span>
      </div>
      <p className="text-xs leading-6 text-[#8B654A]">
        Locals will share how to reach this gem — turn-by-turn tips, best routes and hidden shortcuts.
      </p>
    </section>
  )
}

/**
 * Shared gem detail sections (hero / about / info / author) used by
 * both the mobile bottom sheet and the desktop right panel.
 */
export default function GemDetails({ gem }: { gem: GemCardData }) {
  return (
    <>
      {/* Hero */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-xl">
        <img src={gem.image} alt={gem.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120B08] via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-lg bg-black/45 px-2.5 py-1 text-[11px] font-medium text-[#F5E6D0] backdrop-blur-md">
          {gem.category}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-[#E8743A] px-2.5 py-1 text-[11px] font-bold text-[#120B08] shadow-md">
          <i className="ti ti-map-pin text-[11px]" />
          {gem.area}
        </span>
        <div className="absolute inset-x-4 bottom-3">
          <h2 className="font-['Syne',sans-serif] text-[22px] font-bold leading-tight text-white drop-shadow-lg">
            {gem.title}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
            <i className="ti ti-clock text-sm" />
            {gem.hours}
          </p>
        </div>
      </div>

      {/* About */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
        <h3 className="mb-2 text-sm font-semibold text-[#F5E6D0]">About this Gem</h3>
        <p className="text-sm leading-7 text-[#C8A888]">{gem.description}</p>
      </section>

      {/* Info chips */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
          <p className="mb-1.5 text-[11px] uppercase tracking-wider text-[#A07050]">Best Time</p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[#F5E6D0]">
            <i className="ti ti-clock text-[#E8743A]" />
            {gem.hours}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
          <p className="mb-1.5 text-[11px] uppercase tracking-wider text-[#A07050]">Area</p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[#F5E6D0]">
            <i className="ti ti-map-pin text-[#E8743A]" />
            {gem.area}
          </p>
        </div>
      </section>

      {/* Map */}
      <GemMap gem={gem} className="h-48" />

      {/* Author */}
      <section className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E8743A] text-sm font-bold text-[#120B08]">
          {gem.authorInitials}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F5E6D0]">{gem.author}</p>
          <p className="text-xs text-[#A07050]">Local Explorer · Submitted this gem</p>
        </div>
      </section>

      {/* Voice narration teaser */}
      <NarrationTeaser />
    </>
  )
}

type GemActionsProps = {
  gem: GemCardData
  onUpvoteToggle?: (id: string | number) => void
  onBookmarkToggle?: (id: string | number) => void
}

/** Pinned action row: upvote / save / open in maps. */
export function GemActions({ gem, onUpvoteToggle, onBookmarkToggle }: GemActionsProps) {
  const directionsUrl = gem.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${gem.coordinates.lat},${gem.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gem.title} ${gem.area}`)}`;

  return (
    <div className="flex gap-2.5">
      <button
        onClick={() => onUpvoteToggle?.(gem.id)}
        className={`flex h-12 min-w-0 flex-1 items-center justify-center gap-2 cursor-pointer rounded-2xl border text-sm font-semibold transition-all duration-150 active:scale-95 ${
          gem.isUpvoted
            ? 'border-[#E8743A]/40 bg-[#E8743A]/15 text-[#E8743A]'
            : 'border-white/10 bg-white/[0.06] text-[#F5E6D0]'
        }`}
      >
        <i className={`ti shrink-0 ${gem.isUpvoted ? 'ti-heart-filled' : 'ti-heart'} text-base`} />
        <span className="truncate">{gem.upvotes}</span>
      </button>

      <button
        onClick={() => onBookmarkToggle?.(gem.id)}
        aria-label={gem.isBookmarked ? 'Remove from saved' : 'Save gem'}
        className={`grid h-12 w-12 cursor-pointer shrink-0 place-items-center rounded-2xl border transition-all duration-150 active:scale-95 ${
          gem.isBookmarked
            ? 'border-[#E8743A]/40 bg-[#E8743A]/15 text-[#E8743A]'
            : 'border-white/10 bg-white/[0.06] text-[#F5E6D0]'
        }`}
      >
        <i className={`ti ${gem.isBookmarked ? 'ti-bookmark-filled' : 'ti-bookmark'} text-lg`} />
      </button>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Open Directions"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#E8743A] text-[#120B08]
          shadow-lg shadow-[#E8743A]/25 active:scale-95 transition-transform"
      >
        <i className="ti ti-map text-lg" />
      </a>
    </div>
  )
}
