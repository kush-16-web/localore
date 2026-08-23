"use client";

import { useState,useEffect , useRef} from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png"

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const { pathname } = useLocation();

  // IG pattern — the profile page drops the search bar
  const showSearch = pathname !== "/profile";

  // placeholder animation
 const placeholders = [
    { icon: "ti ti-ghost", text: "hidden spots" },
    { icon: "ti ti-building", text: "areas" },
    { icon: "ti ti-meat", text: "food stalls" },
    { icon: "ti ti-coffee", text: "cafes" },
    { icon: "ti ti-compass", text: "adventures" },
  ];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  const searchInputRef = useRef<HTMLInputElement>(null);


    const handleContainerClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  // animate placeholder — slide out down, swap word, slide in from top
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase('out');                          // trigger exit slide
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % placeholders.length);
        setPhase('in');                         // remount span → enter slide
      }, 320);
    }, 3000);

    return () => clearInterval(interval);
  }, []);



  return (
    <header
      className="
        h-16 shrink-0 flex items-center justify-between gap-3 px-5
        bg-[#110C08]/60 backdrop-blur-xl
        border-b border-[#332010]
        font-['DM_Sans',sans-serif]
      "
    >
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span
            className="text-[20px] hidden md:block  font-semibold text-[#F5E6D0] tracking-wide"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Localore
          </span>
        </div>
      {/* ── Search bar — hidden on profile ── */}
    {showSearch && (
    <div
    onClick={handleContainerClick}
        className={`
        relative flex items-center gap-1 md:w-[35%] w-[calc(100%-100px)]
        px-4 py-[7px] rounded-full
        bg-[#1C1410]
        border transition-all duration-150
        ${searchFocused ? "border-[#E8743A]" : "border-[#3D2A18]"}
        `}
    >
        <i className="ti ti-search text-[14px] text-[#A07050] shrink-0" />
    
        {/* Added min-w-0 and overflow-hidden to prevent parent stretching */}
        <div className="flex items-center mx-1 min-w-0 overflow-hidden">
            {!searchFocused && (
                 <span
                key={currentIdx}
                className="md:text-[14px] text-[12px] text-[#E8A87C] font-['DM_Sans',sans-serif] shrink-0"
            >
                Search&nbsp;
              </span> 
            )}
    
            {/* Animated Custom Floating Placeholder */}
            {!searchFocused && (
            /* Added min-w-0 to allow placeholder text containment */
            <div className="overflow-hidden h-[18px] flex items-center pointer-events-none min-w-0">
              <span
                key={currentIdx}
                style={{
                  animation: phase === 'in'
                    ? 'placeholderSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) forwards'
                    : 'placeholderSlideOut 0.28s ease-in forwards',
                }}
                /* Added ellipsis configurations to avoid text overflow breaks */
                className="text-[#E8A87C] md:text-[14px] text-[12px] font-['DM_Sans',sans-serif] whitespace-nowrap block overflow-hidden "
              > 
                {placeholders[currentIdx].text}
              </span>
                <i
                style={{
                  animation: phase === 'in'
                    ? 'placeholderSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) forwards'
                    : 'placeholderSlideOut 0.28s ease-in forwards',
                }}
                className={`${placeholders[currentIdx].icon} md:text-[16px] text-[14px] text-[#A07050] p-1 shrink-0`} 
              />
            </div>
          )}
        </div>

  <style>{`
    @keyframes placeholderSlideIn {
      from { transform: translateY(-110%); opacity: 0; }
      to   { transform: translateY(0);     opacity: 1; }
    }
    @keyframes placeholderSlideOut {
      from { transform: translateY(0);    opacity: 1; }
      to   { transform: translateY(110%); opacity: 0; }
    }
  `}</style>
  
  <input
  ref={searchInputRef}
    type="text"
    onFocus={() => setSearchFocused(true)}
    onBlur={() => setSearchFocused(false)}
    placeholder=""
    /* Added min-w-0 to overwrite default browser block input sizing */
    className="
      flex-1 bg-transparent border-none outline-none min-w-0
      text-[13px] text-[#F5E6D0]
      font-['DM_Sans',sans-serif]
    "
  />

  {/* kbd hint */}
  <span className="text-[10px] text-[#6B4830] shrink-0 hidden lg:block">⌘K</span>
</div>
)}



      {/* ── Right actions ── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Notification bell */}
        <button
          className="
            relative w-9 h-9 rounded-[10px] flex items-center justify-center
            bg-transparent hover:bg-[#1C1410]
            border border-transparent hover:border-[#3D2A18]
            transition-all duration-150 cursor-pointer
          "
        >
          <i className="ti ti-bell text-[17px] text-[#A07050]" />
          {/* unread dot */}
          <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-[#E8743A]" />
        </button>

        {/* User avatar / login */}
        <Link
          to="/profile"
          className="hidden md:flex
            items-center gap-2 px-3 py-[6px] rounded-[10px] no-underline
            bg-[#1C1410] hover:bg-[#261A14]
            border border-[#3D2A18]
            transition-all duration-150 cursor-pointer
          "
        >
          {/* avatar circle */}
          <span
            className="
              w-6 h-6 rounded-full flex items-center justify-center
              bg-[#2E1A08] text-[#E8743A]
              text-[10px] font-semibold shrink-0
            "
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            RJ
          </span>
          <span className="text-[12px] text-[#C8A888] hidden lg:block">Raj J.</span>
          <i className="ti ti-chevron-down text-[12px] text-[#6B4830] hidden lg:block" />
        </Link>

      </div>
    </header>
  );
}