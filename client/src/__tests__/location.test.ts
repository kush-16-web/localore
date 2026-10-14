import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import {
  DEFAULT_CITY,
  getStoredLocation,
  saveStoredLocation,
  POPULAR_CITIES,
} from "../services/locationService";
import type { CityLocation } from "../types/place";

// Simple in-memory localStorage polyfill for node test environment
const mockStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe("Location Service", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: mockStorage,
      writable: true,
    });
  });

  beforeEach(() => {
    mockStorage.clear();
  });

  it("returns DEFAULT_CITY when no location is stored", () => {
    const loc = getStoredLocation();
    expect(loc.city).toBe("Surat");
    expect(loc.coordinates.lat).toBe(DEFAULT_CITY.coordinates.lat);
  });

  it("persists and restores custom city selection", () => {
    const tokyo: CityLocation = {
      city: "Tokyo",
      country: "Japan",
      displayName: "Tokyo, Japan",
      coordinates: { lat: 35.6762, lng: 139.6503 },
      isLiveGps: false,
    };

    saveStoredLocation(tokyo);
    const retrieved = getStoredLocation();
    expect(retrieved.city).toBe("Tokyo");
    expect(retrieved.coordinates.lat).toBe(35.6762);
    expect(retrieved.coordinates.lng).toBe(139.6503);
  });

  it("falls back to default if stored data is corrupted", () => {
    mockStorage.setItem("localore_selected_location", "invalid-json{{}");
    const loc = getStoredLocation();
    expect(loc.city).toBe("Surat");
  });

  it("provides valid popular global cities", () => {
    expect(POPULAR_CITIES.length).toBeGreaterThanOrEqual(5);
    const cities = POPULAR_CITIES.map((c) => c.city);
    expect(cities).toContain("London");
    expect(cities).toContain("Tokyo");
    expect(cities).toContain("Paris");
    expect(cities).toContain("New York");
  });
});
