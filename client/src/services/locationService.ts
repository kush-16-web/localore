import type { CityLocation, GeoCoordinates } from "../types/place";

const STORAGE_KEY = "localore_selected_location";

export const DEFAULT_CITY: CityLocation = {
  city: "Surat",
  region: "Gujarat",
  country: "India",
  displayName: "Surat, Gujarat, India",
  coordinates: { lat: 21.1702, lng: 72.8311 },
  isLiveGps: false,
};

export const POPULAR_CITIES: CityLocation[] = [
  DEFAULT_CITY,
  {
    city: "Tokyo",
    region: "Kanto",
    country: "Japan",
    displayName: "Tokyo, Japan",
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    city: "London",
    region: "England",
    country: "United Kingdom",
    displayName: "London, England, United Kingdom",
    coordinates: { lat: 51.5074, lng: -0.1278 },
  },
  {
    city: "Paris",
    region: "Île-de-France",
    country: "France",
    displayName: "Paris, Île-de-France, France",
    coordinates: { lat: 48.8566, lng: 2.3522 },
  },
  {
    city: "New York",
    region: "New York",
    country: "United States",
    displayName: "New York, NY, United States",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    city: "Mumbai",
    region: "Maharashtra",
    country: "India",
    displayName: "Mumbai, Maharashtra, India",
    coordinates: { lat: 19.076, lng: 72.8777 },
  },
];

// In-memory cache for reverse-geocoded lookups to respect rate limits
const reverseGeocodeCache = new Map<string, CityLocation>();

/**
 * Checks if browser environment supports geolocation securely.
 */
export function isGeolocationSupported(): { supported: boolean; reason?: string } {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return {
      supported: false,
      reason: "Geolocation is not supported by your browser.",
    };
  }

  const isSecure =
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (!isSecure) {
    return {
      supported: false,
      reason:
        "Browser geolocation requires a secure context (HTTPS or localhost).",
    };
  }

  return { supported: true };
}

/**
 * Request user's device coordinates with timeout and clean error messages.
 * Only call this after explicit user initiation.
 */
export async function getDeviceCoordinates(): Promise<GeoCoordinates> {
  const check = isGeolocationSupported();
  if (!check.supported) {
    throw new Error(check.reason);
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                "Location permission was denied. You can still search and pick any city manually."
              )
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              new Error(
                "GPS position unavailable. Please check your device location settings or select a city manually."
              )
            );
            break;
          case error.TIMEOUT:
            reject(
              new Error(
                "Location request timed out. Please try again or select a city manually."
              )
            );
            break;
          default:
            reject(
              new Error(
                "Unable to retrieve your location. Please select a city manually."
              )
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Resolves coordinates to city, region, and country using Nominatim reverse geocoding.
 */
export async function reverseGeocode(
  coordinates: GeoCoordinates
): Promise<CityLocation> {
  const cacheKey = `${coordinates.lat.toFixed(3)},${coordinates.lng.toFixed(3)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    return reverseGeocodeCache.get(cacheKey)!;
  }

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&addressdetails=1`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Reverse geocoding failed: HTTP ${res.status}`);
    }

    const data = await res.json();
    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      address.county ||
      "Unknown Location";

    const region = address.state || address.region || address.province || "";
    const country = address.country || "";

    const parts = [city, region, country].filter(Boolean);
    const displayName = parts.join(", ") || data.display_name || "Discovered Area";

    const location: CityLocation = {
      city,
      region,
      country,
      displayName,
      coordinates,
      isLiveGps: true,
    };

    reverseGeocodeCache.set(cacheKey, location);
    return location;
  } catch (error) {
    // Fallback if reverse geocoding service is unreachable or rate-limited
    console.warn("Reverse geocode fallback applied:", error);
    return {
      city: "Nearby Location",
      displayName: `Area (${coordinates.lat.toFixed(2)}°, ${coordinates.lng.toFixed(2)}°)`,
      country: "",
      coordinates,
      isLiveGps: true,
    };
  }
}

/**
 * Search global cities by query text using Nominatim.
 */
export async function searchCities(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    trimmed
  )}&format=json&addressdetails=1&limit=6&featuretype=city`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`City search failed: HTTP ${res.status}`);
    }

    const items = await res.json();
    if (!Array.isArray(items)) return [];

    return items
      .map((item) => {
        const address = item.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          item.name;
        const region = address.state || address.county || "";
        const country = address.country || "";
        const parts = [city, region, country].filter(Boolean);

        return {
          city,
          region,
          country,
          displayName: parts.join(", ") || item.display_name,
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          },
          isLiveGps: false,
        };
      })
      .filter((loc) => !isNaN(loc.coordinates.lat) && !isNaN(loc.coordinates.lng));
  } catch (err) {
    console.warn("City search query failed:", err);
    return [];
  }
}

/**
 * Persist selected location to localStorage.
 */
export function saveStoredLocation(location: CityLocation): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // localStorage might be unavailable in private browsing or disabled
  }
}

/**
 * Load persisted location or fallback to Surat default.
 */
export function getStoredLocation(): CityLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.city &&
        parsed.coordinates?.lat &&
        parsed.coordinates?.lng
      ) {
        return parsed;
      }
    }
  } catch {
    // Fall back to default
  }
  return DEFAULT_CITY;
}
