/**
 * The mark: a V (Vamshi) cut from two door leaves with a seam of light between
 * them — the intro's closed doors. At rest it is brushed silver with a faint
 * white seam; on hover (see .brand in globals.css) the leaves part and the
 * seam fills with the spectrum. app/icon.svg is the same drawing on a tile.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="bm-metal" x1="0" y1="6" x2="0" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ededed" />
          <stop offset=".55" stopColor="#b4b4b4" />
          <stop offset="1" stopColor="#6c6c6c" />
        </linearGradient>
        <linearGradient id="bm-seam" x1="0" y1="9" x2="0" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="bm-light" x1="0" y1="11" x2="0" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4cc9f0" stopOpacity="0" />
          <stop offset=".3" stopColor="#9b7bff" />
          <stop offset=".65" stopColor="#ff5d8f" />
          <stop offset="1" stopColor="#ffb35c" />
        </linearGradient>
      </defs>
      <rect className="bm-seam" x="19.55" y="9" width="0.9" height="25" fill="url(#bm-seam)" />
      <rect className="bm-light" x="19.1" y="11" width="1.8" height="23" rx="0.9" fill="url(#bm-light)" />
      <path className="bm-leaf bm-leaf-l" d="M3 6h8.5l7.75 18v10Z" fill="url(#bm-metal)" />
      <path className="bm-leaf bm-leaf-r" d="M37 6h-8.5l-7.75 18v10Z" fill="url(#bm-metal)" />
    </svg>
  );
}
