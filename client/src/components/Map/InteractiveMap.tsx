import { useEffect, useRef } from "react";
import L from "leaflet";
import type { UnifiedPlace } from "../../types/place";
import { formatDistance } from "../../utils/geo";

interface InteractiveMapProps {
  center: { lat: number; lng: number };
  places: UnifiedPlace[];
  selectedPlace: UnifiedPlace | null;
  onSelectPlace: (place: UnifiedPlace) => void;
  radiusMeters?: number;
}

export default function InteractiveMap({
  center,
  places,
  selectedPlace,
  onSelectPlace,
  radiusMeters = 6000,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerMapRef = useRef<Map<string | number, L.Marker>>(new Map());

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: 13,
      zoomControl: false,
    });

    // Dark Matter CartoDB tiles matching Localore's rich dark aesthetics
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Zoom control in bottom right so it doesn't obstruct chips
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Search area circle overlay
    const circle = L.circle([center.lat, center.lng], {
      radius: radiusMeters,
      color: "#E8743A",
      weight: 1.5,
      opacity: 0.5,
      fillColor: "#E8743A",
      fillOpacity: 0.05,
      dashArray: "4, 6",
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    circleRef.current = circle;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center and radius circle when center changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([center.lat, center.lng], 13);

    if (circleRef.current) {
      circleRef.current.setLatLng([center.lat, center.lng]);
      circleRef.current.setRadius(radiusMeters);
    }
  }, [center.lat, center.lng, radiusMeters]);

  // Update Place Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markerMapRef.current.clear();

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const isOsm = place.source === "osm";

      const pinHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${
          isSelected ? "scale-125 z-50" : "hover:scale-115"
        }">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border ${
            isSelected
              ? "bg-[#E8743A] border-white text-[#120B08] shadow-[#E8743A]/50 ring-2 ring-[#E8743A]"
              : isOsm
              ? "bg-[#1E140E] border-[#E8743A] text-[#E8743A]"
              : "bg-[#2A180E] border-[#F5C842] text-[#F5C842]"
          }">
            <i class="ti ti-map-pin-filled text-base"></i>
          </div>
          <div class="w-2 h-2 rounded-full bg-[#E8743A] mx-auto mt-0.5 opacity-80"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-leaflet-pin",
        iconSize: [32, 38],
        iconAnchor: [16, 36],
        popupAnchor: [0, -34],
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: customIcon,
      });

      const popupHtml = `
        <div style="font-family: 'DM Sans', sans-serif; min-width: 200px; max-width: 240px; color: #F5E6D0; background: #180F0A; padding: 10px; border-radius: 14px; border: 1px solid #3D2A18;">
          <img src="${place.image}" alt="${place.title}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 10px; text-transform: uppercase; color: #E8743A; font-weight: bold; letter-spacing: 0.5px;">${place.category}</div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 2px; color: #FFFFFF; font-family: 'Syne', sans-serif;">${place.title}</div>
          <div style="font-size: 11px; color: #A07050; margin-top: 2px;">📍 ${place.area} ${
        place.distanceKm !== undefined ? `· ${formatDistance(place.distanceKm)}` : ""
      }</div>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <button id="view-details-${place.id}" style="flex: 1; background: #E8743A; color: #120B08; font-size: 11px; font-weight: 600; padding: 5px 8px; border-radius: 6px; border: none; cursor: pointer;">Details</button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}" target="_blank" rel="noreferrer" style="background: #2B190F; color: #E8743A; font-size: 11px; font-weight: 600; padding: 5px 8px; border-radius: 6px; text-decoration: none; border: 1px solid #3D2A18;">Directions</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: "custom-leaflet-popup",
        closeButton: false,
      });

      marker.on("click", () => {
        onSelectPlace(place);
      });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`view-details-${place.id}`);
        if (btn) {
          btn.onclick = () => onSelectPlace(place);
        }
      });

      markersLayer.addLayer(marker);
      markerMapRef.current.set(place.id, marker);
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Focus marker when selectedPlace changes
  useEffect(() => {
    if (!selectedPlace) return;
    const map = mapInstanceRef.current;
    const marker = markerMapRef.current.get(selectedPlace.id);

    if (map && marker) {
      map.flyTo(
        [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
        15,
        { duration: 0.8 }
      );
      marker.openPopup();
    }
  }, [selectedPlace]);

  const recenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([center.lat, center.lng], 13);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Recenter button */}
      <button
        onClick={recenter}
        title="Recenter to active city"
        className="absolute bottom-20 right-3 z-[400] w-9 h-9 rounded-xl bg-[#140C08]/85 hover:bg-[#1E120B] backdrop-blur-md border border-[#3D2A18] text-[#F5E6D0] hover:text-[#E8743A] flex items-center justify-center cursor-pointer shadow-lg transition-all active:scale-95"
      >
        <i className="ti ti-current-location text-base" />
      </button>

      {/* Tile attribution overlay styling */}
      <style>{`
        .leaflet-container {
          background: #110C08 !important;
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: #180F0A !important;
          border: 1px solid #3D2A18 !important;
        }
        .leaflet-control-attribution {
          background: rgba(18, 11, 8, 0.75) !important;
          color: #8B654A !important;
          font-size: 9px !important;
          backdrop-filter: blur(4px);
        }
        .leaflet-control-attribution a {
          color: #C8A888 !important;
          text-decoration: none !important;
        }
        .leaflet-control-zoom a {
          background-color: #1A110B !important;
          color: #F5E6D0 !important;
          border-color: #3D2A18 !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #261810 !important;
          color: #E8743A !important;
        }
      `}</style>
    </div>
  );
}
