import { describe, it, expect } from "vitest";
import { calculateDistanceKm, formatDistance } from "../utils/geo";

describe("Geographical utilities", () => {
  it("calculates great-circle distance accurately with Haversine formula", () => {
    // London (51.5074, -0.1278) to Paris (48.8566, 2.3522) ~ 343 km
    const london = { lat: 51.5074, lng: -0.1278 };
    const paris = { lat: 48.8566, lng: 2.3522 };

    const dist = calculateDistanceKm(london, paris);
    expect(dist).toBeGreaterThan(340);
    expect(dist).toBeLessThan(346);
  });

  it("returns 0 km for identical coordinates", () => {
    const pt = { lat: 21.1702, lng: 72.8311 };
    expect(calculateDistanceKm(pt, pt)).toBe(0);
  });

  it("formats distances under 1 km as meters", () => {
    expect(formatDistance(0.45)).toBe("450 m");
    expect(formatDistance(0.08)).toBe("80 m");
  });

  it("formats distances of 1 km or greater with one decimal place", () => {
    expect(formatDistance(1.23)).toBe("1.2 km");
    expect(formatDistance(14.89)).toBe("14.9 km");
  });

  it("handles undefined distance gracefully", () => {
    expect(formatDistance(undefined)).toBeNull();
  });
});
