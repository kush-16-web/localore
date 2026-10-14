export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface CityLocation {
  city: string;
  region?: string;
  country: string;
  displayName: string;
  coordinates: GeoCoordinates;
  isLiveGps?: boolean;
}

export type PlaceSource = "community" | "osm" | "demo";

export interface UnifiedPlace {
  id: string | number;
  title: string;
  category: string;
  area: string;
  coordinates: GeoCoordinates;
  source: PlaceSource;
  image: string;
  description: string;
  tags?: string[];
  upvotes: number;
  author: string;
  authorInitials: string;
  hours: string;
  isBookmarked: boolean;
  isUpvoted: boolean;
  aspectRatio: string;
  // Optional external metadata (never fabricated)
  address?: string;
  website?: string;
  distanceKm?: number;
  osmType?: "node" | "way" | "relation";
  osmId?: number;
}

export const PLACE_CATEGORIES = [
  "All",
  "Cafés and food",
  "Nature and parks",
  "Scenic viewpoints",
  "Arts and culture",
  "Historic places",
  "Interesting local attractions",
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];
