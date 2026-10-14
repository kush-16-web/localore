import { describe, it, expect } from "vitest";
import { getSuratDemoGems } from "../services/placesService";
import { PLACE_CATEGORIES } from "../types/place";

describe("Places & Discovery Data", () => {
  it("provides properly structured Surat demo gems with valid coordinates", () => {
    const demoGems = getSuratDemoGems();
    expect(demoGems.length).toBeGreaterThan(0);

    demoGems.forEach((gem) => {
      expect(gem.id).toBeDefined();
      expect(gem.title).toBeTruthy();
      expect(gem.coordinates).toBeDefined();
      expect(gem.coordinates.lat).toBeGreaterThan(20);
      expect(gem.coordinates.lat).toBeLessThan(22);
      expect(gem.coordinates.lng).toBeGreaterThan(72);
      expect(gem.coordinates.lng).toBeLessThan(74);
      expect(gem.source).toBe("demo");
    });
  });

  it("defines standard worldwide discovery categories", () => {
    expect(PLACE_CATEGORIES).toContain("All");
    expect(PLACE_CATEGORIES).toContain("Cafés and food");
    expect(PLACE_CATEGORIES).toContain("Nature and parks");
    expect(PLACE_CATEGORIES).toContain("Scenic viewpoints");
    expect(PLACE_CATEGORIES).toContain("Arts and culture");
    expect(PLACE_CATEGORIES).toContain("Historic places");
    expect(PLACE_CATEGORIES).toContain("Interesting local attractions");
  });
});
