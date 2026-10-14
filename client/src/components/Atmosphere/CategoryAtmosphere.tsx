import React from "react";

interface CategoryAtmosphereProps {
  category?: string;
  variant?: "background" | "panel" | "hero";
  className?: string;
}

export default function CategoryAtmosphere({
  category = "All",
  variant = "background",
  className = "",
}: CategoryAtmosphereProps) {
  const norm = (category || "").toLowerCase();

  // If "All" or empty, render nothing for Level 1 clean baseline
  if (!norm || norm === "all") {
    return null;
  }

  const isFood = norm.includes("food") || norm.includes("café") || norm.includes("restaurant");
  const isNature = norm.includes("nature") || norm.includes("park");
  const isViewpoint = norm.includes("viewpoint") || norm.includes("scenic");
  const isHeritage = norm.includes("heritage") || norm.includes("historic") || norm.includes("arts") || norm.includes("culture");
  const isShopping = norm.includes("shopping") || norm.includes("market");
  const isQuiet = norm.includes("quiet");
  const isSurprise = norm.includes("surprise");

  // Determine motif
  let motif: React.ReactNode;

  if (isFood) {
    // Culinary steam curls and curved plate/utensil minimalist contours
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M200 450 C 240 380, 210 320, 250 250 C 280 200, 320 180, 310 110"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 8"
          opacity="0.8"
        />
        <path
          d="M280 470 C 330 400, 300 330, 350 260 C 390 200, 410 170, 390 90"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M360 450 C 400 380, 380 320, 420 250 C 450 190, 470 170, 460 120"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 6"
        />
        <ellipse
          cx="340"
          cy="480"
          rx="220"
          ry="55"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 6"
          opacity="0.6"
        />
        <ellipse
          cx="340"
          cy="480"
          rx="170"
          ry="40"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
      </svg>
    );
  } else if (isNature) {
    // Botanical leaves and organic terrain contours
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M100 550 Q 250 480 400 530 T 700 500"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity="0.7"
        />
        <path
          d="M50 500 Q 220 420 450 460 T 800 420"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M550 220 C 580 150, 680 120, 720 180 C 740 250, 650 300, 550 220 Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <path
          d="M550 220 Q 640 180 720 180"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M180 320 C 140 260, 200 180, 270 200 C 310 260, 240 330, 180 320 Z"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.7"
        />
        <circle cx="270" cy="200" r="4" fill="currentColor" opacity="0.6" />
      </svg>
    );
  } else if (isViewpoint) {
    // Mountain ridges, horizon lines, contour elevation rings
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-50 480 L 180 280 L 340 400 L 520 220 L 700 360 L 850 240"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M40 500 L 220 340 L 380 440 L 550 290 L 780 460"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.6"
        />
        <circle
          cx="620"
          cy="180"
          r="65"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity="0.7"
        />
        <circle
          cx="620"
          cy="180"
          r="40"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <line x1="0" y1="480" x2="800" y2="480" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  } else if (isHeritage) {
    // Architectural arches, ornamental geometry, museum columns
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M250 500 V 280 C 250 180, 350 120, 400 120 C 450 120, 550 180, 550 280 V 500"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M280 500 V 300 C 280 220, 350 160, 400 160 C 450 160, 520 220, 520 300 V 500"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0.7"
        />
        <path
          d="M320 500 V 330 C 320 260, 360 210, 400 210 C 440 210, 480 260, 480 330 V 500"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.4"
        />
        <circle cx="400" cy="120" r="6" fill="currentColor" opacity="0.8" />
        <line x1="200" y1="500" x2="600" y2="500" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  } else if (isShopping) {
    // Geometric boutique patterns, fashion tags, diamond facets
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M400 150 L 520 270 L 400 390 L 280 270 Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M400 190 L 480 270 L 400 350 L 320 270 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          opacity="0.6"
        />
        <path
          d="M200 240 L 260 300 L 200 360 L 140 300 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M600 240 L 660 300 L 600 360 L 540 300 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    );
  } else if (isQuiet) {
    // Concentric ripple rings, gentle fluid contours
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse cx="400" cy="300" rx="120" ry="60" stroke="currentColor" strokeWidth="2" />
        <ellipse
          cx="400"
          cy="300"
          rx="220"
          ry="110"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.7"
        />
        <ellipse
          cx="400"
          cy="300"
          rx="320"
          ry="160"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 8"
          opacity="0.4"
        />
        <ellipse
          cx="400"
          cy="300"
          rx="420"
          ry="210"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>
    );
  } else if (isSurprise) {
    // Compass rose, orbital discovery trails, starlight pips
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="400" cy="300" r="140" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="400" cy="300" r="90" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <path d="M400 120 L 415 285 L 580 300 L 415 315 L 400 480 L 385 315 L 220 300 L 385 285 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="400" cy="300" r="10" fill="currentColor" opacity="0.5" />
      </svg>
    );
  } else {
    // Default / exploration contour rings
    motif = (
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="400" cy="300" r="180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.6" />
        <circle cx="400" cy="300" r="110" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }

  // Sizing and positioning based on variant
  const containerClasses =
    variant === "panel"
      ? "absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden mix-blend-screen"
      : "pointer-events-none fixed inset-0 z-[-5] overflow-hidden opacity-50";

  return (
    <div
      aria-hidden="true"
      className={`${containerClasses} transition-opacity duration-700 ease-in-out ${className}`}
      style={{
        color: "var(--ambient-svg-color, rgba(232, 116, 58, 0.08))",
      }}
    >
      {motif}
    </div>
  );
}
