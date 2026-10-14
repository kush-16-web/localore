# Localore — Worldwide Location-First Discovery Platform

Localore is a React 19 + TypeScript + Vite + Tailwind CSS web application that empowers users anywhere in the world to discover local spots, hidden gems, and cultural landmarks through an immersive, map-aware interface.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.x or v22.x)
- npm

### Installation & Run

1. **Install dependencies for the client**
   ```bash
   cd client
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Run unit tests**
   ```bash
   npm test
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🗺️ Key Features (Pass 1.0)

### 1. Global City & Device Geolocation
- **Explicit Device Geolocation:** Users can click "Explore near me" or "Use my current location" to locate themselves via browser GPS.
- **Protocol Safety:** Clear messaging explaining that browser geolocation requires a secure context (HTTPS or localhost).
- **Worldwide City Search:** Typeahead search across global cities (e.g. London, Tokyo, Paris, New York, Surat, Mumbai) via OpenStreetMap Nominatim.
- **Local Persistence:** The selected city is saved locally across sessions in `localStorage`.
- **Privacy First:** Device coordinates are never transmitted to unauthorized third parties or logged.

### 2. Worldwide Place Discovery
- **Real Place Data:** Integrated with OpenStreetMap Overpass API for discovering real places across multiple countries.
- **Categorized Discovery:**
  - Cafés and food (`amenity=cafe|restaurant|fast_food`)
  - Nature and parks (`leisure=park|nature_reserve|garden`)
  - Scenic viewpoints (`tourism=viewpoint`, `natural=peak`)
  - Arts and culture (`tourism=museum|gallery|artwork`)
  - Historic places (`historic=*`)
  - Interesting local attractions (`tourism=attraction|theme_park`)
- **Factual Integrity:** Displays real place names, real coordinates, calculated distance (in km / m), and verified tags. No fabricated user reviews, ratings, prices, or fake food photography.
- **Transparent Sourcing:** Visual badges clearly distinguish OpenStreetMap places (`OSM`), community submissions (`Community Gem`), and demo mock data (`Surat Demo`).
- **Surat Demo Mode:** Surat mock gems are preserved in an explicitly labeled Demo Mode that can be toggled on/off and never pollutes other cities.

### 3. Interactive Leaflet Map
- **Full Interactive Map:** Replaced legacy static Google Maps iframe with a responsive, gesture-friendly Leaflet map.
- **Rich Aesthetic:** Styled with dark CartoDB Matter tiles to seamlessly complement Localore's warm brown/amber color palette.
- **Interactive Pins:** Color-coded pins for each place with popups showing category, name, distance, and direct links.
- **Sync & Focus:** Clicking a marker opens the place details panel; selecting a place card flies to the marker.
- **Directions & Navigation:** Direct route links to Google Maps and OpenStreetMap routing using exact coordinates.
- **Proper Attribution:** Compliant with OpenStreetMap and CARTO tile usage policies.

### 4. Explore & Card Experience
- **Header City Switcher:** Compact header button displaying current discovery city and live GPS pulse indicator.
- **Loading Skeletons:** Animated pulsing skeletons during data fetching for a smooth experience.
- **Helpful Empty States:** Informative empty states with suggestions when no places are found in a specific category or radius.
- **Distance Badges:** Dynamic distance calculated via Haversine formula relative to the active discovery center.

---

## 🏗️ Architecture

```
localore/
├── client/
│   ├── src/
│   │   ├── __tests__/         # Vitest unit tests (geo, location, places)
│   │   ├── components/
│   │   │   ├── CitySelector/  # Global city search & GPS modal
│   │   │   ├── GemCard/       # Gem details and actions
│   │   │   ├── Layout/        # Header, Sidebar, BottomNav, RightPanel
│   │   │   ├── Map/           # InteractiveMap (Leaflet)
│   │   │   └── MasonryGrid/   # Responsive Pinterest-style masonry grid
│   │   ├── context/
│   │   │   ├── LocationContext.tsx # Location state, GPS hook, persistence
│   │   │   └── GemPanelContext.tsx # Unified places state, upvotes, bookmarks
│   │   ├── services/
│   │   │   ├── locationService.ts  # Nominatim geocoding & city search
│   │   │   └── placesService.ts    # Overpass API discovery & caching
│   │   ├── types/
│   │   │   └── place.ts            # UnifiedPlace & CityLocation models
│   │   └── utils/
│   │       └── geo.ts              # Haversine distance & formatting
│   └── package.json
└── README.md
```

---

## ⚙️ Provider Requirements & Limitations

1. **Nominatim (Geocoding & City Search)**
   - Provider: OpenStreetMap Nominatim (`https://nominatim.openstreetmap.org`)
   - Limits: Maximum 1 request per second as per OSM usage policy.
   - Client caching: Implemented in-memory to prevent redundant queries.
   - For high-scale production: A self-hosted Nominatim instance or commercial provider (e.g., Geocode.earth, LocationIQ) should be configured.

2. **Overpass API (Place Discovery)**
   - Provider: OpenStreetMap Overpass API (`https://overpass-api.de/api/interpreter` with backup mirrors).
   - Client caching: 30-minute TTL in-memory cache per coordinate/category to reduce network traffic.
   - Radius: Default 6–7.5 km around selected location.

3. **Leaflet Tile Layer**
   - Provider: CARTO Dark Matter (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
   - Attribution: Includes required attribution `&copy; OpenStreetMap contributors &copy; CARTO`.
