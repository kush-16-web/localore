# LOCALORE — MOBILE PASS 1.6: TWO-STAGE SEQUENTIAL SNAP-POINT DRAGGING
## Half-Screen Peek Opening, Sequential Drag Snapping & Deliberate Dismissal

**Date:** October 15, 2026  
**Status:** Completed & Tested  
**Next Planned Task:** Desktop Ambient Shell + Cinematic Gem Details

---

## 📋 Summary of Completed Work

In Pass 1.6, the mobile Gem Details bottom sheet interaction was upgraded to the standard two-stage bottom-sheet experience:
1. **Half-Screen Peek Initial Opening (`0.55`):**
   - Tapping any gem card opens the bottom sheet to half height (~55% / 450px) instead of jumping directly to full screen.
   - Synchronous render state reset prevents stale full-height state, eliminating any initial layout jump or visual flip.
2. **Smooth Sequential Drag Snapping (`snapPoints={[0.55, 1]}`, `snapToSequentialPoint={true}`):**
   - From half height, users can drag the sheet up or tap "Scroll for details" / handle to expand to near-fullscreen (`1` / `h-[92dvh]`).
   - When closing from full height, dragging downward and releasing anywhere midway snaps back to half height (`0.55`) and **never closes abruptly**.
3. **Deliberate Dismissal Only From Half Height:**
   - Only a downward drag/swipe from the half-height position dismisses the sheet cleanly back to Explore.
   - A partial downward drag from half springs back safely without accidental closing.

In Pass 1.5, three specific mobile regressions were resolved with surgical precision:
1. **Restored Single-Authoritative Vaul Dragging & Fluid Spring-Back:**
   - Removed competing custom transforms (`handleDragY`, `handleTouchStartRef`, `onTouchMove/End` overrides).
   - Vaul is now the single authoritative drag controller on `<Drawer.Handle />`.
   - Small downward drags (30–60px) smoothly follow the finger and spring back to open position on release without dismissing.
   - Deliberate downward drags past `closeThreshold={0.3}` or deliberate downward flicks dismiss the sheet smoothly.
2. **Simplified Clean Photo Lightbox:**
   - Removed large left/right navigation arrows from the photo container.
   - Removed numbered badges (`1`, `2`, `3`) from filmstrip thumbnails.
   - Removed clutter instructional text, keeping clean subtle `"Swipe to view · Double-tap to zoom"`.
   - Preserved genuine gem photo order without unrelated fallback substitutions.
   - Clean horizontal swipe to switch photos; zooming/panning is preserved when `scale > 1` without accidental photo switching.
3. **Complete Isolation of Photo Interactions from Underlying Map & Sheet:**
   - Rendered `PhotoLightbox` into `document.body` via `createPortal` with `z-[99999]`.
   - Stopped all touch and pointer event propagation at the lightbox root (`onClick`, `onPointerDown`, `onTouchStart`, `onTouchMove`, `onTouchEnd`).
   - While lightbox is open or during a 250ms closing grace period, `Drawer.Content` has `pointer-events: none` and `inert`, completely preventing touch/click leakage to the underlying map iframe, "Open Map" link, and "Get Directions" button.



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
