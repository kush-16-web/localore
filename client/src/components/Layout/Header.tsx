"use client";

import { useState } from "react";
import logo from "../../assets/logo.png"

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className="
        h-16 shrink-0 flex items-center justify-between gap-3 px-5
        bg-[#110C08]
        border-b border-[#332010]
        font-['DM_Sans',sans-serif]
      "
    >
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span
            className="text-[20px] font-semibold text-[#F5E6D0] tracking-wide"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Localore
          </span>
        </div>
      {/* ── Search bar — full width ── */}
      <div
        className={`
          flex items-center gap-2 w-[40%]
          px-4 py-[7px] rounded-full
          bg-[#1C1410]
          border transition-all duration-150
          ${searchFocused ? "border-[#E8743A]" : "border-[#3D2A18]"}
        `}
      >
        <i className="ti ti-search text-[14px] text-[#A07050] shrink-0" />
        <input
          type="text"
          placeholder="Search hidden spots, areas, food…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="
            flex-1 bg-transparent border-none outline-none
            text-[13px] text-[#F5E6D0]
            placeholder-[#6B4830]
            font-['DM_Sans',sans-serif]
          "
        />
        {/* kbd hint */}
        <span className="text-[10px] text-[#6B4830] shrink-0 hidden lg:block">⌘K</span>
      </div>

      {/* ── Category tabs ── */}
      {/* <nav className="flex items-center gap-[2px] shrink-0">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`
                px-3 py-[5px] rounded-full text-[11px] font-medium
                whitespace-nowrap transition-all duration-150
                border cursor-pointer
                ${
                  isActive
                    ? "bg-[#261A14] text-[#F5C842] border-[#3D2A18]"
                    : "text-[#A07050] border-transparent hover:bg-[#1C1410] hover:text-[#C8A888]"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </nav> */}

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
        <button
          className="
            flex items-center gap-2 px-3 py-[6px] rounded-[10px]
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
        </button>

      </div>
    </header>
  );
}