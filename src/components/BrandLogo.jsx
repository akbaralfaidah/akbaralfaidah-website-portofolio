export function BrandLogo({ className = 'h-9 w-auto', showWordmark = false }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        viewBox="0 0 44 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        {/* Architectural AF Monogram — clean slanted geometric strokes */}
        <path
          d="M5 32L15.5 4H22L17.5 16H23.5L21.5 21.5H15.5L11.5 32H5Z"
          fill="currentColor"
        />
        <path
          d="M24 4H40L38 9.5H29.5L27.5 15H36L34 20.5H25.5L21.5 32H15L24 4Z"
          fill="currentColor"
        />
        {/* Antique brass geometric keystone accent */}
        <path d="M18 4H24L20.5 13H14.5L18 4Z" fill="#8A611C" className="dark:fill-[#D4A24C]" />
      </svg>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-sm sm:text-base font-bold tracking-tight text-ink">
            Akbar Alfaidah
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
            Tech Agency
          </span>
        </span>
      )}
    </span>
  );
}

export default BrandLogo;
