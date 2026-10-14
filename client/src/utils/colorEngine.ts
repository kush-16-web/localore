/**
 * Color Science utilities for Localore Ambient Theme Engine.
 * Converts RGB to OKLab / OKLCH perceptual color spaces,
 * performs perceptual clustering, and generates balanced dark ambient UI palettes.
 */

export interface OklabColor {
  L: number; // 0 (black) to 1 (white)
  a: number; // green-red axis (-0.4 to +0.4)
  b: number; // blue-yellow axis (-0.4 to +0.4)
}

export interface OklchColor {
  L: number; // Lightness: 0 to 1
  C: number; // Chroma (saturation): 0 to ~0.4
  h: number; // Hue angle: 0 to 360 degrees
}

export type RGB = [number, number, number];

/** Convert sRGB 8-bit [0-255] to linear sRGB [0-1] */
function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** Convert linear sRGB [0-1] to sRGB 8-bit [0-255] */
function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, Math.round(v * 255)));
}

/** Convert sRGB [r, g, b] to OKLab [L, a, b] */
export function rgbToOklab(rgb: RGB): OklabColor {
  const r = srgbToLinear(rgb[0]);
  const g = srgbToLinear(rgb[1]);
  const b = srgbToLinear(rgb[2]);

  // sRGB to LMS
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

/** Convert OKLab [L, a, b] to sRGB [r, g, b] */
export function oklabToRgb(lab: OklabColor): RGB {
  const l_ = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const m_ = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const s_ = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b)];
}

/** Convert OKLab to OKLCH */
export function oklabToOklch(lab: OklabColor): OklchColor {
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L: lab.L, C, h };
}

/** Convert OKLCH to OKLab */
export function oklchToOklab(lch: OklchColor): OklabColor {
  const hRad = (lch.h * Math.PI) / 180;
  return {
    L: lch.L,
    a: lch.C * Math.cos(hRad),
    b: lch.C * Math.sin(hRad),
  };
}

/** Convert RGB to OKLCH directly */
export function rgbToOklch(rgb: RGB): OklchColor {
  return oklabToOklch(rgbToOklab(rgb));
}

/** Convert OKLCH to RGB directly */
export function oklchToRgb(lch: OklchColor): RGB {
  return oklabToRgb(oklchToOklab(lch));
}

/** Perceptual color distance in OKLab */
export function oklabDistance(c1: OklabColor, c2: OklabColor): number {
  const dL = c1.L - c2.L;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Filter out near-black, near-white, or extreme desaturated grays
 * so we capture the true chromatic character of the image.
 */
export function isUsablePaletteColor(rgb: RGB): boolean {
  const lch = rgbToOklch(rgb);
  // Ignore too dark (< 0.12), too bright (> 0.92), or almost pure gray (C < 0.02)
  if (lch.L < 0.12 || lch.L > 0.92) return false;
  if (lch.C < 0.02) return false;
  return true;
}

/**
 * Formats RGB to `rgb(r, g, b)` string.
 */
export function rgbToString(rgb: RGB, alpha?: number): string {
  if (alpha !== undefined) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  }
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * Calculate WCAG 2.1 relative luminance for contrast checking.
 */
export function getRelativeLuminance(rgb: RGB): number {
  const r = srgbToLinear(rgb[0]);
  const g = srgbToLinear(rgb[1]);
  const b = srgbToLinear(rgb[2]);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates contrast ratio between two RGB colors (1 to 21).
 */
export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
