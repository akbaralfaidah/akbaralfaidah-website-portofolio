export function BrandLogo({ className = 'h-9 w-auto', showWordmark = false, inverted = false }) {
  return (
    <span className="inline-flex items-center gap-3 select-none">
      <svg
        viewBox="0 0 44 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M5 32L15.5 4H22L17.5 16H23.5L21.5 21.5H15.5L11.5 32H5Z"
          fill="currentColor"
        />
        <path
          d="M24 4H40L38 9.5H29.5L27.5 15H36L34 20.5H25.5L21.5 32H15L24 4Z"
          fill="currentColor"
        />
        <path
          d="M18 4H24L20.5 13H14.5L18 4Z"
          fill={inverted ? '#60A5FA' : '#1E40AF'}
          className="dark:fill-[#60A5FA]"
        />
      </svg>
      {showWordmark && (
        <span className="flex flex-col leading-tight">
          <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-current">
            Akbar Alfaidah
          </span>
          <span className="text-xs font-medium text-current opacity-65">
            Tech Agency
          </span>
        </span>
      )}
    </span>
  );
}

export default BrandLogo;
