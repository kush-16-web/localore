import type { RGB } from "../utils/colorEngine";
export type { RGB };

export type ThemeLevel = 1 | 2 | 3;

export interface AmbientPalette {
  primaryRgb: RGB;
  secondaryRgb: RGB;
  ambientBg: string;              // Base dark atmosphere background
  ambientSurface: string;         // Header/sidebar/cards background
  ambientSurfaceRaised: string;   // Gem details panel / drawer background
  ambientAccent: string;          // Vibrant brand/place accent
  ambientAccentMuted: string;     // Soft accent for tags/chips
  ambientBorder: string;          // Delicate tinted border
  ambientGlow: string;            // Ambient radial wash glow color
  ambientText: string;            // Primary text (cream/white)
  ambientTextMuted: string;       // Secondary text
  ambientSvgColor: string;        // Category SVG artwork stroke/fill color
}

export interface AmbientThemeState {
  level: ThemeLevel;
  activeCategory: string;
  selectedGemId: string | number | null;
  palette: AmbientPalette;
  isTransitioning: boolean;
  surpriseMeActive: boolean;
}

/** Baseline Level 1 Default Localore Theme */
export const DEFAULT_AMBIENT_PALETTE: AmbientPalette = {
  primaryRgb: [232, 116, 58],        // #E8743A brand orange
  secondaryRgb: [194, 98, 42],       // #C2622A
  ambientBg: "#120B08",
  ambientSurface: "#1C1410",
  ambientSurfaceRaised: "#241913",
  ambientAccent: "#E8743A",
  ambientAccentMuted: "rgba(232, 116, 58, 0.15)",
  ambientBorder: "#3D2A18",
  ambientGlow: "rgba(232, 116, 58, 0.18)",
  ambientText: "#F5E6D0",
  ambientTextMuted: "#A07050",
  ambientSvgColor: "rgba(232, 116, 58, 0.08)",
};
