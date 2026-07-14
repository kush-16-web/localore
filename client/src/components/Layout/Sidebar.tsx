import { useState } from "react";
import { Link } from "react-router-dom";

type NavItem = {
  label: string;
  icon: string;
  href: string;
};

type AreaItem = {
  label: string;
  color: string;
  href: string;
};



const nearbyAreas: AreaItem[] = [
  { label: "Rander",   color: "#E8743A", href: "#" },
  { label: "Nanpura",  color: "#7AB648", href: "#" },
  { label: "Limbayat", color: "#F5C842", href: "#" },
  { label: "Adajan",   color: "#9B8FCC", href: "#" },
  { label: "Vesu",     color: "#2ABFCC", href: "#" },
  { label: "Piplod",   color: "#E8743A", href: "#" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Explore");
  const [activeArea, setActiveArea] = useState("");

    const browseItems: NavItem[] = [
  { label: "Explore",     icon: "ti ti-compass",  href: "/" },
  { label: "Saved Gems",  icon:"ti ti-bookmark" , href: "/saved-gems" },
  { label: "My Gems",     icon:"ti ti-diamond", href: "/my-gems" },
];

  return (
    <>
      {/* Tabler icons CDN — add this to your index.html <head> if not already there:
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
          Syne font:
          <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      */}

      <aside
        className="
          w-56 shrink-0 flex flex-col h-full
          bg-[#0D0906]
          border-r border-[#332010]
          font-['DM_Sans',sans-serif]
        "
      >
        {/* ── Browse ── */}
        <nav className="px-3 pt-5">
          <p className="text-[10px] text-left font-bold tracking-[0.10em] uppercase text-[#A07050] px-2 ">
            Browse
          </p>
          <ul className="space-y-[2px] mt-3">
            {browseItems.map((item) => {
              const isActive = active === item.label;
              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => {
                      setActive(item.label);
                    }}
                    className={`
                      flex items-center gap-[10px] px-3 py-[7px] rounded-[10px]
                      text-[12px] font-medium transition-all duration-300
                      no-underline group
                      ${
                        isActive
                          ? "bg-[#af6844d0] text-[#F5E6D0]"
                          : "text-[#A07050] hover:bg-[#1C1410] hover:text-[#C8A888]"
                      }
                    `}
                  >
                    <i
                      className={`
                        ${item.icon}
                        ${item.label === "Explore" && active === "Explore" ? "ti-compass-filled" : ""}
                        ${item.label === "Saved Gems" && active === "Saved Gems" ? "ti-bookmark-filled" : ""}
                        ${item.label === "My Gems" && active === "My Gems" ? "ti-diamond-filled" : ""}
                        text-[20px] shrink-0 transition-colors duration-150
                      `}
                    />
  
                    {item.label}
                    {/* active indicator dot */}
                    {isActive && (
                      <span className="ml-auto w-[5px] h-[5px] rounded-full bg-[#F5E6D0] shrink-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Nearby Areas ── */}
        <nav className="px-3 pt-6">
          <p className="text-[10px] text-left font-bold tracking-[0.10em] uppercase text-[#A07050] px-2 mb-2">
            Nearby Areas
          </p>
          <ul className="space-y-[2px] mt-2">
            {nearbyAreas.map((area) => {
              const isActive = activeArea === area.label;
              return (
                <li key={area.label}>
                  <a
                    href={area.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveArea(isActive ? "" : area.label);
                    }}
                    className={`
                      flex items-center gap-[10px] px-3 py-[7px] rounded-[10px]
                      text-[12px] transition-all duration-150 no-underline group
                      ${
                        isActive
                          ? "bg-[#261A14] text-[#F5E6D0]"
                          : "text-[#A07050] hover:bg-[#1C1410] hover:text-[#C8A888]"
                      }
                    `}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 transition-all duration-150 ${
                        isActive ? "scale-125" : "opacity-70 group-hover:opacity-100"
                      }`}
                      style={{ backgroundColor: area.color }}
                    />
                    {area.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Bottom — Share a Gem CTA ── */}
        <div className="mt-auto px-3">
          <button
            className="
              w-full flex items-center justify-center gap-2
              py-[9px] px-4 rounded-[10px]
              bg-[#E8743A] hover:bg-[#D4622A]
              text-[#110C08] text-[12px] font-semibold
              transition-all duration-150 cursor-pointer border-none
              font-['DM_Sans',sans-serif]
            "
          >
            <i className="ti ti-plus text-[14px]" />
            Share a gem
          </button>
          <p className="text-[9px] text-[#6B4830] text-center mt-3 leading-relaxed px-1">
            Know a hidden spot? Share it with the city.
          </p>
        </div>
      </aside>
    </>
  );
}