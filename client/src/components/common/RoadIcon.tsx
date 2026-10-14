export function RoadIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Road left and right boundary perspective edges */}
      <path d="m4 19 4-14" />
      <path d="m16 5 4 14" />
      {/* Dashed center lane markings */}
      <path d="M12 7v-2" />
      <path d="M12 13v-2" />
      <path d="M12 19v-2" />
    </svg>
  );
}
