import { getColorSync, getPaletteSync } from "colorthief";
import type { UnifiedPlace } from "../types/place";
import type { AmbientPalette, RGB } from "../types/theme";
import { DEFAULT_AMBIENT_PALETTE } from "../types/theme";
import {
  rgbToOklab,
  rgbToOklch,
  oklchToRgb,
  isUsablePaletteColor,
  oklabDistance,
  rgbToString,
} from "../utils/colorEngine";

// Bounded in-memory caches to avoid duplicate downloads and decodes
const imagePaletteCache = new Map<string, RGB[]>();
const MAX_IMAGE_CACHE = 150;

const categoryPaletteCache = new Map<string, AmbientPalette>();
const MAX_CATEGORY_CACHE = 60;

/**
 * Extracts palette from a single image using colorthief with caching and CORS handling.
 */
export async function extractImagePalette(imgSrc: string): Promise<RGB[]> {
  if (!imgSrc) return [];

  if (imagePaletteCache.has(imgSrc)) {
    return imagePaletteCache.get(imgSrc)!;
  }

  return new Promise((resolve) => {
    // Avoid blocking or hanging if an image cannot be loaded
    const timeout = setTimeout(() => {
      resolve([]);
    }, 3500);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const dominant = getColorSync(img);
        const palette = getPaletteSync(img, { colorCount: 5 });

        const colors: RGB[] = [];
        if (dominant) {
          const domArr = dominant.array() as RGB;
          if (isUsablePaletteColor(domArr)) colors.push(domArr);
        }

        if (palette) {
          for (const c of palette) {
            const arr = c.array() as RGB;
            if (isUsablePaletteColor(arr)) {
              // Avoid duplicates
              if (!colors.some((existing) => oklabDistance(rgbToOklab(existing), rgbToOklab(arr)) < 0.05)) {
                colors.push(arr);
              }
            }
          }
        }

        if (imagePaletteCache.size >= MAX_IMAGE_CACHE) {
          const firstKey = imagePaletteCache.keys().next().value;
          if (firstKey) imagePaletteCache.delete(firstKey);
        }

        imagePaletteCache.set(imgSrc, colors);
        resolve(colors);
      } catch {
        // Tainted canvas or cross-origin restrictions — resolve empty
        resolve([]);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve([]);
    };
  });
}

/**
 * Derives a full dark ambient UI palette from a primary and optional secondary RGB.
 * Uses OKLab / OKLCH perceptual space to generate rich, atmospheric surfaces
 * while maintaining contrast and the Localore espresso dark baseline.
 */
export function derivePaletteFromRgb(primaryRgb: RGB, secondaryRgb?: RGB): AmbientPalette {
  const pLch = rgbToOklch(primaryRgb);
  const sRgb = secondaryRgb ?? primaryRgb;

  // Background: Deep espresso tone tinted subtly with place's hue
  const bgLch = {
    L: 0.075,
    C: Math.min(0.018, pLch.C * 0.15),
    h: pLch.h,
  };
  const ambientBgRgb = oklchToRgb(bgLch);

  // Surface: Raised surface for header, sidebar, cards
  const surfaceLch = {
    L: 0.115,
    C: Math.min(0.024, pLch.C * 0.2),
    h: pLch.h,
  };
  const ambientSurfaceRgb = oklchToRgb(surfaceLch);

  // Surface Raised: Higher elevation for modals, bottom sheets, active panels
  const surfaceRaisedLch = {
    L: 0.155,
    C: Math.min(0.03, pLch.C * 0.25),
    h: pLch.h,
  };
  const ambientSurfaceRaisedRgb = oklchToRgb(surfaceRaisedLch);

  // Vibrant Accent: High-contrast, vibrant version of the primary color
  const accentLch = {
    L: Math.max(0.62, Math.min(0.72, pLch.L)),
    C: Math.max(0.12, Math.min(0.24, pLch.C)),
    h: pLch.h,
  };
  const ambientAccentRgb = oklchToRgb(accentLch);

  // Border: Delicate tinted boundary line
  const borderLch = {
    L: 0.22,
    C: Math.min(0.04, pLch.C * 0.3),
    h: pLch.h,
  };
  const ambientBorderRgb = oklchToRgb(borderLch);

  return {
    primaryRgb,
    secondaryRgb: sRgb,
    ambientBg: rgbToString(ambientBgRgb),
    ambientSurface: rgbToString(ambientSurfaceRgb),
    ambientSurfaceRaised: rgbToString(ambientSurfaceRaisedRgb),
    ambientAccent: rgbToString(ambientAccentRgb),
    ambientAccentMuted: rgbToString(primaryRgb, 0.15),
    ambientBorder: rgbToString(ambientBorderRgb),
    ambientGlow: rgbToString(primaryRgb, 0.22),
    ambientText: "#F5E6D0",
    ambientTextMuted: "#C8A888",
    ambientSvgColor: rgbToString(primaryRgb, 0.08),
  };
}

/**
 * Deterministically generates a collective category palette by sampling
 * gem images belonging to that category in the current city.
 */
export async function generateCollectiveCategoryPalette(
  city: string,
  category: string,
  places: UnifiedPlace[]
): Promise<AmbientPalette> {
  const normalizedCategory = category.trim();

  // Baseline Level 1 if "All" is active
  if (!normalizedCategory || normalizedCategory.toLowerCase() === "all") {
    return DEFAULT_AMBIENT_PALETTE;
  }

  // Filter places for this category
  const matchingPlaces = places.filter((p) => {
    const pCat = p.category.toLowerCase();
    const target = normalizedCategory.toLowerCase();
    if (pCat === target) return true;
    if (target.includes("food") || target.includes("café")) {
      return pCat.includes("food") || pCat.includes("café") || pCat.includes("restaurant");
    }
    if (target.includes("nature") || target.includes("park")) {
      return pCat.includes("nature") || pCat.includes("park") || pCat.includes("quiet");
    }
    if (target.includes("viewpoint")) {
      return pCat.includes("viewpoint") || pCat.includes("scenic");
    }
    if (target.includes("historic") || target.includes("heritage")) {
      return pCat.includes("historic") || pCat.includes("heritage");
    }
    if (target.includes("arts") || target.includes("culture")) {
      return pCat.includes("arts") || pCat.includes("culture") || pCat.includes("museum");
    }
    if (target.includes("shopping")) {
      return pCat.includes("shopping") || pCat.includes("market") || pCat.includes("store");
    }
    return false;
  });

  if (matchingPlaces.length === 0) {
    return DEFAULT_AMBIENT_PALETTE;
  }

  // Sample a bounded subset (up to 12 places)
  const sample = matchingPlaces.slice(0, 12);
  const sampleSignature = sample.map((p) => p.id).join("-");
  const cacheKey = `${city.toLowerCase()}_${normalizedCategory.toLowerCase()}_${sampleSignature}`;

  if (categoryPaletteCache.has(cacheKey)) {
    return categoryPaletteCache.get(cacheKey)!;
  }

  // Extract palettes concurrently
  const palettePromises = sample.map((place) => extractImagePalette(place.image));
  const extractedResults = await Promise.all(palettePromises);
  const allColors: RGB[] = extractedResults.flat();

  if (allColors.length === 0) {
    // If extraction fails across all sample images (e.g. CORS), fallback gracefully
    return DEFAULT_AMBIENT_PALETTE;
  }

  // Perceptual clustering in OKLab space:
  // Group colors into 12 hue sectors (30° each in OKLCH)
  const hueBuckets: { count: number; colors: RGB[]; totalChroma: number }[] = Array.from(
    { length: 12 },
    () => ({ count: 0, colors: [], totalChroma: 0 })
  );

  for (const rgb of allColors) {
    const lch = rgbToOklch(rgb);
    const bucketIdx = Math.floor((lch.h % 360) / 30);
    hueBuckets[bucketIdx].count++;
    hueBuckets[bucketIdx].colors.push(rgb);
    hueBuckets[bucketIdx].totalChroma += lch.C;
  }

  // Sort buckets by influence (weighting both frequency and chroma richness)
  const sortedBuckets = [...hueBuckets]
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count * 1.5 + b.totalChroma * 10 - (a.count * 1.5 + a.totalChroma * 10));

  if (sortedBuckets.length === 0) {
    return DEFAULT_AMBIENT_PALETTE;
  }

  // Primary cluster: choose the medoid (color closest to the cluster center)
  const primaryCluster = sortedBuckets[0].colors;
  const primaryRgb = findClusterMedoid(primaryCluster);

  // Secondary cluster: choose the next distinct cluster (if available)
  let secondaryRgb = primaryRgb;
  if (sortedBuckets.length > 1) {
    secondaryRgb = findClusterMedoid(sortedBuckets[1].colors);
  }

  const generatedPalette = derivePaletteFromRgb(primaryRgb, secondaryRgb);

  if (categoryPaletteCache.size >= MAX_CATEGORY_CACHE) {
    const firstKey = categoryPaletteCache.keys().next().value;
    if (firstKey) categoryPaletteCache.delete(firstKey);
  }
  categoryPaletteCache.set(cacheKey, generatedPalette);

  return generatedPalette;
}

/**
 * Finds the medoid color in an RGB cluster (the color with minimal sum of distances to all others).
 * Deterministic and avoids muddy synthetic averages.
 */
function findClusterMedoid(colors: RGB[]): RGB {
  if (colors.length === 1) return colors[0];

  const labs = colors.map(rgbToOklab);
  let bestIdx = 0;
  let minTotalDist = Infinity;

  for (let i = 0; i < labs.length; i++) {
    let distSum = 0;
    for (let j = 0; j < labs.length; j++) {
      if (i !== j) {
        distSum += oklabDistance(labs[i], labs[j]);
      }
    }
    if (distSum < minTotalDist) {
      minTotalDist = distSum;
      bestIdx = i;
    }
  }

  return colors[bestIdx];
}
