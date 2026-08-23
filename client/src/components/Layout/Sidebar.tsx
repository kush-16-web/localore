import { Link, useLocation } from "react-router-dom";
import { AREAS } from "../../data/constants";

type NavItem = {
  label: string;
  icon: string;
  iconActive: string;
  href: string;
  isActive: (pathname: string, tab: string | null) => boolean;
};

export default function Sidebar() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const tab = params.get("tab");
  // Active area is owned by the URL (set by MapPage / trail chips) —
  // never by local state, so sidebar, map and profile stay in sync.
  // When AREAS becomes live-location data, only the list source changes.
  const activeArea = pathname === "/map" ? params.get("area") : null;

  const browseItems: NavItem[] = [
    {
      label: "Explore",
      icon: "ti-compass",
      iconActive: "ti-compass-filled",
      href: "/",
      isActive: (p) => p === "/",
    },
    {
      label: "Saved Gems",
      icon: "ti-bookmark",
      iconActive: "ti-bookmark-filled",
      href: "/profile?tab=saved",
      isActive: (p, t) => p === "/profile" && t === "saved",
    },
    {
      label: "My Gems",
      icon: "ti-diamond",
      iconActive: "ti-diamond-filled",
      href: "/profile?tab=gems",
      isActive: (p, t) => p === "/profile" && t !== "saved",
    },
    {
      label: "Messages",
      icon: "ti-message-circle",
      iconActive: "ti-message-circle-filled",
      href: "/messages",
      isActive: (p) => p === "/messages",
    }
  ];

  return (
    <aside
      className="
        w-56 shrink-0 hidden md:flex flex-col h-full
        bg-[#0D0906]/60 backdrop-blur-xl
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
            const isActive = item.isActive(pathname, tab);
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
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
                      ti ${isActive ? item.iconActive : item.icon}
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
          {AREAS.map((area) => {
            const isActive = activeArea === area.label;
            return (
              <li key={area.label}>
                <Link
                  to={isActive ? "/map" : `/map?area=${encodeURIComponent(area.label)}`}
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom — Share a Gem CTA ── */}
      <div className="mt-auto px-3 pb-5">
        <Link
          to="/create-gem"
          className="
            w-full flex items-center justify-center gap-2 no-underline
            py-[9px] px-4 rounded-[10px]
            bg-[#E8743A] hover:bg-[#D4622A]
            text-[#110C08] text-[12px] font-semibold
            transition-all duration-150 cursor-pointer
            font-['DM_Sans',sans-serif]
            active:scale-[0.98]
          "
        >
          <i className="ti ti-plus text-[14px]" />
          Share a gem
        </Link>
        <p className="text-[9px] text-[#6B4830] text-center mt-3 leading-relaxed px-1">
          Know a hidden spot? Share it with the city.
        </p>
      </div>
    </aside>
  );
}
