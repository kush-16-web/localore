import type { GeoCoordinates, UnifiedPlace } from "../types/place";
import { calculateDistanceKm } from "../utils/geo";
import { initialGems } from "../components/MasonryGrid";

// Visual background images tailored by category — transparently categorized, not fake user photos
const CATEGORY_IMAGES: Record<string, string[]> = {
  "Cafés and food": [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  ],
  "Nature and parks": [
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
  ],
  "Scenic viewpoints": [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
  ],
  "Arts and culture": [
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80",
  ],
  "Historic places": [
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  ],
  "Interesting local attractions": [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
  ],
};

const ASPECT_RATIOS = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[16/9]",
];

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

// In-memory cache for queries: key = `${lat.toFixed(2)},${lng.toFixed(2)}_${category}`
const placesCache = new Map<string, { timestamp: number; places: UnifiedPlace[] }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Builds Overpass QL query string based on category and coordinate search area.
 */
function buildOverpassQuery(coords: GeoCoordinates, category: string, radiusMeters = 6000): string {
  const { lat, lng } = coords;
  let filters = "";

  switch (category) {
    case "Cafés and food":
      filters = `
        node["amenity"~"cafe|restaurant|fast_food|ice_cream"](around:${radiusMeters},${lat},${lng});
        way["amenity"~"cafe|restaurant|fast_food|ice_cream"](around:${radiusMeters},${lat},${lng});
      `;
      break;
    case "Nature and parks":
      filters = `
        node["leisure"~"park|nature_reserve|garden"](around:${radiusMeters},${lat},${lng});
        way["leisure"~"park|nature_reserve|garden"](around:${radiusMeters},${lat},${lng});
      `;
      break;
    case "Scenic viewpoints":
      filters = `
        node["tourism"="viewpoint"](around:${radiusMeters},${lat},${lng});
        node["natural"~"peak|cliff"](around:${radiusMeters},${lat},${lng});
      `;
      break;
    case "Arts and culture":
      filters = `
        node["tourism"~"museum|gallery|artwork"](around:${radiusMeters},${lat},${lng});
        way["tourism"~"museum|gallery"](around:${radiusMeters},${lat},${lng});
        node["amenity"="arts_centre"](around:${radiusMeters},${lat},${lng});
      `;
      break;
    case "Historic places":
      filters = `
        node["historic"](around:${radiusMeters},${lat},${lng});
        way["historic"](around:${radiusMeters},${lat},${lng});
      `;
      break;
    case "Interesting local attractions":
      filters = `
        node["tourism"~"attraction|theme_park"](around:${radiusMeters},${lat},${lng});
        way["tourism"="attraction"](around:${radiusMeters},${lat},${lng});
      `;
      break;
    default:
      // "All" — queries a diverse blend across viewpoints, attractions, historic, nature, and food
      filters = `
        node["tourism"~"viewpoint|museum|attraction"](around:${radiusMeters},${lat},${lng});
        node["historic"](around:${radiusMeters},${lat},${lng});
        node["leisure"="park"](around:${radiusMeters},${lat},${lng});
        node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      `;
      break;
  }

  return `[out:json][timeout:20];(${filters});out center 40;`;
}

/**
 * Maps raw OpenStreetMap element tags into our normalized category.
 */
function deriveCategory(tags: Record<string, string>): string {
  if (tags.tourism === "viewpoint" || tags.natural === "peak") return "Scenic viewpoints";
  if (tags.historic) return "Historic places";
  if (tags.tourism === "museum" || tags.tourism === "gallery" || tags.tourism === "artwork" || tags.amenity === "arts_centre")
    return "Arts and culture";
  if (tags.leisure === "park" || tags.leisure === "nature_reserve" || tags.leisure === "garden")
    return "Nature and parks";
  if (tags.amenity === "cafe" || tags.amenity === "restaurant" || tags.amenity === "fast_food" || tags.amenity === "ice_cream")
    return "Cafés and food";
  if (tags.tourism === "attraction" || tags.tourism === "theme_park")
    return "Interesting local attractions";
  return "Interesting local attractions";
}

/**
 * Fetch real worldwide places from OpenStreetMap Overpass API.
 */
export async function fetchNearbyPlaces(
  coords: GeoCoordinates,
  category = "All",
  radiusMeters = 7000
): Promise<UnifiedPlace[]> {
  const cacheKey = `${coords.lat.toFixed(2)},${coords.lng.toFixed(2)}_${category}`;
  const cached = placesCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.places;
  }

  const query = buildOverpassQuery(coords, category, radiusMeters);

  let data: { elements?: unknown[] } | null = null;
  let lastError: Error | null = null;

  // Attempt across mirrors
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Localore-Discovery/1.0",
        },
        body: "data=" + encodeURIComponent(query),
      });

      if (res.ok) {
        data = await res.json();
        if (data && Array.isArray(data.elements)) {
          break; // success
        }
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  if (!data || !Array.isArray(data.elements)) {
    console.warn("Overpass places fetch failed across endpoints:", lastError);
    return [];
  }

  // Normalize, deduplicate, and clean data
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const normalized: UnifiedPlace[] = [];

  for (let i = 0; i < data.elements.length; i++) {
    const el = data.elements[i] as {
      id: number;
      type: "node" | "way" | "relation";
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    };

    if (!el.tags) continue;

    // Must have a real name — skip unnamed nodes (e.g. anonymous benches or generic nodes)
    const name = el.tags.name || el.tags["name:en"];
    if (!name || name.trim().length === 0) continue;

    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat === undefined || lng === undefined) continue;

    // Deduplicate
    const placeId = `osm-${el.type}-${el.id}`;
    const nameLower = name.trim().toLowerCase();
    if (seenIds.has(placeId) || seenNames.has(nameLower)) continue;
    seenIds.add(placeId);
    seenNames.add(nameLower);

    const placeCategory = deriveCategory(el.tags);
    const distanceKm = calculateDistanceKm(coords, { lat, lng });

    // Derive area / neighborhood from address tags or fall back to suburb/locality
    const area =
      el.tags["addr:suburb"] ||
      el.tags["addr:neighbourhood"] ||
      el.tags["addr:district"] ||
      el.tags["addr:city"] ||
      el.tags["addr:street"] ||
      "Local Spot";

    // Build real factual description without inventing falsehoods
    let description = "";
    if (el.tags.description) {
      description = el.tags.description;
    } else {
      const parts: string[] = [];
      if (el.tags.historic) parts.push(`Historic ${el.tags.historic}`);
      if (el.tags.tourism) parts.push(`Recorded as ${el.tags.tourism}`);
      if (el.tags.amenity) parts.push(`Local ${el.tags.amenity}`);
      if (el.tags.cuisine) parts.push(`Cuisine: ${el.tags.cuisine}`);
      if (el.tags.wheelchair) parts.push(`Wheelchair accessible: ${el.tags.wheelchair}`);
      if (el.tags["addr:street"]) parts.push(`Located on ${el.tags["addr:street"]}`);
      description = parts.length > 0 ? parts.join(". ") + "." : "Verified community place on OpenStreetMap.";
    }

    const hours = el.tags.opening_hours || "Hours not listed";
    const address = [el.tags["addr:housenumber"], el.tags["addr:street"], el.tags["addr:city"]]
      .filter(Boolean)
      .join(" ");
    const website = el.tags.website || el.tags["contact:website"];

    // Select category photo
    const imageList = CATEGORY_IMAGES[placeCategory] || CATEGORY_IMAGES["Interesting local attractions"];
    const image = imageList[normalized.length % imageList.length];
    const aspectRatio = ASPECT_RATIOS[normalized.length % ASPECT_RATIOS.length];

    // Tags
    const tags: string[] = [];
    if (el.tags.historic) tags.push(`#${el.tags.historic.replace(/\s+/g, "")}`);
    if (el.tags.cuisine) tags.push(`#${el.tags.cuisine.replace(/\s+/g, "")}`);
    if (el.tags.tourism) tags.push(`#${el.tags.tourism.replace(/\s+/g, "")}`);
    tags.push("#OpenStreetMap");

    normalized.push({
      id: placeId,
      title: name,
      category: placeCategory,
      area,
      coordinates: { lat, lng },
      source: "osm",
      image,
      description,
      tags,
      upvotes: Math.floor((Math.sin(el.id) * 0.5 + 0.5) * 40) + 5, // stable pseudorandom upvote seed based on OSM id
      author: "OpenStreetMap",
      authorInitials: "OSM",
      hours,
      isBookmarked: false,
      isUpvoted: false,
      aspectRatio,
      address: address || undefined,
      website: website || undefined,
      distanceKm,
      osmType: el.type,
      osmId: el.id,
    });
  }

  // Sort by closest distance
  normalized.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  placesCache.set(cacheKey, { timestamp: Date.now(), places: normalized });
  return normalized;
}

/**
 * Returns mock Surat demo gems converted into UnifiedPlace format.
 * Real Surat coordinates attached so they map correctly to Surat.
 */
export function getSuratDemoGems(): UnifiedPlace[] {
  // Approximate Surat coordinates for each demo gem
  const demoCoords: Record<string | number, GeoCoordinates> = {
    1: { lat: 21.2052, lng: 72.8023 }, // Rander
    2: { lat: 21.1352, lng: 72.7154 }, // Dumas / Piplod
    3: { lat: 21.1923, lng: 72.8188 }, // Nanpura Dutch Cemetery
    4: { lat: 21.1856, lng: 72.8423 }, // Limbayat / Gopi Talav
    5: { lat: 21.1524, lng: 72.7752 }, // Vesu / Sarthana
    6: { lat: 21.1965, lng: 72.8211 }, // Nanpura / Chowk Bazaar
    7: { lat: 21.1982, lng: 72.8194 }, // Nanpura / Old Fort
    8: { lat: 21.1685, lng: 72.7845 }, // Piplod
  };

  return initialGems.map((gem) => {
    const coords = demoCoords[gem.id] || { lat: 21.1702, lng: 72.8311 };
    return {
      ...gem,
      id: gem.id,
      coordinates: coords,
      source: "demo",
    };
  });
}
