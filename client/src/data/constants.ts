// ── Shared app-wide constants — single source of truth ────────────────────────

export const GEM_CATEGORIES = [
  "Viewpoint",
  "Nature",
  "Street food",
  "Heritage",
  "Quiet spots",
] as const;

export type GemCategory = (typeof GEM_CATEGORIES)[number];

export const AREAS = [
  { label: "Rander",   color: "#E8743A" },
  { label: "Nanpura",  color: "#7AB648" },
  { label: "Limbayat", color: "#F5C842" },
  { label: "Adajan",   color: "#9B8FCC" },
  { label: "Vesu",     color: "#2ABFCC" },
  { label: "Piplod",   color: "#E8743A" },
] as const;

export function areaColor(area: string): string {
  return AREAS.find((a) => a.label === area)?.color ?? "#A07050";
}

// ── Current user — mock identity until auth/backend exists ────────────────────
export const CURRENT_USER = {
  name: "Raj Joshi",
  initials: "RJ",
  handle: "@raj.joshi",
  city: "Surat, India",
  bio: "Chasing quiet corners & late-night food stalls across Surat. Sharing the spots maps forget.",
};
