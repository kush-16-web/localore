# Localore — Local Discovery Platform

Localore is a React-based web application that helps users discover hidden gems in their city through a visually immersive, map-aware interface. It is built as a **Single Page Application (SPA)** with a dedicated **Admin Panel** for content management and robust user authentication.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.x or later)
- npm

### Installation

1. **Clone the repository** (or download the source code)
   ```bash
   git clone https://github.com/yourusername/localore.git
   cd localore
   ```

2. **Install dependencies for both the client and server**
   ```bash
   # Client-side dependencies (React app)
   cd client
   npm install

   # Server-side dependencies (Node.js/Express)
   cd ../server
   npm install
   ```

### Running the Application

Start both the client and server independently using the provided scripts.

1. **Start the Client (React App)**
   ```bash
   cd client
   npm run dev
   ```
   Access the app at: `http://localhost:5173`

2. **Start the Server (API)**
   ```bash
   cd server
   npm run dev
   ```
   The API will be available at: `http://localhost:3000`

## 🏗️ Project Structure

```
localore/
├── client/                # React frontend application
│   ├── src/
│   │   ├── assets/        # Static assets (logo, icons, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers (AuthContext, GemPanelContext)
│   │   ├── data/          # Mock data (can be replaced with API calls)
│   │   ├── pages/         # Main page components (Explore, SubmitGem, etc.)
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Root component
│   └── package.json       # Client dependencies
│
└── server/                # Node.js/Express backend
    ├── config/            # Database configuration
    ├── routes/            # API route handlers
    ├── services/          # Business logic and data access
    └── server.js          # Server entry point
    package.json         # Server dependencies
```

## 🛠️ Key Features

### 🗺️ Explore Page
- **Interactive Map:** Features a custom, full-page interactive map powered by Mapbox GL JS.
- **Gem Pins:** Displays discovered gems as interactive markers on the map.
- **Detail Panel:** Seamless bottom-sheet panel to view detailed gem information without leaving the map view.

### 🔐 Authentication
- **Sign In:** Supports sign-in with Google.
- **User Profiles:** Each user has a profile page displaying their submitted gems and bookmarks.
- **Access Control:** Private routes ensure only authenticated users can access specific features.

### 📝 Content Creation & Management
- **Submit Gem Form:** A multi-step form for submitting new gems with details like name, description, location, and photos.
- **My Gems:** A dedicated page for users to view and manage the gems they have submitted.
- **Saved Gems:** Users can bookmark gems they find interesting, which are collected in a separate "Saved Gems" section.

## 📁 Component Architecture

The application follows a modular, component-based architecture:

### Client Components
- **`Layout/Header.tsx`**: Responsive navigation header with brand logo, global search, and user authentication controls.
- **`Layout/Sidebar.tsx`**: Left-hand navigation sidebar with links to main sections (Explore, Saved Gems, My Gems) and nearby area filters.
- **`MasonryGrid.tsx`**: A flexible grid layout component to display gem cards with responsive column adjustments.
- **`GemCard.tsx`**: Individual cards for displaying gem information, supporting both grid and map views.
- **`GemPanel.tsx`**: A collapsible bottom panel that slides up to reveal detailed information about a selected gem.

### Server Architecture
- **`server.js`**: The main entry point for the Express server, handling global middleware and route registration.
- **`routes/`**: Defines RESTful API endpoints for authentication (`/auth`), gems (`/gems`), user data (`/user`), and search (`/search`).
- **`services/`**: Contains the core business logic, including authentication services and data handling logic for gems.

## 🧪 Testing

Unit tests can be run using the built-in testing utilities:

```bash
cd client
npm test
```

## 🔄 Project Roadmap

### Phase 1: Core Foundation (Completed)
- [x] Project setup and repository structure.
- [x] Basic client application with navigation.
- [x] Core API server with database configuration.
- [x] Authentication system (Google Sign-In).

### Phase 2: User Features
- [x] Explore page with interactive map and gem pins.
- [x] Gem submission flow.
- [x] User profiles and saved gems functionality.
- [x] Gem detail view and sharing.

### Phase 3: Polish & Admin Features
- [x] Admin panel for content management.
- [x] Responsive UI improvements and animations.
- [x] Search functionality and filtering.
- [x] Performance optimization.
