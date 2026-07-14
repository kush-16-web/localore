// MasonryGrid Component — pure grid renderer, no header or filter logic
import React from "react";


export interface GemCardData {
  id: number;
  title: string;
  category: string;
  area: string;
  image: string;
  description: string;
  upvotes: number;
  author: string;
  authorInitials: string;
  hours: string;
  isBookmarked: boolean;
  isUpvoted: boolean;
  aspectRatio: string;
}

export const initialGems: GemCardData[] = [
  {
    id: 1,
    title: "Rander Kulfi & Coco Corner",
    category: "Street food",
    area: "Rander",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    description: "Tucked away in the narrow lanes of Rander, this legendary spot serves the most rich, creamy, hand-churned mango kulfi and thick chocolate coco in Surat. Best visited after 9 PM.",
    upvotes: 184,
    author: "Aarav Shah",
    authorInitials: "AS",
    hours: "6 PM - 11:50 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[3/4]"
  },
  {
    id: 2,
    title: "Dumas Dark Sand Sunset",
    category: "Viewpoint",
    area: "Piplod",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "Skip the main crowded beach and head 1.5km north. There is a quiet inlet where you can see the sun dip into the Arabian Sea, painting the sky in deep purples and oranges.",
    upvotes: 320,
    author: "Pooja Patel",
    authorInitials: "PP",
    hours: "Open 24/7",
    isBookmarked: true,
    isUpvoted: true,
    aspectRatio: "aspect-[16/9]"
  },
  {
    id: 3,
    title: "Dutch & English Cemeteries",
    category: "Heritage",
    area: "Nanpura",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
    description: "Dating back to the 17th century, these grand mausoleums look like forgotten castles. The architectural details tell the rich history of Surat's ancient trade port era.",
    upvotes: 95,
    author: "Vikram Nair",
    authorInitials: "VN",
    hours: "9 AM - 6 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[4/5]"
  },
  {
    id: 4,
    title: "Gopi Talav Quiet Steps",
    category: "Quiet spots",
    area: "Limbayat",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80",
    description: "While Gopi Talav is usually popular, the eastern steps near the old wishing well remain beautifully quiet in the early mornings.",
    upvotes: 142,
    author: "Karan Dave",
    authorInitials: "KD",
    hours: "6 AM - 10 AM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[3/2]"
  },
  {
    id: 5,
    title: "Sarthana River Canopy",
    category: "Nature",
    area: "Vesu",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
    description: "A hidden dense forest trail along the Tapi riverbank. Huge banyan trees form a natural green canopy that blocks out all city noise. Spot peacocks if you go early!",
    upvotes: 215,
    author: "Diya Mehta",
    authorInitials: "DM",
    hours: "7 AM - 5 PM",
    isBookmarked: true,
    isUpvoted: false,
    aspectRatio: "aspect-square"
  },
  {
    id: 6,
    title: "Chowk Bazaar Locho Hub",
    category: "Street food",
    area: "Nanpura",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    description: "The legendary oil-free surti locho served piping hot with green chutney, sev, and a huge dollop of butter. Always ask for the special garlic seasoning topping!",
    upvotes: 289,
    author: "Amit Roy",
    authorInitials: "AR",
    hours: "7 AM - 1 PM",
    isBookmarked: false,
    isUpvoted: true,
    aspectRatio: "aspect-[4/3]"
  },
  {
    id: 7,
    title: "The Old City Fort Ruins",
    category: "Heritage",
    area: "Nanpura",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
    description: "Step inside the historic Mughal fortress walls. Very few visitors know about the small exhibition gallery inside showing ancient maps of Surat.",
    upvotes: 110,
    author: "Riya Kapoor",
    authorInitials: "RK",
    hours: "10 AM - 5 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[3/4]"
  },
  {
    id: 8,
    title: "Tapi Riverfront Quiet Deck",
    category: "Quiet spots",
    area: "Adajan",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
    description: "A wooden deck overlooking the river, hidden behind a popular cafe. It's the perfect spot to read a book or write, accompanied only by the soft sound of waves.",
    upvotes: 176,
    author: "Samir Gohel",
    authorInitials: "SG",
    hours: "Open 24/7",
    isBookmarked: true,
    isUpvoted: false,
    aspectRatio: "aspect-[16/10]"
  },
  {
    id: 9,
    title: "Suvali Black Sand Beach",
    category: "Viewpoint",
    area: "Adajan",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "A secluded beach featuring volcanic black sand, located about 25 km from the city. Almost completely deserted during weekdays, offering clean air and total peace.",
    upvotes: 253,
    author: "Nisha Vyas",
    authorInitials: "NV",
    hours: "6 AM - 7 PM",
    isBookmarked: false,
    isUpvoted: false,
    aspectRatio: "aspect-[4/5]"
  }
];

type MasonryGridProps = {
  gems: GemCardData[];
  onGemSelect?: (gem: GemCardData) => void;
  onBookmarkToggle?: (id: number) => void;
  onUpvoteToggle?: (id: number) => void;
};

export default function MasonryGrid({ gems, onGemSelect, onBookmarkToggle, onUpvoteToggle }: MasonryGridProps) {

  const handleBookmark = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle?.(id);
  };

  const handleUpvote = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvoteToggle?.(id);
  };

  return (
    <div className="w-full font-['DM_Sans',sans-serif] text-left px-4 py-4">

      {/* ── Masonry Grid Layout ── */}
      {gems.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#3D2A18] rounded-2xl bg-[#110C08]">
          <i className="ti ti-search text-3xl text-[#6B4830] mb-2" />
          <p className="text-sm text-[#A07050]">No gems found in this category.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full">
          {gems.map((gem) => (
            <div
              key={gem.id}
              className="
                break-inside-avoid mb-6 rounded-2xl bg-[#1C1410] border border-[#96683d]
                hover:border-[#E8743A]/40 hover:shadow-[0_12px_24px_-10px_rgba(232,116,58,0.15)]
                transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer
              "
              onClick={(e) => {
                e.stopPropagation();
                onGemSelect?.(gem);
              }}
            >
              {/* Image Container with Pinterest dynamic aspect ratio */}
              <div className={`relative overflow-hidden bg-[#110C08] ${gem.aspectRatio}`}>
                <img
                  src={gem.image}
                  alt={gem.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                
                {/* Dark overlay on hover */}
                {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-10" /> */}

                {/* Category Overlay Pill (always visible) */}
                <span className="absolute top-3 left-3 bg-[#110C08]/40 backdrop-blur-md text-[#F5E6D0] text-[10px] font-medium px-2.5 py-[4px] rounded-lg z-20">
                  {gem.category}
                </span>

                {/* Quick Area Overlay Pill (always visible) */}
                <span className="absolute top-3 right-3 bg-[#E8743A] text-[#110C08] text-[10px] font-bold px-2.5 py-[4px] rounded-lg flex items-center gap-1.5 z-20 shadow-md">
                  <i className="ti ti-map-pin text-[11px]" />
                  {gem.area}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4.5 flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[16px] font-semibold text-[#F5E6D0] group-hover:text-[#E8743A] transition-colors duration-200 leading-snug font-['Syne',sans-serif]">
                    {gem.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-[#A07050]">
                    <span className="flex items-center gap-1">
                      <i className="ti ti-clock text-[11px]" />
                      {gem.hours}
                    </span>
                  </div>
                </div>

                <p className="text-[12.5px] text-[#A07050]/90 leading-relaxed font-normal">
                  {gem.description}
                </p>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-3 border-t border-[#332010] mt-1.5">
                  {/* Author avatar */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#3D2A18] border border-[#A07050]/20 flex items-center justify-center text-[10px] font-bold text-[#F5E6D0] font-['Syne',sans-serif]">
                      {gem.authorInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-[#C8A888]">By {gem.author}</span>
                    </div>
                  </div>

                  {/* Actions (Upvote + Bookmark) */}
                  <div className="flex items-center gap-2">
                    {/* Upvote Button */}
                    <button
                      onClick={(e) => handleUpvote(gem.id, e)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all duration-150
                        ${
                          gem.isUpvoted
                            ? "bg-[#E8743A]/15 text-[#E8743A] border-[#E8743A]/30"
                            : "bg-[#110C08] text-[#A07050] border-[#3D2A18] hover:text-[#F5E6D0] hover:border-[#A07050]/40"
                        }
                      `}
                    >
                      <i className={`ti ${gem.isUpvoted ? "ti-arrow-big-up-filled" : "ti-arrow-big-up"} text-[13px]`} />
                      <span>{gem.upvotes}</span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => handleBookmark(gem.id, e)}
                      className={`
                        w-7 h-7 flex items-center justify-center rounded-lg border text-[13px] cursor-pointer transition-all duration-150
                        ${
                          gem.isBookmarked
                            ? "bg-[#261A14] text-[#E8743A] border-[#E8743A]/30"
                            : "bg-[#110C08] text-[#A07050] border-[#3D2A18] hover:text-[#F5E6D0] hover:border-[#A07050]/40"
                        }
                      `}
                    >
                      <i className={`ti ${gem.isBookmarked ? "ti-bookmark-filled" : "ti-bookmark"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}