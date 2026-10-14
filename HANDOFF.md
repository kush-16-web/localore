# LOCALORE — MOBILE UI POLISH PASS: CINEMATIC GEM DETAILS + SINGLE SCROLL + DOUBLE-TAP LIKE

**Commit:** `4effbba`  
**Date:** October 14, 2026  
**Status:** Completed & Tested  
**Next Planned Task:** Desktop Ambient Shell + Cinematic Gem Details

---

## 📋 Summary of Completed Work

In this pass, Localore's mobile Gem Details experience was transformed into a continuous, single-scroll cinematic detail view that completely matches the target visual reference, featuring:
- **Draggable-to-dismiss sheet:** Pulling down on the top handle smoothly closes the sheet.
- **Fixed parallax hero photo:** Hero image stays in the background with a parallax depth factor as details slide over it.
- **Strictly left-aligned typography:** Title, category/area badges, likes, route distance, and hours align on the exact same left grid as the About, Photos, and Map sections.
- **Clean Single-Tap View:** Fades out all gradients, title, badges, and the sticky Get Directions button completely, revealing 100% pure, unshaded, edge-to-edge photo with only the Back button and Expand icon.
- **Smooth Double-Tap Heart Like:** Playful ~600ms spring curve animation with clean SVG heart (no dark box/glow shadow).
- **True Fullscreen Uncropped Lightbox:** Dedicated original photo viewer with black backdrop, `object-contain` (true uncropped aspect ratio), swipe gestures, double-tap zoom (which zooms, not likes), and drag-down-to-dismiss.

---

### 1. Three-Level Ambient Theme Architecture

| Level | State | Behavior |
| :--- | :--- | :--- |
| **Level 1** | **Default Localore** | Restores original espresso background (`#120B08`), brand orange accents (`#E8743A`), and clean surfaces when no gem is open and "All" category is selected. No background SVG artwork. |
| **Level 2** | **Collective Category Theme** | Samples actual gem images from the active city and selected category (Food, Nature, Shopping, Viewpoints, Heritage, etc.). Clusters colors in OKLCH/OKLab perceptual color space and generates cohesive dark espresso surfaces, accents, and category-specific SVG motifs. |
| **Level 3** | **Selected Gem Override** | Temporarily overrides category palette with the opened gem's individual image palette. Strengthens ambient glow in the desktop side panel and mobile bottom sheet. Seamlessly restores Level 2 or Level 1 when closed. |

**Priority Rule:** `Selected Gem (Level 3) > Active Category (Level 2) > Default Localore (Level 1)`.

---

### 2. Perceptual Color Engine (`client/src/utils/colorEngine.ts`)

- **Perceptual Color Spaces:**
  - Converts sRGB to linear sRGB, then to OKLab ($L, a, b$) and OKLCH ($L, C, h$).
  - Perceptual distance ($\Delta E$) in OKLab for accurate clustering.
- **Usability Filtering (`isUsablePaletteColor`):**
  - Rejects near-blacks ($L < 0.12$), near-whites ($L > 0.92$), and washed-out grays ($C < 0.02$) to capture the chromatic essence of photos.
- **Deterministic Medoid Clustering:**
  - Categorical colors are bucketed into 12 hue sectors (30° intervals).
  - Selects cluster medoids (the exact color with minimum cumulative distance to neighbors) instead of arithmetic RGB averaging, preventing muddy brown/gray averages.
- **Contrast & Accessibility:**
  - Derives dark surfaces ($L \approx 0.075 - 0.155$) and vibrant accents ($L \approx 0.62 - 0.72$) using OKLCH.
  - WCAG 2.1 relative luminance and contrast ratio validation ensuring $>12:1$ contrast against cream text (`#F5E6D0`).

---

### 3. Category SVG Atmospheres (`client/src/components/Atmosphere/CategoryAtmosphere.tsx`)

Lightweight, scalable vector artwork placed behind content:
- **Food & Cafés:** Flowing culinary steam curls, curved plate and bowl minimalist contours.
- **Nature & Parks:** Organic leaves, delicate botanical silhouettes, contour terrain ridges.
- **Scenic Viewpoints:** Mountain silhouettes, horizon curves, topographic rings.
- **Heritage & Culture:** Classical architectural arches, ornamental geometry, columns.
- **Shopping & Markets:** Geometric boutique patterns, modern shopping silhouettes.
- **Quiet Spots:** Soft concentric ripples, gentle flowing lines.
- **Surprise Me:** Orbital compass rose with starlight pips and discovery trails.
- **Default:** Minimalist concentric celestial rings.

**Rules Enforced:**
- All vector colors adapt dynamically via `var(--ambient-svg-color)`.
- Non-blocking: `pointer-events-none` and `aria-hidden="true"`.
- Mobile-optimized scaling and panel-specific overlay modes.

---

### 4. CSS Custom Properties & Transitions (`client/src/index.css`)

Centralized design tokens updated reactively on `:root`:
- `--ambient-bg`: Base atmospheric background
- `--ambient-surface`: Header, sidebar, and card surface
- `--ambient-surface-raised`: Gem details panel and mobile bottom sheet background
- `--ambient-accent`: Place-derived or brand orange accent
- `--ambient-accent-muted`: Subtle chip and badge tint
- `--ambient-border`: Subtle boundary line
- `--ambient-glow`: Radial atmospheric wash
- `--ambient-text`: Cream text (`#F5E6D0`)
- `--ambient-text-muted`: Secondary text (`#C8A888`)
- `--ambient-svg-color`: Category artwork stroke/fill tint

**Transitions:** Smooth 450–650ms CSS color and opacity transitions with `@media (prefers-reduced-motion: reduce)` support.

---

### 5. Mobile Experience & Surprise Me

- **Mobile Bottom Sheet:** Vaul drawer utilizes `--ambient-surface-raised` and category vector motifs with readable controls and safe-area spacing.
- **Surprise Me Integration:** Exploration button on Explore header triggers lightweight compass motif and reveals a serendipitous gem with full Level 3 ambient transition.

---

## 🧪 Validation & Test Results

1. **Vitest Unit Tests (`npm test` in `client`)**
   - `src/__tests__/mobileGem.test.ts`: 7/7 passed (single-tap overlay toggle delay, double-tap cancellation of single-tap, scroll gesture rejection, idempotent first like, repeat double-tap count preservation without unliking, actual like button unlike/like toggling, animation timing constraints).
   - `src/__tests__/geo.test.ts`: 5/5 passed.
   - `src/__tests__/location.test.ts`: 4/4 passed.
   - `src/__tests__/places.test.ts`: 2/2 passed.
   - `src/__tests__/theme.test.ts`: 12/12 passed.
   - **Total:** 5 test suites, 30 tests passed (100%).

2. **Production Build (`npm run build` in `client`)**
   - TypeScript compilation (`tsc -b`) and Vite production bundle generated cleanly without errors.

3. **Browser Testing & Mobile Screenshots**
   - Tested responsive viewports (390x844, 375x812).
   - Captured and verified initial cinematic hero view, overlay toggle, double-tap like, single continuous scroll, photo switching, mini map embed, and sticky bottom navigation.

---

## 🚀 Recommended Next Pass

**Desktop Ambient Shell + Cinematic Gem Details**: Enhance the desktop RightPanel layout, synchronizing the ambient lighting and typography to mirror the mobile cinematic quality while preserving full desktop ergonomics.
