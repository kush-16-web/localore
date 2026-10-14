import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CityLocation } from "../types/place";
import {
  getStoredLocation,
  saveStoredLocation,
  getDeviceCoordinates,
  reverseGeocode,
} from "../services/locationService";

interface LocationContextValue {
  currentLocation: CityLocation;
  isDetectingLocation: boolean;
  locationError: string | null;
  requestDeviceLocation: () => Promise<void>;
  selectCity: (location: CityLocation) => void;
  clearLocationError: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<CityLocation>(() =>
    getStoredLocation()
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    saveStoredLocation(currentLocation);
  }, [currentLocation]);

  const selectCity = useCallback((location: CityLocation) => {
    setCurrentLocation(location);
    setLocationError(null);
  }, []);

  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  /**
   * Only requested upon explicit user interaction (e.g. "Use my location").
   */
  const requestDeviceLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    setLocationError(null);

    try {
      const coords = await getDeviceCoordinates();
      const resolved = await reverseGeocode(coords);
      setCurrentLocation(resolved);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to obtain your device location.";
      setLocationError(msg);
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isDetectingLocation,
        locationError,
        requestDeviceLocation,
        selectCity,
        clearLocationError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationState(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocationState must be used within a LocationProvider");
  }
  return ctx;
}
