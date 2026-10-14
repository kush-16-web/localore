import { useState, useEffect, useRef } from "react";
import { useLocationState } from "../../context/LocationContext";
import {
  searchCities,
  POPULAR_CITIES,
  isGeolocationSupported,
} from "../../services/locationService";
import type { CityLocation } from "../../types/place";

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CitySelectorModal({
  isOpen,
  onClose,
}: CitySelectorModalProps) {
  const {
    currentLocation,
    isDetectingLocation,
    locationError,
    requestDeviceLocation,
    selectCity,
    clearLocationError,
  } = useLocationState();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const geoCheck = isGeolocationSupported();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      clearLocationError();
    }
  }, [isOpen, clearLocationError]);

  // Debounced search query
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handlePickCity = (loc: CityLocation) => {
    selectCity(loc);
    onClose();
  };

  const handleGpsClick = async () => {
    await requestDeviceLocation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#140C08] border border-[#3D2A18] rounded-3xl shadow-2xl overflow-hidden font-['DM_Sans',sans-serif]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2E1A0F]">
          <div>
            <h2
              className="text-lg font-bold text-[#F5E6D0]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Choose Discovery Location
            </h2>
            <p className="text-xs text-[#A07050] mt-0.5">
              Explore hidden gems and places anywhere in the world
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#20140D] hover:bg-[#2C1C13] text-[#A07050] hover:text-[#F5E6D0] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <i className="ti ti-x text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Error notice if location failed */}
          {locationError && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs">
              <i className="ti ti-alert-triangle text-base text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-300">Location Notice</p>
                <p className="mt-0.5 text-red-200/90 leading-relaxed">
                  {locationError}
                </p>
              </div>
              <button
                onClick={clearLocationError}
                className="text-red-400 hover:text-red-200 cursor-pointer"
              >
                <i className="ti ti-x text-xs" />
              </button>
            </div>
          )}

          {/* Device GPS action button */}
          <div>
            <button
              onClick={handleGpsClick}
              disabled={isDetectingLocation || !geoCheck.supported}
              className={`
                w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer
                ${
                  currentLocation.isLiveGps
                    ? "bg-[#E8743A]/15 border-[#E8743A]/40 text-[#E8743A]"
                    : "bg-[#1C120B] hover:bg-[#251810] border-[#3D2A18] text-[#F5E6D0]"
                }
                ${!geoCheck.supported ? "opacity-60 cursor-not-allowed" : "active:scale-[0.99]"}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentLocation.isLiveGps
                      ? "bg-[#E8743A] text-[#120B08]"
                      : "bg-[#2A180E] text-[#E8743A]"
                  }`}
                >
                  {isDetectingLocation ? (
                    <i className="ti ti-loader animate-spin text-lg" />
                  ) : (
                    <i className="ti ti-current-location text-lg" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">
                    {isDetectingLocation
                      ? "Acquiring coordinates..."
                      : currentLocation.isLiveGps
                      ? "Using my live GPS location"
                      : "Use my current location"}
                  </p>
                  <p className="text-[11px] text-[#A07050]">
                    {currentLocation.isLiveGps
                      ? `Active: ${currentLocation.displayName}`
                      : "Requests GPS through browser geolocation"}
                  </p>
                </div>
              </div>
              <i className="ti ti-chevron-right text-[#A07050]" />
            </button>

            {!geoCheck.supported && geoCheck.reason && (
              <p className="text-[11px] text-[#8B654A] mt-1.5 px-1">
                ℹ️ {geoCheck.reason}
              </p>
            )}
          </div>

          {/* Search by City */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A07050] mb-2">
              Search City Globally
            </label>
            <div className="relative flex items-center">
              <i className="ti ti-search absolute left-3.5 text-[#A07050] text-sm pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city e.g. London, Tokyo, Paris, Surat..."
                className="w-full bg-[#1A110B] border border-[#3D2A18] focus:border-[#E8743A] rounded-2xl pl-10 pr-10 py-3 text-sm text-[#F5E6D0] placeholder:text-[#6B4830] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-[#A07050] hover:text-[#F5E6D0] cursor-pointer"
                >
                  <i className="ti ti-x text-xs" />
                </button>
              )}
            </div>

            {/* Dynamic Search Results */}
            {isSearching && (
              <div className="flex items-center gap-2 py-4 px-2 text-xs text-[#A07050]">
                <i className="ti ti-loader animate-spin" />
                Searching worldwide cities...
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="mt-2 divide-y divide-[#2B190E] border border-[#3D2A18] rounded-2xl bg-[#1A110B] overflow-hidden">
                {searchResults.map((loc, idx) => (
                  <button
                    key={`${loc.displayName}-${idx}`}
                    onClick={() => handlePickCity(loc)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-[#251810] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <i className="ti ti-map-pin text-[#E8743A] text-sm" />
                      <div>
                        <p className="text-sm font-medium text-[#F5E6D0]">
                          {loc.city}
                        </p>
                        <p className="text-[11px] text-[#A07050]">
                          {loc.displayName}
                        </p>
                      </div>
                    </div>
                    <i className="ti ti-arrow-right text-xs text-[#A07050]" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Cities */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A07050] mb-2.5">
              Popular Cities
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_CITIES.map((city) => {
                const isActive =
                  currentLocation.city.toLowerCase() ===
                    city.city.toLowerCase() && !currentLocation.isLiveGps;
                return (
                  <button
                    key={city.city}
                    onClick={() => handlePickCity(city)}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded-xl text-left border text-xs cursor-pointer transition-all
                      ${
                        isActive
                          ? "bg-[#E8743A]/15 border-[#E8743A]/50 text-[#F5E6D0]"
                          : "bg-[#1A110B] hover:bg-[#251810] border-[#3D2A18] text-[#C8A888]"
                      }
                    `}
                  >
                    <i
                      className={`ti ti-building text-sm ${
                        isActive ? "text-[#E8743A]" : "text-[#A07050]"
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-semibold block">{city.city}</span>
                      <span className="text-[10px] text-[#8B654A] block truncate">
                        {city.country}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3.5 bg-[#100905] border-t border-[#25150C] flex items-center justify-between text-[11px] text-[#8B654A]">
          <span>Current: <strong className="text-[#F5E6D0]">{currentLocation.displayName}</strong></span>
          <span>OpenStreetMap Geocoding</span>
        </div>
      </div>
    </div>
  );
}
