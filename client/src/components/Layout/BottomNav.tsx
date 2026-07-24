import { Link, useLocation } from "react-router-dom";

type NavItem = {
  label: string;
  href: string;
  iconDefault: string;
  iconActive: string;
};

const navItems: NavItem[] = [
  { label: "Explore",   href: "/",           iconDefault: "ti-compass",          iconActive: "ti-compass-filled" },
  { label: "Map",       href: "/map",         iconDefault: "ti-map-pin",           iconActive: "ti-map-pin-filled" },
  { label: "Saved Gems",   href: "/saved-gems",   iconDefault: "ti-bookmark",          iconActive: "ti-bookmark-filled" },
  { label: "Profile",   href: "/profile",    iconDefault: "ti-user",              iconActive: "ti-user-filled" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="
        fixed bottom-1 left-[2.5%] right-[2.5%] w-[95%]
        flex items-center justify-between
        md:hidden z-50
        bg-[#120B08]/80 backdrop-blur-sm
        border border-[#332010]
        py-2 px-4 h-16 rounded-2xl
        transition-all duration-300
        font-['DM_Sans',sans-serif]
      "
    >
      {/* Explore */}
      <Link
        to={navItems[0].href}
        className="flex flex-col items-center gap-[3px] flex-1 no-underline"
      >
        <i
          className={`ti text-2xl transition-colors duration-150 ${
            pathname === navItems[0].href
              ? `${navItems[0].iconActive} text-[#E8743A]`
              : `${navItems[0].iconDefault} text-[#6B4830]`
          }`}
        />
        <span className={`text-[12px] ${pathname === navItems[0].href ? "text-[#E8743A]" : "text-[#6B4830]"}`}>
          Explore
        </span>
      </Link>

      {/* Map */}
      <Link
        to={navItems[1].href}
        className="flex flex-col items-center gap-[3px] flex-1 no-underline"
      >
        <i
          className={`ti text-2xl transition-colors duration-150 ${
            pathname === navItems[1].href
              ? `${navItems[1].iconActive} text-[#E8743A]`
              : `${navItems[1].iconDefault} text-[#6B4830]`
          }`}
        />
        <span className={`text-[12px] ${pathname === navItems[1].href ? "text-[#E8743A]" : "text-[#6B4830]"}`}>
          Map
        </span>
      </Link>

      {/* Center + button */}
      <div className="flex flex-col items-center flex-1">
        <button
          className="
            w-11 h-11 rounded-xl cursor-pointer
            bg-[#E8743A] hover:bg-[#D4622A]
            flex items-center justify-center
            transition-all duration-150
            border-none
          "
        >
          <i className="ti ti-plus text-xl text-[#120B08]" />
        </button>
      </div>

      {/* My Gems */}
      <Link
        to={navItems[2].href}
        className="flex flex-col items-center gap-[3px] flex-1 no-underline"
      >
        <i
          className={`ti text-2xl transition-colors duration-150 ${
            pathname === navItems[2].href
              ? `${navItems[2].iconActive} text-[#E8743A]`
              : `${navItems[2].iconDefault} text-[#6B4830]`
          }`}
        />
        <span className={`text-[12px] ${pathname === navItems[2].href ? "text-[#E8743A]" : "text-[#6B4830]"}`}>
          Gems
        </span>
      </Link>

      {/* Profile */}
      <Link
        to={navItems[3].href}
        className="flex flex-col items-center gap-[3px] flex-1 no-underline"
      >
        <i
          className={`ti text-2xl transition-colors duration-150 ${
            pathname === navItems[3].href
              ? `${navItems[3].iconActive} text-[#E8743A]`
              : `${navItems[3].iconDefault} text-[#6B4830]`
          }`}
        />
        <span className={`text-[12px] ${pathname === navItems[3].href ? "text-[#E8743A]" : "text-[#6B4830]"}`}>
          Profile
        </span>
      </Link>
    </nav>
  );
}