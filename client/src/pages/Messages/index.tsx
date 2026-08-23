import { Link } from "react-router-dom";

/**
 * Messages — placeholder shell. Functionality TBD; the route and nav
 * entries exist so the IA is locked in before the backend lands.
 */
export default function Messages() {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-[#120B08] font-['DM_Sans',sans-serif]">
      <div className="max-w-2xl mx-auto px-5 py-10 md:py-16">
        {/* Page heading */}
        <h1
          className="flex items-center gap-2.5 text-2xl font-bold text-[#F5E6D0]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <i className="ti ti-message-circle-filled text-xl text-[#E8743A]" />
          Messages
        </h1>

        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#3D2A18] rounded-2xl bg-[#110C08] px-6">
          <i className="ti ti-message-circle text-4xl text-[#6B4830] mb-3" />
          <p className="text-sm font-semibold text-[#C8A888]" style={{ fontFamily: "'Syne', sans-serif" }}>
            No conversations yet
          </p>
          <p className="text-xs text-[#6B4830] mt-1.5 mb-5 max-w-xs leading-relaxed">
            Soon you'll be able to plan meetup spots and swap gem tips with other explorers.
          </p>
          <Link
            to="/"
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-[10px] no-underline
              bg-[#E8743A] hover:bg-[#D4622A] text-[#110C08] text-[12px] font-semibold
              transition-all duration-150 active:scale-95
            "
          >
            <i className="ti ti-compass text-[14px]" />
            Explore gems
          </Link>
        </div>
      </div>
    </div>
  );
}
