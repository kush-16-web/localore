import { describe, it, expect } from "vitest";
import { DEFAULT_AMBIENT_PALETTE } from "../types/theme";
import {
  rgbToOklab,
  oklabToRgb,
  rgbToOklch,
  oklchToRgb,
  isUsablePaletteColor,
  getContrastRatio,
  oklabDistance,
  rgbToString,
} from "../utils/colorEngine";
import {
  derivePaletteFromRgb,
  generateCollectiveCategoryPalette,
  extractImagePalette,
} from "../services/ambientThemeService";
import type { UnifiedPlace } from "../types/place";

describe("Ambient Theme & Perceptual Color Engine", () => {
  describe("Default Baseline Localore Theme (Level 1)", () => {
    it("preserves default espresso background and warm orange brand accent", () => {
      expect(DEFAULT_AMBIENT_PALETTE.ambientBg).toBe("#120B08");
      expect(DEFAULT_AMBIENT_PALETTE.ambientAccent).toBe("#E8743A");
      expect(DEFAULT_AMBIENT_PALETTE.ambientSurface).toBe("#1C1410");
      expect(DEFAULT_AMBIENT_PALETTE.ambientSurfaceRaised).toBe("#241913");
      expect(DEFAULT_AMBIENT_PALETTE.ambientText).toBe("#F5E6D0");
    });

    it("maintains accessible WCAG contrast between default text and background", () => {
      // Cream #F5E6D0 vs Espresso #120B08
      const textRgb: [number, number, number] = [245, 230, 208];
      const bgRgb: [number, number, number] = [18, 11, 8];
      const contrast = getContrastRatio(textRgb, bgRgb);
      expect(contrast).toBeGreaterThan(12); // Exceeds WCAG AAA requirement (7:1)
    });
  });

  describe("Color Science & Perceptual Space Conversions", () => {
    it("accurately converts sRGB to OKLab and back", () => {
      const original: [number, number, number] = [232, 116, 58]; // Brand orange
      const lab = rgbToOklab(original);
      const reconstructed = oklabToRgb(lab);

      expect(Math.abs(reconstructed[0] - original[0])).toBeLessThanOrEqual(2);
      expect(Math.abs(reconstructed[1] - original[1])).toBeLessThanOrEqual(2);
      expect(Math.abs(reconstructed[2] - original[2])).toBeLessThanOrEqual(2);
    });

    it("accurately converts sRGB to OKLCH and back", () => {
      const original: [number, number, number] = [46, 125, 50]; // Forest green
      const lch = rgbToOklch(original);
      const reconstructed = oklchToRgb(lch);

      expect(Math.abs(reconstructed[0] - original[0])).toBeLessThanOrEqual(2);
      expect(Math.abs(reconstructed[1] - original[1])).toBeLessThanOrEqual(2);
      expect(Math.abs(reconstructed[2] - original[2])).toBeLessThanOrEqual(2);
    });

    it("filters near-black, near-white, and muddy grays", () => {
      expect(isUsablePaletteColor([5, 5, 5])).toBe(false); // Near black
      expect(isUsablePaletteColor([250, 250, 250])).toBe(false); // Near white
      expect(isUsablePaletteColor([128, 128, 128])).toBe(false); // Pure gray (low chroma)

      expect(isUsablePaletteColor([210, 80, 40])).toBe(true); // Vibrant warm orange
      expect(isUsablePaletteColor([40, 160, 90])).toBe(true); // Lush green
      expect(isUsablePaletteColor([50, 120, 220])).toBe(true); // Rich blue
    });

    it("calculates perceptual distance correctly in OKLab", () => {
      const red = rgbToOklab([255, 0, 0]);
      const nearRed = rgbToOklab([245, 10, 5]);
      const blue = rgbToOklab([0, 0, 255]);

      const distClose = oklabDistance(red, nearRed);
      const distFar = oklabDistance(red, blue);

      expect(distClose).toBeLessThan(0.08);
      expect(distFar).toBeGreaterThan(0.2);
    });
  });

  describe("UI Palette Derivation", () => {
    it("derives dark atmospheric surfaces while preserving place hue character", () => {
      const placeGreen: [number, number, number] = [34, 139, 34];
      const palette = derivePaletteFromRgb(placeGreen);

      expect(palette.primaryRgb).toEqual(placeGreen);
      expect(palette.ambientBg).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      expect(palette.ambientSurface).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      expect(palette.ambientSurfaceRaised).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      expect(palette.ambientAccent).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      expect(palette.ambientBorder).toBeDefined();
      expect(palette.ambientGlow).toContain("rgba(");
      expect(palette.ambientSvgColor).toContain("rgba(");
    });

    it("formats rgb strings with optional alpha values", () => {
      expect(rgbToString([255, 100, 50])).toBe("rgb(255, 100, 50)");
      expect(rgbToString([255, 100, 50], 0.25)).toBe("rgba(255, 100, 50, 0.25)");
    });
  });

  describe("Collective Category Palette Generation (Level 2)", () => {
    const mockPlaces: UnifiedPlace[] = [
      {
        id: "p1",
        title: "Khandani Pakodewala",
        category: "Food",
        area: "Sarojini Nagar",
        coordinates: { lat: 28.57, lng: 77.21 },
        image: "https://images.unsplash.com/photo-delhi-food-1",
        description: "Crispy pakodas served fresh with mint chutney.",
        tags: ["Street Food"],
        source: "community",
        upvotes: 42,
        author: "Aarav",
        authorInitials: "A",
        hours: "10:00 - 21:00",
        isBookmarked: false,
        isUpvoted: false,
        aspectRatio: "aspect-[3/4]",
      },
      {
        id: "p2",
        title: "Lodhi Gardens",
        category: "Nature",
        area: "Lodhi Estate",
        coordinates: { lat: 28.59, lng: 77.22 },
        image: "https://images.unsplash.com/photo-delhi-nature-1",
        description: "Historic park with tombs and lush walking paths.",
        tags: ["Park"],
        source: "community",
        upvotes: 89,
        author: "Meera",
        authorInitials: "M",
        hours: "06:00 - 20:00",
        isBookmarked: false,
        isUpvoted: false,
        aspectRatio: "aspect-[4/3]",
      },
    ];

    it("returns baseline default palette when category is 'All'", async () => {
      const palette = await generateCollectiveCategoryPalette("Delhi", "All", mockPlaces);
      expect(palette).toEqual(DEFAULT_AMBIENT_PALETTE);
    });

    it("returns baseline default palette when category has no matching places", async () => {
      const palette = await generateCollectiveCategoryPalette("Delhi", "Viewpoints", mockPlaces);
      expect(palette).toEqual(DEFAULT_AMBIENT_PALETTE);
    });

    it("returns cached palette deterministically on repeated calls", async () => {
      const p1 = await generateCollectiveCategoryPalette("Delhi", "All", mockPlaces);
      const p2 = await generateCollectiveCategoryPalette("Delhi", "All", mockPlaces);
      expect(p1).toBe(p2);
    });

    it("extractImagePalette handles empty or missing image source gracefully", async () => {
      const palette = await extractImagePalette("");
      expect(palette).toEqual([]);
    });
  });
});
