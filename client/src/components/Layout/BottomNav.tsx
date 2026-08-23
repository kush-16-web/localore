import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Drawer } from "vaul";
import GemForm from "../GemForm/GemForm";

type NavItem = {
  label: string;
  href: string;
  iconDefault: string;
  iconActive: string;
};

const exploreItem: NavItem = {
  label: "Explore",
  href: "/",
  iconDefault: "ti-compass",
  iconActive: "ti-compass-filled",
};
const mapItem: NavItem = {
  label: "Map",
  href: "/map",
  iconDefault: "ti-map-pin",
  iconActive: "ti-map-pin-filled",
};
const messagesItem: NavItem = {
  label: "Messages",
  href: "/messages",
  iconDefault: "ti-message-circle",
  iconActive: "ti-message-circle-filled",
};
const profileItem: NavItem = {
  label: "Profile",
  href: "/profile",
  iconDefault: "ti-user",
  iconActive: "ti-user-filled",
};

export default function BottomNav() {
  const { pathname } = useLocation();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <nav
        className="
          fixed bottom-0 w-full
          flex items-center justify-between
          md:hidden z-50
          bg-[#120B08]/80 backdrop-blur-sm
          border-t border-[#332010]
          py-2 px-2 h-16 pb-[max(0.5rem,env(safe-area-inset-bottom))]
          transition-all duration-300
          font-['DM_Sans',sans-serif]
        "
      >
        {/* Left group — equal weight to right group keeps (+) dead center */}
        <div className="flex flex-1 items-center">
          <NavLink item={exploreItem} active={pathname === "/"} />
          <NavLink item={mapItem} active={pathname === "/map"} />
        </div>

        {/* Center + button — opens the share sheet */}
        <div className="shrink-0 flex flex-col items-center px-1">
          <button
            onClick={() => setShareOpen(true)}
            aria-label="Share a gem"
            className="
              w-11 h-11 rounded-xl cursor-pointer
              bg-[#E8743A] hover:bg-[#D4622A]
              flex items-center justify-center
              transition-all duration-150 active:scale-90
              border-none shadow-lg shadow-[#E8743A]/25
            "
          >
            <i className="ti ti-plus text-xl text-[#120B08]" />
          </button>
        </div>

        {/* Right group — Saved lives as a tab inside Profile, no duplicate slot */}
        <div className="flex flex-1 items-center justify-end">
          <NavLink item={messagesItem} active={pathname === "/messages"} />
          <NavLink item={profileItem} active={pathname === "/profile"} />
        </div>
      </nav>

      {/* ── Share-a-gem bottom sheet ─────────────────────────────────────── */}
      <Drawer.Root open={shareOpen} onOpenChange={setShareOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[998]" />
          <Drawer.Content
            className="
              fixed inset-x-0 bottom-0 z-[999]
              h-[92dvh] outline-none rounded-t-3xl border-t border-white/10
              shadow-[0_-16px_50px_rgba(0,0,0,0.6)]
              flex flex-col overflow-hidden bg-[#120B08]
              font-['DM_Sans',sans-serif]
            "
          >
            {/* Drag handle */}
            <div className="relative z-10 shrink-0 flex justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
              <div className="h-1.5 w-11 rounded-full bg-white/30" />
            </div>

            {/* Sheet header */}
            <div className="relative z-10 shrink-0 flex items-center justify-between px-5 pt-1 pb-3 border-b border-[#332010]/70">
              <Drawer.Title
                className="flex items-center gap-2 text-[16px] font-bold text-[#F5E6D0]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <i className="ti ti-diamond-filled text-[15px] text-[#E8743A]" />
                Share a Gem
              </Drawer.Title>
              <button
                onClick={() => setShareOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center cursor-pointer rounded-full
                  bg-black/40 text-[#A07050] ring-1 ring-white/10
                  active:scale-90 hover:text-[#F5E6D0] transition-all"
              >
                <i className="ti ti-x text-base" />
              </button>
            </div>

            {/* Scrollable form body */}
            <div className="relative z-10 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] scrollbar-none">
              <GemForm onSuccess={() => setShareOpen(false)} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link to={item.href} className="flex flex-col items-center gap-[3px] flex-1 no-underline">
      <i
        className={`ti text-2xl transition-colors duration-150 ${
          active ? `${item.iconActive} text-[#E8743A]` : `${item.iconDefault} text-[#6B4830]`
        }`}
      />
      <span className={`text-[11px] ${active ? "text-[#E8743A]" : "text-[#6B4830]"}`}>
        {item.label}
      </span>
    </Link>
  );
}
